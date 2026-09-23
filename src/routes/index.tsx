import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Sparkles,
  ClipboardList,
  Zap,
  FileCheck2,
  ShieldCheck,
  Users,
  Landmark,
  HeartHandshake,
  BookOpen,
  Lightbulb,
} from "lucide-react";

import { schemesQueryOptions } from "@/lib/schemes";
import farmerBg from "@/assets/theme-farmer.jpg";
import studentBg from "@/assets/theme-student.jpg";
import workerBg from "@/assets/theme-worker.jpg";
import womenBg from "@/assets/theme-women.jpg";
import seniorBg from "@/assets/theme-senior.jpg";
import businessBg from "@/assets/theme-business.jpg";
import inclusiveBg from "@/assets/theme-inclusive.jpg";

type Persona = {
  key: string;
  image: string;
  alt: string;
};

const PERSONAS: Persona[] = [
  {
    key: "farmer",
    image: farmerBg,
    alt: "Green paddy fields at sunrise with an Indian farmer and tractor",
  },
  {
    key: "student",
    image: studentBg,
    alt: "Indian college campus with students walking",
  },
  {
    key: "worker",
    image: workerBg,
    alt: "Indian construction and factory workers in safety helmets",
  },
  {
    key: "women",
    image: womenBg,
    alt: "Indian women self-help group entrepreneurs",
  },
  {
    key: "senior",
    image: seniorBg,
    alt: "Indian elderly couple with a healthcare worker",
  },
  {
    key: "business",
    image: businessBg,
    alt: "Modern Indian small business startup office",
  },
  {
    key: "inclusive",
    image: inclusiveBg,
    alt: "Inclusive accessible Indian workplace",
  },
];

/** Map questionnaire occupations to a homepage persona theme. */
const OCCUPATION_PERSONA: Record<string, string> = {
  farmer: "farmer",
  student: "student",
  labour: "worker",
  "unorganised-worker": "worker",
  "street-vendor": "worker",
  salaried: "worker",
  "self-employed": "business",
  entrepreneur: "business",
  business: "business",
  unemployed: "student",
};

export const Route = createFileRoute("/")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(schemesQueryOptions),
  head: () => ({
    meta: [
      { title: "Scheme Sathi AI — Find Government Schemes You Deserve" },
      {
        name: "description",
        content:
          "Check your eligibility for Central & State government welfare schemes in India in minutes. Free, multilingual, AI-guided.",
      },
      { property: "og:title", content: "Scheme Sathi AI — Find Government Schemes You Deserve" },
      {
        property: "og:description",
        content:
          "Check your eligibility for Central & State government welfare schemes in India in minutes. Free, multilingual, AI-guided.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useTranslation();
  const { data: schemes } = useSuspenseQuery(schemesQueryOptions);
  const popular = schemes.filter((s) => s.is_popular).slice(0, 6);
  const [personaKey, setPersonaKey] = useState<string | null>(null);

  // Pick up the persona from the last completed questionnaire, if any.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("yojana:profile");
      if (!raw) return;
      const p = JSON.parse(raw) as {
        occupation?: string;
        gender?: string;
        age?: number;
        hasDisability?: boolean;
      };
      let key = p.occupation ? OCCUPATION_PERSONA[p.occupation] : undefined;
      if (p.hasDisability) key = "inclusive";
      else if (p.age && p.age >= 60) key = "senior";
      else if (!key && p.gender === "female") key = "women";
      if (key) setPersonaKey(key);
    } catch {}
  }, []);

  const persona = PERSONAS.find((p) => p.key === personaKey);

  return (
    <>
      {/* Hero */}
      <section
        className={`persona-hero overflow-hidden text-white persona-${persona?.key ?? "default"} ${persona ? "" : "hero-gradient"}`}
      >
        {persona && (
          <img
            src={persona.image}
            alt={persona.alt}
            className="persona-image"
            width={1536}
            height={768}
          />
        )}
        <div className="persona-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t("home.trustedBadge")}
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {t("home.heroTitle")}{" "}
              <span className="text-gradient-brand">{t("home.heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
              {personaKey ? t(`home.personas.${personaKey}.tagline`) : t("home.defaultTagline")}
            </p>

            {/* Persona switcher — changes the homepage theme */}
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {PERSONAS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPersonaKey(personaKey === p.key ? null : p.key)}
                  aria-pressed={personaKey === p.key}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition ${
                    personaKey === p.key
                      ? "border-white bg-white/90 text-foreground"
                      : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {t(`home.personas.${p.key}.label`)}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/questionnaire"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
              >
                {t("home.checkEligibility")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/schemes"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                {t("home.browseAll")}
              </Link>
            </div>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 text-center">
              {[
                { v: `${schemes.length}+`, l: t("home.statsSchemes") },
                { v: "36", l: t("home.statsStates") },
                { v: t("home.statsFree"), l: t("home.statsForever") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold text-gradient-brand sm:text-4xl">
                    {s.v}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {t("home.howItWorksTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("home.howItWorksSubtitle")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              step: "Step 1",
              title: t("home.step1Title"),
              body: t("home.step1Body"),
            },
            {
              icon: Zap,
              step: "Step 2",
              title: t("home.step2Title"),
              body: t("home.step2Body"),
            },
            {
              icon: FileCheck2,
              step: "Step 3",
              title: t("home.step3Title"),
              body: t("home.step3Body"),
            },
          ].map((s, i) => (
            <div key={i} className="card-elevated p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
                {s.step}
              </div>
              <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular schemes */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                {t("home.popularTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("home.popularSubtitle")}</p>
            </div>
            <Link
              to="/schemes"
              className="hidden shrink-0 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              {t("home.viewAll")}
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((s) => (
              <article
                key={s.id}
                className="card-elevated flex flex-col p-6 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {s.category}
                  </span>
                  {s.ministry && (
                    <span className="text-xs text-muted-foreground line-clamp-1">{s.ministry}</span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{s.name}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {s.short_description}
                </p>
                <a
                  href={s.apply_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {t("home.learnMore")} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
            <BookOpen className="h-3.5 w-3.5" /> {t("home.didYouKnowBadge")}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {t("home.didYouKnowTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("home.didYouKnowSubtitle")}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              tag: "PM-KISAN",
              title: "₹3.24 lakh crore disbursed",
              body: "Over 11 crore small and marginal farmers receive direct cash transfers of ₹6,000 per year.",
            },
            {
              tag: "Ayushman Bharat",
              title: "World's largest health scheme",
              body: "PM-JAY covers over 55 crore citizens with ₹5 lakh cashless hospitalization per family per year.",
            },
            {
              tag: "MGNREGA",
              title: "100 days of guaranteed work",
              body: "Every rural household is legally entitled to 100 days of paid manual work per year.",
            },
            {
              tag: "Ujjwala",
              title: "10+ crore LPG connections",
              body: "PMUY has provided free cooking gas connections to women from BPL households across India.",
            },
            {
              tag: "Sukanya Samriddhi",
              title: "8.2% interest for daughters",
              body: "One of the highest sovereign-backed interest rates in India for girl-child savings accounts.",
            },
            {
              tag: "Jan Dhan",
              title: "53+ crore bank accounts",
              body: "PMJDY turned India from largely unbanked to universally banked with direct benefit transfer.",
            },
          ].map((f, i) => (
            <article
              key={i}
              className="card-elevated group relative overflow-hidden p-6 transition hover:-translate-y-1"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {f.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: t("home.whyUs1Title"),
              body: t("home.whyUs1Body"),
            },
            {
              icon: Landmark,
              title: t("home.whyUs2Title"),
              body: t("home.whyUs2Body"),
            },
            {
              icon: Users,
              title: t("home.whyUs3Title"),
              body: t("home.whyUs3Body"),
            },
            {
              icon: HeartHandshake,
              title: t("home.whyUs4Title"),
              body: t("home.whyUs4Body"),
            },
          ].map((v, i) => (
            <div key={i}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="hero-gradient overflow-hidden rounded-3xl px-6 py-14 text-center text-white md:px-16 md:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("home.readyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{t("home.readySubtitle")}</p>
          <Link
            to="/questionnaire"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
          >
            {t("home.startNow")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
