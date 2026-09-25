import fs from "node:fs";
import path from "node:path";
import type { Scheme, UserProfile } from "./schemes";
import { checkOfficialLink } from "./link-check.server";
import { DEFAULT_SCHEMES } from "./default-schemes";

export type SchemeFilterParams = {
  q?: string;
  category?: string;
  state?: string | null;
  governmentLevel?: "all" | "Central" | "State" | "UT";
  occupation?: string;
  gender?: string;
  caste?: string;
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  hasDisability?: boolean;
  urlStatus?: "all" | "working" | "fallback" | "broken" | "unverified";
  page?: number;
  pageSize?: number;
  sortBy?: "popularity" | "name" | "category" | "state";
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: { name: string; count: number }[];
  states: { name: string; count: number }[];
  stats: {
    total: number;
    central: number;
    state: number;
    ut: number;
    workingUrls: number;
    fallbackUrls: number;
  };
};

let cachedSchemes: Scheme[] | null = null;
let byIdMap = new Map<string, Scheme>();
let bySlugMap = new Map<string, Scheme>();
let customAdminOverrides = new Map<string, Partial<Scheme>>();

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

function sanitizeSchemeLink(url: string | null | undefined): string | null {
  if (!url) return null;
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

function isAliveOfficialScheme(s: Scheme): boolean {
  // Discard schemes marked broken or invalid
  if (s.link_status === "broken" || s.link_status === "invalid") return false;
  if (s.link_http_status === 404 || s.link_http_status === 410) return false;

  const url = s.official_website || s.apply_url || s.official_source_url;
  if (!url || !/^https?:\/\/[^\s]+\.[a-z]{2,}/i.test(url)) return false;
  return true;
}

function loadCatalog(): Scheme[] {
  if (cachedSchemes && cachedSchemes.length > 0) return cachedSchemes;
  try {
    const filePath = path.resolve(process.cwd(), "src/data/schemes-catalog.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(raw) as Scheme[];
      if (Array.isArray(list) && list.length > 0) {
        byIdMap.clear();
        bySlugMap.clear();
        const validList: Scheme[] = [];

        for (const item of list) {
          if (!isAliveOfficialScheme(item)) continue;

          const sanitized: Scheme = {
            ...item,
            official_website: sanitizeSchemeLink(item.official_website),
            apply_url:
              sanitizeSchemeLink(item.apply_url) || sanitizeSchemeLink(item.official_website) || "",
            official_source_url:
              sanitizeSchemeLink(item.official_source_url) ||
              sanitizeSchemeLink(item.official_website),
            link_status:
              item.link_status === "invalid" || item.link_status === "broken"
                ? "working"
                : item.link_status || "working",
          };

          const key = sanitized.id || sanitized.slug;
          byIdMap.set(sanitized.id, sanitized);
          if (sanitized.slug) bySlugMap.set(sanitized.slug, sanitized);
          validList.push(sanitized);
        }

        cachedSchemes = validList;
        return validList;
      }
    }
  } catch (err) {
    console.error("[schemes-db] Error loading schemes-catalog.json:", err);
  }
  // Fallback to in-memory DEFAULT_SCHEMES
  byIdMap.clear();
  bySlugMap.clear();
  const validDefaults: Scheme[] = [];
  for (const s of DEFAULT_SCHEMES) {
    if (!isAliveOfficialScheme(s)) continue;
    const sanitized: Scheme = {
      ...s,
      official_website: sanitizeSchemeLink(s.official_website),
      apply_url: sanitizeSchemeLink(s.apply_url) || sanitizeSchemeLink(s.official_website) || "",
      official_source_url:
        sanitizeSchemeLink(s.official_source_url) || sanitizeSchemeLink(s.official_website),
    };
    const key = sanitized.id || sanitized.slug;
    byIdMap.set(sanitized.id, sanitized);
    if (sanitized.slug) bySlugMap.set(sanitized.slug, sanitized);
    validDefaults.push(sanitized);
  }
  cachedSchemes = validDefaults;
  return validDefaults;
}

export function getAllSchemes(): Scheme[] {
  const base = loadCatalog();
  if (customAdminOverrides.size === 0) return base;
  return base.map((s) => {
    const override =
      customAdminOverrides.get(s.id) || (s.slug ? customAdminOverrides.get(s.slug) : undefined);
    return override ? { ...s, ...override } : s;
  });
}

export function getSchemeById(idOrSlug: string): Scheme | null {
  loadCatalog();
  const found = byIdMap.get(idOrSlug) || bySlugMap.get(idOrSlug) || null;
  if (!found) return null;
  const override =
    customAdminOverrides.get(found.id) ||
    (found.slug ? customAdminOverrides.get(found.slug) : undefined);
  return override ? { ...found, ...override } : found;
}

export function applyAdminSchemeUpdate(schemeId: string, updates: Partial<Scheme>): Scheme | null {
  const existing = getSchemeById(schemeId);
  if (!existing) return null;
  const merged: Scheme = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
    last_verified: updates.last_verified || new Date().toISOString().split("T")[0],
  };
  customAdminOverrides.set(existing.id, merged);
  if (existing.slug) customAdminOverrides.set(existing.slug, merged);
  return merged;
}

export function applyAdminAddScheme(newScheme: Scheme): Scheme {
  loadCatalog();
  // Prevent duplicate: check ID, slug, and normalized name + state
  const normName = newScheme.name.trim().toLowerCase();
  for (const s of getAllSchemes()) {
    if (s.id === newScheme.id || (s.slug && s.slug === newScheme.slug)) {
      // Merge instead of duplicate
      return applyAdminSchemeUpdate(s.id, newScheme)!;
    }
    if (s.name.trim().toLowerCase() === normName && s.state === newScheme.state) {
      return applyAdminSchemeUpdate(s.id, newScheme)!;
    }
  }
  customAdminOverrides.set(newScheme.id, newScheme);
  if (newScheme.slug) customAdminOverrides.set(newScheme.slug, newScheme);
  if (cachedSchemes) {
    cachedSchemes.unshift(newScheme);
  }
  return newScheme;
}

// Full text & keyword search across 4,000+ schemes
export function searchSchemes(params: SchemeFilterParams): PaginatedResult<Scheme> {
  const all = getAllSchemes();
  const q = (params.q || "").trim().toLowerCase();

  // Natural language query token extraction
  const wantsScholarship = /scholarship|student|fellowship|college|school|tuition/i.test(q);
  const wantsFarmer = /farmer|kisan|agriculture|crop|tractor|irrigation/i.test(q);
  const wantsWomen = /women|girl|mahila|mother|maternity|widow|bride/i.test(q);
  const wantsYouth = /youth|unemployed|internship|job|employment|rozgar|yuva/i.test(q);
  const wantsDisability = /disab|divyang|handicap|blind|deaf|wheelchair/i.test(q);
  const wantsHousing = /house|housing|pucca|shelter|awas|slum/i.test(q);
  const wantsBusiness = /business|msme|loan|mudra|entrepreneur|startup/i.test(q);
  const wantsHealth = /health|ayushman|medical|hospital|insurance|doctor/i.test(q);
  const wantsPension = /pension|senior|old age|vridh/i.test(q);
  const wantsOBC = /\bobc\b|backward class/i.test(q);
  const wantsSC = /\bsc\b|scheduled caste|dalit/i.test(q);
  const wantsST = /\bst\b|scheduled tribe|tribal|adivasi/i.test(q);

  // Extract state if mentioned in the search query
  const matchedStateInQuery = q
    ? all.find((s) => s.state && q.includes(s.state.toLowerCase()))?.state
    : null;
  const cleanedTokens = q
    ? q
        .replace(
          /\b(schemes|scheme|yojana|program|programs|portal|for|in|of|the|all|and|to|me|can|get|i|am|a)\b/gi,
          " ",
        )
        .trim()
        .split(/\s+/)
        .filter((t) => t.length > 1)
    : [];

  const filtered = all.filter((s) => {
    // 1. Text search
    if (q) {
      const haystack =
        `${s.name} ${s.short_description || ""} ${s.category} ${s.state || "Central"} ${s.ministry || ""} ${s.department || ""} ${(s.tags || []).join(" ")}`.toLowerCase();

      let matchesQuery = haystack.includes(q);

      // State match in query (e.g. "Andhra Pradesh schemes")
      if (!matchesQuery && matchedStateInQuery) {
        if (s.state === matchedStateInQuery) {
          // If query also specifies something else (e.g. "Andhra Pradesh student scholarships")
          if (cleanedTokens.length > 0) {
            const nonStateTokens = cleanedTokens.filter(
              (tok) => !matchedStateInQuery.toLowerCase().includes(tok),
            );
            if (
              nonStateTokens.length === 0 ||
              nonStateTokens.some((tok) => haystack.includes(tok))
            ) {
              matchesQuery = true;
            }
          } else {
            matchesQuery = true;
          }
        }
      }

      // Token matching
      if (!matchesQuery && cleanedTokens.length > 0) {
        if (cleanedTokens.every((tok) => haystack.includes(tok))) {
          matchesQuery = true;
        }
      }

      // Support natural intent searches
      if (!matchesQuery) {
        if (
          wantsScholarship &&
          (s.category === "Education & Scholarships" || s.occupations.includes("student"))
        )
          matchesQuery = true;
        if (wantsFarmer && (s.category === "Agriculture" || s.occupations.includes("farmer")))
          matchesQuery = true;
        if (wantsWomen && (s.category === "Women & Child" || s.gender === "female"))
          matchesQuery = true;
        if (
          wantsYouth &&
          (s.category === "Employment & Skill Development" || s.occupations.includes("unemployed"))
        )
          matchesQuery = true;
        if (wantsDisability && (s.category === "Disability & Inclusion" || s.disability_required))
          matchesQuery = true;
        if (wantsHousing && s.category === "Housing & Shelter") matchesQuery = true;
        if (
          wantsBusiness &&
          (s.category === "Business & MSME" || s.category === "Financial Assistance")
        )
          matchesQuery = true;
        if (wantsHealth && s.category === "Healthcare") matchesQuery = true;
        if (
          wantsPension &&
          (s.category === "Social Security & Pensions" || (s.min_age != null && s.min_age >= 60))
        )
          matchesQuery = true;
        if (
          wantsOBC &&
          (s.category === "SC/ST/OBC Welfare" ||
            haystack.includes("obc") ||
            haystack.includes("backward"))
        )
          matchesQuery = true;
        if (
          wantsSC &&
          (s.category === "SC/ST/OBC Welfare" ||
            haystack.includes("sc") ||
            haystack.includes("scheduled caste"))
        )
          matchesQuery = true;
        if (
          wantsST &&
          (s.category === "SC/ST/OBC Welfare" ||
            haystack.includes("st") ||
            haystack.includes("tribal"))
        )
          matchesQuery = true;
      }

      if (!matchesQuery) return false;
    }

    // 2. Category filter
    if (params.category && params.category !== "all" && s.category !== params.category) {
      return false;
    }

    // 3. State filter
    if (params.state) {
      if (params.state === "Central") {
        if (s.state) return false;
      } else {
        // When a state (e.g. Andhra Pradesh) is selected:
        // If user specifically requested "State" only: only schemes belonging to that state
        // If user selected "all" or default: include that state schemes PLUS Central schemes available in that state
        if (params.governmentLevel === "State") {
          if (s.state !== params.state) return false;
        } else if (params.governmentLevel === "Central") {
          if (s.state) return false;
        } else {
          const isOwnState = s.state && s.state.toLowerCase() === params.state.toLowerCase();
          const isCentralScheme = !s.state || s.government_level === "Central";
          if (!isOwnState && !isCentralScheme) return false;
        }
      }
    }

    // 4. Government level filter
    if (params.governmentLevel && params.governmentLevel !== "all") {
      const sLevel = s.government_level || (s.state ? "State" : "Central");
      if (sLevel.toLowerCase() !== params.governmentLevel.toLowerCase()) return false;
    }

    // 5. Occupation filter
    if (params.occupation && params.occupation !== "all") {
      if (
        s.occupations.length > 0 &&
        !s.occupations.includes("any") &&
        !s.occupations.includes(params.occupation)
      ) {
        return false;
      }
    }

    // 6. Gender filter
    if (params.gender && params.gender !== "all") {
      if (s.gender !== "any" && s.gender !== params.gender) {
        return false;
      }
    }

    // 7. Income limit
    if (params.maxIncome != null && s.max_annual_income != null) {
      if (params.maxIncome > s.max_annual_income) return false;
    }

    // 8. URL Status filter & 404 elimination
    if (params.urlStatus && params.urlStatus !== "all") {
      const curStatus = s.link_status || "working";
      if (curStatus !== params.urlStatus) return false;
    } else {
      // By default, strictly exclude any scheme that has broken or 404 status
      if (s.link_status === "broken" || s.link_status === "invalid") return false;
      if (s.link_http_status === 404 || s.link_http_status === 410) return false;
    }

    return true;
  });

  // Calculate aggregates
  const catCount = new Map<string, number>();
  const stateCount = new Map<string, number>();
  let centralCount = 0;
  let stateGovCount = 0;
  let utGovCount = 0;
  let workingUrls = 0;
  let fallbackUrls = 0;

  for (const s of all) {
    catCount.set(s.category, (catCount.get(s.category) || 0) + 1);
    if (s.state) {
      stateCount.set(s.state, (stateCount.get(s.state) || 0) + 1);
      if (s.government_level === "UT") utGovCount++;
      else stateGovCount++;
    } else {
      centralCount++;
    }
    if (s.link_status === "fallback" || (!s.official_website && s.apply_url?.includes("myscheme")))
      fallbackUrls++;
    else workingUrls++;
  }

  // Sorting
  filtered.sort((a, b) => {
    // If a specific state is selected, place that state's schemes first before Central
    if (params.state && params.state !== "Central") {
      const aIsState = a.state && a.state.toLowerCase() === params.state.toLowerCase() ? 1 : 0;
      const bIsState = b.state && b.state.toLowerCase() === params.state.toLowerCase() ? 1 : 0;
      if (aIsState !== bIsState) return bIsState - aIsState;
    }
    if (params.sortBy === "name") return a.name.localeCompare(b.name);
    if (params.sortBy === "category") return a.category.localeCompare(b.category);
    if (params.sortBy === "state")
      return (a.state || "Central").localeCompare(b.state || "Central");
    // Default: popularity first, then name
    return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) || a.name.localeCompare(b.name);
  });

  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 12));
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  const categories = Array.from(catCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const states = Array.from(stateCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    categories,
    states,
    stats: {
      total: all.length,
      central: centralCount,
      state: stateGovCount,
      ut: utGovCount,
      workingUrls,
      fallbackUrls,
    },
  };
}

// 3-Tier Rule-Based Eligibility Evaluator across 4,000+ schemes
export type TieredEligibilityResult = {
  eligible: Scheme[];
  verify: { scheme: Scheme; reason: string }[];
  ineligible: { scheme: Scheme; failedReason: string }[];
  counts: {
    totalEvaluated: number;
    eligibleCount: number;
    verifyCount: number;
    ineligibleCount: number;
  };
};

export function evaluateProfileAcrossCatalog(profile: UserProfile): TieredEligibilityResult {
  const all = getAllSchemes();
  const eligible: Scheme[] = [];
  const verify: { scheme: Scheme; reason: string }[] = [];
  const ineligible: { scheme: Scheme; failedReason: string }[] = [];

  for (const s of all) {
    // 1. Hard Disqualifications (Ineligible)
    // State restriction
    if (s.state && profile.state && s.state.toLowerCase() !== profile.state.toLowerCase()) {
      ineligible.push({
        scheme: s,
        failedReason: `Restricted to permanent residents of ${s.state}`,
      });
      continue;
    }

    // Gender mismatch
    if (s.gender !== "any" && profile.gender && s.gender !== profile.gender) {
      ineligible.push({
        scheme: s,
        failedReason: `Applicable exclusively to ${s.gender} beneficiaries`,
      });
      continue;
    }

    // Age bounds
    if (s.min_age != null && profile.age < s.min_age) {
      ineligible.push({
        scheme: s,
        failedReason: `Minimum required age is ${s.min_age} years (User age: ${profile.age})`,
      });
      continue;
    }
    if (s.max_age != null && profile.age > s.max_age) {
      ineligible.push({
        scheme: s,
        failedReason: `Maximum allowed age is ${s.max_age} years (User age: ${profile.age})`,
      });
      continue;
    }

    // Disability requirement
    if (s.disability_required && !profile.hasDisability) {
      ineligible.push({
        scheme: s,
        failedReason: "Requires benchmark disability certification (40%+ disability)",
      });
      continue;
    }

    // Income limit strictly exceeded
    if (s.max_annual_income != null && profile.annualIncome > s.max_annual_income) {
      ineligible.push({
        scheme: s,
        failedReason: `Annual household income exceeds limit of ₹${s.max_annual_income.toLocaleString("en-IN")}`,
      });
      continue;
    }

    // 2. Check Occupation & Special Category matches
    const occs = s.occupations || [];
    const hasOccupationRestriction = occs.length > 0 && !occs.includes("any");
    const occupationMatches = !hasOccupationRestriction || occs.includes(profile.occupation);

    // If occupation strictly does not match
    if (hasOccupationRestriction && !occupationMatches) {
      ineligible.push({
        scheme: s,
        failedReason: `Targeted for ${occs.join(", ")} (User occupation: ${profile.occupation})`,
      });
      continue;
    }

    // 3. Tier 1 vs Tier 2:
    // If all known profile criteria match and there are no conditional land/business/specific category prerequisites:
    // Categorize as "eligible".
    // If the scheme requires specific land ownership, BPL verification, caste certificate, or academic merit:
    // Categorize as "verify" ("You may be eligible. Please verify the detailed eligibility requirements on the official scheme portal.")
    const isLandRequired =
      s.short_description?.toLowerCase().includes("landholding") ||
      s.benefits?.toLowerCase().includes("per acre");
    const isCasteSpecific =
      s.category === "SC/ST/OBC Welfare" && (!profile.caste || profile.caste === "general");
    const isBplRequired =
      s.max_annual_income != null && s.max_annual_income <= 200000 && profile.annualIncome > 100000;

    if (isLandRequired || isCasteSpecific || isBplRequired) {
      verify.push({
        scheme: s,
        reason:
          "You may be eligible. Please verify the detailed eligibility requirements and documentation on the official scheme portal.",
      });
    } else {
      eligible.push(s);
    }
  }

  // Sort eligible by popularity and state relevance
  eligible.sort((a, b) => {
    const aState = a.state ? 1 : 0;
    const bState = b.state ? 1 : 0;
    return (
      (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) ||
      bState - aState ||
      a.name.localeCompare(b.name)
    );
  });

  return {
    eligible,
    verify,
    ineligible,
    counts: {
      totalEvaluated: all.length,
      eligibleCount: eligible.length,
      verifyCount: verify.length,
      ineligibleCount: ineligible.length,
    },
  };
}

// Resolver for Official URL vs myScheme Fallback Logic
export async function resolveSchemeUrlStatus(scheme: Scheme): Promise<{
  url: string;
  sourceType: "Official Government" | "myScheme Government Source";
  buttonText: string;
  badgeText: string;
  urlStatus: "working" | "fallback" | "broken" | "unverified";
  isVerified: boolean;
}> {
  const offUrl = scheme.official_source_url || scheme.official_website || scheme.apply_url;
  const mySchemeUrl =
    scheme.fallbackUrl || `https://www.myscheme.gov.in/search?q=${encodeURIComponent(scheme.name)}`;

  if (offUrl && /^https?:\/\//i.test(offUrl)) {
    // If already marked working or valid government domain (.gov.in, .nic.in, official state domain)
    const isGovDomain = /\.gov\.in|\.nic\.in|\.gov\b/i.test(offUrl);
    if (isGovDomain && scheme.link_status !== "invalid" && scheme.link_status !== "broken") {
      return {
        url: offUrl,
        sourceType: "Official Government",
        buttonText: "Apply on Official Government Portal",
        badgeText: "✓ Official Government Source",
        urlStatus: "working",
        isVerified: true,
      };
    }
  }

  // Fallback to myScheme
  if (mySchemeUrl && /^https?:\/\//i.test(mySchemeUrl)) {
    return {
      url: mySchemeUrl,
      sourceType: "myScheme Government Source",
      buttonText: "View on myScheme",
      badgeText: "↗ myScheme Government Source",
      urlStatus: "fallback",
      isVerified: true,
    };
  }

  return {
    url: "#",
    sourceType: "Official Government",
    buttonText: "Verification Required",
    badgeText: "Verification Pending",
    urlStatus: "unverified",
    isVerified: false,
  };
}
