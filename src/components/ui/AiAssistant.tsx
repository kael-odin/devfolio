import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import useBreakpoint from "@hooks/useBreakpoint";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";
import {
   CYAN,
   DURATION,
   EASING,
   GLASS_BORDER,
   MONO_FONT,
   TEXT_MUTED,
   TEXT_PRIMARY,
   TEXT_SECONDARY,
} from "@/constants/theme";

interface ChatMessage {
   id: number;
   role: "user" | "assistant";
   text: string;
}

/**
 * Resolve the chat endpoint. Priority:
 * 1. VITE_CHAT_API_URL (public config: your deployed /api/chat or proxy URL)
 * 2. localhost dev proxy (pnpm chat-proxy, default 127.0.0.1:8790)
 * 3. same-origin /api/chat (Vercel-style serverless alongside the site)
 */
const resolveChatUrl = (): string => {
   const override = (
      import.meta.env.VITE_CHAT_API_URL as string | undefined
   )?.trim();
   if (override) return override;
   if (typeof window !== "undefined") {
      const h = window.location.hostname;
      if (h === "localhost" || h === "127.0.0.1") {
         const port =
            typeof (window as unknown as { CHAT_PROXY_PORT?: unknown })
               .CHAT_PROXY_PORT === "number"
               ? (window as unknown as { CHAT_PROXY_PORT: number })
                    .CHAT_PROXY_PORT
               : 8790;
         return `http://${h}:${port}/chat`;
      }
   }
   return "/api/chat";
};

let messageId = 0;
const nextId = () => {
   messageId += 1;
   return messageId;
};

/**
 * Floating AI assistant ("AI 分身" / online support), inspired by
 * vienne-ai-site's chat dock: a hint bubble + chat window sliding in from
 * the bottom-right, talking to POST { message } on the chat endpoint.
 * Without a configured backend it shows setup guidance instead of failing
 * silently — mirroring the contact form's placeholder guard.
 */
const AiAssistant = () => {
   const { isMobile } = useBreakpoint();
   const { language } = useLanguage();
   const [open, setOpen] = useState(false);
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [input, setInput] = useState("");
   const [sending, setSending] = useState(false);
   const listRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (open) {
         const timer = setTimeout(() => inputRef.current?.focus(), 250);
         return () => clearTimeout(timer);
      }
      return undefined;
   }, [open]);

   useEffect(() => {
      listRef.current?.scrollTo({
         top: listRef.current.scrollHeight,
         behavior: "smooth",
      });
   }, [messages, open, sending]);

   const pushMessage = useCallback(
      (role: ChatMessage["role"], text: string) => {
         setMessages((prev) => [
            ...prev.slice(-29),
            { id: nextId(), role, text },
         ]);
      },
      [],
   );

   const send = useCallback(async () => {
      const text = input.trim();
      if (!text || sending) return;
      setInput("");
      pushMessage("user", text);
      setSending(true);
      try {
         const res = await fetch(resolveChatUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
         });
         const raw = await res.text();
         let data: {
            reply?: unknown;
            error?: unknown;
            hint?: unknown;
            detail?: unknown;
            raw?: unknown;
            status?: unknown;
         } = {};
         try {
            data = raw ? (JSON.parse(raw) as typeof data) : {};
         } catch {
            pushMessage("assistant", t(language, "chat.errApi"));
            return;
         }
         if (!res.ok) {
            const msg =
               (typeof data.hint === "string" && data.hint) ||
               (typeof data.error === "string" && data.error) ||
               (typeof data.detail === "string" && data.detail) ||
               (typeof data.raw === "string" && data.raw) ||
               (data.status != null ? `HTTP ${String(data.status)}` : null) ||
               t(language, "chat.errApi");
            pushMessage("assistant", msg);
            return;
         }
         pushMessage(
            "assistant",
            data.reply != null
               ? String(data.reply)
               : t(language, "chat.errApi"),
         );
      } catch {
         pushMessage("assistant", t(language, "chat.errNetwork"));
      } finally {
         setSending(false);
         inputRef.current?.focus();
      }
   }, [input, sending, pushMessage, language]);

   const toggle = useCallback(() => setOpen((v) => !v), []);

   return (
      <>
         {/* Launcher FAB */}
         <motion.button
            type="button"
            onClick={toggle}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: DURATION.quick, ease: EASING.brisk }}
            aria-label={
               open ? t(language, "chat.close") : t(language, "chat.open")
            }
            aria-expanded={open}
            title={t(language, "chat.title")}
            style={{
               position: "fixed",
               right: isMobile ? 20 : 32,
               bottom: isMobile ? 76 : 88,
               zIndex: 40,
               width: 52,
               height: 52,
               borderRadius: 16,
               border: `1px solid ${GLASS_BORDER}`,
               background: "rgb(var(--ch-glass) / 0.85)",
               backdropFilter: "blur(12px)",
               WebkitBackdropFilter: "blur(12px)",
               color: CYAN,
               cursor: "pointer",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
            }}
         >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
         </motion.button>

         {/* Chat dock */}
         <AnimatePresence>
            {open && (
               <motion.div
                  initial={{ opacity: 0, y: 48, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 48, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: EASING.brisk }}
                  role="dialog"
                  aria-label={t(language, "chat.title")}
                  style={{
                     position: "fixed",
                     right: isMobile ? 12 : 32,
                     bottom: isMobile ? 140 : 152,
                     zIndex: 40,
                     width: isMobile ? "calc(100vw - 24px)" : 340,
                     maxWidth: 340,
                     display: "flex",
                     flexDirection: "column",
                     gap: 8,
                  }}
               >
                  {/* Token-saving hint bubble */}
                  <div
                     role="note"
                     style={{
                        borderRadius: 14,
                        border: "1px solid rgba(245,158,11,0.4)",
                        background:
                           "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,88,12,0.06))",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        padding: "10px 12px",
                     }}
                  >
                     <p
                        style={{
                           margin: 0,
                           fontSize: 11,
                           lineHeight: 1.6,
                           color: "rgba(254,243,199,0.95)",
                           textAlign: "center",
                        }}
                     >
                        {t(language, "chat.tokenHint")}
                     </p>
                  </div>

                  {/* Chat window */}
                  <div
                     style={{
                        borderRadius: 16,
                        border: `1px solid ${GLASS_BORDER}`,
                        background: "rgb(var(--ch-glass) / 0.9)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
                        overflow: "hidden",
                     }}
                  >
                     {/* Header */}
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: 10,
                           padding: "12px 14px",
                           borderBottom: "1px solid rgba(255,255,255,0.08)",
                           background:
                              "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(56,189,248,0.12))",
                        }}
                     >
                        <span
                           aria-hidden="true"
                           style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: "#0b1012",
                              border: `1px solid ${CYAN}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: MONO_FONT,
                              fontSize: 13,
                              fontWeight: 800,
                              color: CYAN,
                           }}
                        >
                           K
                        </span>
                        <div>
                           <p
                              style={{
                                 margin: 0,
                                 fontSize: 13,
                                 fontWeight: 700,
                                 color: TEXT_PRIMARY,
                              }}
                           >
                              {t(language, "chat.title")}
                           </p>
                           <p
                              style={{
                                 margin: 0,
                                 fontSize: 11,
                                 color: CYAN,
                                 fontFamily: MONO_FONT,
                              }}
                           >
                              Online
                           </p>
                        </div>
                        <button
                           type="button"
                           onClick={toggle}
                           aria-label={t(language, "chat.close")}
                           style={{
                              marginLeft: "auto",
                              background: "none",
                              border: "none",
                              color: TEXT_MUTED,
                              cursor: "pointer",
                              padding: 6,
                           }}
                        >
                           <X size={18} />
                        </button>
                     </div>

                     {/* Messages */}
                     <div
                        ref={listRef}
                        role="log"
                        aria-live="polite"
                        style={{
                           height: 256,
                           overflowY: "auto",
                           padding: 14,
                           display: "flex",
                           flexDirection: "column",
                           gap: 10,
                           background: "rgba(0,0,0,0.35)",
                        }}
                     >
                        <div
                           style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: 12,
                              padding: 12,
                              fontSize: 13,
                              lineHeight: 1.7,
                              color: TEXT_SECONDARY,
                              whiteSpace: "pre-wrap",
                           }}
                        >
                           {t(language, "chat.welcome")}
                        </div>
                        {messages.map((m) => (
                           <div
                              key={m.id}
                              style={{
                                 alignSelf:
                                    m.role === "user"
                                       ? "flex-end"
                                       : "flex-start",
                                 maxWidth: "85%",
                                 background:
                                    m.role === "user"
                                       ? "rgba(37,99,235,0.18)"
                                       : "rgba(255,255,255,0.05)",
                                 border:
                                    m.role === "user"
                                       ? "1px solid rgba(37,99,235,0.35)"
                                       : "1px solid rgba(255,255,255,0.06)",
                                 borderRadius: 12,
                                 padding: 12,
                                 fontSize: 13,
                                 lineHeight: 1.7,
                                 color:
                                    m.role === "user"
                                       ? TEXT_PRIMARY
                                       : TEXT_SECONDARY,
                                 whiteSpace: "pre-wrap",
                                 overflowWrap: "anywhere",
                              }}
                           >
                              {m.text}
                           </div>
                        ))}
                        {sending && (
                           <div
                              style={{
                                 alignSelf: "flex-start",
                                 background: "rgba(255,255,255,0.05)",
                                 border: "1px solid rgba(255,255,255,0.06)",
                                 borderRadius: 12,
                                 padding: 12,
                                 fontSize: 13,
                                 color: TEXT_MUTED,
                              }}
                           >
                              {t(language, "chat.thinking")}
                           </div>
                        )}
                     </div>

                     {/* Input */}
                     <div
                        style={{
                           padding: 12,
                           borderTop: "1px solid rgba(255,255,255,0.08)",
                           background: "rgba(0,0,0,0.35)",
                        }}
                     >
                        <div style={{ display: "flex", gap: 8 }}>
                           <input
                              ref={inputRef}
                              type="text"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") void send();
                              }}
                              placeholder={t(language, "chat.placeholder")}
                              aria-label={t(language, "chat.inputLabel")}
                              disabled={sending}
                              style={{
                                 flex: 1,
                                 minWidth: 0,
                                 padding: "8px 14px",
                                 borderRadius: 999,
                                 border: "1px solid rgba(255,255,255,0.1)",
                                 background: "rgba(255,255,255,0.05)",
                                 color: TEXT_PRIMARY,
                                 fontSize: 13,
                                 outline: "none",
                              }}
                           />
                           <button
                              type="button"
                              onClick={() => void send()}
                              disabled={sending || input.trim().length === 0}
                              aria-label={t(language, "chat.send")}
                              style={{
                                 width: 40,
                                 height: 40,
                                 flexShrink: 0,
                                 borderRadius: "50%",
                                 border: `1px solid ${CYAN}80`,
                                 background: "rgba(37,99,235,0.2)",
                                 color: CYAN,
                                 cursor:
                                    sending || input.trim().length === 0
                                       ? "default"
                                       : "pointer",
                                 opacity:
                                    sending || input.trim().length === 0
                                       ? 0.5
                                       : 1,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                              }}
                           >
                              <Send size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
};

export default AiAssistant;
