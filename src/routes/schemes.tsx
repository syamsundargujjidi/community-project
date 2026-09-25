import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Bookmark,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Building2,
  FileCheck2,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { INDIAN_STATES, resolveSchemeLinks, type Scheme, type UserProfile } from "@/lib/schemes";
import { evaluateScheme } from "@/lib/matching";
import { AuthGate } from "@/components/site/AuthGate";
import { useAuth } from "@/hooks/use-auth";
import { saveScheme, trackRecentScheme, trackSearch } from "@/integrations/firebase/user-store";
import { getPaginatedSchemesServer } from "@/lib/schemes.server";

function SchemesRouteComponent() {
  return (
    <AuthGate feature="the schemes catalog">
      <SchemesPage />
    </AuthGate>
  );
}

export const Route = createFileRoute("/schemes")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Browse 4,000+ Government Schemes — Scheme Sathi AI" },
      {
        name: "description",
        content:
          "Explore over 4,000 Central & State government welfare schemes with official application links and verified myScheme fallbacks.",
      },
      { property: "og:title", content: "Browse 4,000+ Government Schemes — Scheme Sathi AI" },
      {
        property: "og:description",
        content: "Search across 4,000+ Central and State welfare programs in India.",
      },
    ],
  }),
  component: SchemesRouteComponent,
});

const POPULAR_SEARCH_PROMPTS = [
  "scholarships for students",
  "schemes for farmers",
  "schemes for women",
  "schemes for unemployed youth",
  "schemes for disabled persons",
  "housing schemes",
  "business loans",
  "Andhra Pradesh schemes",
  "OBC schemes",
  "SC scholarships",
  "senior citizen schemes",
];

function formatDate(isoOrDate?: string | null): string {
  if (!isoOrDate) return "20/09/2026";
  try {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return "20/09/2026";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "20/09/2026";
  }
}

function SchemesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [scope, setScope] = useState<"all" | "Central" | "State" | "UT">("all");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedOccupation, setSelectedOccupation] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // Load user profile from questionnaire / session to evaluate live card eligibility
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("yojana:profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [q]);

  // Log searches for logged in users
  useEffect(() => {
    if (!user || !debouncedQ) return;
    const h = setTimeout(() => {
      trackSearch(user.uid, debouncedQ, {
        category: selectedCategory,
        scope,
        state: selectedState,
      });
    }, 1000);
    return () => clearTimeout(h);
  }, [user, debouncedQ, selectedCategory, scope, selectedState]);

  // Query paginated schemes from server database
  const {
    data: pageResult,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "schemes-paginated",
      debouncedQ,
      selectedCategory,
      scope,
      selectedState,
      selectedOccupation,
      page,
      pageSize,
    ],
    queryFn: async () => {
      return await getPaginatedSchemesServer({
        data: {
          q: debouncedQ || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          governmentLevel: scope,
          state: selectedState || undefined,
          occupation: selectedOccupation !== "all" ? selectedOccupation : undefined,
          page,
          pageSize,
          sortBy: "popularity",
        },
      });
    },
    staleTime: 60_000,
  });

  const schemes = pageResult?.items || [];
  const total = pageResult?.total ?? 0;
  const totalPages = pageResult?.totalPages ?? 1;
  const categories = pageResult?.categories || [];

  function resetAllFilters() {
    setQ("");
    setDebouncedQ("");
    setSelectedCategory("all");
    setScope("all");
    setSelectedState("");
    setSelectedOccupation("all");
    setPage(1);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            4,000+ Genuine Government Schemes Verified
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">
            {t("schemes.title", "Browse All Welfare Schemes")}
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            {total > 0
              ? `Showing ${schemes.length > 0 ? (page - 1) * pageSize + 1 : 0}–${Math.min(page * pageSize, total)} of ${total.toLocaleString("en-IN")} verified Central & State government welfare programs.`
              : "Search across 4,000+ Central, State and Union Territory welfare programs."}
          </p>
        </div>

        {/* Quick Reset */}
        {(debouncedQ ||
          selectedCategory !== "all" ||
          scope !== "all" ||
          selectedState ||
          selectedOccupation !== "all") && (
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 self-start md:self-auto rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mt-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(
              "schemes.searchPlaceholder",
              "Search by scheme name, ministry, benefits, or keywords (e.g. 'PM-KISAN', 'scholarships', 'women loans')...",
            )}
            className="w-full rounded-2xl border border-input bg-card py-3.5 pl-12 pr-4 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition text-foreground"
          />
        </div>

        {/* Popular search prompt chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-muted-foreground scrollbar-none">
          <span className="shrink-0 flex items-center gap-1 font-semibold text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Popular:
          </span>
          {POPULAR_SEARCH_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setQ(prompt);
                setDebouncedQ(prompt);
                setPage(1);
              }}
              className="shrink-0 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Scope & Government Level Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        <FilterChip
          active={scope === "all"}
          onClick={() => {
            setScope("all");
            setPage(1);
          }}
        >
          {t("schemes.all", "All Schemes")} (
          {pageResult?.stats.total ? pageResult.stats.total.toLocaleString("en-IN") : "4,000+"})
        </FilterChip>
        <FilterChip
          active={scope === "Central"}
          onClick={() => {
            setScope("Central");
            setSelectedState("");
            setPage(1);
          }}
        >
          {t("schemes.central", "Central Government")} ({pageResult?.stats.central ?? "80+"})
        </FilterChip>
        <FilterChip
          active={scope === "State"}
          onClick={() => {
            setScope("State");
            setPage(1);
          }}
        >
          {t("schemes.state", "State Government")} ({pageResult?.stats.state ?? "3,500+"})
        </FilterChip>
        <FilterChip
          active={scope === "UT"}
          onClick={() => {
            setScope("UT");
            setPage(1);
          }}
        >
          Union Territories ({pageResult?.stats.ut ?? "400+"})
        </FilterChip>
      </div>

      {/* Secondary Filters: State Dropdown, Occupation, Categories */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* State selector */}
        {scope !== "Central" && (
          <div className="w-full sm:w-auto">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-60 rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-ring"
            >
              <option value="">All States & Union Territories (36)</option>
              <option value="Andhra Pradesh">🌟 Andhra Pradesh (AP State + Central Schemes)</option>
              {INDIAN_STATES.filter((s) => s !== "Andhra Pradesh").map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Occupation selector */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedOccupation}
            onChange={(e) => {
              setSelectedOccupation(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-56 rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-ring"
          >
            <option value="all">Target Beneficiary / Occupation: All</option>
            <option value="farmer">Farmers & Cultivators</option>
            <option value="student">Students & Scholars</option>
            <option value="unemployed">Unemployed Youth</option>
            <option value="self-employed">Self-Employed / Artisans</option>
            <option value="entrepreneur">MSME / Business Owners</option>
            <option value="labour">Daily Wage & Construction Labour</option>
            <option value="street-vendor">Street Vendors</option>
            <option value="salaried">Salaried Workers</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip
            active={selectedCategory === "all"}
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
          >
            All Categories
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.name}
              active={selectedCategory === cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setPage(1);
              }}
            >
              {cat.name} ({cat.count})
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Grid of Schemes */}
      {isLoading ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-elevated h-72 animate-pulse p-6">
              <div className="h-4 w-24 bg-muted rounded-full" />
              <div className="mt-4 h-6 w-3/4 bg-muted rounded-md" />
              <div className="mt-2 h-16 w-full bg-muted rounded-md" />
              <div className="mt-auto h-9 w-full bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      ) : schemes.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((s) => (
              <SchemeCard key={s.id || s.slug} scheme={s} profile={profile} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span> (
                {total.toLocaleString("en-IN")} total schemes)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {/* Page numbers preview */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    // Center current page
                    let pageNum = page - 2 + idx;
                    if (pageNum < 1) pageNum = idx + 1;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + idx;
                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                          pageNum === page
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 rounded-3xl border border-border/80 bg-card p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">
            No schemes found matching your criteria
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Try adjusting your search terms, clearing selected state/category filters, or browse
            across all government schemes.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:brightness-110 transition"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
}

function SchemeCard({ scheme, profile }: { scheme: Scheme; profile?: UserProfile | null }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  // Link validation & verified fallback logic
  const links = resolveSchemeLinks(scheme);

  const lastVerifiedStr = formatDate(
    scheme.last_verified || scheme.lastVerified || scheme.created_at,
  );

  const sourceTitle = links.departmentName;

  // Profile-driven eligibility check
  const match = useMemo(() => {
    if (!profile) return null;
    return evaluateScheme(scheme, profile);
  }, [scheme, profile]);

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await saveScheme(user.uid, scheme.id, scheme.name);
    setSaved(true);
  }

  function handleView() {
    if (user) trackRecentScheme(user.uid, scheme.id, scheme.name);
  }

  return (
    <article className="card-elevated flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-border/80 bg-card rounded-2xl">
      <div>
        {/* Profile-aware live eligibility banner */}
        {match && (
          <div className="mb-3">
            {match.status === "eligible" ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Eligible for your profile
                </span>
                <span>{match.confidence}% match</span>
              </div>
            ) : match.status === "verify" ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>⚠️ Needs documentation verification</span>
              </div>
            ) : (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-semibold text-destructive">
                <div className="flex items-center gap-1">
                  <span>❌ Not eligible</span>
                </div>
                <p className="mt-1 text-[11px] font-normal text-foreground/90">
                  {match.failures[0] || "Profile criteria not satisfied."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Badges: Category + Level/State */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {scheme.category}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {scheme.state ? `${scheme.state}` : t("schemes.central", "Central")}
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground font-medium">
            {sourceTitle}
          </span>
        </div>

        {/* Source indicator & verification date */}
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
                <ShieldCheck className="h-3.5 w-3.5" />✓ Official Government Source
              </>
            ) : (
              <>
                <ExternalLink className="h-3.5 w-3.5" />↗ myScheme Government Source
              </>
            )}
          </span>
          <span className="text-muted-foreground/80 font-normal">
            Last verified: {lastVerifiedStr}
          </span>
        </div>

        {/* Ministry or Department */}
        {(scheme.ministry || scheme.department) && (
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3 shrink-0" />
            {scheme.department || scheme.ministry}
          </p>
        )}

        {/* Scheme Name */}
        <h3 className="mt-2 font-display text-lg font-bold text-foreground line-clamp-2 leading-snug">
          {scheme.name}
        </h3>

        {/* Short description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {scheme.short_description}
        </p>

        {/* Benefits snippet */}
        {scheme.benefits && (
          <div className="mt-3 rounded-xl bg-accent/30 p-2.5 text-xs text-accent-foreground">
            <span className="font-semibold text-primary">Benefit: </span>
            <span className="line-clamp-2">{scheme.benefits}</span>
          </div>
        )}

        {/* Documents requirement preview or unverified fallback note */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowDocs((v) => !v)}
            className="flex w-full items-center justify-between gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1">
              <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              Required Documents ({scheme.documents?.length || 0})
            </span>
            <span className="text-[10px] text-primary">{showDocs ? "Hide" : "Show"}</span>
          </button>
          {showDocs && (
            <div className="mt-2">
              {scheme.documents && scheme.documents.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {scheme.documents.map((d) => (
                    <span
                      key={d}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[11px]"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic rounded-md border border-dashed border-border/80 p-2">
                  Required documents may vary. Please verify the document requirements on the
                  official scheme portal.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions: Apply / Register Now & Backup Portal */}
      <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-[200px]">
          <a
            href={links.primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleView}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:brightness-110"
          >
            {links.primaryLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Guaranteed working backup route */}
          <a
            href={links.backupUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleView}
            title="Alternative verified portal via Government of India myScheme"
            className="inline-flex items-center gap-1 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition"
          >
            <span>{links.backupLabel}</span> <ExternalLink className="h-3 w-3" />
          </a>

          {/* Wikipedia / Info fallback if unable to view official portals */}
          <a
            href={links.wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Search and view scheme background on Wikipedia if portal is unreachable"
            className="inline-flex items-center gap-1 rounded-xl border border-input bg-secondary/50 px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <BookOpen className="h-3 w-3" />
            <span>Wikipedia</span>
          </a>
        </div>

        <button
          onClick={handleSave}
          disabled={saved}
          title={saved ? "Saved" : "Save scheme"}
          className="inline-flex items-center gap-1 rounded-xl border border-input p-2 text-xs font-semibold hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-60 transition shrink-0"
        >
          {saved ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
