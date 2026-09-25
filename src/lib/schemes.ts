import { queryOptions } from "@tanstack/react-query";
import { collection, getDocs, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";
import { DEFAULT_SCHEMES } from "./default-schemes";
import { getAllCatalogSchemesServer } from "./schemes.server";

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
  officialInfoUrl?: string | null;
  applicationUrl?: string | null;
  registrationUrl?: string | null;
  fallbackUrl?: string | null;
  source?: string | null;
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
    officialInfoUrl: d.officialInfoUrl || d.official_website || null,
    applicationUrl: d.applicationUrl || d.apply_url || d.applyLink || null,
    registrationUrl: d.registrationUrl || d.applicationUrl || d.apply_url || null,
    fallbackUrl: d.fallbackUrl || null,
    source: d.source || null,
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
      // 1. Fetch full verified catalog from server function
      try {
        const fullCatalog = await getAllCatalogSchemesServer();
        if (Array.isArray(fullCatalog) && fullCatalog.length > 0) {
          return fullCatalog;
        }
      } catch (e) {
        // Server fetch fallback
      }

      if (typeof window !== "undefined") {
        try {
          const db = getDb();
          const col = collection(db, "schemes");
          // Short timeout so app never hangs or blocks if Firestore network is unavailable
          const snapPromise = getDocs(col);
          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 2000),
          );
          const snap = (await Promise.race([snapPromise, timeoutPromise])) as any;

          if (snap && !snap.empty) {
            const schemeMap = new Map<string, Scheme>();
            snap.forEach((d: any) => {
              const s = docToScheme(d.id, d.data());
              schemeMap.set(s.slug || s.id, s);
            });
            for (const def of DEFAULT_SCHEMES) {
              const key = def.slug || def.id;
              if (!schemeMap.has(key)) schemeMap.set(key, def);
            }
            const list = Array.from(schemeMap.values());
            list.sort(
              (a, b) =>
                (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) || a.name.localeCompare(b.name),
            );
            return list;
          }
        } catch {
          // Firestore unavailable or offline, smoothly use DEFAULT_SCHEMES
        }
      }
    } catch {
      // fallback
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

export function isValidHttpUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("javascript:") ||
    trimmed.includes("example.com") ||
    trimmed.includes("localhost") ||
    !/^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(trimmed)
  ) {
    return false;
  }
  return true;
}

export type ResolvedSchemeLink = {
  primaryUrl: string;
  primaryLabel: string;
  backupUrl: string;
  backupLabel: string;
  wikiUrl: string;
  isOfficial: boolean;
  departmentName: string;
};

const DEAD_DOMAIN_MAP: Record<string, string> = {
  "sbmurban.org": "https://swachhbharatmission.ddws.gov.in/",
  "pminternship.mca.gov.in": "https://www.myscheme.gov.in/schemes/pmis",
  "pmsma.nhm.gov.in": "https://pmsma.mohfw.gov.in/",
  "pmayg.nic.in": "https://pmayg.gov.in/",
  "nsap.nic.in": "https://nsap.dord.gov.in/",
  "gramawardsachivalayam.ap.gov.in": "https://ap.gov.in/",
  "gsws.ap.gov.in": "https://ap.gov.in/",
  "navasakam.ap.gov.in": "https://ap.gov.in/",
  "aarogyasri.ap.gov.in": "https://drntrvaidyaseva.ap.gov.in/",
  "ysraarogyasri.ap.gov.in": "https://drntrvaidyaseva.ap.gov.in/",
  "aphandlooms.gov.in": "https://ap.gov.in/",
  "rythubandhu.telangana.gov.in": "https://telangana.gov.in/",
  "kalia.odisha.gov.in": "https://krushak.odisha.gov.in/",
  "kanyashree.gov.in": "https://wbkanyashree.gov.in/",
  "welfarepension.lsgkerala.gov.in": "https://kerala.gov.in/",
  "www.pmkvyofficial.org": "https://www.skillindiadigital.gov.in/",
  "pmkvyofficial.org": "https://www.skillindiadigital.gov.in/",
  "ladkibahin.maharashtra.gov.in": "https://ladakibahin.maharashtra.gov.in/",
  "enps.nsdl.com": "https://www.jansuraksha.gov.in/",
};

function sanitizeOfficialUrl(url: string | null | undefined): string | null {
  if (!url || !isValidHttpUrl(url)) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const cleanHost = host.startsWith("www.") ? host.slice(4) : host;
    if (DEAD_DOMAIN_MAP[host]) return DEAD_DOMAIN_MAP[host];
    if (DEAD_DOMAIN_MAP[cleanHost]) return DEAD_DOMAIN_MAP[cleanHost];
  } catch {
    // fallback
  }
  for (const [deadDomain, replacement] of Object.entries(DEAD_DOMAIN_MAP)) {
    if (trimmed.includes(`://${deadDomain}`) || trimmed.includes(`//www.${deadDomain}`)) {
      return replacement;
    }
  }
  return trimmed;
}

interface RelatedPortal {
  url: string;
  label: string;
}

/**
 * Resolves a scheme-specific related departmental/ministry portal
 * so that schemes do not all share the same generic fallback portal.
 */
function resolveRelatedPortal(
  scheme: Partial<Scheme>,
  primaryUrl: string,
  schemeName: string,
): RelatedPortal {
  const isAP = scheme.state === "Andhra Pradesh";
  const state = scheme.state;
  const category = (scheme.category || "").toLowerCase();
  const ministry = (scheme.ministry || "").toLowerCase();
  const department = (scheme.department || "").toLowerCase();
  const name = schemeName.toLowerCase();

  const isDifferent = (url: string | null | undefined): url is string => {
    if (!url || !isValidHttpUrl(url)) return false;
    try {
      const u1 = new URL(url.trim());
      const u2 = new URL(primaryUrl.trim());
      return (
        u1.hostname !== u2.hostname ||
        (u1.pathname !== u2.pathname && u1.pathname !== "/" && u2.pathname !== "/")
      );
    } catch {
      return url.trim() !== primaryUrl.trim();
    }
  };

  // 1. If custom fallbackUrl is valid and different
  if (scheme.fallbackUrl && isDifferent(scheme.fallbackUrl)) {
    return {
      url: scheme.fallbackUrl.trim(),
      label: scheme.ministry ? `${scheme.ministry} Portal` : "Official Reference Portal",
    };
  }

  // 2. If the scheme has an alternate official source/website that differs from the primary apply URL
  const altCandidates = [
    scheme.official_website,
    scheme.official_source_url,
    scheme.officialInfoUrl,
  ];
  for (const alt of altCandidates) {
    const sanitized = sanitizeOfficialUrl(alt);
    if (sanitized && isDifferent(sanitized)) {
      let label = "Department Official Portal";
      if (scheme.ministry) label = `${scheme.ministry} Portal`;
      else if (scheme.department) label = `${scheme.department} Portal`;
      return { url: sanitized, label };
    }
  }

  // 3. Andhra Pradesh state departmental portals
  if (isAP) {
    if (
      category.includes("health") ||
      name.includes("aarogya") ||
      name.includes("vaidya") ||
      name.includes("medical")
    ) {
      const url = "https://hmfw.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Health & Family Welfare" };
    }
    if (
      category.includes("agri") ||
      name.includes("farmer") ||
      name.includes("crop") ||
      name.includes("rythu") ||
      name.includes("karshak")
    ) {
      const url = "https://karshak.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Karshak Agri Portal" };
    }
    if (
      category.includes("social") ||
      category.includes("pension") ||
      name.includes("pension") ||
      name.includes("bharosa") ||
      name.includes("oap")
    ) {
      const url = "https://sspensions.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Social Pensions Portal" };
    }
    if (
      category.includes("edu") ||
      category.includes("scholar") ||
      name.includes("vidya") ||
      name.includes("thalliki") ||
      name.includes("school") ||
      name.includes("jnanabhumi")
    ) {
      const url = "https://jnanabhumi.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Jnanabhumi Education" };
    }
    if (
      category.includes("hous") ||
      name.includes("housing") ||
      name.includes("awas") ||
      name.includes("illu")
    ) {
      const url = "https://housing.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Housing Portal" };
    }
    if (
      category.includes("skill") ||
      category.includes("employ") ||
      name.includes("skill") ||
      name.includes("employment")
    ) {
      const url = "https://www.apssdc.in/";
      if (isDifferent(url)) return { url, label: "AP Skill Mission (APSSDC)" };
    }
    if (
      name.includes("ration") ||
      name.includes("rice") ||
      name.includes("civil supplies") ||
      name.includes("food")
    ) {
      const url = "https://civilsupplies.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Civil Supplies Portal" };
    }
    if (
      name.includes("transport") ||
      name.includes("auto") ||
      name.includes("driver") ||
      name.includes("vahan")
    ) {
      const url = "https://aptransport.org/";
      if (isDifferent(url)) return { url, label: "AP Transport Portal" };
    }
    if (category.includes("women") || name.includes("mahila") || name.includes("child")) {
      const url = "https://wdcw.ap.gov.in/";
      if (isDifferent(url)) return { url, label: "AP Women & Child Dept" };
    }
    if (isDifferent("https://ap.gov.in/")) {
      return { url: "https://ap.gov.in/", label: "AP Government State Portal" };
    }
  }

  // 4. Other States Departmental & State Portals
  if (state && state !== "All" && state !== "Central") {
    const statePortals: Record<string, { url: string; label: string }> = {
      Telangana: { url: "https://telangana.gov.in/", label: "Telangana State Portal" },
      Karnataka: { url: "https://sevasindhu.karnataka.gov.in/", label: "Karnataka Seva Sindhu" },
      "Tamil Nadu": { url: "https://www.tn.gov.in/", label: "Tamil Nadu State Portal" },
      Maharashtra: {
        url: "https://aaplesarkar.mahaonline.gov.in/",
        label: "Aaple Sarkar Maharashtra",
      },
      Rajasthan: {
        url: "https://janinformation.rajasthan.gov.in/",
        label: "Jan Soochna Rajasthan",
      },
      "Uttar Pradesh": { url: "https://edistrict.up.gov.in/", label: "UP eDistrict Portal" },
      Bihar: { url: "https://serviceonline.bihar.gov.in/", label: "RTPS Bihar Portal" },
      Odisha: { url: "https://krushak.odisha.gov.in/", label: "Odisha Citizen Portal" },
      "Madhya Pradesh": { url: "https://mp.gov.in/", label: "MP State Portal" },
      "West Bengal": { url: "https://wb.gov.in/", label: "WB Citizen Portal" },
      Kerala: { url: "https://kerala.gov.in/", label: "Kerala eServices Portal" },
      Gujarat: { url: "https://gujaratindia.gov.in/", label: "Gujarat State Portal" },
      Punjab: { url: "https://punjab.gov.in/", label: "Punjab State Portal" },
      Haryana: { url: "https://haryana.gov.in/", label: "Haryana Antyodaya Portal" },
      Assam: { url: "https://assam.gov.in/", label: "Assam State Portal" },
      Delhi: { url: "https://edistrict.delhigovt.nic.in/", label: "Delhi eDistrict Portal" },
    };
    if (statePortals[state] && isDifferent(statePortals[state].url)) {
      return statePortals[state];
    }
  }

  // 5. Ministry-Specific Verified Portals
  if (ministry.includes("agri") || department.includes("agri")) {
    const url = "https://agricoop.nic.in/";
    if (isDifferent(url)) return { url, label: "Ministry of Agriculture" };
  }
  if (ministry.includes("health") || department.includes("health")) {
    const url = "https://mohfw.gov.in/";
    if (isDifferent(url)) return { url, label: "MoHFW Health Portal" };
  }
  if (ministry.includes("education") || ministry.includes("human resource")) {
    const url = "https://www.education.gov.in/";
    if (isDifferent(url)) return { url, label: "Ministry of Education" };
  }
  if (ministry.includes("housing") || ministry.includes("urban")) {
    const url = "https://mohua.gov.in/";
    if (isDifferent(url)) return { url, label: "MoHUA Urban Portal" };
  }
  if (ministry.includes("rural")) {
    const url = "https://rural.nic.in/";
    if (isDifferent(url)) return { url, label: "Ministry of Rural Dev" };
  }
  if (ministry.includes("social justice") || ministry.includes("empowerment")) {
    const url = "https://socialjustice.gov.in/";
    if (isDifferent(url)) return { url, label: "Social Justice Ministry" };
  }
  if (ministry.includes("women") || ministry.includes("child")) {
    const url = "https://wcd.nic.in/";
    if (isDifferent(url)) return { url, label: "Women & Child Dev Portal" };
  }
  if (ministry.includes("skill") || ministry.includes("entrepreneurship")) {
    const url = "https://msde.gov.in/";
    if (isDifferent(url)) return { url, label: "Skill Development Ministry" };
  }
  if (ministry.includes("msme") || ministry.includes("small enterprise")) {
    const url = "https://msme.gov.in/";
    if (isDifferent(url)) return { url, label: "Ministry of MSME Portal" };
  }
  if (ministry.includes("labour") || ministry.includes("employment")) {
    const url = "https://labour.gov.in/";
    if (isDifferent(url)) return { url, label: "Labour & Employment Ministry" };
  }
  if (ministry.includes("finance") || department.includes("financial")) {
    const url = "https://financialservices.gov.in/";
    if (isDifferent(url)) return { url, label: "Dept of Financial Services" };
  }
  if (ministry.includes("tribal")) {
    const url = "https://tribal.nic.in/";
    if (isDifferent(url)) return { url, label: "Tribal Affairs Ministry" };
  }
  if (ministry.includes("minority")) {
    const url = "https://minorityaffairs.gov.in/";
    if (isDifferent(url)) return { url, label: "Minority Affairs Ministry" };
  }
  if (ministry.includes("renewable") || ministry.includes("energy")) {
    const url = "https://mnre.gov.in/";
    if (isDifferent(url)) return { url, label: "Renewable Energy Ministry" };
  }
  if (ministry.includes("electronics") || ministry.includes("it") || ministry.includes("meity")) {
    const url = "https://www.meity.gov.in/";
    if (isDifferent(url)) return { url, label: "MeitY Digital India" };
  }

  // 6. Category-Specific Central Portals
  if (category.includes("health")) {
    const url = "https://nha.gov.in/";
    if (isDifferent(url)) return { url, label: "National Health Authority" };
  }
  if (category.includes("agri")) {
    const url = "https://agricoop.nic.in/";
    if (isDifferent(url)) return { url, label: "National Agriculture Portal" };
  }
  if (category.includes("edu") || category.includes("scholar")) {
    const url = "https://scholarships.gov.in/";
    if (isDifferent(url)) return { url, label: "National Scholarship Portal" };
  }
  if (category.includes("pension") || category.includes("social")) {
    const url = "https://nsap.nic.in/";
    if (isDifferent(url)) return { url, label: "National Social Assistance (NSAP)" };
  }
  if (category.includes("hous")) {
    const url = "https://pmay-urban.gov.in/";
    if (isDifferent(url)) return { url, label: "PMAY Housing Portal" };
  }
  if (category.includes("skill") || category.includes("employ")) {
    const url = "https://www.ncs.gov.in/";
    if (isDifferent(url)) return { url, label: "National Career Service (NCS)" };
  }
  if (category.includes("msme") || category.includes("business")) {
    const url = "https://msme.gov.in/";
    if (isDifferent(url)) return { url, label: "Ministry of MSME Portal" };
  }
  if (category.includes("disability") || category.includes("inclusion")) {
    const url = "https://www.swavlambancard.gov.in/";
    if (isDifferent(url)) return { url, label: "UDID Disability Portal" };
  }
  if (category.includes("women") || category.includes("child")) {
    const url = "https://wcd.nic.in/";
    if (isDifferent(url)) return { url, label: "Women & Child Dev Portal" };
  }
  if (category.includes("financial")) {
    const url = "https://dbtbharat.gov.in/";
    if (isDifferent(url)) return { url, label: "DBT Bharat Welfare Portal" };
  }

  // 7. Scheme-specific targeted search on myScheme
  const searchUrl = `https://www.myscheme.gov.in/search?q=${encodeURIComponent(schemeName)}`;
  if (isDifferent(searchUrl)) {
    return {
      url: searchUrl,
      label: scheme.category ? `myScheme ${scheme.category} Guide` : "myScheme Verification Guide",
    };
  }

  return {
    url: "https://www.india.gov.in/",
    label: "National Portal of India",
  };
}

/**
 * Dynamic link resolution following the strict priority ladder:
 * 1. Exact official scheme application URL
 * 2. Exact official scheme registration URL
 * 3. Official scheme/department website
 * 4. Scheme-relevant departmental/state/ministry portal
 * 5. Targeted myScheme search guide
 */
export function resolveSchemeLinks(scheme: Partial<Scheme>): ResolvedSchemeLink {
  const name = scheme.name || "Government Welfare Scheme";
  const state = scheme.state;
  const isAP = state === "Andhra Pradesh";
  const apPortalDefault = "https://ap.gov.in/";
  const searchFallback = "https://www.myscheme.gov.in/search?q=" + encodeURIComponent(name);

  // Candidate URLs in priority order:
  const candidates = [
    scheme.applicationUrl,
    scheme.apply_url,
    scheme.registrationUrl,
    scheme.official_website,
    scheme.official_source_url,
    scheme.officialInfoUrl,
  ];

  let chosenPrimary = "";
  for (const c of candidates) {
    const sanitized = sanitizeOfficialUrl(c);
    if (sanitized) {
      chosenPrimary = sanitized;
      break;
    }
  }

  // Fallback if no valid candidate found
  if (!chosenPrimary) {
    chosenPrimary = isAP ? apPortalDefault : searchFallback;
  }

  const isOfficial = !chosenPrimary.includes("myscheme.gov.in");

  let primaryLabel = "Apply / Visit Official Portal";
  if (!isOfficial) {
    primaryLabel = "View on myScheme Portal";
  } else {
    try {
      const pathname = new URL(chosenPrimary).pathname.toLowerCase();
      if (
        pathname.includes("apply") ||
        pathname.includes("register") ||
        pathname.includes("registration") ||
        pathname.includes("form")
      ) {
        primaryLabel = "Apply Now";
      } else {
        primaryLabel = "Apply / Visit Official Portal";
      }
    } catch {
      primaryLabel = "Apply / Visit Official Portal";
    }
  }

  // Dynamic scheme-specific related backup portal:
  const related = resolveRelatedPortal(scheme, chosenPrimary, name);
  const backupUrl = related.url;
  const backupLabel = related.label;

  const departmentName =
    scheme.department ||
    scheme.ministry ||
    (isAP
      ? "Government of Andhra Pradesh"
      : state
        ? `Government of ${state}`
        : "Government of India");

  const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`;

  return {
    primaryUrl: chosenPrimary,
    primaryLabel,
    backupUrl,
    backupLabel,
    wikiUrl,
    isOfficial,
    departmentName,
  };
}

export function officialLink(scheme: LinkFields): OfficialLink {
  const resolved = resolveSchemeLinks(scheme as Partial<Scheme>);
  return { state: "ok", url: resolved.primaryUrl };
}
