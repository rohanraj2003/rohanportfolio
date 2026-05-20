import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { from: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "What projects have you built?",
  "Are you available for work?",
  "What certifications do you have?",
];

function getReply(input: string): string {
  const q = input.toLowerCase();

  if (/name|who are you|introduce/.test(q))
    return "I'm Rohan Raj S R — a Python Full Stack Developer & MCA student based in Kozhikode, Kerala, India.";

  if (/skill|tech|stack|language|know|use/.test(q))
    return "My core stack: Python, Django, DRF, MySQL, MongoDB, JavaScript, HTML, CSS, Bootstrap, REST APIs. I also use Git, Linux, and cybersecurity tools like Wireshark, Burp Suite & Nessus.";

  if (/experience|work|job|intern/.test(q))
    return "I'm currently a Software Developer Intern at Infocampus (Jan 2026–Present) building full-stack Django apps. Previously interned at Baabtra Cyber Square (Jun–Dec 2023) where I reduced bugs by 40% and vulnerabilities by 98%.";

  if (/project|built|made|portfolio/.test(q))
    return "I've built:\n• FloDesk – Lead & Student Enquiry Management System (Django, MySQL) — improved lead visibility by 30%\n• Pain & Palliative Care Management System – improved workflow efficiency by 25%";

  if (/education|degree|college|study|mca|bsc/.test(q))
    return "I'm pursuing MCA at AWH Engineering College (2024–2026). I completed my BSc Computer Science from ICA College (2020–2023).";

  if (/certif/.test(q))
    return "My certifications:\n• IBM Cybersecurity Fundamentals Professional\n• Python Full Stack Internship – Baabtra\n• Introduction to IoT – IIT Kharagpur\n• Data Analytics using Python Workshop";

  if (/cyber|security|hack|burp|wireshark|nessus/.test(q))
    return "I have hands-on experience with cybersecurity tools — Wireshark, Burp Suite, and Nessus. I hold an IBM Cybersecurity Fundamentals certification and reduced vulnerabilities by 98% during my internship.";

  if (/django|python|drf|rest|api/.test(q))
    return "Django & Python are my primary stack. I build full-stack apps with Django, use DRF for REST APIs, and handle authentication, CRUD, and database management with MySQL/MongoDB.";

  if (/available|hire|freelance|work together|contact/.test(q))
    return "Yes! I'm open to freelance work, internships, and full-time roles. Reach me at rohanrajmaniyot@gmail.com or +91 8137962377.";

  if (/email|phone|contact|reach|location|where/.test(q))
    return "📍 Kozhikode, Kerala, India\n📧 rohanrajmaniyot@gmail.com\n📞 +91 8137962377";

  if (/language|speak|english|malayalam|hindi/.test(q))
    return "I speak English, Malayalam, and Hindi.";

  if (/soft skill|team|leadership|agile|management/.test(q))
    return "I'm strong in team collaboration, agile development, project management, communication, leadership, and time management.";

  if (/hello|hi|hey|sup/.test(q))
    return "Hey! 👋 I'm Rohan's portfolio assistant. Ask me anything about his skills, experience, projects, or availability!";

  if (/thank/.test(q))
    return "You're welcome! Feel free to ask anything else or reach out to Rohan directly. 😊";

  return "I'm not sure about that. Try asking about Rohan's skills, experience, projects, certifications, or contact info!";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const about = document.querySelector("#about");
    if (!about) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry!.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(about);
    return () => observer.disconnect();
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! 👋 I'm Rohan's assistant. Ask me about his skills, projects, experience, or availability!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (!visible) return null;

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: getReply(msg) }]);
    }, 800);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9990] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_24px_4px_rgba(45,212,191,0.45)] transition hover:scale-110"
        whileTap={{ scale: 0.92 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed bottom-24 right-6 z-[9989] flex w-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a]/95 shadow-2xl backdrop-blur-xl sm:w-[380px]"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                RR
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d1a] bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">Rohan&apos;s Assistant</p>
                <p className="text-xs text-emerald-400">Online · Ask me anything</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" style={{ minHeight: 0, maxHeight: "320px" }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-sm bg-primary text-black"
                        : "rounded-bl-sm border border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {m.text}
                  </span>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {!typing && (
              <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-4 py-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary transition hover:bg-primary/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about Rohan..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-black transition hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
