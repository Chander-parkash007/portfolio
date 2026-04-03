import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// ── Typing effect ──────────────────────────────────────────────────────────────
function useTypingEffect(words, speed = 80) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1500);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex));
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, speed]);

  return text;
}

// ── Animated counter ───────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const end = parseInt(target);
    const duration = 2000;
    const step = Math.ceil(duration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Floating particles ─────────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "#06b6d4" : p.id % 3 === 1 ? "#a855f7" : "#ec4899",
            opacity: 0.3,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Skill bar ──────────────────────────────────────────────────────────────────
function SkillBar({ name, percent, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-5"
    >
      <div className="flex justify-between mb-2">
        <span className="text-white font-semibold">{name}</span>
        <span className="text-slate-400 text-sm">{percent}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
}

// ── Project card ───────────────────────────────────────────────────────────────
function ProjectCard({ title, description, tech, gradient, emoji, link }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* glow border */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
      <div className={`absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-500/50 transition-all duration-500`} />

      <div className="relative p-7 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/60 h-full">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
          {emoji}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <span key={i} className="px-3 py-1 text-xs font-semibold bg-slate-800 text-cyan-300 rounded-full border border-slate-700">
              {t}
            </span>
          ))}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-5"
            >
              <a href={link || "#"} className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                View Project →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Timeline item ──────────────────────────────────────────────────────────────
function TimelineItem({ title, company, period, points, delay, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="relative flex gap-6"
    >
      {/* line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 border-4 border-slate-950 z-10 mt-1 shrink-0" />
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/50 to-transparent mt-1" />}
      </div>
      <div className="pb-10 flex-1">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{title}</h3>
              <div className="text-cyan-400 font-semibold text-sm">{company}</div>
            </div>
            <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">{period}</span>
          </div>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                <span className="text-cyan-400 mt-0.5 shrink-0">▹</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Portfolio ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const roles = ["Full-Stack Java Developer", "Spring Boot Expert", "React.js Developer", "API Architect"];
  const typedRole = useTypingEffect(roles, 70);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const navLinks = ["About", "Experience", "Projects", "Skills", "Contact"];

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden font-sans">

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-[60]"
        style={{ width: progressWidth }}
      />

      {/* ── Cursor glow ── */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none z-50 mix-blend-screen transition-all duration-100"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          left: mousePos.x - 160,
          top: mousePos.y - 160,
        }}
      />

      <FloatingParticles />

      {/* ── Background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-40 backdrop-blur-2xl bg-[#030712]/70 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            CP.dev
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveSection(item.toLowerCase())}
                className={`text-sm font-medium transition-colors ${activeSection === item.toLowerCase() ? "text-cyan-400" : "text-slate-400 hover:text-white"}`}
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.95 }}
              href="mailto:khatriiiranjhi12@gmail.com"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-sm font-bold shadow-lg"
            >
              Hire Me
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-300 text-2xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-900/95 border-t border-slate-800 px-6 py-4 flex flex-col gap-4"
            >
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium">
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left */}
          <div className="space-y-7 order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Available for work
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Hi, I'm</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Chander
                </span>
                <br />
                <span className="text-white">Parkash</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-slate-400 font-medium h-8">
              <span className="text-cyan-300">{typedRole}</span>
              <span className="animate-pulse text-cyan-400">|</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Building scalable Spring Boot backends and smooth React frontends. Passionate about clean code, great UX, and shipping products that users love.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-4 flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.5)" }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold shadow-lg text-sm"
              >
                View My Work ↓
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Chander-parkash007"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 border border-slate-700 rounded-xl font-bold hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all text-sm"
              >
                GitHub Profile
              </motion.a>
            </motion.div>

            {/* Social icons */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex gap-4 pt-2">
              {[
                { label: "LinkedIn", icon: "in", href: "https://www.linkedin.com/in/chander-parkash", color: "from-blue-500 to-blue-700" },
                { label: "GitHub", icon: "gh", href: "https://github.com/Chander-parkash007", color: "from-slate-600 to-slate-800" },
                { label: "Email", icon: "@", href: "mailto:khatriiiranjhi12@gmail.com", color: "from-cyan-500 to-cyan-700" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  title={s.label}
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xs font-black shadow-lg`}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right — Developer photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative flex justify-center order-1 lg:order-2"
          >
            {/* Outer spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-[340px] h-[340px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #06b6d4, #a855f7, #ec4899, #06b6d4)",
                padding: "3px",
                borderRadius: "50%",
              }}
            >
              <div className="w-full h-full rounded-full bg-[#030712]" />
            </motion.div>

            {/* Inner counter-spin ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-[310px] h-[310px] rounded-full border border-dashed border-cyan-500/30"
            />

            {/* Photo */}
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl z-10">
              <img
                src="/developer-photo.jpg"
                alt="Chander Parkash"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div style="width:100%;height:100%;background:linear-gradient(135deg,#0e7490,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:5rem;font-weight:900;color:white;">CP</div>
                  `;
                }}
              />
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-4 -right-4 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl px-5 py-3 shadow-xl z-20"
            >
              <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">2+</div>
              <div className="text-slate-400 text-xs font-semibold">Years Exp</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute top-4 -left-4 bg-slate-900/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl px-5 py-3 shadow-xl z-20"
            >
              <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">10+</div>
              <div className="text-slate-400 text-xs font-semibold">Projects</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs">scroll</span>
          <div className="w-5 h-8 border-2 border-slate-700 rounded-full flex justify-center pt-1">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { number: "10", suffix: "+", label: "Projects", icon: "🚀", gradient: "from-cyan-500 to-blue-600" },
            { number: "2", suffix: "+", label: "Years Exp", icon: "⚡", gradient: "from-purple-500 to-pink-600" },
            { number: "100", suffix: "%", label: "On-Time", icon: "✅", gradient: "from-green-500 to-teal-600" },
            { number: "5", suffix: "★", label: "Rating", icon: "⭐", gradient: "from-yellow-500 to-orange-600" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-3xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                  <Counter target={s.number} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 text-sm font-medium mt-1">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">Career</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Experience</h2>
          </motion.div>

          <div>
            {[
              {
                title: "Full Stack Intern",
                company: "DevelopersHub Corporation",
                period: "Apr 2026 – Present",
                points: [
                  "Developing full-stack apps with Java, Spring Boot, and React.js",
                  "Designing RESTful APIs for scalable backend systems",
                  "Debugging and optimizing application performance",
                  "Collaborating via Git and Agile methodologies",
                ],
              },
              {
                title: "Freelance Full Stack Developer",
                company: "Fiverr",
                period: "Mar 2024 – Present",
                points: [
                  "Delivered 10+ full-stack apps using Spring Boot and React.js",
                  "Built responsive UIs with HTML, CSS, and Bootstrap",
                  "Integrated REST APIs for seamless frontend-backend communication",
                  "Optimized MySQL queries, improving performance by 30%",
                  "Maintained 5-star client ratings through quality delivery",
                ],
              },
              {
                title: "Web Development Intern",
                company: "NFTP Program, Pakistan",
                period: "Jan 2025 – Jul 2025",
                points: [
                  "Applied core web technologies: HTML, CSS, JavaScript, PHP",
                  "Built responsive web applications on real-world projects",
                  "Collaborated with mentors and peers in a structured program",
                ],
              },
            ].map((exp, i, arr) => (
              <TimelineItem key={i} {...exp} delay={i * 0.15} isLast={i === arr.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Featured Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Full Stack E-Commerce App",
                description: "Complete e-commerce platform with authentication, role-based access, shopping cart, and payment integration.",
                tech: ["Spring Boot", "React.js", "MySQL", "JWT", "Stripe API"],
                gradient: "from-cyan-500 to-blue-600",
                emoji: "🛒",
                link: "https://github.com/Chander-parkash007",
              },
              {
                title: "REST API Management System",
                description: "Scalable REST API system with advanced CRUD, pagination, filtering, and optimized database queries.",
                tech: ["Java", "Spring Boot", "PostgreSQL", "Swagger", "Docker"],
                gradient: "from-purple-500 to-pink-600",
                emoji: "⚙️",
                link: "https://github.com/Chander-parkash007",
              },
              {
                title: "Real-Time Task Manager",
                description: "Collaborative task management app with real-time updates, team features, and project analytics dashboard.",
                tech: ["Spring Boot", "WebSocket", "React", "MongoDB", "Redux"],
                gradient: "from-green-500 to-teal-600",
                emoji: "📋",
                link: "https://github.com/Chander-parkash007",
              },
              {
                title: "Social Media Analytics",
                description: "Analytics platform with data visualization, sentiment analysis, and comprehensive reporting for marketing teams.",
                tech: ["Java", "Spring MVC", "Chart.js", "MySQL", "Bootstrap"],
                gradient: "from-orange-500 to-red-600",
                emoji: "📊",
                link: "https://github.com/Chander-parkash007",
              },
            ].map((p, i) => (
              <ProjectCard key={i} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-pink-400 font-semibold text-sm uppercase tracking-widest">Expertise</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Technical Skills</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Backend */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">☕</div>
                <h3 className="font-bold text-white">Backend</h3>
              </div>
              {[
                { name: "Java", percent: 90, color: "linear-gradient(90deg,#06b6d4,#3b82f6)" },
                { name: "Spring Boot", percent: 88, color: "linear-gradient(90deg,#06b6d4,#3b82f6)" },
                { name: "REST APIs", percent: 92, color: "linear-gradient(90deg,#06b6d4,#3b82f6)" },
                { name: "Microservices", percent: 72, color: "linear-gradient(90deg,#06b6d4,#3b82f6)" },
              ].map((s) => <SkillBar key={s.name} {...s} />)}
            </motion.div>

            {/* Frontend */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg">⚛️</div>
                <h3 className="font-bold text-white">Frontend</h3>
              </div>
              {[
                { name: "React.js", percent: 85, color: "linear-gradient(90deg,#a855f7,#ec4899)" },
                { name: "JavaScript", percent: 88, color: "linear-gradient(90deg,#a855f7,#ec4899)" },
                { name: "HTML5 / CSS3", percent: 95, color: "linear-gradient(90deg,#a855f7,#ec4899)" },
                { name: "Tailwind CSS", percent: 78, color: "linear-gradient(90deg,#a855f7,#ec4899)" },
              ].map((s) => <SkillBar key={s.name} {...s} />)}
            </motion.div>

            {/* Database & Tools */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-lg">🗄️</div>
                <h3 className="font-bold text-white">DB & Tools</h3>
              </div>
              {[
                { name: "MySQL", percent: 88, color: "linear-gradient(90deg,#22c55e,#14b8a6)" },
                { name: "PostgreSQL", percent: 75, color: "linear-gradient(90deg,#22c55e,#14b8a6)" },
                { name: "MongoDB", percent: 70, color: "linear-gradient(90deg,#22c55e,#14b8a6)" },
                { name: "Git / Docker", percent: 82, color: "linear-gradient(90deg,#22c55e,#14b8a6)" },
              ].map((s) => <SkillBar key={s.name} {...s} />)}
            </motion.div>
          </div>

          {/* Tech pill cloud */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-10 flex flex-wrap gap-3 justify-center">
            {["Java", "Spring Boot", "React.js", "MySQL", "PostgreSQL", "MongoDB", "Docker", "Git", "JWT", "REST API", "WebSocket", "Redux", "Bootstrap", "Tailwind"].map((t) => (
              <motion.span
                key={t}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-4 py-2 text-sm font-semibold bg-slate-900/80 border border-slate-700 rounded-full text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition-all cursor-default"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Let's Work Together</h2>
            <p className="text-slate-400 mt-4 text-lg">Open to new opportunities. Drop me a message and I'll get back to you.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: "✉️", label: "Email", value: "khatriiiranjhi12@gmail.com", href: "mailto:khatriiiranjhi12@gmail.com" },
                { icon: "📱", label: "Phone", value: "+92 336 8264688", href: "tel:+923368264688" },
                { icon: "💼", label: "LinkedIn", value: "chander-parkash", href: "https://www.linkedin.com/in/chander-parkash" },
                { icon: "📍", label: "Location", value: "Sindh, Pakistan", href: null },
              ].map((c, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/40 transition-all">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noreferrer" className="text-white font-medium hover:text-cyan-400 transition-colors text-sm">{c.value}</a>
                    ) : (
                      <span className="text-white font-medium text-sm">{c.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.96 }}
                href="mailto:khatriiiranjhi12@gmail.com"
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-center shadow-lg"
              >
                📧 Send Email
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://github.com/Chander-parkash007"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 border border-slate-700 rounded-xl font-bold text-center hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all"
              >
                💻 View GitHub
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-base">CP.dev</span>
          <span>Built with React · Framer Motion · Tailwind CSS</span>
          <span>© 2026 Chander Parkash</span>
        </div>
      </footer>
    </div>
  );
}
