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
  const roles = ["Full-Stack Java Developer", "Spring Boot Expert", "React.js Developer", "API Architect"];
  const typedRole = useTypingEffect(roles, 75);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const projects = [
    { title: "Full Stack E-Commerce App", description: "Complete e-commerce platform with authentication, role-based access, shopping cart, and Stripe payment integration.", tech: ["Spring Boot", "React.js", "MySQL", "JWT", "Stripe API"], emoji: "🛒", g: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
    { title: "REST API Management System", description: "Scalable REST API with advanced CRUD, pagination, filtering, and optimized database queries with Swagger docs.", tech: ["Java", "Spring Boot", "PostgreSQL", "Swagger", "Docker"], emoji: "⚙️", g: "linear-gradient(135deg,#a855f7,#ec4899)" },
    { title: "Real-Time Task Manager", description: "Collaborative task management app with real-time WebSocket updates, team features, and analytics dashboard.", tech: ["Spring Boot", "WebSocket", "React", "MongoDB", "Redux"], emoji: "📋", g: "linear-gradient(135deg,#22c55e,#14b8a6)" },
    { title: "Social Media Analytics", description: "Analytics platform with data visualization, sentiment analysis, and comprehensive reporting for marketing teams.", tech: ["Java", "Spring MVC", "Chart.js", "MySQL", "Bootstrap"], emoji: "📊", g: "linear-gradient(135deg,#f97316,#ef4444)" },
  ];

  const skillCats = [
    { title: "Backend", icon: "☕", g: "linear-gradient(135deg,#06b6d4,#3b82f6)", barColor: "linear-gradient(90deg,#06b6d4,#3b82f6)",
      skills: [{ name: "Java", p: 90 }, { name: "Spring Boot", p: 88 }, { name: "REST APIs", p: 92 }, { name: "Microservices", p: 72 }] },
    { title: "Frontend", icon: "⚛️", g: "linear-gradient(135deg,#a855f7,#ec4899)", barColor: "linear-gradient(90deg,#a855f7,#ec4899)",
      skills: [{ name: "React.js", p: 85 }, { name: "JavaScript", p: 88 }, { name: "HTML5 / CSS3", p: 95 }, { name: "Tailwind CSS", p: 78 }] },
    { title: "DB & Tools", icon: "🗄️", g: "linear-gradient(135deg,#22c55e,#14b8a6)", barColor: "linear-gradient(90deg,#22c55e,#14b8a6)",
      skills: [{ name: "MySQL", p: 88 }, { name: "PostgreSQL", p: 75 }, { name: "MongoDB", p: 70 }, { name: "Git / Docker", p: 82 }] },
  ];

  const experiences = [
    { title: "Full Stack Intern", company: "DevelopersHub Corporation", period: "Apr 2026 – Present",
      points: ["Developing full-stack apps with Java, Spring Boot, and React.js", "Designing RESTful APIs for scalable backend systems", "Debugging and optimizing application performance", "Collaborating via Git and Agile methodologies"] },
    { title: "Freelance Full Stack Developer", company: "Fiverr", period: "Mar 2024 – Present",
      points: ["Delivered 10+ full-stack apps using Spring Boot and React.js", "Built responsive UIs with HTML, CSS, and Bootstrap", "Integrated REST APIs for seamless frontend-backend communication", "Optimized MySQL queries, improving performance by 30%"] },
    { title: "Web Development Intern", company: "NFTP Program, Pakistan", period: "Jan 2025 – Jul 2025",
      points: ["Applied core web technologies: HTML, CSS, JavaScript, PHP", "Built responsive web applications on real-world projects", "Collaborated with mentors and peers in a structured program"] },
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
            {["About", "Experience", "Projects", "Skills", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={S.navLink}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}>
                {item}
              </a>
            ))}
            <a href="mailto:khatriiiranjhi12@gmail.com" style={S.hireBtn}>Hire Me</a>
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
              Available for work
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
              Building scalable Spring Boot backends and smooth React frontends. Passionate about clean code, great UX, and shipping products users love.
            </p>
            <div style={S.btnRow}>
              <motion.a href="#projects" style={S.btnPrimary} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>View My Work ↓</motion.a>
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
                <div style={{ ...S.floatNum, background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10+</div>
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
            { n: "10", s: "+", label: "Projects", icon: "🚀" },
            { n: "2", s: "+", label: "Years Exp", icon: "⚡" },
            { n: "100", s: "%", label: "On-Time", icon: "✅" },
            { n: "5", s: "★", label: "Rating", icon: "⭐" },
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
          <span style={{ ...S.sectionLabel, color: "#a855f7" }}>Portfolio</span>
          <h2 style={S.sectionTitle}>Featured Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {projects.map((p, i) => (
              <motion.div key={i} style={S.card} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, borderColor: "#334155" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: p.g, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>
                  {p.emoji}
                </div>
                <div style={S.cardTitle}>{p.title}</div>
                <div style={S.cardDesc}>{p.description}</div>
                <div>{p.tech.map((t, j) => <span key={j} style={S.tag}>{t}</span>)}</div>
                <a href="https://github.com/Chander-parkash007" target="_blank" rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 700, background: p.g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                  View Project →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...S.sectionLabel, color: "#ec4899" }}>Expertise</span>
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
            {["Java", "Spring Boot", "React.js", "MySQL", "PostgreSQL", "MongoDB", "Docker", "Git", "JWT", "REST API", "WebSocket", "Redux", "Bootstrap", "Tailwind CSS"].map((t) => (
              <motion.span key={t} whileHover={{ scale: 1.08, y: -2 }}
                style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", cursor: "default" }}>
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "60px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={S.sectionLabel}>Get In Touch</span>
          <h2 style={S.sectionTitle}>Let's Work Together</h2>
          <p style={{ color: "#64748b", textAlign: "center", marginBottom: 32, fontSize: 14 }}>Open to new opportunities. Drop me a message and I'll get back to you.</p>
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
          <span style={S.footerText}>Built with React · Framer Motion</span>
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
