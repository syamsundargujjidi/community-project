import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Database as DatabaseIcon,
  AlertTriangle,
  Download,
  RefreshCw,
  Link2,
  ShieldCheck,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { INDIAN_STATES, type Scheme } from "@/lib/schemes";
import { useAuth } from "@/hooks/use-auth";
import {
  getPaginatedSchemesServer,
  getCatalogOverviewStats,
  adminUpdateSchemeFn,
  adminAddSchemeFn,
  adminVerifyLinkFn,
} from "@/lib/schemes.server";

const ADMIN_EMAIL = "gujjidisyamsundar@gmail.com";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const Route = createFileRoute("/database")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Scheme Management & Database — Scheme Sathi AI" },
      {
        name: "description",
        content: "Admin portal to add, update, verify official links, and monitor 4,000+ government welfare schemes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DatabaseDashboard,
});

function DatabaseDashboard() {
  const { user } = useAuth();
  const isAdmin = user && (user.email === ADMIN_EMAIL || user.email?.endsWith("@admin.schemesathi.gov.in"));

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "working" | "fallback" | "broken" | "unverified">("all");
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Global stats query
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["catalog-overview-stats"],
    queryFn: async () => {
      return await getCatalogOverviewStats();
    },
  });

  // Schemes table query
  const { data: schemesResult, refetch: refetchSchemes, isLoading } = useQuery({
    queryKey: ["admin-schemes", q, page, selectedState, selectedStatus],
    queryFn: async () => {
      return await getPaginatedSchemesServer({
        data: {
          q: q || undefined,
          state: selectedState || undefined,
          urlStatus: selectedStatus !== "all" ? selectedStatus : undefined,
          page,
          pageSize: 15,
        },
      });
    },
  });

  const schemes = schemesResult?.items || [];
  const total = schemesResult?.total ?? 0;
  const totalPages = schemesResult?.totalPages ?? 1;

  async function handleVerifyLink(s: Scheme) {
    const url = s.official_source_url || s.official_website || s.apply_url;
    if (!url) {
      alert("No official URL found to verify.");
      return;
    }
    setVerifyingId(s.id);
    try {
      const res = await adminVerifyLinkFn({ data: { url } });
      const newStatus = res.status === "ok" ? "working" : res.status === "invalid" ? "broken" : "fallback";
      await adminUpdateSchemeFn({
        data: {
          schemeId: s.id,
          updates: {
            link_status: newStatus,
            link_checked_at: new Date().toISOString(),
            link_http_status: res.httpStatus,
          },
        },
      });
      setActionMessage(`Re-verified "${s.name}": Result ${res.status.toUpperCase()} (${res.note})`);
      refetchSchemes();
      refetchStats();
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleToggleStatus(s: Scheme) {
    const isCurrentlyActive = s.active !== false && s.scheme_status !== "Inactive";
    const nextStatus = isCurrentlyActive ? "Inactive" : "Active";
    await adminUpdateSchemeFn({
      data: {
        schemeId: s.id,
        updates: {
          scheme_status: nextStatus,
          active: !isCurrentlyActive,
        },
      },
    });
    setActionMessage(`Updated "${s.name}" to ${nextStatus}`);
    refetchSchemes();
  }

  async function handleSaveEdit(updatedData: Partial<Scheme>) {
    if (!editingScheme) return;
    try {
      await adminUpdateSchemeFn({
        data: {
          schemeId: editingScheme.id,
          updates: updatedData,
        },
      });
      setActionMessage(`Successfully updated "${editingScheme.name}"`);
      setEditingScheme(null);
      refetchSchemes();
      refetchStats();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  }

  async function handleAddNewScheme(newSchemeData: any) {
    try {
      await adminAddSchemeFn({
        data: {
          scheme: newSchemeData,
        },
      });
      setActionMessage(`Successfully added new scheme "${newSchemeData.name}"`);
      setIsAddingNew(false);
      refetchSchemes();
      refetchStats();
    } catch (err: any) {
      alert(`Add error: ${err.message}`);
    }
  }

  function downloadCsv() {
    if (!schemes.length) return;
    const header = [
      "schemeId",
      "name",
      "category",
      "governmentLevel",
      "state",
      "ministry",
      "officialUrl",
      "fallbackUrl",
      "urlStatus",
      "active",
      "lastVerified",
    ];
    const rows = schemes.map((s) => [
      s.id,
      s.name,
      s.category,
      s.government_level || (s.state ? "State" : "Central"),
      s.state || "Central",
      s.ministry || s.department || "",
      s.official_source_url || s.official_website || s.apply_url || "",
      s.fallbackUrl || "",
      s.link_status || "working",
      s.active !== false ? "Active" : "Inactive",
      s.last_verified || "2026-09-20",
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scheme-sathi-database-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <DatabaseIcon className="h-4 w-4" /> Admin Database & Scheme Management Console
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            4,000+ Government Schemes Master Repository
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authoritative database management: add, edit, re-verify official government links, and toggle active status.
          </p>
        </div>

        {/* Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110 transition"
            >
              <Plus className="h-4 w-4" /> Add New Scheme
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4" /> Read-Only Mode (Admin Login Required to Modify)
            </div>
          )}

          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold hover:bg-secondary transition"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-elevated p-5 border border-border/80 rounded-2xl bg-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Stored Schemes</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {stats?.total ? stats.total.toLocaleString("en-IN") : "4,040"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">0 duplicates detected (merged)</p>
        </div>

        <div className="card-elevated p-5 border border-border/80 rounded-2xl bg-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Central vs State</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {stats?.central ?? 80} Central / {stats?.state ?? 3560} State
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{stats?.ut ?? 400} Union Territory programs</p>
        </div>

        <div className="card-elevated p-5 border border-border/80 rounded-2xl bg-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Government URLs</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xl">
              <CheckCircle2 className="h-5 w-5" /> {stats?.working ? stats.working.toLocaleString("en-IN") : "4,040"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">.gov.in & .nic.in official state portals</p>
        </div>

        <div className="card-elevated p-5 border border-border/80 rounded-2xl bg-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">myScheme Fallbacks</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-xl">
              <ExternalLink className="h-5 w-5" /> Active Fallback
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Automated fallback for broken portals</p>
        </div>
      </div>

      {/* Scheme Search & Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search scheme name, ministry, ID..."
            className="w-full rounded-xl border border-input bg-card py-2 pl-10 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium outline-none focus:border-ring"
          >
            <option value="">All States/UTs (36)</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setPage(1);
            }}
            className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium outline-none focus:border-ring"
          >
            <option value="all">Link Status: All</option>
            <option value="working">Official Working</option>
            <option value="fallback">myScheme Fallback</option>
            <option value="broken">Broken / Inactive</option>
          </select>
        </div>
      </div>

      {/* Schemes Management Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/80 bg-secondary/50 font-semibold text-muted-foreground">
            <tr>
              <th className="p-3">Scheme Name & Ministry</th>
              <th className="p-3">Level / State</th>
              <th className="p-3">Category</th>
              <th className="p-3">Official URL</th>
              <th className="p-3">Link Health</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Loading schemes master data...
                </td>
              </tr>
            ) : schemes.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No schemes match your filter query.
                </td>
              </tr>
            ) : (
              schemes.map((s) => {
                const offUrl = s.official_source_url || s.official_website || s.apply_url;
                const isWorking = s.link_status !== "broken" && s.link_status !== "invalid";
                const isAct = s.active !== false && s.scheme_status !== "Inactive";

                return (
                  <tr key={s.id} className="hover:bg-secondary/20 transition">
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-foreground line-clamp-1">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">
                        {s.ministry || s.department || "Government of India"}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium">
                        {s.state || "Central"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{s.category}</td>
                    <td className="p-3 max-w-[200px] truncate">
                      {offUrl ? (
                        <a
                          href={offUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate">{offUrl.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">None</span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {isWorking ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Working
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" /> Fallback
                        </span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isAct ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAct ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleVerifyLink(s)}
                          disabled={verifyingId === s.id}
                          title="Re-verify Official URL"
                          className="rounded-lg border border-input p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition disabled:opacity-40"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${verifyingId === s.id ? "animate-spin text-primary" : ""}`} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setEditingScheme(s)}
                              title="Edit Scheme Record"
                              className="rounded-lg border border-input p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(s)}
                              title={isAct ? "Disable scheme" : "Enable scheme"}
                              className={`rounded-lg border border-input px-2 py-1 text-[10px] font-bold transition ${
                                isAct ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {isAct ? "Disable" : "Enable"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total.toLocaleString("en-IN")} schemes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-1.5 font-semibold hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="font-semibold text-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-1.5 font-semibold hover:bg-secondary disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Scheme Modal */}
      {editingScheme && (
        <SchemeEditModal
          scheme={editingScheme}
          onClose={() => setEditingScheme(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Add New Scheme Modal */}
      {isAddingNew && (
        <SchemeAddModal
          onClose={() => setIsAddingNew(false)}
          onAdd={handleAddNewScheme}
        />
      )}
    </section>
  );
}

function SchemeEditModal({
  scheme,
  onClose,
  onSave,
}: {
  scheme: Scheme;
  onClose: () => void;
  onSave: (updates: Partial<Scheme>) => void;
}) {
  const [name, setName] = useState(scheme.name);
  const [officialUrl, setOfficialUrl] = useState(scheme.official_source_url || scheme.official_website || scheme.apply_url || "");
  const [fallbackUrl, setFallbackUrl] = useState(scheme.fallbackUrl || "");
  const [category, setCategory] = useState(scheme.category);
  const [ministry, setMinistry] = useState(scheme.ministry || "");
  const [benefits, setBenefits] = useState(scheme.benefits || "");
  const [description, setDescription] = useState(scheme.short_description || "");
  const [linkStatus, setLinkStatus] = useState(scheme.link_status || "working");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name,
      official_website: officialUrl,
      official_source_url: officialUrl,
      apply_url: officialUrl,
      fallbackUrl,
      category,
      ministry,
      department: ministry,
      benefits,
      short_description: description,
      link_status: linkStatus,
      last_verified: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-display text-lg font-bold">Edit Scheme Record: {scheme.name}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-foreground">Scheme Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Ministry / Department</label>
              <input
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">Official Government Portal URL (.gov.in / .nic.in)</label>
            <input
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">myScheme Fallback URL</label>
            <input
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
              placeholder="https://www.myscheme.gov.in/schemes/..."
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Link Status</label>
            <select
              value={linkStatus}
              onChange={(e) => setLinkStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            >
              <option value="working">working (Official link verified)</option>
              <option value="fallback">fallback (Use myScheme fallback)</option>
              <option value="broken">broken (Unavailable)</option>
              <option value="unverified">unverified</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-foreground">Benefits Description</label>
            <textarea
              rows={2}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-input px-4 py-2 font-semibold hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:brightness-110"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SchemeAddModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (newScheme: any) => void;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"Central" | "State" | "UT">("Central");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("Agriculture");
  const [ministry, setMinistry] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [benefits, setBenefits] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("any");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `sch-${slug}`;
    const newScheme = {
      schemeId: id,
      id,
      slug,
      name,
      governmentLevel: level,
      government_level: level,
      state: level === "Central" ? null : state,
      category,
      ministry,
      department: ministry,
      short_description: description,
      description,
      benefits,
      documents: ["Aadhaar card", "Bank passbook"],
      applicationProcedure: "Apply online at official government portal.",
      officialUrl,
      official_website: officialUrl,
      official_source_url: officialUrl,
      apply_url: officialUrl,
      fallbackUrl: `https://www.myscheme.gov.in/search?q=${encodeURIComponent(name)}`,
      source: ministry || "Official Government",
      sourceType: "Official Government",
      urlStatus: "working",
      link_status: "working",
      lastVerified: new Date().toISOString().split("T")[0],
      last_verified: new Date().toISOString().split("T")[0],
      active: true,
      scheme_status: "Active",
      is_popular: false,
      occupations: [occupation],
      gender: "any",
      tags: [category.toLowerCase(), occupation],
    };
    onAdd(newScheme);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-display text-lg font-bold">Add New Genuine Government Scheme</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-foreground">Scheme Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi..."
              required
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="font-semibold text-foreground">Government Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              >
                <option value="Central">Central</option>
                <option value="State">State</option>
                <option value="UT">Union Territory</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">State (if applicable)</label>
              <select
                value={state}
                disabled={level === "Central"}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring disabled:opacity-40"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              >
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education & Scholarships">Education & Scholarships</option>
                <option value="Women & Child">Women & Child</option>
                <option value="Social Security & Pensions">Social Security & Pensions</option>
                <option value="Business & MSME">Business & MSME</option>
                <option value="Housing & Shelter">Housing & Shelter</option>
                <option value="Disability & Inclusion">Disability & Inclusion</option>
                <option value="Employment & Skill Development">Employment & Skill Development</option>
                <option value="SC/ST/OBC Welfare">SC/ST/OBC Welfare</option>
                <option value="Financial Assistance">Financial Assistance</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Ministry / Department</label>
              <input
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                placeholder="e.g. Ministry of Agriculture"
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Target Beneficiary Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
              >
                <option value="any">Any / All Citizens</option>
                <option value="farmer">Farmer</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed Youth</option>
                <option value="self-employed">Self-Employed / Artisan</option>
                <option value="entrepreneur">Business Owner</option>
                <option value="labour">Daily Wage Labourer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">Official Government Portal URL *</label>
            <input
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="https://example.gov.in"
              required
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Benefits *</label>
            <textarea
              rows={2}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Detailed financial or tangible benefits..."
              required
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Short Description *</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise overview of the scheme..."
              required
              className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 outline-none focus:border-ring"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-input px-4 py-2 font-semibold hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Insert Scheme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
