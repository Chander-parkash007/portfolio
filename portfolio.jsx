import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";

function useTypingEffect(words, speed = 80) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      const t = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => {
      setText(words[index].substring(0, subIndex));
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [subIndex, index, deleting]);

  return text;
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const end = parseInt(target);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStarted(true);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.max(1, Math.floor(end / 50));
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [started, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function CertIcon({ type }) {
  const icons = {
    java: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/>
      </svg>
    ),
    spring: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M21.8537 1.4158a10.4504 10.4504 0 0 1-1.284 2.2471A11.9666 11.9666 0 1 0 3.8518 20.7757l.4445.3951a11.9543 11.9543 0 0 0 19.6316-8.2971c.3457-2.9395-.2753-6.0679-2.0742-11.458zM7.6482 17.2848a1.3914 1.3914 0 1 1 .0494-1.9672 1.3916 1.3916 0 0 1-.0494 1.9672zm10.5613-5.2957c-2.6988 3.4457-8.3976 2.6988-11.9433 2.9889.0494-.0988.0988-.1481.1481-.2469 3.1481-.2469 8.6006.0988 10.9482-2.7481.9383-1.1358.7408-2.7975-.2963-3.7852-.9877-.9383-2.4.0988-3.4457.6914-1.5.8889-3.1975 1.4321-4.9444 1.4321-1.5 0-3.2963-.4938-3.9383-1.9753-.7901-1.8765.9383-3.6543 2.5506-4.3951 2.0247-.9383 4.3951-.9877 6.5185-.4938.0988.0494.1975.0494.2963.0988-.0988.2963-.1975.5926-.2963.8889-.0494 0-.0988-.0494-.1481-.0494-1.9259-.4938-4.1481-.4444-5.9753.3951-1.0864.4938-2.4 1.5-2.0543 2.8395.2963 1.1852 1.6296 1.5309 2.7654 1.5309 1.5309 0 2.963-.4938 4.2963-1.2346 1.1852-.6914 2.6667-1.6296 4.0988-1.1852 1.6296.5432 2.4691 2.3704 1.7284 3.9012z"/>
      </svg>
    ),
    springboot: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.492 1.424a5.38 5.38 0 0 1-.143-.076c-2.405-1.17-2.475-6.38 1.894-8.059 1.916-.736 3.747-.332 5.818-.825 2.208-.525 4.766-2.18 5.805-4.344 1.165 3.458 2.565 8.866.053 12.21zm1.122-13.011A11.894 11.894 0 0 1 23.999 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0a11.89 11.89 0 0 1 8.742 3.8l-.002-.002a10.475 10.475 0 0 0-.413-.417z"/>
      </svg>
    ),
    ibm: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M0 7.174v1.377h8.928v-1.377H0zm0 2.754v1.377h8.928V9.928H0zm0 2.754v1.377h8.928v-1.377H0zm15.072-5.508v1.377H24V7.174h-8.928zm0 2.754v1.377H24V9.928h-8.928zm0 2.754v1.377H24v-1.377h-8.928zM5.52 4.42v1.377h2.754V4.42H5.52zm0 11.016v1.377h2.754v-1.377H5.52zm10.206-11.016v1.377h2.754V4.42h-2.754zm0 11.016v1.377h2.754v-1.377h-2.754zM2.754 4.42v1.377h2.754V4.42H2.754zm0 11.016v1.377h2.754v-1.377H2.754zm10.206-11.016v1.377h2.754V4.42h-2.754zm0 11.016v1.377h2.754v-1.377h-2.754zM5.52 2.754h2.754V0H5.52v2.754zm0 18.492h2.754V18.49H5.52v2.756zm10.206-18.492h2.754V0h-2.754v2.754zm0 18.492h2.754V18.49h-2.754v2.756z"/>
      </svg>
    ),
    microsoft: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0A2.5 2.5 0 0 0 14 15.5a2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
      </svg>
    ),
    arch: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2 2 2 0 0 0 2-2V5h2V3H8m6 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2z"/>
      </svg>
    ),
    trophy: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M18 2c0 1-1 2-1 2H7S6 3 6 2H2v7c0 2.55 1.92 4.63 4.39 4.94C7.29 15.69 9 17 11 17v3H7v2h10v-2h-4v-3c2-.03 3.71-1.31 4.61-3.06C20.08 13.63 22 11.55 22 9V2h-4zM4 9V4h2v6.83C4.84 10.37 4 9.74 4 9zm16 0c0 .74-.84 1.37-2 1.83V4h2v5z"/>
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>
    ),
    microservice: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
        <circle cx="2" cy="7" r="1.5"/>
        <circle cx="2" cy="12" r="1.5"/>
        <circle cx="2" cy="17" r="1.5"/>
        <circle cx="22" cy="7" r="1.5"/>
        <circle cx="22" cy="12" r="1.5"/>
        <circle cx="22" cy="17" r="1.5"/>
      </svg>
    ),
    vanderbilt: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 3L1 9l4 2.18V17l7 4 7-4v-5.82L23 9 12 3zm6 12.99l-6 3.44-6-3.44v-4.15L12 15l6-3.16v4.15z"/>
      </svg>
    ),
  };
  return icons[type] || icons.code;
}

function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i * 41 + 13) % 95,
      y: (i * 67 + 9) % 95,
      size: (i % 3) + 2,
      duration: 10 + (i % 6) * 2,
      delay: (i % 5) * 1.5,
      color: i % 3 === 0 ? "rgba(6,182,212,0.4)" : i % 3 === 1 ? "rgba(168,85,247,0.4)" : "rgba(236,72,153,0.4)",
    })), []
  );

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "#030712",
    color: "#fff",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflowX: "hidden",
  },
  nav: {
    position: "fixed", top: 0, width: "100%", zIndex: 40,
    background: "rgba(3,7,18,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  navInner: {
    maxWidth: 1100, margin: "0 auto", padding: "14px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  logo: {
    fontSize: 20, fontWeight: 900,
    background: "linear-gradient(90deg,#22d3ee,#a855f7)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  navLinks: { display: "flex", gap: 28, alignItems: "center" },
  navLink: { color: "#94a3b8", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" },
  hireBtn: {
    padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 700,
    background: "linear-gradient(90deg,#06b6d4,#a855f7)", color: "#fff",
    textDecoration: "none", border: "none", cursor: "pointer",
  },
  hero: {
    maxWidth: 1100, margin: "0 auto",
    padding: "120px 24px 80px",
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 60, alignItems: "center",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 14px", borderRadius: 999,
    background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
    color: "#22d3ee", fontSize: 12, fontWeight: 600, marginBottom: 20,
  },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#22d3ee" },
  h1: { fontSize: 56, fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px" },
  gradText: {
    background: "linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  roleRow: { fontSize: 18, color: "#67e8f9", fontWeight: 600, marginBottom: 20, minHeight: 28 },
  desc: { color: "#94a3b8", lineHeight: 1.7, fontSize: 15, maxWidth: 420, marginBottom: 28 },
  btnRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 },
  btnPrimary: {
    padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14,
    background: "linear-gradient(90deg,#06b6d4,#a855f7)", color: "#fff",
    textDecoration: "none", boxShadow: "0 0 20px rgba(6,182,212,0.3)",
  },
  btnSecondary: {
    padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14,
    border: "1px solid #334155", color: "#fff", textDecoration: "none",
    background: "transparent",
  },
  socialRow: { display: "flex", gap: 10 },
  socialBtn: {
    width: 40, height: 40, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 900, color: "#fff", textDecoration: "none",
  },
  photoCol: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
  photoWrap: { position: "relative", width: 220, height: 220 },
  photoRing: {
    position: "absolute", inset: -6, borderRadius: "50%",
    background: "conic-gradient(from 0deg, #06b6d4, #a855f7, #ec4899, #06b6d4)",
    zIndex: 0,
  },
  photoGap: {
    position: "absolute", inset: -3, borderRadius: "50%",
    background: "#030712", zIndex: 1,
  },
  photo: {
    position: "relative", width: "100%", height: "100%",
    borderRadius: "50%", overflow: "hidden",
    border: "2px solid #1e293b", zIndex: 2,
  },
  photoImg: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" },
  floatBadge: {
    position: "absolute", background: "#0f172a",
    border: "1px solid rgba(6,182,212,0.4)", borderRadius: 12,
    padding: "8px 14px", zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  floatNum: {
    fontSize: 18, fontWeight: 900,
    background: "linear-gradient(90deg,#22d3ee,#a855f7)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  floatLabel: { color: "#64748b", fontSize: 11, fontWeight: 600 },
  section: { maxWidth: 1100, margin: "0 auto", padding: "80px 24px" },
  sectionLabel: { color: "#22d3ee", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: 8 },
  sectionTitle: {
    fontSize: 40, fontWeight: 900, textAlign: "center", marginBottom: 48,
    background: "linear-gradient(90deg,#fff,#94a3b8)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "0 auto" },
  statCard: {
    padding: "20px 16px", borderRadius: 16, textAlign: "center",
    background: "rgba(15,23,42,0.8)", border: "1px solid #1e293b",
  },
  statNum: {
    fontSize: 28, fontWeight: 900,
    background: "linear-gradient(90deg,#22d3ee,#a855f7)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  statLabel: { color: "#64748b", fontSize: 12, marginTop: 4 },
  card: {
    background: "rgba(15,23,42,0.9)", border: "1px solid #1e293b",
    borderRadius: 16, padding: "24px",
  },
  cardTitle: { color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 8 },
  cardDesc: { color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 16 },
  tag: {
    display: "inline-block", padding: "4px 10px", borderRadius: 999,
    background: "#1e293b", color: "#67e8f9", fontSize: 11, fontWeight: 600,
    border: "1px solid #334155", marginRight: 6, marginBottom: 6,
  },
  skillCard: {
    background: "rgba(15,23,42,0.9)", border: "1px solid #1e293b",
    borderRadius: 16, padding: "24px",
  },
  skillHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  skillIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
  },
  skillTitle: { color: "#fff", fontWeight: 700, fontSize: 15 },
  barWrap: { marginBottom: 14 },
  barLabel: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  barName: { color: "#e2e8f0", fontSize: 13, fontWeight: 600 },
  barPct: { color: "#64748b", fontSize: 12 },
  barBg: { height: 6, background: "#1e293b", borderRadius: 999, overflow: "hidden" },
  timelineWrap: { maxWidth: 700, margin: "0 auto" },
  tlRow: { display: "flex", gap: 16, marginBottom: 0 },
  tlDotCol: { display: "flex", flexDirection: "column", alignItems: "center" },
  tlDot: {
    width: 12, height: 12, borderRadius: "50%", marginTop: 6, flexShrink: 0,
    background: "linear-gradient(135deg,#22d3ee,#a855f7)",
    border: "2px solid #030712",
  },
  tlLine: { width: 1, flex: 1, background: "linear-gradient(to bottom, rgba(6,182,212,0.3), transparent)", marginTop: 4 },
  tlCard: {
    flex: 1, marginBottom: 28,
    background: "rgba(15,23,42,0.9)", border: "1px solid #1e293b",
    borderRadius: 14, padding: "18px 20px",
  },
  tlTitle: { color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 2 },
  tlCompany: { color: "#22d3ee", fontSize: 13, fontWeight: 600, marginBottom: 4 },
  tlPeriod: {
    display: "inline-block", fontSize: 11, color: "#64748b",
    background: "#1e293b", border: "1px solid #334155",
    padding: "3px 10px", borderRadius: 999, marginBottom: 10,
  },
  tlPoint: { display: "flex", gap: 8, color: "#94a3b8", fontSize: 13, marginBottom: 6 },
  contactCard: {
    background: "rgba(15,23,42,0.9)", border: "1px solid #1e293b",
    borderRadius: 20, padding: "32px", maxWidth: 600, margin: "0 auto",
  },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 },
  contactItem: {
    display: "flex", alignItems: "center", gap: 12,
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 12, padding: "12px 14px",
  },
  contactLabel: { color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  contactVal: { color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" },
  footer: {
    borderTop: "1px solid #1e293b", padding: "24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 8,
  },
  footerText: { color: "#475569", fontSize: 12 },
};

export default function Portfolio() {
  const roles = ["Java Backend Developer", "Spring Boot Engineer", "REST API Architect", "Microservices Developer", "Full-Stack Java Developer"];
  const typedRole = useTypingEffect(roles, 75);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const projects = [
    {
      title: "InternX — Internship Platform",
      description: "Enterprise-grade full-stack platform where companies post real tasks and students solve them. Backend: Java 17, Spring Boot, Spring Security + JWT, Spring Data JPA, PostgreSQL, Cloudinary. 50+ REST endpoints, role-based access (STUDENT/COMPANY/ADMIN), real-time notifications, Swagger/OpenAPI docs.",
      tech: ["Java 17", "Spring Boot", "Spring Security", "JWT", "PostgreSQL", "JPA", "Cloudinary", "Swagger"],
      emoji: "🚀", g: "linear-gradient(135deg,#6366f1,#06b6d4)",
      link: "https://github.com/Chander-parkash007/InternX",
      highlight: true,
    },
    {
      title: "Blog Management System",
      description: "Full-stack blog platform with complete CRUD operations, user authentication, and database-driven content management. Built with Java, Spring Boot REST APIs, MySQL, and React frontend. Follows three-layer architecture: controller → service → repository.",
      tech: ["Java", "Spring Boot", "REST API", "MySQL", "React.js", "JWT"],
      emoji: "📝", g: "linear-gradient(135deg,#22c55e,#14b8a6)",
      link: "https://github.com/Chander-parkash007/blog-management-system",
    },
    {
      title: "Real-Time Crypto Tracker",
      description: "Live cryptocurrency price tracker built in Java with real-time WebSocket data feeds, price alerts, and portfolio tracking dashboard. Integrates external REST APIs for live market data with Spring Boot backend.",
      tech: ["Java", "Spring Boot", "WebSocket", "REST API", "Spring MVC"],
      emoji: "₿", g: "linear-gradient(135deg,#f59e0b,#f97316)",
      link: "https://github.com/Chander-parkash007/java-realtime-CryptoTracker",
    },
    {
      title: "Java Web Scraper",
      description: "Robust web scraping engine built in Java using JSoup. Extracts, parses, and processes structured data from websites with configurable CSS selectors, pagination support, and JSON/CSV export. Maven-based project with clean service layer.",
      tech: ["Java", "JSoup", "Maven", "JSON", "OOP"],
      emoji: "🕷️", g: "linear-gradient(135deg,#a855f7,#ec4899)",
      link: "https://github.com/Chander-parkash007/java-webScraper",
    },
    {
      title: "YouTube Analytics Tool",
      description: "Analytics dashboard consuming the YouTube Data API v3 via Spring MVC backend. Fetches channel metrics, visualizes views and engagement trends, and exposes data through clean REST endpoints to a Chart.js frontend.",
      tech: ["Java", "Spring MVC", "YouTube API v3", "REST API", "Chart.js"],
      emoji: "📊", g: "linear-gradient(135deg,#ef4444,#ec4899)",
      link: "https://github.com/Chander-parkash007/youtube-analytics-tool",
    },
    {
      title: "Craftly AI",
      description: "AI-powered app that identifies household materials from photos and suggests DIY craft projects. Java/Node.js backend integrates Claude AI API for material detection and generates step-by-step instructions via REST endpoints.",
      tech: ["React.js", "Claude AI", "Node.js", "REST API", "CSS3"],
      emoji: "🎨", g: "linear-gradient(135deg,#06b6d4,#3b82f6)",
      link: "https://github.com/Chander-parkash007/Craftly-Ai",
    },
  ];

  const skillCats = [
    { title: "Java & Backend", icon: "☕", g: "linear-gradient(135deg,#06b6d4,#3b82f6)", barColor: "linear-gradient(90deg,#06b6d4,#3b82f6)",
      skills: [{ name: "Java (Core + Java 17)", p: 92 }, { name: "Spring Boot", p: 90 }, { name: "Spring Security + JWT", p: 85 }, { name: "Microservices", p: 78 }] },
    { title: "APIs & Architecture", icon: "🔗", g: "linear-gradient(135deg,#a855f7,#ec4899)", barColor: "linear-gradient(90deg,#a855f7,#ec4899)",
      skills: [{ name: "REST API Design", p: 93 }, { name: "Spring Data JPA", p: 88 }, { name: "Hibernate / ORM", p: 82 }, { name: "Swagger / OpenAPI", p: 80 }] },
    { title: "DB, DevOps & Tools", icon: "🗄️", g: "linear-gradient(135deg,#22c55e,#14b8a6)", barColor: "linear-gradient(90deg,#22c55e,#14b8a6)",
      skills: [{ name: "MySQL / PostgreSQL", p: 88 }, { name: "MongoDB", p: 70 }, { name: "Git / GitHub", p: 90 }, { name: "Docker", p: 72 }] },
  ];

  const experiences = [
    { title: "Java Backend Intern", company: "DevelopersHub Corporation", period: "Apr 2026 – Present",
      points: [
        "Building RESTful APIs with Java 17 and Spring Boot for production-grade applications",
        "Implementing Spring Security with JWT for stateless authentication and role-based access control",
        "Designing normalized database schemas and writing optimized JPA/Hibernate queries",
        "Collaborating via Git, code reviews, and Agile sprint cycles",
      ]
    },
    { title: "Freelance Java Backend Developer", company: "Fiverr", period: "Mar 2024 – Present",
      points: [
        "Delivered 10+ backend projects using Spring Boot, REST APIs, and MySQL/PostgreSQL",
        "Built secure authentication systems with JWT and Spring Security for client applications",
        "Integrated third-party APIs (payment, cloud storage, social) into Spring Boot services",
        "Optimized SQL queries and JPA mappings, improving response times by up to 40%",
      ]
    },
    { title: "Web Development Intern", company: "NFTP Program, Pakistan", period: "Jan 2025 – Jul 2025",
      points: [
        "Developed server-side logic using Java and PHP for real-world web projects",
        "Built and consumed REST APIs, applying MVC architecture patterns",
        "Collaborated with senior developers in a structured, mentor-led program",
      ]
    },
  ];

  return (
    <div style={S.page}>
      {/* Progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: 3, background: "linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)", zIndex: 60, width: progressWidth }} />

      <FloatingParticles />

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-5%", left: "-5%", width: 500, height: 500, background: "rgba(6,182,212,0.04)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "35%", right: "-5%", width: 400, height: 400, background: "rgba(168,85,247,0.04)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "30%", width: 400, height: 400, background: "rgba(236,72,153,0.04)", borderRadius: "50%", filter: "blur(80px)" }} />
      </div>

      {/* ── NAV ── */}
      <motion.nav style={S.nav} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={S.navInner}>
          <div style={S.logo}>CP.dev</div>
          <div style={S.navLinks}>
            {["About", "Experience", "Projects", "Skills", "Certifications", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={S.navLink}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}>
                {item}
              </a>
            ))}
            <a href="mailto:khatriiiranjhi12@gmail.com" style={S.hireBtn}>Hire Me 🚀</a>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section id="about" style={{ position: "relative", zIndex: 1 }}>
        <div style={S.hero}>
          {/* Left text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={S.badge}>
              <motion.div style={S.dot} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              Available for Java Backend Roles
            </div>
            <h1 style={S.h1}>
              <span style={{ color: "#94a3b8", fontSize: 22, fontWeight: 600, display: "block", marginBottom: 4 }}>Hi, I'm</span>
              <span style={S.gradText}>Chander</span>
              <br />
              <span style={{ color: "#fff" }}>Parkash</span>
            </h1>
            <div style={S.roleRow}>
              {typedRole}<span style={{ color: "#22d3ee", animation: "blink 1s infinite" }}>|</span>
            </div>
            <p style={S.desc}>
              Java Backend Developer specializing in Spring Boot, REST APIs, and Microservices. I build secure, scalable server-side systems with clean architecture — from JWT-secured APIs to PostgreSQL-backed services. Currently interning at DevelopersHub Corporation.
            </p>
            <div style={S.btnRow}>
              <motion.a href="#projects" style={S.btnPrimary} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>View Backend Projects ↓</motion.a>
              <motion.a href="https://github.com/Chander-parkash007" target="_blank" rel="noreferrer" style={S.btnSecondary}
                whileHover={{ scale: 1.04, borderColor: "#64748b" }} whileTap={{ scale: 0.96 }}>GitHub Profile</motion.a>
            </div>
            <div style={S.socialRow}>
              {[
                { label: "in", href: "https://www.linkedin.com/in/chander-parkash-595a03346", bg: "#0077b5" },
                { label: "gh", href: "https://github.com/Chander-parkash007", bg: "#24292e" },
                { label: "@", href: "mailto:khatriiiranjhi12@gmail.com", bg: "#0891b2" },
              ].map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{ ...S.socialBtn, background: s.bg }} whileHover={{ scale: 1.12, y: -2 }}>
                  {s.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right photo */}
          <motion.div style={S.photoCol} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div style={S.photoWrap}>
              {/* spinning ring */}
              <motion.div style={S.photoRing} animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} />
              <div style={S.photoGap} />
              <div style={S.photo}>
                <img
                  src="/developer-photo.jpg.jpeg"
                  alt="Chander Parkash"
                  style={S.photoImg}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.style.background = "linear-gradient(135deg,#0e7490,#7c3aed)";
                    e.currentTarget.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:900;color:white;">CP</div>`;
                  }}
                />
              </div>
              {/* badges */}
              <motion.div style={{ ...S.floatBadge, bottom: -10, right: -20 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
                <div style={S.floatNum}>2+</div>
                <div style={S.floatLabel}>Years Exp</div>
              </motion.div>
              <motion.div style={{ ...S.floatBadge, top: -10, left: -20, borderColor: "rgba(168,85,247,0.4)" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
                <div style={{ ...S.floatNum, background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>11+</div>
                <div style={S.floatLabel}>Projects</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "40px 24px 60px", position: "relative", zIndex: 1 }}>
        <div style={S.statsGrid}>
          {[
            { n: "50", s: "+", label: "API Endpoints", icon: "🔗" },
            { n: "2", s: "+", label: "Years Exp", icon: "⚡" },
            { n: "12", s: "+", label: "Projects", icon: "🚀" },
            { n: "12", s: "", label: "Certifications", icon: "🎓" },
          ].map((st, i) => (
            <motion.div key={i} style={S.statCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{st.icon}</div>
              <div style={S.statNum}><Counter target={st.n} suffix={st.s} /></div>
              <div style={S.statLabel}>{st.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={S.sectionLabel}>Career</span>
          <h2 style={S.sectionTitle}>Experience</h2>
          <div style={S.timelineWrap}>
            {experiences.map((exp, i) => (
              <motion.div key={i} style={S.tlRow} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={S.tlDotCol}>
                  <div style={S.tlDot} />
                  {i < experiences.length - 1 && <div style={S.tlLine} />}
                </div>
                <div style={S.tlCard}>
                  <div style={S.tlTitle}>{exp.title}</div>
                  <div style={S.tlCompany}>{exp.company}</div>
                  <span style={S.tlPeriod}>{exp.period}</span>
                  {exp.points.map((p, j) => (
                    <div key={j} style={S.tlPoint}>
                      <span style={{ color: "#22d3ee", flexShrink: 0 }}>▹</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...S.sectionLabel, color: "#a855f7" }}>GitHub Portfolio</span>
          <h2 style={S.sectionTitle}>Backend Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {projects.map((p, i) => (
              <motion.div key={i} style={{ ...S.card, border: p.highlight ? "1px solid rgba(6,182,212,0.5)" : "1px solid #1e293b", background: p.highlight ? "rgba(6,182,212,0.04)" : "rgba(15,23,42,0.9)", position: "relative", overflow: "hidden" }} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, borderColor: "#334155" }}>
                {p.highlight && (
                  <div style={{ position: "absolute", top: 12, right: 14, background: "linear-gradient(90deg,#06b6d4,#a855f7)", borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: "#fff" }}>⭐ Featured</div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: p.g, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>
                  {p.emoji}
                </div>
                <div style={S.cardTitle}>{p.title}</div>
                <div style={S.cardDesc}>{p.description}</div>
                <div>{p.tech.map((t, j) => <span key={j} style={S.tag}>{t}</span>)}</div>
                <a href={p.link} target="_blank" rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 700, background: p.g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                  View on GitHub →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...S.sectionLabel, color: "#ec4899" }}>Core Competencies</span>
          <h2 style={S.sectionTitle}>Technical Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 28 }}>
            {skillCats.map((cat, i) => (
              <motion.div key={i} style={S.skillCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={S.skillHead}>
                  <div style={{ ...S.skillIcon, background: cat.g }}>{cat.icon}</div>
                  <div style={S.skillTitle}>{cat.title}</div>
                </div>
                {cat.skills.map((sk) => (
                  <div key={sk.name} style={S.barWrap}>
                    <div style={S.barLabel}>
                      <span style={S.barName}>{sk.name}</span>
                      <span style={S.barPct}>{sk.p}%</span>
                    </div>
                    <div style={S.barBg}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.p}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 999, background: cat.barColor }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {["Java", "Java 17", "Spring Boot", "Spring Security", "JWT", "REST API", "Microservices", "Spring Data JPA", "Hibernate", "MySQL", "PostgreSQL", "MongoDB", "Docker", "Git", "Maven", "Swagger/OpenAPI", "WebSocket", "React.js", "BCrypt", "CORS"].map((t) => (
              <motion.span key={t} whileHover={{ scale: 1.08, y: -2 }}
                style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", cursor: "default" }}>
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...S.sectionLabel, color: "#f59e0b" }}>Credentials</span>
          <h2 style={S.sectionTitle}>Certifications</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {[
              { name: "Java Microservices with Spring Boot", issuer: "Edureka · Coursera", date: "Feb 2026", tag: "Java", tagColor: "#22d3ee", iconBg: "linear-gradient(135deg,#0e7490,#06b6d4)", svgIcon: "java", link: "https://coursera.org/verify/HDQA5XKBL241C", highlight: true, glowColor: "rgba(6,182,212,0.25)" },
              { name: "Microservice Architectures", issuer: "Vanderbilt University · Coursera", date: "Dec 2025", tag: "Java", tagColor: "#22d3ee", iconBg: "linear-gradient(135deg,#1e3a5f,#2563eb)", svgIcon: "vanderbilt", link: "https://coursera.org/verify/VR6XI1ZXB34U", highlight: true, glowColor: "rgba(37,99,235,0.2)" },
              { name: "Generative AI for Java and Spring Development", issuer: "SkillUp · Coursera", date: "Apr 2026", tag: "AI + Java", tagColor: "#a855f7", iconBg: "linear-gradient(135deg,#4c1d95,#7c3aed)", svgIcon: "ai", link: "https://coursera.org/verify/6LV4I3RM2XEH", highlight: true, glowColor: "rgba(168,85,247,0.25)" },
              { name: "Generative AI: Introduction and Applications", issuer: "IBM · Coursera", date: "Feb 2026", tag: "AI", tagColor: "#a855f7", iconBg: "linear-gradient(135deg,#1e1b4b,#4338ca)", svgIcon: "ibm", link: "https://coursera.org/verify/CBL44P29XP70", highlight: true, glowColor: "rgba(99,102,241,0.2)" },
              { name: "Building HTTP APIs with Spring", issuer: "Vanderbilt University · Coursera", date: "Dec 2025", tag: "Spring", tagColor: "#22d3ee", iconBg: "linear-gradient(135deg,#064e3b,#059669)", svgIcon: "spring", link: "https://coursera.org/verify/5U5K5W7V02WT", highlight: false, glowColor: "none" },
              { name: "Spring Framework for Java Development", issuer: "SkillUp · Coursera", date: "Oct 2025", tag: "Spring", tagColor: "#22d3ee", iconBg: "linear-gradient(135deg,#064e3b,#10b981)", svgIcon: "spring", link: "https://coursera.org/verify/8KFGQMDJU101C", highlight: false, glowColor: "none" },
              { name: "Software Design Patterns and Architecture", issuer: "University of Alberta", date: "Jun 2024", tag: "Architecture", tagColor: "#f59e0b", iconBg: "linear-gradient(135deg,#1c1917,#78350f)", svgIcon: "arch", link: "https://www.linkedin.com/in/chander-parkash-595a03346/overlay/Certifications/1281785874/treasury/?profileId=ACoAAFalb4EB7SqMhvn44oKqenp8bATpivAV8GU", highlight: false, glowColor: "none" },
              { name: "Introduction to Software Engineering", issuer: "IBM · Coursera", date: "Jun 2025", tag: "IBM", tagColor: "#94a3b8", iconBg: "linear-gradient(135deg,#1e1b4b,#312e81)", svgIcon: "ibm", link: "https://coursera.org/verify/P27SNN8ZMNF7", highlight: false, glowColor: "none" },
              { name: "Introduction to Networking and Cloud Computing", issuer: "Microsoft · Coursera", date: "Aug 2025", tag: "Cloud", tagColor: "#38bdf8", iconBg: "linear-gradient(135deg,#0c4a6e,#0284c7)", svgIcon: "microsoft", link: "https://coursera.org/verify/I1OPT8XMI84C", highlight: false, glowColor: "none" },
              { name: "Technical Domain Training – NFTP", issuer: "National Freelance Training Program", date: "Jan 2025", tag: "Training", tagColor: "#94a3b8", iconBg: "linear-gradient(135deg,#134e4a,#0f766e)", svgIcon: "code", link: "https://www.linkedin.com/in/chander-parkash-595a03346/overlay/Certifications/1283042244/treasury/?profileId=ACoAAFalb4EB7SqMhvn44oKqenp8bATpivAV8GU", highlight: false, glowColor: "none" },
              { name: "Hult Prize On Campus Program (2024–2025)", issuer: "Mehran UET SZAB Campus", date: "Mar 2025", tag: "Award", tagColor: "#f59e0b", iconBg: "linear-gradient(135deg,#451a03,#b45309)", svgIcon: "trophy", link: "https://www.linkedin.com/in/chander-parkash-595a03346/overlay/Certifications/1282619893/treasury/?profileId=ACoAAFalb4EB7SqMhvn44oKqenp8bATpivAV8GU", highlight: false, glowColor: "none" },
              { name: "Emerging Technologies Workshop Series", issuer: "Workshop Program", date: "Sep 2024", tag: "Workshop", tagColor: "#94a3b8", iconBg: "linear-gradient(135deg,#1e1b4b,#4c1d95)", svgIcon: "spark", link: "https://www.linkedin.com/in/chander-parkash-595a03346/overlay/Certifications/1285349510/treasury/?profileId=ACoAAFalb4EB7SqMhvn44oKqenp8bATpivAV8GU", highlight: false, glowColor: "none" },
            ].map((cert, i) => (
              <motion.a
                key={i}
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...S.card,
                  display: "flex", alignItems: "center", gap: 16,
                  textDecoration: "none", cursor: "pointer",
                  border: cert.highlight ? "1px solid rgba(6,182,212,0.6)" : "1px solid #1e293b",
                  background: cert.highlight ? "rgba(6,182,212,0.06)" : "rgba(15,23,42,0.9)",
                  position: "relative", overflow: "hidden",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, borderColor: cert.highlight ? "rgba(6,182,212,0.9)" : "#334155" }}
              >
                {cert.highlight && (
                  <div style={{ position: "absolute", top: 10, right: 12, background: "linear-gradient(90deg,#06b6d4,#a855f7)", borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    ⭐ Featured
                  </div>
                )}
                {/* cert icon */}
                <div style={{ width: 52, height: 52, borderRadius: 12, background: cert.iconBg || "linear-gradient(135deg,#06b6d4,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: cert.highlight ? `0 0 20px ${cert.glowColor || "rgba(6,182,212,0.4)"}` : "none" }}>
                  <CertIcon type={cert.svgIcon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: cert.highlight ? "#22d3ee" : "#fff", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{cert.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>{cert.issuer}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#64748b", background: "#1e293b", border: "1px solid #334155", padding: "3px 10px", borderRadius: 999 }}>{cert.date}</span>
                  <span style={{ fontSize: 12, color: "#22d3ee", fontWeight: 600 }}>View ↗</span>
                </div>
              </motion.a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="https://www.linkedin.com/in/chander-parkash-595a03346/" target="_blank" rel="noreferrer"
              style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = "#22d3ee"}
              onMouseLeave={e => e.target.style.color = "#64748b"}>
              View all on LinkedIn →
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "60px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={S.sectionLabel}>Get In Touch</span>
          <h2 style={S.sectionTitle}>Let's Work Together</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: 32, fontSize: 14 }}>Looking for a Java Backend Developer? I'm open to full-time roles, internships, and freelance projects. Let's build something great.</p>
          <div style={S.contactCard}>
            <div style={S.contactGrid}>
              {[
                { icon: "✉️", label: "Email", value: "khatriiiranjhi12@gmail.com", href: "mailto:khatriiiranjhi12@gmail.com" },
                { icon: "📱", label: "Phone", value: "+92 336 8264688", href: "tel:+923368264688" },
                { icon: "💼", label: "LinkedIn", value: "chander-parkash", href: "https://www.linkedin.com/in/chander-parkash-595a03346" },
                { icon: "📍", label: "Location", value: "Sindh, Pakistan", href: null },
              ].map((c, i) => (
                <motion.div key={i} style={S.contactItem} whileHover={{ borderColor: "#334155" }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <div>
                    <div style={S.contactLabel}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} target="_blank" rel="noreferrer" style={{ ...S.contactVal, color: "#e2e8f0" }}
                          onMouseEnter={e => e.target.style.color = "#22d3ee"}
                          onMouseLeave={e => e.target.style.color = "#e2e8f0"}>{c.value}</a>
                      : <span style={S.contactVal}>{c.value}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <motion.a href="mailto:khatriiiranjhi12@gmail.com" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center", background: "linear-gradient(90deg,#06b6d4,#a855f7)", color: "#fff", textDecoration: "none" }}>
                📧 Send Email
              </motion.a>
              <motion.a href="https://github.com/Chander-parkash007" target="_blank" rel="noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center", border: "1px solid #1e293b", color: "#fff", textDecoration: "none", background: "transparent" }}>
                💻 GitHub
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e293b", position: "relative", zIndex: 1 }}>
        <div style={S.footer}>
          <span style={{ ...S.logo, fontSize: 16 }}>CP.dev</span>
          <span style={S.footerText}>Java · Spring Boot · REST APIs</span>
          <span style={S.footerText}>© 2026 Chander Parkash</span>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
