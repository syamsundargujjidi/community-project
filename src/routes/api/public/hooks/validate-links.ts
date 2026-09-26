import { createFileRoute } from "@tanstack/react-router";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";
import { checkOfficialLink } from "@/lib/link-check.server";
import { isFirestoreQuotaExhausted, isQuotaError } from "@/integrations/firebase/user-store";

const JOB_ID = "link_validation";
const BATCH_SIZE = 25;
const LEASE_MINUTES = 10;

async function handle() {
  if (isFirestoreQuotaExhausted()) {
    return Response.json({ ok: true, skipped: "quota_paused", reason: "Firestore daily write quota reached" });
  }

  const db = getDb();
  const jobRef = doc(db, "jobs", JOB_ID);
  const now = new Date();

  let jobData: Record<string, any> = {};
  try {
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      jobData = jobSnap.data() || {};
    }
  } catch (err) {
    if (isQuotaError(err)) {
      return Response.json({ ok: true, skipped: "quota_paused" });
    }
    console.warn("[validate-links] job snap fetch:", err);
  }

  if (jobData.paused) {
    return Response.json({ ok: true, skipped: "paused", reason: jobData.paused_reason });
  }

  if (jobData.lease_until && new Date(jobData.lease_until) > now) {
    return Response.json({ ok: true, skipped: "locked" });
  }

  const leaseUntil = new Date(now.getTime() + LEASE_MINUTES * 60_000).toISOString();
  try {
    await setDoc(
      jobRef,
      {
        job_name: JOB_ID,
        lease_until: leaseUntil,
        last_run_at: now.toISOString(),
      },
      { merge: true },
    );
  } catch (err) {
    if (isQuotaError(err)) {
      return Response.json({ ok: true, skipped: "quota_paused" });
    }
  }

  let checked = 0;
  let invalid = 0;
  let unreachable = 0;
  let ok = 0;

  try {
    const schemesSnap = await getDocs(query(collection(db, "schemes"), limit(BATCH_SIZE)));
    const docs = schemesSnap.docs;

    for (const d of docs) {
      const row = d.data();
      const url = row.official_source_url || row.official_website || row.apply_url || row.applyLink;
      const result = await checkOfficialLink(url);
      const failCount = result.status === "ok" ? 0 : (row.link_fail_count ?? 0) + 1;

      await updateDoc(d.ref, {
        link_status: result.status,
        link_http_status: result.httpStatus ?? null,
        link_checked_at: new Date().toISOString(),
        link_fail_count: failCount,
      }).catch((e) => console.warn("[validate-links] updateDoc failed for doc:", d.id, e));

      checked += 1;
      if (result.status === "ok") ok += 1;
      else if (result.status === "invalid") invalid += 1;
      else unreachable += 1;
    }
  } catch (err: any) {
    console.error("[validate-links] run failed", err);
    await updateDoc(jobRef, { lease_until: null }).catch(() => {});
    return Response.json({ ok: false, error: err?.message || "unknown" }, { status: 500 });
  }

  await updateDoc(jobRef, {
    lease_until: null,
    last_finished_at: new Date().toISOString(),
    checked_last_run: checked,
  }).catch(() => {});

  return Response.json({ ok: true, checked, ok_links: ok, unreachable, invalid });
}

export const Route = createFileRoute("/api/public/hooks/validate-links")({
  server: {
    handlers: {
      POST: handle,
      GET: handle,
    },
  },
});
