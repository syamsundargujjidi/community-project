import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  ArrowRight,
  LogOut,
  User as UserIcon,
  Bookmark,
  Check,
  Edit3,
  X,
  Save,
  Sparkles,
} from "lucide-react";
import { getDb, getFirebaseAuth } from "@/integrations/firebase/client";
import { completeUserProfile, tsToMs } from "@/integrations/firebase/user-store";
import { useAuth } from "@/hooks/use-auth";
import { INDIAN_STATES, OCCUPATIONS } from "@/lib/schemes";

export const Route = createFileRoute("/_authenticated/profile")({
  ssr: false,
  head: () => ({
    meta: [{ title: "My profile — Scheme Sathi AI" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority"];
const EDUCATION = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post-graduate",
  "Doctorate",
];

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    occupation: "",
    annualIncome: "",
    category: "",
    disability: "no",
    area_type: "",
    education: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      doc(getDb(), "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setProfile(d);
          setForm({
            displayName: d.displayName || user.displayName || "",
            age: d.age ? String(d.age) : "",
            gender: d.gender || "",
            state: d.state || "",
            district: d.district || "",
            occupation: d.occupation || "",
            annualIncome: d.annualIncome ? String(d.annualIncome) : "",
            category: d.category || d.caste || "",
            disability: d.disability === true ? "yes" : "no",
            area_type: d.area_type || d.areaType || "",
            education: d.education || "",
            phoneNumber: d.phoneNumber || d.phone || "",
          });
        } else {
          setProfile(null);
          setForm((f) => ({
            ...f,
            displayName: user.displayName || user.email?.split("@")[0] || "",
          }));
        }
        setLoading(false);
      },
      (err) => {
        console.error("[firestore] profile snapshot error", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [user]);

  async function doSignOut() {
    await signOut(getFirebaseAuth());
    window.location.href = "/";
  }

  function setField<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Save all details given till now (no strict required blockers)
      await completeUserProfile(user.uid, {
        displayName: form.displayName,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        state: form.state || undefined,
        district: form.district || undefined,
        occupation: form.occupation || undefined,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : undefined,
        category: form.category || undefined,
        disability: form.disability === "yes",
        area_type: form.area_type || undefined,
        education: form.education || undefined,
        phoneNumber: form.phoneNumber || undefined,
        phone: form.phoneNumber || undefined,
      });

      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("[profile] failed to save profile", err);
    } finally {
      setSaving(false);
    }
  }

  const fields: Array<[string, any, string]> = profile
    ? [
        ["Full name", profile.displayName, "displayName"],
        ["Email address", profile.email || user?.email, "email"],
        ["Phone number", profile.phoneNumber || profile.phone, "phoneNumber"],
        ["Age", profile.age ? `${profile.age} years` : "", "age"],
        [
          "Gender",
          profile.gender ? profile.gender[0].toUpperCase() + profile.gender.slice(1) : "",
          "gender",
        ],
        ["State", profile.state, "state"],
        ["District", profile.district, "district"],
        [
          "Area type",
          profile.area_type ? profile.area_type[0].toUpperCase() + profile.area_type.slice(1) : "",
          "area_type",
        ],
        [
          "Occupation",
          OCCUPATIONS.find((o) => o.value === profile.occupation)?.label || profile.occupation,
          "occupation",
        ],
        [
          "Annual income",
          profile.annualIncome ? `₹${Number(profile.annualIncome).toLocaleString("en-IN")}` : "",
          "annualIncome",
        ],
        ["Category / Caste", profile.category || profile.caste, "category"],
        ["Education", profile.education, "education"],
        [
          "Disability status",
          profile.disability === true ? "Yes" : profile.disability === false ? "No" : "",
          "disability",
        ],
        [
          "Member since",
          profile.createdAt ? new Date(tsToMs(profile.createdAt)).toLocaleDateString() : "",
          "",
        ],
        [
          "Last active",
          profile.lastLogin ? new Date(tsToMs(profile.lastLogin)).toLocaleString() : "",
          "",
        ],
      ]
    : [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Account & Profile
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold">
              {profile?.displayName ||
                user?.displayName ||
                user?.email?.split("@")[0] ||
                "My Profile"}
            </h1>
            {user?.email && (
              <p className="mt-0.5 text-xs text-muted-foreground">Signed in as {user.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:brightness-110 transition"
            >
              <Edit3 className="h-4 w-4" /> Edit details
            </button>
          )}
          <button
            type="button"
            onClick={doSignOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Success banner */}
      {savedSuccess && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <div>
            <p className="font-semibold">Profile details saved successfully!</p>
            <p className="text-xs opacity-90">
              All provided details have been saved to your account and matched with welfare schemes.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area: Edit Form or View Details */}
      <div className="card-elevated mt-8 p-6 md:p-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading your profile details…</p>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold">Edit Profile Details</h2>
                <p className="text-xs text-muted-foreground">
                  Provide any details you want. All fields are optional and saved safely to your
                  profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition"
                aria-label="Cancel editing"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </span>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setField("displayName", e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </span>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Age (Years)
                </span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={(e) => setField("age", e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Gender
                </span>
                <select
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select gender…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  State / UT
                </span>
                <select
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  District
                </span>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setField("district", e.target.value)}
                  placeholder="e.g. Varanasi"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Occupation
                </span>
                <select
                  value={form.occupation}
                  onChange={(e) => setField("occupation", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select occupation…</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Annual Income (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.annualIncome}
                  onChange={(e) => setField("annualIncome", e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Social Category
                </span>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Area Type
                </span>
                <select
                  value={form.area_type}
                  onChange={(e) => setField("area_type", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select area…</option>
                  <option value="urban">Urban</option>
                  <option value="rural">Rural</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Education Level
                </span>
                <select
                  value={form.education}
                  onChange={(e) => setField("education", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select education…</option>
                  {EDUCATION.map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Person with Disability (PwD)
                </span>
                <select
                  value={form.disability}
                  onChange={(e) => setField("disability", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-input px-5 py-2 text-sm font-semibold hover:bg-secondary transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving details…" : "Save details"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="font-display text-lg font-bold">Your Details</h2>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit details
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {fields.map(([k, v, fieldKey]) => (
                <div key={k} className="border-b border-border/40 pb-3 last:border-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm">
                    {v !== undefined && v !== null && v !== "" ? (
                      <span className="font-medium text-foreground">{String(v)}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground/80 hover:text-primary hover:underline"
                      >
                        — <span className="text-[11px] underline">Add</span>
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>

      {/* Action links */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" />
          View eligible schemes
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/questionnaire"
          className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Detailed questionnaire
        </Link>
        <Link
          to="/saved"
          className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          <Bookmark className="h-4 w-4" /> My saved schemes
        </Link>
      </div>
    </section>
  );
}
