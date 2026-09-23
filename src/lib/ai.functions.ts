import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callGateway(body: unknown): Promise<string> {
  const key = process.env.LOVABLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI API key missing");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  mr: "Marathi (मराठी)",
  bn: "Bengali (বাংলা)",
  gu: "Gujarati (ગુજરાતી)",
  or: "Odia (ଓଡ଼ିଆ)",
};

const FALLBACK_REPLIES: Record<string, string> = {
  en: "Namaste! I am Sathi, your welfare assistant. You can check your eligibility for Central and State government schemes using our quick questionnaire, or browse popular welfare schemes right from the Schemes tab!",
  hi: "नमस्ते! मैं साथी हूँ, आपका सरकारी योजना सहायक। आप हमारी त्वरित प्रश्नावली का उपयोग करके केंद्र और राज्य सरकार की कल्याणकारी योजनाओं के लिए अपनी पात्रता देख सकते हैं, या योजनाएँ टैब से लोकप्रिय योजनाओं की जानकारी ले सकते हैं!",
  te: "నమస్కారం! నేను సాథిని, మీ ప్రభుత్వ సంక్షేమ పథకాల సహాయకుడిని. మా శీఘ్ర ప్రశ్నాపత్రం ద్వారా కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాలకు మీ అర్హతను వెంటనే తనిఖీ చేయవచ్చు!",
  ta: "வணக்கம்! நான் சாதி, உங்கள் அரசு நலத்திட்ட உதவியாளர். எளிய வினாடி வினா மூலம் மத்திய மற்றும் மாநில அரசு திட்டங்களுக்கான உங்கள் தகுதியை உடனடியாக அறியலாம்!",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ಸಾಥಿ, ನಿಮ್ಮ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಸಹಾಯಕ. ನಮ್ಮ ತ್ವರಿತ ಪ್ರಶ್ನಾವಳಿಯನ್ನು ಬಳಸಿಕೊಂಡು ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ನೀವು ಪರಿಶೀಲಿಸಬಹುದು!",
  ml: "നമസ്കാരം! ഞാൻ സാഥി, നിങ്ങളുടെ സർക്കാർ ക്ഷേമപദ്ധതി സഹായി. കേന്ദ്ര-സംസ്ഥാന പദ്ധതികൾക്കായുള്ള നിങ്ങളുടെ അർಹത എളുപ്പത്തിൽ പരിശോധിക്കാം!",
  mr: "नमस्ते! मी साथी आहे, आपला सरकारी योजना सहाय्यक. आपण आमच्या प्रश्नावलीचा वापर करून केंद्र व राज्य सरकारच्या कल्याणकारी योजनांसाठी आपली पात्रता तपासू शकता!",
  bn: "নমস্কার! আমি সাথী, আপনার সরকারি প্রকল্প সহায়ক। আমাদের দ্রুত প্রশ্নোত্তর ব্যবহার করে কেন্দ্র ও রাজ্য সরকারের প্রকল্পের জন্য আপনার যোগ্যতা পরীক্ষা করুন!",
  gu: "નમસ્તે! હું સાથી છું, તમારો સરકારી યોજના સહાયક. તમે અમારી પ્રશ્નાવલીનો ઉપયોગ કરીને કેન્દ્ર અને રાજ્ય સરકારની યોજનાઓ માટે તમારી પાત્રતા ચકાસી શકો છો!",
  or: "ନମସ୍କାର! ମୁଁ ସାଥୀ, ଆପଣଙ୍କ ସରକାରୀ ଯୋଜନା ସହାୟକ। ଆମର ପ୍ରଶ୍ନାବଳୀ ବ୍ୟବହାର କରି କେନ୍ଦ୍ର ଓ ରାଜ୍ୟ ସରକାରୀ ଯୋଜନା ପାଇଁ ଆପଣଙ୍କ ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ!",
};

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        texts: z.array(z.string()).min(1).max(200),
        targetLang: z.string().min(2).max(5),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const target = LANG_NAMES[data.targetLang] ?? data.targetLang;
    if (data.targetLang === "en") return { translations: data.texts };

    let translations: string[] = data.texts;
    try {
      const system = `You are a professional translator. Translate every JSON array element to ${target}. Preserve numbers, punctuation, brand names (Scheme Sathi AI, PM-KISAN, Ayushman, MyScheme, etc.), URLs, and emoji as-is. Return ONLY a JSON array of the translated strings, same length and order. No commentary.`;
      const user = JSON.stringify(data.texts);

      const content = await callGateway({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      });

      // Extract JSON array from response.
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.length === data.texts.length &&
          parsed.every((x) => typeof x === "string")
        ) {
          translations = parsed as string[];
        }
      }
    } catch (err) {
      console.warn("[AI] translateBatch fallback used:", err);
    }
    return { translations };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(4000),
            }),
          )
          .min(1)
          .max(30),
        lang: z.string().default("en"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const langKey = data.lang || "en";
    const langName = LANG_NAMES[langKey] ?? "English";
    try {
      const system = `You are "Sathi", the official AI assistant for Scheme Sathi AI (योजना साथी) — a free portal helping Indian citizens discover Central and State government welfare schemes.

CRITICAL LANGUAGE REQUIREMENT:
- You MUST answer, speak, and converse STRICTLY AND EXCLUSIVELY in ${langName}.
- DO NOT speak in English or any other language unless the user requested language is English (${data.lang === "en"}).
- Even if the user types in English, Roman transliteration, or another language, YOUR COMPLETE ANSWER MUST BE IN ${langName}.
- All scheme details, eligibility guidance, documents, and greetings must be translated and presented naturally in ${langName}.

Content Guidelines:
- Be warm, respectful, concise, and easy to understand for all citizens.
- Guide users to complete the "Check Eligibility" questionnaire for accurate personalized recommendations.
- When mentioning schemes (PM-KISAN, Ayushman Bharat, PMAY, MGNREGA, PM Ujjwala, Sukanya Samriddhi, Jan Dhan, MUDRA, PM-SVANidhi, Ladki Bahin, Gruha Lakshmi, Rythu Bharosa, etc.), clearly explain who is eligible and key benefits.
- Never invent nonexistent schemes or fake links. Remind users to verify on myscheme.gov.in.
- Strictly refuse to ask for or collect private sensitive information (like Aadhaar numbers, OTP, bank account numbers).`;

      const content = await callGateway({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...data.messages],
        temperature: 0.5,
      });
      return { reply: content || FALLBACK_REPLIES[langKey] || FALLBACK_REPLIES.en };
    } catch {
      return {
        reply: FALLBACK_REPLIES[langKey] || FALLBACK_REPLIES.en,
      };
    }
  });

export const explainScheme = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        schemeName: z.string().min(1).max(200),
        state: z.string().nullable().optional(),
        benefits: z.string().max(1000).default(""),
        documents: z.array(z.string()).max(30).default([]),
        applyUrl: z.string().max(500).default(""),
        eligible: z.boolean().default(true),
        profile: z.record(z.string(), z.any()).default({}),
        lang: z.string().optional().default("en"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const langName = LANG_NAMES[data.lang ?? "en"] ?? "English";
    try {
      const system = `You are a concise government welfare advisor for Scheme Sathi AI.
Explain why this scheme matches (or doesn't match) the user in 2-3 warm, simple bullet points.
CRITICAL: Reply STRICTLY in ${langName}.
End with one concrete next step (e.g. "Apply online at MyScheme with your Aadhaar and Income Certificate").`;

      const user = `Scheme: ${data.schemeName} (${data.state ?? "Central"})
Key benefits: ${data.benefits}
Required docs: ${data.documents.join(", ") || "Aadhaar, Bank details"}
User profile: ${JSON.stringify(data.profile)}
Evaluated eligible: ${data.eligible}`;

      const explanation = await callGateway({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
      });

      return { explanation };
    } catch {
      const fallback =
        data.lang && data.lang !== "en" && FALLBACK_REPLIES[data.lang]
          ? FALLBACK_REPLIES[data.lang]
          : `• Matches your profile criteria for ${data.schemeName}.\n• Key benefit: ${data.benefits || "Direct government welfare support."}\n• Next step: Apply via official portal with valid Aadhaar and bank details.`;
      return { explanation: fallback };
    }
  });
