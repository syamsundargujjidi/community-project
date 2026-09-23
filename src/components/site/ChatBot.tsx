import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { chatWithAssistant } from "@/lib/ai.functions";
import { LANGUAGE_NAMES } from "@/i18n";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatBot() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const activeLang = i18n.language || "en";
  const activeLangLabel = LANGUAGE_NAMES[activeLang] || activeLang;

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: t("chat.greeting"),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // When language changes, if user hasn't started chatting yet, update the greeting
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.role === "assistant") {
        return [{ role: "assistant", content: t("chat.greeting") }];
      }
      return prev;
    });
  }, [activeLang, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function handleReset() {
    setMessages([{ role: "assistant", content: t("chat.greeting") }]);
    setInput("");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const { reply } = await chatWithAssistant({
        data: { messages: next, lang: activeLang },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("[ChatBot error]", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            activeLang === "hi"
              ? "माफ़ कीजिए, कोई तकनीकी समस्या आई। कृपया पुनः प्रयास करें।"
              : activeLang === "te"
                ? "క్షమించండి, సాంకేతిక సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి."
                : activeLang === "ta"
                  ? "மன்னிக்கவும், தொழில்நுட்ப சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
                  : activeLang === "kn"
                    ? "ಕ್ಷಮಿಸಿ, ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
                    : activeLang === "mr"
                      ? "माफ करा, तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा."
                      : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t("chat.openAssistant")}
          className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-primary/40"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary ring-2 ring-background" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[80] flex h-[560px] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex flex-col border-b border-primary/20 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20 shadow-xs">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{t("chat.title")}</div>
                  <div className="text-[11px] opacity-80">{t("chat.subtitle")}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="rounded-full p-1.5 hover:bg-primary-foreground/15 transition text-primary-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t("chat.close")}
                  className="rounded-full p-1.5 hover:bg-primary-foreground/15 transition text-primary-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active Language Badge */}
            <div className="mt-2 flex items-center justify-between rounded-xl bg-black/15 px-2.5 py-1 text-[11px]">
              <span className="font-medium text-white/95">🌐 {t("chat.chattingIn")}</span>
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 font-bold text-white text-[10px] uppercase tracking-wide">
                {activeLang.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 bg-muted/20">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground shadow-sm"
                      : "max-w-[90%] rounded-2xl rounded-bl-sm bg-card border border-border/80 px-3.5 py-2.5 text-sm text-card-foreground shadow-xs"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-card border border-border/80 px-3.5 py-2.5 text-sm text-muted-foreground shadow-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" /> {t("chat.thinking")}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={t("chat.placeholder")}
                className="max-h-32 min-h-[42px] flex-1 resize-none rounded-2xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label={t("chat.send")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground leading-tight">
              {t("chat.disclaimer")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
