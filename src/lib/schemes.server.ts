import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  searchSchemes,
  getSchemeById,
  evaluateProfileAcrossCatalog,
  applyAdminSchemeUpdate,
  applyAdminAddScheme,
  getAllSchemes,
  type SchemeFilterParams,
} from "./schemes-db.server";
import { checkOfficialLink } from "./link-check.server";
import type { UserProfile, Scheme } from "./schemes";

export const getPaginatedSchemesServer = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        q: z.string().optional(),
        category: z.string().optional(),
        state: z.string().nullable().optional(),
        governmentLevel: z.enum(["all", "Central", "State", "UT"]).optional(),
        occupation: z.string().optional(),
        gender: z.string().optional(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(12),
        sortBy: z.enum(["popularity", "name", "category", "state"]).optional(),
        urlStatus: z.enum(["all", "working", "fallback", "broken", "unverified"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    return searchSchemes(data as SchemeFilterParams);
  });

export const getSingleSchemeServer = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return getSchemeById(data.id);
  });

export const evaluateProfileServer = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        age: z.number(),
        gender: z.enum(["male", "female", "other"]),
        state: z.string(),
        areaType: z.enum(["urban", "rural"]),
        annualIncome: z.number(),
        occupation: z.string(),
        education: z.string().optional(),
        caste: z.string().optional(),
        parentOccupation: z
          .enum(["govt", "pvt", "self-employed", "farmer", "labour", "unemployed", "na"])
          .optional(),
        hasDisability: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    return evaluateProfileAcrossCatalog(data as UserProfile);
  });

export const adminUpdateSchemeFn = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        schemeId: z.string(),
        updates: z.record(z.string(), z.any()),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    return applyAdminSchemeUpdate(data.schemeId, data.updates);
  });

export const adminAddSchemeFn = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        scheme: z.record(z.string(), z.any()),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    return applyAdminAddScheme(data.scheme as unknown as Scheme);
  });

export const adminVerifyLinkFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ url: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return checkOfficialLink(data.url);
  });

export const getCatalogOverviewStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const all = getAllSchemes();
    let central = 0;
    let stateCount = 0;
    let utCount = 0;
    let working = 0;
    let fallback = 0;
    const catMap = new Map<string, number>();
    const stateMap = new Map<string, number>();

    for (const s of all) {
      if (!s.state) central++;
      else if (s.government_level === "UT") utCount++;
      else stateCount++;

      catMap.set(s.category, (catMap.get(s.category) || 0) + 1);
      if (s.state) stateMap.set(s.state, (stateMap.get(s.state) || 0) + 1);

      if (s.link_status === "fallback" || (!s.official_website && s.apply_url?.includes("myscheme"))) {
        fallback++;
      } else {
        working++;
      }
    }

    return {
      total: all.length,
      central,
      state: stateCount,
      ut: utCount,
      working,
      fallback,
      categories: Array.from(catMap.entries()).map(([k, v]) => ({ name: k, count: v })),
      states: Array.from(stateMap.entries()).map(([k, v]) => ({ name: k, count: v })),
    };
  });
