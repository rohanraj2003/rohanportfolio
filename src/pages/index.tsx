import Container from "@/components/Container";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/Home.module.css";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Shield,
  Database,
  Lightbulb,
  Server,
  MailIcon,
  SendIcon,
  CheckCircle2,
  Download,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Award,
} from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { TriangleDownIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { cn, scrollTo } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import VanillaTilt from "vanilla-tilt";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Github, Linkedin, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/MagneticButton";
const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });

const nameLetters = "ROHAN RAJ SR".split("");

// Premium: Spotlight cursor glow (Linear.app style)
function Spotlight() {
  useEffect(() => {
    const el = document.getElementById("spotlight");
    const move = (e: MouseEvent) => {
      if (el) {
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div id="spotlight" className="spotlight" />;
}

function useCountUp(target: number, duration = 1.5) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { ref, count };
}

function CountUp({ value }: { value: string }) {
  const num = parseInt(value);
  const suffix = value.replace(String(num), "");
  const { ref, count } = useCountUp(num);
  return <span ref={ref}>{count}{suffix}</span>;
}

const typewriterRoles = [
  "Python Developer",
  "Backend & API Engineer",
  "Data & Quality Analyst",
  "Cybersecurity Enthusiast"
];

function useTypewriter(words: string[], typingSpeed = 60, pauseMs = 1800, deletingSpeed = 35) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length]!;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplay(current.slice(0, display.length + 1));
        if (display.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseMs);
        }
      } else {
        setDisplay(current.slice(0, display.length - 1));
        if (display.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIndex, words, typingSpeed, pauseMs, deletingSpeed]);

  return display;
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// Slide in from left (commented out to clear ESLint warning)
// function SlideLeft({ children }: { children: React.ReactNode }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -80 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
//       viewport={{ once: true, margin: "-80px" }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// Slide in from right
function SlideRight({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// Zoom in
function ZoomIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// Flip in (rotateX)
function FlipIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 25, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

// Fade + blur reveal
function BlurIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// Apple-style scroll-driven word-by-word text reveal
function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef}>
      <p className="text-3xl font-light leading-normal tracking-tighter text-foreground xl:text-[40px]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <ScrollRevealWord
              key={i}
              word={word}
              progress={scrollYProgress}
              start={start}
              end={end}
            />
          );
        })}
      </p>
    </div>
  );
}

function ScrollRevealWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  // each word lights up as its range passes through scroll progress
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const blur    = useTransform(progress, [start, end], [6, 0]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span
      style={{ opacity, filter }}
      className="mr-[0.3em] inline-block"
    >
      {word}
    </motion.span>
  );
}

const techPills = [
  {
    label: "Python",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 2C6.48 2 7 4.9 7 4.9V7h5v1H4.5S2 7.74 2 12s2.76 5 2.76 5H6v-2.1S5.9 12 9 12h6c2.76 0 3-2.24 3-2.24V5.24S18.28 2 12 2zm-1.5 1.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
        <path d="M12 22c5.52 0 5-2.9 5-2.9V17h-5v-1h7.5S22 16.26 22 12s-2.76-5-2.76-5H18v2.1S18.1 12 15 12H9c-2.76 0-3 2.24-3 2.24v6.52S5.72 22 12 22zm1.5-1.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    ),
  },
  {
    label: "Django",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v11.109c0 3.849-.28 5.695-1.096 7.288-.764 1.543-1.77 2.52-3.849 3.594l-3.645-1.724c2.08-1.019 3.086-1.92 3.747-3.311.687-1.42.916-3.086.916-7.441V6.059h3.927zM17.39.021h3.924v4.026H17.39z"/>
      </svg>
    ),
  },
  {
    label: "MySQL",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.182-.151zM5.77 18.695h-.927a50.854 50.854 0 0 0-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 0 0-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135c-.597 0-1.06-.164-1.388-.49-.328-.326-.492-.797-.492-1.41v-.patron-.26c0-.648.158-1.175.473-1.58.315-.406.76-.61 1.337-.61.538 0 .952.178 1.24.533.29.356.434.87.434 1.544v.476h-2.546c.018.519.175.912.47 1.18.294.268.705.402 1.23.402.246 0 .476-.02.69-.063.214-.042.443-.115.688-.218v.76c-.22.098-.44.166-.66.204-.22.04-.477.06-.476.06zm.003-3.678c-.401 0-.72.135-.955.406-.236.27-.373.65-.41 1.14h2.606c-.007-.49-.12-.87-.34-1.14-.22-.27-.524-.406-.9-.406z"/>
      </svg>
    ),
  },
  {
    label: "Tailwind",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.37 10.8 14.33 12 16 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C14.63 7.2 13.67 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.37 16.8 9.33 18 11 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C9.63 13.2 8.67 12 7 12z"/>
      </svg>
    ),
  },
];

const skills = [
  { label: "Python", pct: 92 },
  { label: "Django & DRF", pct: 88 },
  { label: "MySQL & MongoDB", pct: 80 },
  { label: "Software Testing & QA", pct: 85 },
  { label: "Data Analysis", pct: 80 },
  { label: "Cybersecurity", pct: 82 },
];

const aboutStats = [
  { label: "Years of experience", value: "1+" },
  { label: "Technologies mastered", value: "10+" },
  { label: "Certifications", value: "4+" },
];

const projects = [
  {
    title: "FloDesk – Lead Management System",
    description: "Streamlined student enquiry handling using Django and MySQL, resulting in a 30% improvement in lead visibility and data metrics.",
    image: "/assets/unqueue.webm",
    href: "https://github.com/rohanraj2003/rohanportfolio",
  },
  {
    title: "Pain & Palliative Care Management",
    description: "Django-based medical system optimizing patient and clinical workflows, improving daily care coordination efficiency by 25%.",
    image: "/assets/wrona.jpeg",
    href: "https://github.com/rohanraj2003/rohanportfolio",
  },
  {
    title: "PyAudit & Data Sandbox Suite",
    description: "An automated Python script suite executing regression test runs and profiling system log datasets to verify application integrity.",
    image: "/assets/translate_bot.webm",
    href: "https://github.com/rohanraj2003/rohanportfolio",
  },
];

const services = [
  {
    service: "Python & Backend Development",
    description:
      "Designing scalable server-side APIs, full-stack Django platforms, and secure REST frameworks from design to deployment.",
    icon: Server,
  },
  {
    service: "Data Analysis & Insights",
    description:
      "Profiling datasets, developing algorithms, and analyzing operational metrics to extract business trends and optimize processes.",
    icon: Database,
  },
  {
    service: "Software Testing & QA",
    description:
      "Writing regression tests, executing debugging workflows, and auditing codebases to reduce bug incidents by 40% and ensure absolute quality.",
    icon: CheckCircle2,
  },
  {
    service: "Cybersecurity & Hardening",
    description:
      "IBM-Certified vulnerability assessment using Burp Suite, Wireshark, and Nessus to prevent 98% of security flaws.",
    icon: Shield,
  },
  {
    service: "Tech Exploration (AI & ML)",
    description:
      "Exploring AI models, machine learning, and cutting-edge automation tools to optimize dev pipelines.",
    icon: Lightbulb,
  },
];

export default function Home() {
  const refScrollContainer = useRef(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [contactOpen, setContactOpen] = useState(false);

  const role = useTypewriter(typewriterRoles);

  // handle scroll
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    async function getLocomotive() {
      const Locomotive = (await import("locomotive-scroll")).default;
      new Locomotive({
        el: refScrollContainer.current ?? new HTMLElement(),
        smooth: true,
      });
    }

    function handleScroll() {
      let current = "";
      setIsScrolled(window.scrollY > 0);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
          current = section.getAttribute("id") ?? "";
        }
      });

      navLinks.forEach((li) => {
        li.classList.remove("nav-active");

        if (li.getAttribute("href") === `#${current}`) {
          li.classList.add("nav-active");

        }
      });
    }

    void getLocomotive();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  // card hover effect
  useEffect(() => {
    const tilt: HTMLElement[] = Array.from(document.querySelectorAll("#tilt"));
    VanillaTilt.init(tilt, {
      speed: 300,
      glare: true,
      "max-glare": 0.1,
      gyroscope: true,
      perspective: 900,
      scale: 0.9,
    });
  }, []);

  return (
    <>
    {/* Premium global effects */}
    <Spotlight />
    <div className="dot-grid" />
    <Container>
      <div ref={refScrollContainer}>
        <Gradient />

        {/* Intro */}
        <section
          id="home"
          data-scroll-section
          className="mt-40 flex w-full flex-col items-center xl:mt-0 xl:min-h-screen xl:flex-row xl:justify-between"
        >
          <div className={styles.intro}>
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for work
            </motion.div>

            <div
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed=".09"
              className="flex flex-row items-center space-x-1.5"
            >
              {techPills.map((pill) => (
                <span key={pill.label} className={styles.pill}>
                  {pill.icon}
                  <span className="ml-1">{pill.label}</span>
                </span>
              ))}
            </div>
            <div>
              <h1
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                data-scroll-direction="horizontal"
              >
                <span className="text-6xl tracking-tighter text-foreground 2xl:text-8xl">
                  Hello, I&apos;m
                  <br />
                </span>
                <span className="clash-grotesk shimmer-text text-6xl 2xl:text-8xl">
                  {nameLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00a0" : letter}
                    </motion.span>
                  ))}
                </span>
              </h1>
              <p
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                className="mt-1 max-w-lg tracking-tight text-muted-foreground 2xl:text-xl"
              >
                A passionate{" "}
                <span className="text-primary">{role}</span>
                <span className="animate-blink text-primary">|</span>
              </p>
            </div>
            <span
              data-scroll
              data-scroll-enable-touch-speed
              data-scroll-speed=".06"
              className="flex flex-wrap items-center gap-3 pt-6"
            >
              <MagneticButton strength={0.4}>
                <Button
                  onClick={() => setContactOpen(true)}
                  className="transition-shadow duration-300 hover:shadow-[0_0_18px_3px_rgba(45,212,191,0.45)]"
                >
                  Connect with me <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </MagneticButton>

              {contactOpen && typeof document !== "undefined" && createPortal(
                <SocialPopup onClose={() => setContactOpen(false)} />,
                document.body
              )}

              {/* Premium Download CV button */}
              <MagneticButton strength={0.4}>
                <a
                  href="https://drive.google.com/uc?export=download&id=1SA7qUbdty-y7m0I-gY70My3QM4HLyh8F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary/70 hover:bg-primary/20 hover:shadow-[0_0_22px_4px_rgba(45,212,191,0.25)]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Download CV
                </a>
              </MagneticButton>

              <MagneticButton strength={0.4}>
                <Button
                  variant="outline"
                  onClick={() => scrollTo(document.querySelector("#about"))}
                >
                  Learn more
                </Button>
              </MagneticButton>
            </span>

            <div
              className={cn(
                styles.scroll,
                isScrolled && styles["scroll--hidden"],
              )}
            >
              Scroll to discover{" "}
              <TriangleDownIcon className="mt-1 animate-bounce" />
            </div>
          </div>
          <div
            data-scroll
            data-scroll-speed="-.01"
            className="mt-14 flex h-full w-full items-center justify-center xl:mt-0"
          >
            <CodeBlock />
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Marquee */}
        <div className="relative overflow-hidden py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max animate-marquee gap-12">
            {[
              "Python", "Django", "MySQL", "REST API",
              "JavaScript", "HTML & CSS", "Bootstrap", "Cybersecurity",
              "Python", "Django", "MySQL", "REST API",
              "JavaScript", "HTML & CSS", "Bootstrap", "Cybersecurity",
            ].map((tech, i) => (
              <span key={i} className="flex items-center gap-3 text-sm font-medium tracking-widest text-muted-foreground uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider" />

        {/* Premium Bento Grid */}
        <BentoGrid />

        {/* Divider */}
        <div className="section-divider" />

        {/* About */}
        <section id="about" data-scroll-section>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-14 flex max-w-6xl flex-col justify-start space-y-10"
          >
            {/* Apple-style scroll-driven text reveal */}
            <ScrollRevealText text="I'm a Python Developer focused on Django, databases, and REST APIs — building secure, high-performance web applications, automated test suites, and data profiling systems. I have a strong foundation in cybersecurity and a deep passion for exploring AI, machine learning, and advanced developer tools." />

            <div className="grid grid-cols-3 gap-8">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-md"
                >
                  <span className="clash-grotesk text-gradient text-4xl font-semibold tracking-tight xl:text-6xl">
                    <CountUp value={stat.value} />
                  </span>
                  <span className="tracking-tight text-muted-foreground xl:text-lg">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Skills Radar */}
            <SkillsRadar />
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Projects */}
        <section id="projects" data-scroll-section>
          <ZoomIn>
          {/* Gradient */}
          <div className="relative isolate -z-10">
            <div
              className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-[100px] sm:-top-80 lg:-top-60"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary via-primary to-secondary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div data-scroll data-scroll-speed=".4" className="my-64">
            <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
              ✨ Projects
            </span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight tracking-tighter xl:text-6xl">
              Streamlined digital experiences.
            </h2>
            <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;ve worked on a variety of projects, from small websites to
              large-scale web applications. Here are some of my favorites:
            </p>

            {/* Carousel */}
            <div className="mt-14">
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {projects.map((project) => (
                    <CarouselItem key={project.title} className="md:basis-1/2">
                      <Card id="tilt">
                        <CardHeader className="p-0">
                          <Link href={project.href} target="_blank" passHref>
                            {project.image.endsWith(".webm") ? (
                              <video
                                src={project.image}
                                autoPlay
                                loop
                                muted
                                className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                              />
                            ) : (
                              <Image
                                src={project.image}
                                alt={project.title}
                                width={600}
                                height={300}
                                quality={100}
                                className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                              />
                            )}
                          </Link>
                        </CardHeader>
                        <CardContent className="absolute bottom-0 w-full bg-background/50 backdrop-blur">
                          <CardTitle className="border-t border-white/5 p-4 text-base font-normal tracking-tighter">
                            {project.description}
                          </CardTitle>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="py-2 text-center text-sm text-muted-foreground">
                <span className="font-semibold">
                  {current} / {count}
                </span>{" "}
                projects
              </div>
            </div>
          </div>
          </ZoomIn>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Services */}
        <section id="services" data-scroll-section>
          <SlideRight>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-24 flex flex-col justify-start space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                staggerChildren: 0.5,
              }}
              viewport={{ once: true }}
              className="grid items-center gap-1.5 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="flex flex-col py-6 xl:p-6">
                <h2 className="text-4xl font-medium tracking-tight">
                  Need more info about me?
                  <br />
                  <span className="text-gradient clash-grotesk tracking-normal">
                    I got you.
                  </span>
                </h2>
                <p className="mt-2 tracking-tighter text-secondary-foreground">
                  Here are some of the info. If you have any
                  questions, feel free to reach out.
                </p>
              </div>
              {services.map((service) => (
                <div
                  key={service.service}
                  className="flex flex-col items-start rounded-xl border border-white/10 bg-white/5 p-14 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                >
                  <service.icon className="my-6 text-primary" size={20} />
                  <span className="text-lg tracking-tight text-foreground">
                    {service.service}
                  </span>
                  <span className="mt-2 tracking-tighter text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
          </SlideRight>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Timeline */}
        <section id="timeline" data-scroll-section>
          <FlipIn>
            <div data-scroll data-scroll-speed=".4" className="my-24">
              <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
                🗂️ Journey
              </span>
              <h2 className="mt-3 text-4xl font-semibold tracking-tighter xl:text-6xl">
                My career path.
              </h2>
              <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
                Education and work experience that shaped who I am.
              </p>
              <div className="mt-14">
                <Timeline />
              </div>
            </div>
          </FlipIn>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Certifications */}
        <section id="certifications" data-scroll-section>
          <BlurIn>
            <div data-scroll data-scroll-speed=".4" className="my-24">
              <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
                🏆 Certifications
              </span>
              <h2 className="mt-3 text-4xl font-semibold tracking-tighter xl:text-6xl">
                Verified credentials.
              </h2>
              <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
                Certifications that validate my skills and knowledge.
              </p>
              <div className="mt-14">
                <Certifications />
              </div>
            </div>
          </BlurIn>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* Contact */}
        <section id="contact" data-scroll-section className="my-64">
          <FadeUp>
            <div className="animated-border-card rounded-xl p-px">
              <div className="rounded-xl bg-background/80 px-8 py-14 backdrop-blur-md xl:px-16">
                <div className="mb-10 text-center">
                  <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
                    ✉️ Contact
                  </span>
                  <h2 className="mt-2 text-4xl font-medium tracking-tighter xl:text-6xl">
                    Let&apos;s work{" "}
                    <span className="text-gradient clash-grotesk">together.</span>
                  </h2>
                  <p className="mt-2 text-sm tracking-tight text-muted-foreground">
                    I&apos;m available for freelance work. Drop me a message!
                  </p>
                  <a
                    href="mailto:rohanrajmaniyot@gmail.com"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary transition hover:bg-primary/20"
                  >
                    <MailIcon className="h-3.5 w-3.5" />
                    rohanrajmaniyot@gmail.com
                  </a>
                </div>
                <ContactForm />
              </div>
            </div>
          </FadeUp>
          {contactOpen && typeof document !== "undefined" && createPortal(
            <SocialPopup onClose={() => setContactOpen(false)} />,
            document.body
          )}
        </section>
      </div>
    </Container>
    <ChatBot />
    </>
  );
}

function ContactForm() {
  const [state, handleSubmit] = useForm("YOUR_FORM_ID");

  if (state.succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 py-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <p className="text-lg font-medium tracking-tight">Message sent!</p>
        <p className="text-sm text-muted-foreground">I&apos;ll get back to you as soon as possible.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-tight text-muted-foreground">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
          
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60 focus:bg-white/10"
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-xs text-red-400" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-tight text-muted-foreground">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60 focus:bg-white/10"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-400" />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-xs tracking-tight text-muted-foreground">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
         
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60 focus:bg-white/10 resize-none"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-400" />
      </div>

      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={state.submitting}
          className="w-full transition-shadow duration-300 hover:shadow-[0_0_18px_3px_rgba(45,212,191,0.45)]"
        >
          {state.submitting ? "Sending..." : "Send Message"}
          <SendIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function SocialPopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-white/10 bg-[#0d0d1a]/90 p-10 shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-8 text-center text-lg font-semibold tracking-tight text-white">
          Find me on
        </p>
        <div className="flex items-center justify-center gap-10">
          <a
            href="https://github.com/rohanraj2003"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <Github size={44} />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/rohan-raj-sr-854545369/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <Linkedin size={44} />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a
            href="https://drive.google.com/file/d/1SA7qUbdty-y7m0I-gY70My3QM4HLyh8F/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <FileText size={44} />
            <span className="text-sm">CV</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const timelineItems = [
  {
    type: "work",
    title: "Software Developer Intern",
    org: "Infocampus, Kozhikode",
    period: "Jan 2026 – Present",
    desc: "Assisting in full-stack Django development, database management, and API integrations. Collaborating on debugging, testing, and frontend components using HTML, CSS, and Bootstrap in Git-based Agile flows.",
    current: true,
  },
  {
    type: "edu",
    title: "Master of Computer Applications (MCA)",
    org: "AWH Engineering College, Kozhikode, Kerala",
    period: "2024 – 2026",
    desc: "Specializing in software engineering, database design, advanced algorithms, and secure systems architecture.",
    current: true,
  },
  {
    type: "work",
    title: "Python Full Stack Intern",
    org: "Baabtra Cyber Square, Kozhikode, Kerala",
    period: "Jun 2023 – Dec 2023",
    desc: "Developed scalable web applications in Python/Django, reducing load times by 25%. Executed automated testing and debugging to reduce bugs by 40%. Delivered cross-functional enhancements with 10% more adoption, optimized deployment timelines by 20%, and blocked 98% of security vulnerabilities.",
    current: false,
  },
  {
    type: "edu",
    title: "Bachelor of Computer Science",
    org: "ICA College of Applied Arts & Science, Kozhikode, Kerala",
    period: "2020 – 2023",
    desc: "Core foundation in computational theory, object-oriented programming, logical reasoning, data structures, and relational databases.",
    current: false,
  },
];

function Timeline() {
  return (
    <div className="relative">
      {/* vertical line */}
      <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent xl:left-1/2" />
      <div className="flex flex-col gap-10">
        {timelineItems.map((item, i) => {
          const isRight = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isRight ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              viewport={{ once: true, margin: "-60px" }}
              className={`relative flex items-start gap-6 pl-16 xl:w-1/2 xl:pl-0 ${
                isRight ? "xl:ml-auto xl:pr-16 xl:pl-10" : "xl:pr-16"
              }`}
            >
              {/* dot */}
              <div className={`absolute left-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background xl:left-auto ${
                isRight ? "xl:-left-2.5" : "xl:-right-2.5"
              }`}>
                {item.current && (
                  <span className="h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
                )}
                {!item.current && <span className="h-2 w-2 rounded-full bg-primary/50" />}
              </div>

              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:bg-white/8 hover:shadow-[0_0_20px_rgba(45,212,191,0.08)]">
                <div className="flex items-center gap-2">
                  {item.type === "work"
                    ? <Briefcase className="h-4 w-4 text-primary" />
                    : <GraduationCap className="h-4 w-4 text-primary" />}
                  <span className="text-xs tracking-tight text-primary">{item.period}</span>
                  {item.current && (
                    <span className="ml-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">Current</span>
                  )}
                </div>
                <p className="text-base font-semibold tracking-tight text-foreground">{item.title}</p>
                <p className="text-sm font-medium text-primary/80">{item.org}</p>
                <p className="text-sm tracking-tight text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const certifications = [
  {
    title: "IBM Cybersecurity Fundamentals",
    issuer: "IBM",
    desc: "Professional certification covering network security, cyber threats, key security tools and techniques.",
    badge: "🔐",
    verify: "https://www.credly.com/",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
  },
  {
    title: "Python Full Stack Internship",
    issuer: "Baabtra Cyber Square",
    desc: "Completed intensive full-stack development training with Django, REST APIs, and database management.",
    badge: (
      <svg className="h-8 w-8 text-[#3776AB]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.25.18c.9 0 1.66.07 2.3.2a14.21 14.21 0 0 1 2.94 1.15c.38.2.8.56 1.04.91.27.4.45.87.5 1.38.03.3.05.63.05.99v2.24h-2.24c-1.5 0-2.72 1.22-2.72 2.72v2.24h-4.48c-1.5 0-2.72-1.22-2.72-2.72V5.55c0-1.5 1.22-2.72 2.72-2.72h4.48V.56c0-.18-.04-.38-.13-.53-.13-.2-.36-.35-.61-.35H14.25zM9.75 23.82c-.9 0-1.66-.07-2.3-.2a14.21 14.21 0 0 1-2.94-1.15c-.38-.2-.8-.56-1.04-.91-.27-.4-.45-.87-.5-1.38-.03-.3-.05-.63-.05-.99v-2.24h2.24c1.5 0 2.72-1.22 2.72-2.72v-2.24h4.48c1.5 0 2.72 1.22 2.72 2.72v3.63c0 1.5-1.22 2.72-2.72 2.72h-4.48v2.24c0 .18.04.38.13.53.13.2.36.35.61.35h3.63z" />
      </svg>
    ),
    verify: "https://baabtra.com/",
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
  {
    title: "Introduction to IoT",
    issuer: "IIT Kharagpur",
    desc: "Fundamentals of Internet of Things, sensor networks, and embedded systems from IIT Kharagpur.",
    badge: "📡",
    verify: "https://nptel.ac.in/",
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20",
  },
  {
    title: "Data Analytics using Python",
    issuer: "Workshop Certification",
    desc: "Hands-on workshop covering data analysis, visualization, and insights extraction using Python libraries.",
    badge: "📊",
    verify: "#",
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
  },
];

function Certifications() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {certifications.map((cert, i) => (
        <motion.div
          key={cert.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          viewport={{ once: true, margin: "-40px" }}
          className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-gradient-to-br p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(45,212,191,0.12)] ${cert.border} ${cert.color}`}
        >
          <div className="flex items-start justify-between">
            <span className="text-3xl">{cert.badge}</span>
            <a
              href={cert.verify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground transition hover:text-primary"
            >
              Verify <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">{cert.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
              <Award className="h-3 w-3" />{cert.issuer}
            </p>
          </div>
          <p className="text-xs leading-relaxed tracking-tight text-muted-foreground">{cert.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

function SkillsRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  const data = skills.map((s) => ({
    skill: s.label,
    value: animated ? s.pct : 0,
  }));

  return (
    <div ref={ref} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-8 backdrop-blur-md">
      <p className="mb-4 text-center text-sm tracking-tight text-muted-foreground">Skills Overview</p>
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data} margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "inherit" }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(13,13,26,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "12px",
            }}
            formatter={(value) => [`${String(value ?? 0)}%`, "Proficiency"]}
          />
          <Radar
            dataKey="value"
            stroke="#2dd4bf"
            fill="#2dd4bf"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 5, fill: "#2dd4bf", strokeWidth: 0 }}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((d) => (
          <span key={d.skill} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {d.skill} <span className="text-primary">{d.value}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const codeSnippets = [
  {
    file: "views.py",
    lang: "Python",
    lines: [
      { tokens: [{t:"keyword",v:"from "},{t:"module",v:"django.shortcuts "},{t:"keyword",v:"import "},{t:"fn",v:"render, get_object_or_404"}] },
      { tokens: [{t:"keyword",v:"from "},{t:"module",v:".models "},{t:"keyword",v:"import "},{t:"fn",v:"Project"}] },
      { tokens: [{t:"plain",v:""}] },
      { tokens: [{t:"decorator",v:"@login_required"}] },
      { tokens: [{t:"keyword",v:"def "},{t:"fn",v:"dashboard"},{t:"plain",v:"("},{t:"param",v:"request"},{t:"plain",v:")"}] },
      { tokens: [{t:"plain",v:"    projects = "},{t:"module",v:"Project"},{t:"plain",v:".objects."},{t:"fn",v:"filter"}] },
      { tokens: [{t:"plain",v:"        "},{t:"param",v:"user"},{t:"plain",v:"="},{t:"param",v:"request"},{t:"plain",v:".user"}] },
      { tokens: [{t:"plain",v:"    "},{t:"keyword",v:"return "},{t:"fn",v:"render"},{t:"plain",v:"(request,"}] },
      { tokens: [{t:"string",v:"        'dashboard.html'"}] },
      { tokens: [{t:"plain",v:"        {"},{t:"string",v:"'projects'"},{t:"plain",v:": projects})"}] },
    ],
  },
  {
    file: "models.py",
    lang: "Django",
    lines: [
      { tokens: [{t:"keyword",v:"from "},{t:"module",v:"django.db "},{t:"keyword",v:"import "},{t:"fn",v:"models"}] },
      { tokens: [{t:"plain",v:""}] },
      { tokens: [{t:"keyword",v:"class "},{t:"fn",v:"Project"},{t:"plain",v:"("},{t:"module",v:"models"},{t:"plain",v:".Model):"}] },
      { tokens: [{t:"param",v:"    title "},{t:"plain",v:"= models."},{t:"fn",v:"CharField"},{t:"plain",v:"("}] },
      { tokens: [{t:"param",v:"        max_length"},{t:"plain",v:"="},{t:"string",v:"200"}] },
      { tokens: [{t:"param",v:"    created_at "},{t:"plain",v:"= models."},{t:"fn",v:"DateTimeField"}] },
      { tokens: [{t:"param",v:"        auto_now_add"},{t:"plain",v:"="},{t:"keyword",v:"True"}] },
      { tokens: [{t:"plain",v:""}] },
      { tokens: [{t:"keyword",v:"    def "},{t:"fn",v:"__str__"},{t:"plain",v:"("},{t:"param",v:"self"},{t:"plain",v:"):"}] },
      { tokens: [{t:"keyword",v:"        return "},{t:"param",v:"self"},{t:"plain",v:".title"}] },
    ],
  },
  {
    file: "serializers.py",
    lang: "DRF",
    lines: [
      { tokens: [{t:"keyword",v:"from "},{t:"module",v:"rest_framework "},{t:"keyword",v:"import "},{t:"fn",v:"serializers"}] },
      { tokens: [{t:"keyword",v:"from "},{t:"module",v:".models "},{t:"keyword",v:"import "},{t:"fn",v:"Project"}] },
      { tokens: [{t:"plain",v:""}] },
      { tokens: [{t:"keyword",v:"class "},{t:"fn",v:"ProjectSerializer"},{t:"plain",v:"("}] },
      { tokens: [{t:"plain",v:"    "},{t:"module",v:"serializers"},{t:"plain",v:".ModelSerializer):"}] },
      { tokens: [{t:"keyword",v:"    class "},{t:"fn",v:"Meta"}] },
      { tokens: [{t:"param",v:"        model "},{t:"plain",v:"= "},{t:"module",v:"Project"}] },
      { tokens: [{t:"param",v:"        fields "},{t:"plain",v:"= "},{t:"string",v:"'__all__'"}] },
    ],
  },
];

const tokenColors: Record<string, string> = {
  keyword:   "text-pink-400",
  module:    "text-yellow-300",
  fn:        "text-blue-300",
  param:     "text-orange-300",
  string:    "text-emerald-300",
  decorator: "text-purple-400",
  plain:     "text-slate-300",
};

function CodeBlock() {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const snippet = codeSnippets[snippetIdx]!;

  // cycle snippets
  useEffect(() => {
    setVisibleLines(0);
    const interval = setInterval(() => {
      setSnippetIdx((i) => (i + 1) % codeSnippets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // typewriter line reveal
  useEffect(() => {
    setVisibleLines(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= snippet.lines.length) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [snippetIdx, snippet.lines.length]);

  // 3D tilt on mouse move
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    setMouseX(x);
    setMouseY(y);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setMouseX(0); setMouseY(0); }}
      animate={{ rotateY: mouseX, rotateX: mouseY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformPerspective: 900 }}
      className="relative w-full max-w-lg"
    >
      {/* glow behind card */}
      <div className="absolute -inset-2 rounded-2xl bg-primary/10 blur-2xl" />

      {/* card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f1a] shadow-2xl">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs tracking-tight text-slate-400">{snippet.file}</span>
          <span className="ml-auto rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{snippet.lang}</span>
        </div>

        {/* code area */}
        <div className="px-5 py-4 font-mono text-xs leading-6" style={{ minHeight: 260 }}>
          {snippet.lines.map((line, li) =>
            li < visibleLines ? (
              <motion.div
                key={`${snippetIdx}-${li}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                <span className="mr-4 w-4 select-none text-right text-slate-600">{li + 1}</span>
                <span>
                  {line.tokens.map((tok, ti) => (
                    <span key={ti} className={tokenColors[tok.t] ?? "text-slate-300"}>{tok.v}</span>
                  ))}
                </span>
              </motion.div>
            ) : null
          )}
          {/* blinking cursor on last visible line */}
          {visibleLines < snippet.lines.length && (
            <div className="flex">
              <span className="mr-4 w-4 select-none text-right text-slate-600">{visibleLines + 1}</span>
              <span className="animate-blink text-primary">▋</span>
            </div>
          )}
        </div>

        {/* snippet tabs */}
        <div className="flex gap-1 border-t border-white/5 bg-white/5 px-4 py-2">
          {codeSnippets.map((s, i) => (
            <button
              key={s.file}
              onClick={() => setSnippetIdx(i)}
              className={`rounded px-2 py-0.5 text-[10px] transition ${
                i === snippetIdx ? "bg-primary/20 text-primary" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {s.file}
            </button>
          ))}
        </div>
      </div>

      {/* floating badges */}
      {[
        { label: "Django REST", top: "-top-3", right: "-right-4", delay: 0 },
        { label: "MySQL",       top: "top-1/3", right: "-right-8", delay: 0.2 },
        { label: "Python 3.11", top: "bottom-8", right: "-right-4", delay: 0.4 },
      ].map((b) => (
        <motion.span
          key={b.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
          transition={{ delay: b.delay, duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          className={`absolute ${b.top} ${b.right} rounded-full border border-primary/30 bg-[#0d0f1a]/90 px-2.5 py-1 text-[10px] font-medium text-primary backdrop-blur-md`}
        >
          {b.label}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Premium Bento Grid (inspired by Linear / Vercel)
function BentoGrid() {
  return (
    <section data-scroll-section>
      <FadeUp>
        <div className="my-16 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {/* Status card */}
          <div className="bento-card col-span-2 flex flex-col justify-between p-6 xl:col-span-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400">Open to work</span>
            </div>
            <div className="mt-6">
              <p className="text-2xl font-semibold tracking-tight">Available</p>
              <p className="mt-1 text-xs text-muted-foreground">Freelance & full-time roles</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bento-card col-span-2 flex items-center justify-around p-6">
            {[
              { n: "1+", label: "Years exp" },
              { n: "10+", label: "Tech stack" },
              { n: "4+", label: "Certs" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="clash-grotesk text-gradient text-3xl font-bold">{s.n}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Location card */}
          <div className="bento-card col-span-2 flex flex-col justify-between p-6 xl:col-span-1">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-sm font-semibold tracking-tight">Kerala, India</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Remote-friendly</p>
            </div>
          </div>

          {/* Stack showcase */}
          <div className="bento-card col-span-2 flex flex-col gap-3 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Current stack</p>
            <div className="flex flex-wrap gap-2">
              {["Python", "Django", "REST API", "MySQL", "JavaScript", "Bootstrap", "Cybersecurity"].map((t) => (
                <span key={t} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Currently learning */}
          <div className="bento-card col-span-2 flex flex-col justify-between p-6 xl:col-span-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Learning now</p>
            <div className="mt-4 flex flex-col gap-2">
              {["AI, ML & Latest Tools", "QA & Test Automation", "Data Analytics"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-float" />
                  <span className="text-sm tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="bento-card col-span-2 flex flex-col items-start justify-between bg-gradient-to-br from-primary/10 to-secondary/5 p-6 xl:col-span-1">
            <p className="text-sm font-semibold tracking-tight">Let&apos;s build something great</p>
            <p className="mt-1 text-xs text-muted-foreground">Open for collaborations & freelance projects.</p>
            <MagneticButton strength={0.45} className="mt-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-black transition hover:opacity-90"
              >
                Get in touch <ChevronRight className="h-3 w-3" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

function Gradient() {
  return (
    <>
      {/* Upper gradient */}
      <div className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2dd4bf" />
              <stop offset={1} stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Lower gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <svg
          className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06b6d4" />
              <stop offset={1} stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
