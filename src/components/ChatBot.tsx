import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Briefcase, Sparkles, RotateCcw } from "lucide-react";

type Message = { from: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "What projects have you built?",
  "Are you available for work?",
  "What certifications do you have?",
];

const LOADING_STEPS = [
  "Parsing job requirements...",
  "Scanning Rohan's backend credentials...",
  "Analyzing MySQL & secure coding experience...",
  "Synthesizing customized alignment pitch...",
  "Finalizing analysis report...",
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

// Custom Markdown-like parser for styled rendering of AI output
function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  
  function renderBoldText(str: string) {
    const parts = str.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-emerald-400">{part}</strong>;
      }
      return part;
    });
  }

  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-300">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;

        // Header ###
        if (trimmed.startsWith("###")) {
          return (
            <h4
              key={i}
              className="mt-5 text-sm font-bold text-white tracking-tight clash-grotesk border-b border-white/10 pb-1.5 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }

        // Bullet points
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.replace(/^[-*]\s*/, "");
          return (
            <div key={i} className="flex items-start gap-2 pl-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="flex-1">{renderBoldText(content)}</span>
            </div>
          );
        }

        return <p key={i} className="pl-0.5">{renderBoldText(trimmed)}</p>;
      })}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  
  // Modes: "chat" (Default Q&A assistant) or "recruiter" (AI matching workstation)
  const [mode, setMode] = useState<"chat" | "recruiter">("chat");

  // Recruiter Matcher states
  const [jobDesc, setJobDesc] = useState("");
  const [analysisState, setAnalysisState] = useState<"idle" | "loading" | "result">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState("");

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

  // Standard Q&A ChatBot states
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! 👋 I'm Rohan's assistant. Ask me about his skills, projects, experience, or availability!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, analysisState]);

  if (!visible) return null;

  // Standard Chat send handler
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

  // Recruiter Match analysis handler
  async function handleMatchAnalysis() {
    if (!jobDesc.trim()) return;
    setAnalysisState("loading");
    setLoadingStep(0);

    // Dynamic state loading simulation
    const interval = setInterval(() => {
      setLoadingStep((s) => {
        if (s < 3) return s + 1;
        return s;
      });
    }, 1200);

    try {
      const res = await fetch("/api/matcher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription: jobDesc }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to analyze.");
      }

      const data = (await res.json()) as { analysis: string };
      setLoadingStep(4); // "Finalizing report..."

      setTimeout(() => {
        setAnalysisResult(data.analysis);
        setAnalysisState("result");
      }, 600);
    } catch (e: unknown) {
      clearInterval(interval);
      console.error(e);
      const errMsg = e instanceof Error ? e.message : "Unknown Connection Error";
      setAnalysisResult(
        `### ❌ Analysis Failed\n\nCould not communicate with the backend AI module. Reason:\n- **${errMsg}**\n\n*Make sure you set your GEMINI_API_KEY in your environment on Vercel or locally.*`
      );
      setAnalysisState("result");
    }
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
            style={{ maxHeight: "540px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                RR
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d1a] bg-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight text-white">Rohan&apos;s Assistant</p>
                <p className="text-[10px] text-emerald-400">Online · Powered by Gemini</p>
              </div>
            </div>

            {/* Premium Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-white/5 p-1 gap-1">
              <button
                onClick={() => setMode("chat")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  mode === "chat"
                    ? "bg-primary text-black shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat Q&A
              </button>
              <button
                onClick={() => setMode("recruiter")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  mode === "recruiter"
                    ? "bg-primary text-black shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                AI Matcher
              </button>
            </div>

            {/* Mode-dependent Views */}
            <div className="flex flex-col flex-1" style={{ minHeight: 0 }}>
              {mode === "chat" ? (
                /* ----------------- Standard Chat View ----------------- */
                <>
                  {/* Messages list */}
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

                  {/* Suggestions list */}
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

                  {/* Message input */}
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
                </>
              ) : (
                /* ----------------- AI Recruiter Matcher View ----------------- */
                <AnimatePresence mode="wait">
                  {analysisState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col p-4"
                      style={{ minHeight: "320px" }}
                    >
                      <div className="flex flex-col items-center text-center my-4 space-y-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                        <h3 className="text-xs font-semibold text-white">AI Recruiter Desk</h3>
                        <p className="text-[10px] text-slate-400 max-w-[280px]">
                          Paste your Job Description below, and Rohan&apos;s AI agent will analyze his alignment in real-time.
                        </p>
                      </div>
                      <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Paste Job Description here... (e.g. Seeking a Full-Stack Python/Django developer with MySQL and security exposure...)"
                        className="flex-1 min-h-[140px] rounded-xl border border-white/10 bg-[#0d0d1a] p-3 text-xs text-foreground placeholder:text-muted-foreground/45 outline-none resize-none focus:border-primary/50"
                      />
                      <button
                        onClick={handleMatchAnalysis}
                        disabled={!jobDesc.trim()}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-black transition hover:opacity-90 disabled:opacity-40"
                      >
                        Analyze Job Fit
                      </button>
                    </motion.div>
                  )}

                  {analysisState === "loading" && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-6"
                      style={{ minHeight: "320px" }}
                    >
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-white">Generating Match Report</p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={loadingStep}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="text-[10px] text-primary font-medium"
                          >
                            {LOADING_STEPS[loadingStep]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {analysisState === "result" && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col p-4 overflow-y-auto"
                      style={{ minHeight: "320px", maxHeight: "380px" }}
                    >
                      <MarkdownRenderer text={analysisResult} />
                      <button
                        onClick={() => {
                          setAnalysisResult("");
                          setAnalysisState("idle");
                        }}
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-[10px] font-semibold text-slate-300 transition hover:bg-white/10"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Analyze Another Job
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
