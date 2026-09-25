import { queryOptions } from "@tanstack/react-query";
import { collection, getDocs, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";
import { DEFAULT_SCHEMES } from "./default-schemes";

export type Scheme = {
  id: string;
  slug: string;
  name: string;
  category: string;
  state: string | null;
  department: string | null;
  ministry: string | null;
  short_description: string;
  benefits: string;
  documents: string[];
  min_age: number | null;
  max_age: number | null;
  gender: string;
  max_annual_income: number | null;
  occupations: string[];
  education_levels: string[];
  caste_categories: string[];
  area_type: string;
  disability_required: boolean;
  official_website: string | null;
  official_source_url?: string | null;
  apply_url: string;
  is_popular: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  link_status?: string | null;
  link_http_status?: number | null;
  link_fail_count?: number | null;
  link_checked_at?: string | null;
  verification_status?: string | null;
  scheme_status?: string | null;
  government_level?: string | null;
  scheme_scope?: string | null;
  available_states?: string[];
  eligibility_rules?: unknown;
};

export type UserProfile = {
  age: number;
  gender: "male" | "female" | "other";
  state: string;
  areaType: "urban" | "rural";
  annualIncome: number;
  occupation: string;
  education?: string;
  caste?: string;
  parentOccupation?: "govt" | "pvt" | "self-employed" | "farmer" | "labour" | "unemployed" | "na";
  hasDisability: boolean;
};

export const CASTE_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "minority", label: "Minority" },
];

export const EDUCATION_LEVELS = [
  { value: "none", label: "No formal education" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary (10th)" },
  { value: "higher-secondary", label: "Higher Secondary (12th)" },
  { value: "diploma", label: "Diploma / ITI" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Post Graduate or above" },
];

function docToScheme(id: string, d: Record<string, any>): Scheme {
  return {
    id: d.id || id,
    slug: d.slug || id,
    name: d.name || d.schemeName || "",
    category: d.category || "General",
    state: d.state === "Central" ? null : d.state || null,
    ministry: d.ministry || d.department || null,
    department: d.department || d.ministry || null,
    short_description: d.short_description || d.description || "",
    benefits: d.benefits || "",
    documents: d.documents || d.requiredDocuments || [],
    min_age: d.min_age ?? d.eligibility?.minAge ?? null,
    max_age: d.max_age ?? d.eligibility?.maxAge ?? null,
    gender: d.gender ?? d.eligibility?.gender ?? "any",
    max_annual_income: d.max_annual_income ?? d.eligibility?.maxAnnualIncome ?? null,
    occupations: d.occupations ?? d.eligibility?.occupations ?? [],
    education_levels: d.education_levels ?? d.eligibility?.educationLevels ?? [],
    caste_categories: d.caste_categories ?? d.eligibility?.casteCategories ?? [],
    area_type: d.area_type ?? d.eligibility?.areaType ?? "any",
    disability_required: d.disability_required ?? d.eligibility?.disabilityRequired ?? false,
    official_website: d.official_website || d.applyLink || d.apply_url || null,
    official_source_url: d.official_source_url || d.officialWebsite || null,
    apply_url: d.apply_url || d.applyLink || "",
    is_popular: Boolean(d.is_popular ?? d.popular ?? d.featured ?? false),
    tags: d.tags ?? [],
    created_at: d.createdAt ? String(d.createdAt) : undefined,
    updated_at: d.updatedAt ? String(d.updatedAt) : undefined,
    link_status: d.link_status ?? "ok",
    verification_status: d.verification_status ?? "Verified",
    scheme_status: d.scheme_status ?? "Active",
    government_level: d.government_level ?? (d.state ? "State" : "Central"),
    scheme_scope: d.scheme_scope ?? (d.state ? "state" : "central"),
  };
}

export const schemesQueryOptions = queryOptions({
  queryKey: ["schemes"],
  queryFn: async (): Promise<Scheme[]> => {
    try {
      if (typeof window !== "undefined") {
        const db = getDb();
        const col = collection(db, "schemes");
        const snap = await getDocs(col);

        const schemeMap = new Map<string, Scheme>();

        if (!snap.empty) {
          snap.forEach((d) => {
            const s = docToScheme(d.id, d.data());
            schemeMap.set(s.slug || s.id, s);
          });
        }

        // Merge all DEFAULT_SCHEMES so new programs are immediately available
        const missingToSeed: Scheme[] = [];
        for (const def of DEFAULT_SCHEMES) {
          const key = def.slug || def.id;
          if (!schemeMap.has(key)) {
            schemeMap.set(key, def);
            missingToSeed.push(def);
          }
        }

        // Asynchronously persist any missing schemes into Firestore
        if (missingToSeed.length > 0) {
          for (const s of missingToSeed) {
            const docId = s.slug || s.id;
            setDoc(
              doc(db, "schemes", docId),
              {
                ...s,
                schemeName: s.name,
                description: s.short_description,
                featured: s.is_popular,
              },
              { merge: true },
            ).catch((e) => console.warn(`[schemes] sync error on ${docId}:`, e));
          }
        }

        const list = Array.from(schemeMap.values());
        list.sort(
          (a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) || a.name.localeCompare(b.name),
        );
        return list;
      }
    } catch (err) {
      console.warn("[schemes] Firestore query failed, falling back to seed schemes:", err);
    }
    return DEFAULT_SCHEMES;
  },
  staleTime: 5 * 60_000,
});

export function matchesProfile(scheme: Scheme, p: UserProfile): boolean {
  if (scheme.min_age != null && p.age < scheme.min_age) return false;
  if (scheme.max_age != null && p.age > scheme.max_age) return false;
  if (scheme.gender !== "any" && scheme.gender !== p.gender) return false;
  if (scheme.max_annual_income != null && p.annualIncome > scheme.max_annual_income) return false;
  if (scheme.disability_required && !p.hasDisability) return false;
  if (scheme.state && scheme.state !== p.state) return false;
  if (scheme.occupations.length > 0) {
    const allowed = scheme.occupations;
    if (!allowed.includes("any") && !allowed.includes(p.occupation)) return false;
  }
  return true;
}

export function scoreScheme(scheme: Scheme, p: UserProfile): number {
  let score = 0;
  if (scheme.occupations.includes(p.occupation)) score += 3;
  if (scheme.gender === p.gender) score += 1;
  if (scheme.is_popular) score += 1;
  if (scheme.disability_required && p.hasDisability) score += 2;
  if (scheme.state && scheme.state === p.state) score += 2;
  return score;
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

export const OCCUPATIONS = [
  { value: "farmer", label: "Farmer" },
  { value: "labour", label: "Labourer / Daily Wage" },
  { value: "unorganised-worker", label: "Unorganised Sector Worker" },
  { value: "self-employed", label: "Self-employed" },
  { value: "entrepreneur", label: "Entrepreneur / Business Owner" },
  { value: "business", label: "Small Business" },
  { value: "street-vendor", label: "Street Vendor" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
  { value: "salaried", label: "Salaried Employee" },
  { value: "any", label: "Other / Not Listed" },
];

// ---------------------------------------------------------------------------
// Official apply link + link health
// ---------------------------------------------------------------------------

export type OfficialLink =
  | { state: "ok"; url: string }
  | { state: "unreachable"; url: string; note: string }
  | { state: "invalid"; url: null; note: string }
  | { state: "missing"; url: null; note: string };

type LinkFields = {
  official_source_url?: string | null;
  official_website?: string | null;
  apply_url?: string | null;
  link_status?: string | null;
  link_http_status?: number | null;
  link_fail_count?: number | null;
};

export function officialLink(scheme: LinkFields): OfficialLink {
  const raw = scheme.official_source_url || scheme.official_website || scheme.apply_url || "";
  const url = /^https?:\/\/[^\s]+\.[a-z]{2,}/i.test(raw) ? raw : null;

  if (!url) return { state: "missing", url: null, note: "Official application link unavailable" };

  const status = scheme.link_status ?? "unchecked";
  const fails = scheme.link_fail_count ?? 0;

  if (status === "invalid" && fails >= 2) {
    return { state: "invalid", url: null, note: "Official page no longer exists" };
  }
  if (status === "unreachable" || (status === "invalid" && fails < 2)) {
    return {
      state: "unreachable",
      url,
      note: scheme.link_http_status
        ? `Could not reach the official site (HTTP ${scheme.link_http_status}) — try it anyway`
        : "Could not reach the official site — try it anyway",
    };
  }
  return { state: "ok", url };
}
