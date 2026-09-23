import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  INDIAN_STATES,
  OCCUPATIONS,
  EDUCATION_LEVELS,
  CASTE_CATEGORIES,
  type UserProfile,
} from "@/lib/schemes";
import { getFirebaseAuth } from "@/integrations/firebase/client";
import { updateUserProfile, upsertOccupation } from "@/integrations/firebase/user-store";
import { AuthGate } from "@/components/site/AuthGate";

export const Route = createFileRoute("/questionnaire")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Check Your Eligibility — Scheme Sathi AI" },
      {
        name: "description",
        content:
          "Answer a few quick steps to instantly find Central & State schemes you qualify for.",
      },
      { property: "og:title", content: "Check Your Eligibility — Scheme Sathi AI" },
      {
        property: "og:description",
        content:
          "Answer a few quick steps to instantly find Central & State schemes you qualify for.",
      },
    ],
  }),
  component: () => (
    <AuthGate feature="the eligibility questionnaire">
      <Questionnaire />
    </AuthGate>
  ),
});

type Step = 0 | 1 | 2 | 3;

const PARENT_OCCUPATIONS: Array<{
  value: NonNullable<UserProfile["parentOccupation"]>;
  label: string;
}> = [
  { value: "govt", label: "Government Employee" },
  { value: "pvt", label: "Private Employee" },
  { value: "self-employed", label: "Self-employed / Business" },
  { value: "farmer", label: "Farmer" },
  { value: "labour", label: "Daily Wage / Labour" },
  { value: "unemployed", label: "Unemployed" },
  { value: "na", label: "Not applicable" },
];

function Questionnaire() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<UserProfile["gender"] | "">("");
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [state, setState] = useState("");
  const [areaType, setAreaType] = useState<UserProfile["areaType"] | "">("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [education, setEducation] = useState("");
  const [caste, setCaste] = useState("");
  const [occupation, setOccupation] = useState("");
  const [parentOccupation, setParentOccupation] = useState<UserProfile["parentOccupation"] | "">(
    "",
  );

  const stepLabels: Record<Step, string> = {
    0: t("questionnaire.steps.personal", "Personal"),
    1: t("questionnaire.steps.location", "Location"),
    2: t("questionnaire.steps.financial", "Financial"),
    3: t("questionnaire.steps.occupation", "Occupation"),
  };

  const isStudentOrChild = occupation === "student" || (Number(age) > 0 && Number(age) < 18);

  const canContinue =
    (step === 0 && age && Number(age) > 0 && gender && hasDisability !== null) ||
    (step === 1 && state && areaType) ||
    (step === 2 && annualIncome !== "" && education && caste) ||
    (step === 3 && occupation && (!isStudentOrChild || parentOccupation));

  function next() {
    if (step < 3) setStep((step + 1) as Step);
    else submit();
  }
  function back() {
    if (step > 0) setStep((step - 1) as Step);
  }
  function submit() {
    const profile: UserProfile = {
      age: Number(age),
      gender: gender as UserProfile["gender"],
      hasDisability: !!hasDisability,
      state,
      areaType: areaType as UserProfile["areaType"],
      annualIncome: Number(annualIncome),
      occupation,
      education: education || undefined,
      caste: caste || undefined,
      parentOccupation: (parentOccupation || undefined) as UserProfile["parentOccupation"],
    };
    try {
      sessionStorage.setItem("yojana:profile", JSON.stringify(profile));
    } catch {}

    // Fire-and-forget Firestore updates so navigation is instant.
    const user = getFirebaseAuth().currentUser;
    if (user) {
      updateUserProfile(user.uid, profile).catch((e) =>
        console.error("[questionnaire] updateUserProfile", e),
      );
      const occLabel = OCCUPATIONS.find((o) => o.value === occupation)?.label;
      upsertOccupation(occupation, occLabel).catch((e) =>
        console.error("[questionnaire] upsertOccupation", e),
      );
    } else {
      console.log("[questionnaire] no user signed in; skipping Firestore write");
    }

    navigate({ to: "/results" });
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <div className="mb-8 flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
        {([0, 1, 2, 3] as const).map((s) => (
          <div key={s} className="flex-1 text-center">
            <span
              className={
                s === step ? "text-primary" : s < step ? "text-foreground" : "text-muted-foreground"
              }
            >
              {stepLabels[s]}
            </span>
            <div className={`mt-2 h-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`} />
          </div>
        ))}
      </div>

      <div className="card-elevated p-6 md:p-10">
        {step === 0 && (
          <div>
            <h1 className="font-display text-2xl font-bold">
              {t("questionnaire.step0.title", "Tell us about yourself")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "questionnaire.step0.subtitle",
                "These help us filter age & gender-specific schemes.",
              )}
            </p>
            <div className="mt-6 space-y-6">
              <Field label={t("questionnaire.step0.ageLabel", "Age")}>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input"
                  placeholder={t("questionnaire.step0.agePlaceholder", "e.g. 32")}
                />
              </Field>
              <Field label={t("questionnaire.step0.genderLabel", "Gender")}>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <ChoiceBtn key={g} active={gender === g} onClick={() => setGender(g)}>
                      {t(`questionnaire.step0.${g}`, g[0].toUpperCase() + g.slice(1))}
                    </ChoiceBtn>
                  ))}
                </div>
              </Field>
              <Field label={t("questionnaire.step0.disabilityLabel", "Do you have a disability?")}>
                <YesNo
                  value={hasDisability}
                  onChange={setHasDisability}
                  yesLabel={t("questionnaire.step0.yes", "Yes")}
                  noLabel={t("questionnaire.step0.no", "No")}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl font-bold">
              {t("questionnaire.step1.title", "Where do you live?")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "questionnaire.step1.subtitle",
                "Some schemes are state-specific or targeted to urban/rural residents.",
              )}
            </p>
            <div className="mt-6 space-y-6">
              <Field label={t("questionnaire.step1.stateLabel", "State / UT")}>
                <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                  <option value="">
                    {t("questionnaire.step1.selectState", "Select your state…")}
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("questionnaire.step1.areaTypeLabel", "Area type")}>
                <div className="grid grid-cols-2 gap-2">
                  <ChoiceBtn active={areaType === "urban"} onClick={() => setAreaType("urban")}>
                    {t("questionnaire.step1.urban", "Urban")}
                  </ChoiceBtn>
                  <ChoiceBtn active={areaType === "rural"} onClick={() => setAreaType("rural")}>
                    {t("questionnaire.step1.rural", "Rural")}
                  </ChoiceBtn>
                </div>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl font-bold">
              {t("questionnaire.step2.title", "Financial & background details")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "questionnaire.step2.subtitle",
                "Used only for income, education and category based eligibility.",
              )}
            </p>
            <div className="mt-6 space-y-6">
              <Field label={t("questionnaire.step2.incomeLabel", "Annual household income (₹)")}>
                <input
                  type="number"
                  min={0}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="input"
                  placeholder={t("questionnaire.step2.incomePlaceholder", "e.g. 180000")}
                />
              </Field>
              <Field label={t("questionnaire.step2.educationLabel", "Highest education level")}>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="input"
                >
                  <option value="">
                    {t("questionnaire.step2.selectEducation", "Select education…")}
                  </option>
                  {EDUCATION_LEVELS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(`questionnaire.educationLevels.${o.value}`, o.label)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("questionnaire.step2.casteLabel", "Caste category")}>
                <select value={caste} onChange={(e) => setCaste(e.target.value)} className="input">
                  <option value="">
                    {t("questionnaire.step2.selectCaste", "Select category…")}
                  </option>
                  {CASTE_CATEGORIES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(`questionnaire.casteCategories.${o.value}`, o.label)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl font-bold">
              {t("questionnaire.step3.title", "Your occupation")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("questionnaire.step3.subtitle", "Pick the closest match.")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {OCCUPATIONS.map((o) => (
                <ChoiceBtn
                  key={o.value}
                  active={occupation === o.value}
                  onClick={() => setOccupation(o.value)}
                >
                  {t(`questionnaire.occupations.${o.value}`, o.label)}
                </ChoiceBtn>
              ))}
            </div>
            {isStudentOrChild && (
              <div className="mt-8">
                <p className="mb-2 text-sm font-medium">
                  {t("questionnaire.step3.parentOccupationLabel", "Parent / Guardian's occupation")}
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  {t(
                    "questionnaire.step3.parentOccupationSubtitle",
                    "Some student & child welfare schemes depend on the parent's job type.",
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PARENT_OCCUPATIONS.map((o) => (
                    <ChoiceBtn
                      key={o.value}
                      active={parentOccupation === o.value}
                      onClick={() => setParentOccupation(o.value)}
                    >
                      {t(`questionnaire.parentOccupations.${o.value}`, o.label)}
                    </ChoiceBtn>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> {t("questionnaire.nav.back", "Back")}
          </button>
          <button
            onClick={next}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-40"
          >
            {step === 3 ? (
              <>
                {t("questionnaire.nav.seeResults", "See Results")}{" "}
                <ClipboardCheck className="h-4 w-4" />
              </>
            ) : (
              <>
                {t("questionnaire.nav.next", "Next")} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-input);
          background: var(--color-background);
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-ring);
          box-shadow: 0 0 0 3px oklch(0.62 0.16 158 / 0.2);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function ChoiceBtn({
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
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input bg-background hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function YesNo({
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <ChoiceBtn active={value === true} onClick={() => onChange(true)}>
        {yesLabel}
      </ChoiceBtn>
      <ChoiceBtn active={value === false} onClick={() => onChange(false)}>
        {noLabel}
      </ChoiceBtn>
    </div>
  );
}
