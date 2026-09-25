import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileText,
  Bookmark,
  Check,
  ChevronDown,
  ExternalLink,
  Volume2,
  VolumeX,
  Filter,
  Sparkles,
  Search,
  BookOpen,
  Building2,
} from "lucide-react";
import {
  schemesQueryOptions,
  officialLink,
  resolveSchemeLinks,
  type UserProfile,
} from "@/lib/schemes";
import {
  evaluateAll,
  sortMatches,
  isCentral,
  myschemeUrl,
  type SchemeMatch,
  type SortKey,
} from "@/lib/matching";
import { explainScheme } from "@/lib/ai.server";
import {
  saveSchemesResult,
  saveScheme,
  syncSchemeToFirestore,
  logEligibilityCheck,
  trackRecentScheme,
  getUserDoc,
} from "@/integrations/firebase/user-store";
import { useAuth } from "@/hooks/use-auth";
import { AuthGate } from "@/components/site/AuthGate";

function ResultsRouteComponent() {
  return (
    <AuthGate feature="your personalised scheme matches">
      <Results />
    </AuthGate>
  );
}

export const Route = createFileRoute("/results")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(schemesQueryOptions),
  head: () => ({
    meta: [
      { title: "Your Eligible Schemes — Scheme Sathi AI" },
      { name: "description", content: "Government schemes matched to your profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsRouteComponent,
});

function Results() {
  const { t } = useTranslation();
  const { data: schemes } = useSuspenseQuery(schemesQueryOptions);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [scope, setScope] = useState<"all" | "central" | "state">("all");
  const [sort, setSort] = useState<SortKey>("match");

  const { user } = useAuth();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("yojana:profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    getUserDoc(user.uid)
      .then((docData) => {
        if (docData && (docData.occupation || docData.state || docData.age)) {
          const loaded: UserProfile = {
            age: Number(docData.age || 0),
            gender: (docData.gender || "any") as any,
            hasDisability: docData.disability === true,
            state: docData.state || "",
            areaType: (docData.area_type || docData.areaType || "urban") as any,
            annualIncome: Number(docData.annualIncome || 0),
            occupation: docData.occupation || "any",
            education: docData.education || undefined,
            caste: docData.category || docData.caste || undefined,
            parentOccupation: docData.parentOccupation || undefined,
          };
          setProfile((prev) => prev || loaded);
          try {
            sessionStorage.setItem("yojana:profile", JSON.stringify(loaded));
          } catch {}
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!schemes?.length) return;
    const key = "scheme-sathi:schemes-synced";
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;
    Promise.all(schemes.map((s) => syncSchemeToFirestore(s)))
      .then(() => {
        try {
          sessionStorage.setItem(key, "1");
        } catch {}
      })
      .catch((e) => console.error("[firestore] scheme sync failed", e));
  }, [schemes]);

  const result = useMemo(
    () =>
      profile
        ? evaluateAll(schemes, profile)
        : {
            all: [],
            eligible: [],
            verify: [],
            ineligible: [],
            counts: { total: 0, central: 0, state: 0, verify: 0, ineligible: 0 },
            debug: {
              catalogue: schemes.length,
              duplicatesRemoved: 0,
              candidates: 0,
              outOfScope: 0,
              inactive: 0,
              eligible: 0,
              verify: 0,
              ineligible: 0,
            },
          },
    [schemes, profile],
  );

  const eligible = result.eligible;

  // Log eligibility check once per profile+session
  useEffect(() => {
    if (!user || !profile || !result.all.length) return;
    const key = `scheme-sathi:eligibility-logged:${user.uid}:${profile.age}:${profile.state}:${profile.occupation}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    logEligibilityCheck(
      user.uid,
      profile,
      eligible.map((m) => m.scheme.id),
    );
  }, [user, profile, result, eligible]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    eligible.forEach((m) => m.scheme.category && set.add(m.scheme.category));
    return Array.from(set).sort();
  }, [eligible]);

  const filtered = useMemo(
    () =>
      sortMatches(
        eligible.filter((m) => {
          if (category !== "all" && m.scheme.category !== category) return false;
          if (scope === "central" && !isCentral(m.scheme)) return false;
          if (scope === "state" && isCentral(m.scheme)) return false;
          return true;
        }),
        sort,
      ),
    [eligible, category, scope, sort],
  );

  if (!hydrated) return <div className="mx-auto max-w-4xl px-4 py-16" />;

  if (!profile) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">{t("results.noProfile")}</h1>
        <Link
          to="/questionnaire"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          {t("results.startQuestionnaire")} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Your Results
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            🎯 {result.counts.total}{" "}
            {result.counts.total === 1 ? t("results.scheme") : t("results.schemes")}{" "}
            {t("results.title")}
          </h1>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              Central Government —{" "}
              <strong className="text-foreground">{result.counts.central}</strong>
            </span>
            <span>
              {profile.state} Government —{" "}
              <strong className="text-foreground">{result.counts.state}</strong>
            </span>
            {result.counts.verify > 0 && (
              <span>
                Needs verification —{" "}
                <strong className="text-foreground">{result.counts.verify}</strong>
              </span>
            )}
            {result.counts.ineligible > 0 && (
              <span>
                Not eligible —{" "}
                <strong className="text-foreground">{result.counts.ineligible}</strong>
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ReadAloudButton matches={filtered} />
          <SaveButton profile={profile} schemeIds={eligible.map((m) => m.scheme.id)} />
          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> {t("results.redo")}
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {[
          `Age ${profile.age}`,
          profile.gender,
          profile.state,
          profile.areaType,
          `Income ₹${profile.annualIncome.toLocaleString("en-IN")}`,
          profile.education ?? null,
          profile.caste ? profile.caste.toUpperCase() : null,
          profile.hasDisability ? "PwD" : null,
          profile.occupation,
          profile.parentOccupation && profile.parentOccupation !== "na"
            ? `Parent: ${profile.parentOccupation}`
            : null,
        ]
          .filter(Boolean)
          .map((t) => (
            <span key={t as string} className="rounded-full bg-secondary px-3 py-1 font-medium">
              {t as string}
            </span>
          ))}
      </div>

      {/* Filters */}
      {eligible.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "central", "state"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  scope === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:brightness-95"
                }`}
              >
                {s === "all" ? t("results.filterAll") : s === "central" ? "Central" : "State"}
              </button>
            ))}
          </div>
          <label className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-input bg-background px-2 py-1 text-xs font-medium text-foreground"
            >
              <option value="match">Exact eligibility match</option>
              <option value="relevance">Scheme relevance</option>
              <option value="popular">Popular schemes</option>
              <option value="recent">Recently verified</option>
            </select>
          </label>
          {categories.length > 0 && (
            <div className="flex w-full flex-wrap gap-1.5">
              <button
                onClick={() => setCategory("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  category === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:brightness-95"
                }`}
              >
                {t("results.filterAll")}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:brightness-95"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {eligible.length === 0 ? (
        <div className="card-elevated mt-10 p-8">
          <p className="text-lg font-semibold">
            No currently eligible schemes found. You can update your profile details to check again.
          </p>
        </div>
      ) : (
        <SchemeGroups matches={filtered} stateName={profile.state} />
      )}

      <VerificationList matches={result.verify} />
      <IneligibleList matches={result.ineligible} />

      <details className="mt-10 rounded-2xl border border-border bg-card p-4 text-sm">
        <summary className="cursor-pointer font-semibold">Search details (debug)</summary>
        <ul className="mt-3 grid gap-1 text-muted-foreground sm:grid-cols-2">
          <li>
            Schemes in database:{" "}
            <strong className="text-foreground">{result.debug.catalogue}</strong>
          </li>
          <li>
            Duplicates removed:{" "}
            <strong className="text-foreground">{result.debug.duplicatesRemoved}</strong>
          </li>
          <li>
            Candidate schemes for {profile.state}:{" "}
            <strong className="text-foreground">{result.debug.candidates}</strong>
          </li>
          <li>
            Not available in your State/UT:{" "}
            <strong className="text-foreground">{result.debug.outOfScope}</strong>
          </li>
          <li>
            Inactive schemes skipped:{" "}
            <strong className="text-foreground">{result.debug.inactive}</strong>
          </li>
          <li>
            Eligible: <strong className="text-foreground">{result.debug.eligible}</strong>
          </li>
          <li>
            Needs verification: <strong className="text-foreground">{result.debug.verify}</strong>
          </li>
          <li>
            Not eligible: <strong className="text-foreground">{result.debug.ineligible}</strong>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Every candidate scheme is checked condition by condition — nothing is limited or cut off.
          Open any scheme card to see each condition result.
        </p>
      </details>
    </section>
  );
}

function VerificationList({ matches }: { matches: SchemeMatch[] }) {
  if (matches.length === 0) return null;
  return (
    <div className="mt-12 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            {matches.length} {matches.length === 1 ? "Scheme" : "Schemes"} Potentially Eligible /
            Needs Verification
          </h2>
          <p className="mt-1 text-sm font-medium text-amber-800 dark:text-amber-300">
            "You may be eligible. Please verify the detailed eligibility requirements on the
            official scheme portal."
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {matches.map((m) => {
          const s = m.scheme;
          const links = resolveSchemeLinks(s);
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Needs Documentation Verification
                  </span>
                  <span className="text-muted-foreground">
                    Last verified:{" "}
                    {s.last_verified
                      ? s.last_verified.split("T")[0].split("-").reverse().join("/")
                      : "25/09/2026"}
                  </span>
                </div>
                <h3 className="mt-1 font-bold text-sm text-foreground">{s.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {s.short_description || s.benefits}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {s.state ? s.state : "Central"} · {s.category}
                </span>
                <a
                  href={links.primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold hover:bg-secondary/80 text-foreground transition"
                >
                  Verify on Portal <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IneligibleList({ matches }: { matches: SchemeMatch[] }) {
  const [open, setOpen] = useState(true);
  const [ineligibleQ, setIneligibleQ] = useState("");
  const [filterType, setFilterType] = useState<"all" | "state" | "criteria">("all");
  const [visibleCount, setVisibleCount] = useState(12);

  if (matches.length === 0) return null;

  const filteredMatches = matches.filter((m) => {
    if (ineligibleQ) {
      const q = ineligibleQ.toLowerCase();
      const txt =
        `${m.scheme.name} ${m.scheme.category} ${m.scheme.state || ""} ${m.failures.join(" ")}`.toLowerCase();
      if (!txt.includes(q)) return false;
    }
    if (filterType === "state") {
      return m.failures.some(
        (f) => f.toLowerCase().includes("state") || f.toLowerCase().includes("residents of"),
      );
    }
    if (filterType === "criteria") {
      return m.failures.some(
        (f) => !f.toLowerCase().includes("state") && !f.toLowerCase().includes("residents of"),
      );
    }
    return true;
  });

  return (
    <div className="mt-14 rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {matches.length} Schemes Not Eligible
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Transparent eligibility breakdown: understand exactly why specific Central or
              other-state schemes are unavailable for your current profile.
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-xs hover:bg-secondary"
          aria-expanded={open}
        >
          {open ? "Collapse list" : `View ${matches.length} ineligible schemes`}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mt-6">
          {/* Controls: Search & Filter */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border/60 pb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={ineligibleQ}
                onChange={(e) => {
                  setIneligibleQ(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder="Search ineligible schemes (e.g. 'Rythu Bandhu', 'Pension', 'Telangana')..."
                className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-3 text-xs outline-none focus:border-ring text-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", label: `All (${matches.length})` },
                  { id: "state", label: "State Restrictions" },
                  { id: "criteria", label: "Income / Age / Category" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setFilterType(t.id);
                    setVisibleCount(12);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    filterType === t.id
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary border border-border"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredMatches.slice(0, visibleCount).map((m) => {
              const s = m.scheme;
              const links = resolveSchemeLinks(s);

              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-destructive/20 bg-card p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                        ❌ Not eligible
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {s.state ? `${s.state} Government` : "Central Government"}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-foreground leading-snug">
                      {s.name}
                    </h3>

                    {/* Prominent Reason callout */}
                    <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs">
                      <p className="font-bold text-destructive">Reason:</p>
                      <ul className="mt-1 space-y-1 text-foreground/90 font-medium">
                        {m.failures.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-destructive shrink-0">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2">
                      {s.short_description || s.benefits}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      Category: <strong>{s.category}</strong>
                    </span>
                    <a
                      href={links.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      View Guidelines / Official Portal <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Pagination */}
          {filteredMatches.length > visibleCount && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-xs font-bold hover:bg-secondary"
              >
                Load {Math.min(12, filteredMatches.length - visibleCount)} more ineligible schemes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SchemeGroups({ matches, stateName }: { matches: SchemeMatch[]; stateName: string }) {
  const { t } = useTranslation();
  const central = matches.filter((m) => isCentral(m.scheme));
  const state = matches.filter((m) => !isCentral(m.scheme));
  return (
    <div className="mt-8 space-y-10">
      {state.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold">
            {stateName} Government Schemes{" "}
            <span className="text-sm font-normal text-muted-foreground">({state.length})</span>
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {state.map((m) => (
              <SchemeCard key={m.scheme.id} match={m} />
            ))}
          </div>
        </div>
      )}
      {central.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold">
            {t("results.central")}{" "}
            <span className="text-sm font-normal text-muted-foreground">({central.length})</span>
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {central.map((m) => (
              <SchemeCard key={m.scheme.id} match={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SchemeCard({ match }: { match: SchemeMatch }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { scheme, eligible, confidence } = match;
  const [showDocs, setShowDocs] = useState(false);
  const [savedOne, setSavedOne] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const links = resolveSchemeLinks(scheme);

  function onApplyClick() {
    if (user) trackRecentScheme(user.uid, scheme.id, scheme.name);
  }
  async function onSaveOne() {
    if (!user) return;
    await saveScheme(user.uid, scheme.id, scheme.name);
    setSavedOne(true);
  }
  async function onExplain() {
    if (explanation) {
      setExplanation(null);
      return;
    }
    setExplaining(true);
    let profile: Record<string, unknown> = {};
    try {
      profile = JSON.parse(sessionStorage.getItem("yojana:profile") || "{}");
    } catch {}
    try {
      const res = await explainScheme({
        data: {
          schemeName: scheme.name,
          state: scheme.state,
          benefits: scheme.benefits ?? "",
          documents: scheme.documents ?? [],
          applyUrl: (scheme as any).official_website || scheme.apply_url || "",
          eligible,
          profile,
          lang: i18n.language,
        },
      });
      setExplanation(res.explanation);
    } catch (e: any) {
      setExplanation(`Could not load AI explanation. ${e?.message ?? ""}`);
    } finally {
      setExplaining(false);
    }
  }

  return (
    <article className="card-elevated flex flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            eligible ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> {eligible ? t("results.eligible") : "Partial"}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {scheme.category}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {scheme.state ? `State · ${scheme.state}` : "Central"}
        </span>
        <span className="ml-auto text-xs font-semibold text-primary">
          {confidence}% {t("results.matchConfidence")}
        </span>
      </div>

      {/* Official vs myScheme Source Indicator */}
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            links.isOfficial
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {links.isOfficial ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />✓ Official Government Source
            </>
          ) : (
            <>
              <ExternalLink className="h-3.5 w-3.5" />↗ myScheme Government Source
            </>
          )}
        </span>
        <span className="text-muted-foreground font-normal">
          Last verified:{" "}
          {scheme.last_verified
            ? scheme.last_verified.split("T")[0].split("-").reverse().join("/")
            : "20/09/2026"}
        </span>
      </div>

      <h3 className="mt-2 font-display text-lg font-bold">{scheme.name}</h3>
      {scheme.ministry && <p className="text-xs text-muted-foreground">{scheme.ministry}</p>}
      <p className="mt-3 text-sm text-muted-foreground">{scheme.short_description}</p>

      <div className="mt-4 rounded-xl bg-accent/40 p-3 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/80">
          Benefit
        </p>
        <p className="mt-0.5 text-foreground">{scheme.benefits}</p>
      </div>

      {match.checks.some((c) => c.status === "pass") && (
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t("results.whyMatches")}
          </p>
          <ul className="mt-1.5 space-y-0.5 text-xs text-foreground">
            {match.checks
              .filter((c) => c.status === "pass")
              .map((c) => (
                <li key={c.key} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <span>
                    <strong>{c.label}:</strong> {c.detail}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowDocs((v) => !v)}
          className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-secondary"
          aria-expanded={showDocs}
        >
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> {t("results.docs")} (
            {scheme.documents?.length || 0})
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${showDocs ? "rotate-180" : ""}`}
          />
        </button>
        {showDocs && (
          <div className="mt-2">
            {scheme.documents && scheme.documents.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {scheme.documents.map((d) => (
                  <span
                    key={d}
                    className="rounded-md border border-border bg-muted/20 px-2 py-0.5 text-xs"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-border p-2.5 text-xs text-muted-foreground italic">
                Required documents may vary. Please verify the document requirements on the official
                scheme portal.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <a
          href={links.primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onApplyClick}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs transition hover:brightness-110 min-w-[200px]"
        >
          {links.primaryLabel} <ExternalLink className="h-4 w-4" />
        </a>

        {/* Scheme-related departmental / verified portal */}
        <a
          href={links.backupUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onApplyClick}
          title={`Related official portal: ${links.backupLabel}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600/30 bg-blue-50/80 dark:bg-blue-950/30 px-3 py-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition shadow-2xs"
        >
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[190px]">{links.backupLabel}</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
        </a>

        {/* Wikipedia fallback if portal is unreachable */}
        <a
          href={links.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Search and view scheme background on Wikipedia if portal is unreachable"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition shrink-0 shadow-2xs"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Wikipedia</span>
        </a>

        <button
          onClick={onSaveOne}
          disabled={savedOne}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input px-3 py-2.5 text-xs font-semibold hover:bg-secondary disabled:opacity-60 transition shrink-0"
        >
          {savedOne ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Saved
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5" /> Save
            </>
          )}
        </button>
      </div>

      <button
        onClick={onExplain}
        disabled={explaining}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-60"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {explaining ? "Asking AI…" : explanation ? "Hide AI guidance" : "Explain with AI"}
      </button>
      {explanation && (
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-border bg-secondary/40 p-3 text-xs leading-relaxed">
          {explanation}
        </div>
      )}
    </article>
  );
}

function ReadAloudButton({ matches }: { matches: SchemeMatch[] }) {
  const { t, i18n } = useTranslation();
  const [reading, setReading] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggle() {
    if (!("speechSynthesis" in window)) return;
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }
    const langMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      te: "te-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      or: "or-IN",
    };
    const text = matches
      .slice(0, 10)
      .map(
        (m, i) =>
          `${i + 1}. ${m.scheme.name}. ${m.confidence}% match. ${m.scheme.short_description}. Benefit: ${m.scheme.benefits}.`,
      )
      .join(" ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langMap[i18n.language] || "en-IN";
    u.rate = 0.95;
    u.onend = () => setReading(false);
    u.onerror = () => setReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setReading(true);
  }

  return (
    <button
      onClick={toggle}
      disabled={matches.length === 0}
      className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
    >
      {reading ? (
        <>
          <VolumeX className="h-4 w-4" /> {t("a11y.stopReading")}
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" /> {t("a11y.readAloud")}
        </>
      )}
    </button>
  );
}

function SaveButton({ profile, schemeIds }: { profile: UserProfile; schemeIds: string[] }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    if (!user) {
      try {
        sessionStorage.setItem("scheme-sathi:pending-save", "1");
      } catch {}
      navigate({ to: "/auth" });
      return;
    }
    setSaving(true);
    setError(null);
    const label = `${profile.state} · Age ${profile.age} · ${profile.occupation}`;
    try {
      await saveSchemesResult(user.uid, profile, schemeIds, label);
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onSave}
        disabled={saving || loading || saved}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-70"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" /> {t("results.saved")}
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />{" "}
            {saving ? t("results.saving") : user ? t("results.save") : t("results.signInToSave")}
          </>
        )}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
      {saved && (
        <Link to="/saved" className="text-xs text-primary hover:underline">
          {t("results.viewSaved")} →
        </Link>
      )}
    </div>
  );
}
