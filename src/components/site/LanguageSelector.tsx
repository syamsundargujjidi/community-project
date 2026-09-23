import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES, setLanguage } from "@/i18n";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ||
    LANGUAGES.find((l) => i18n.language.startsWith(l.code)) ||
    LANGUAGES[0];

  const languageLabel = t("nav.language", "Language");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 text-xs font-semibold text-primary shadow-xs transition hover:bg-primary/20 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">
          <span className="opacity-75">{languageLabel}: </span>
          <span className="font-bold">{currentLang.label}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full z-[100] mt-2 max-h-80 w-64 overflow-y-auto rounded-2xl border border-border/80 bg-card p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95"
        >
          <div className="border-b border-border/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {languageLabel} / SELECT
          </div>
          <div className="mt-1 space-y-1">
            {LANGUAGES.map((l) => {
              const isSelected = currentLang.code === l.code;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-foreground hover:bg-muted/80"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-snug">{l.label}</span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {l.subLabel}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
