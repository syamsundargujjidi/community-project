import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { translateBatch } from "@/lib/ai.functions";

type Ctx = {
  translating: boolean;
  translateText: (text: string) => Promise<string>;
};

const AutoTranslateCtx = createContext<Ctx>({
  translating: false,
  translateText: async (t) => t,
});

export const useAutoTranslate = () => useContext(AutoTranslateCtx);

const CACHE_PREFIX = "ssa-tr:";
const cache = new Map<string, string>();

function cacheGet(lang: string, text: string): string | undefined {
  const k = `${lang}|${text}`;
  if (cache.has(k)) return cache.get(k);
  if (typeof window === "undefined") return undefined;
  try {
    const v = window.localStorage.getItem(CACHE_PREFIX + k);
    if (v != null) {
      cache.set(k, v);
      return v;
    }
  } catch {}
  return undefined;
}

function cacheSet(lang: string, text: string, tr: string) {
  const k = `${lang}|${text}`;
  cache.set(k, tr);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + k, tr);
  } catch {}
}

export function AutoTranslateProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [translating, setTranslating] = useState(false);

  async function translateText(text: string): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed || lang === "en") return text;
    const hit = cacheGet(lang, trimmed);
    if (hit) return hit;
    setTranslating(true);
    try {
      const res = await translateBatch({ data: { texts: [trimmed], targetLang: lang } });
      const tr = res.translations[0] ?? trimmed;
      cacheSet(lang, trimmed, tr);
      return tr;
    } catch {
      return text;
    } finally {
      setTranslating(false);
    }
  }

  return (
    <AutoTranslateCtx.Provider value={{ translating, translateText }}>
      {children}
    </AutoTranslateCtx.Provider>
  );
}
