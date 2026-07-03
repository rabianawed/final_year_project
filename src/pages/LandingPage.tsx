/**
 * LandingPage.tsx
 * PhishGuard AI — Public landing page
 * Sections: Navbar, Hero, Features, How AI Works, Why Us, Testimonials, Pricing, FAQ, Footer
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Shield, Zap, Eye, Globe, Mail, Link2, ChevronDown, ChevronRight,
  Check, Star, ArrowRight, Menu, X, Lock, Brain, BarChart3,
  AlertTriangle, Users, Award, Cpu, FileSearch, ShieldCheck,
  TrendingUp, Layers, Github, Twitter, Linkedin
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem { label: string; href: string }
interface Feature { icon: React.ReactNode; title: string; desc: string; accent: string }
interface Step { num: string; title: string; desc: string }
interface Stat { value: string; label: string }
interface Testimonial { name: string; role: string; company: string; text: string; rating: number }
interface PricingPlan { name: string; price: string; period: string; desc: string; features: string[]; cta: string; highlight: boolean }
interface FAQItem { q: string; a: string }

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES: Feature[] = [
  {
    icon: <Link2 size={22} />,
    title: "URL Analysis",
    desc: "Detect malicious URLs in real-time using ML models trained on millions of phishing patterns and behavioral signals.",
    accent: "#2563EB",
  },
  {
    icon: <Mail size={22} />,
    title: "Email Scanning",
    desc: "Analyze email headers, body, and embedded links for phishing indicators with NLP-powered content analysis.",
    accent: "#8B5CF6",
  },
  {
    icon: <Globe size={22} />,
    title: "Website Detection",
    desc: "Live website scanning with screenshot analysis, SSL validation, and domain reputation scoring.",
    accent: "#22C55E",
  },
  {
    icon: <Brain size={22} />,
    title: "AI Explanations",
    desc: "Every detection comes with human-readable AI reasoning so you understand exactly why a threat was flagged.",
    accent: "#F59E0B",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Threat Intelligence",
    desc: "Access a continuously updated database of known malicious domains, IPs, and attack campaigns.",
    accent: "#EF4444",
  },
  {
    icon: <Layers size={22} />,
    title: "Browser Extension",
    desc: "Protect yourself in real-time with our browser extension that silently scans every page you visit.",
    accent: "#0EA5E9",
  },
];

const HOW_IT_WORKS_STEPS: Step[] = [
  {
    num: "01",
    title: "Submit Content",
    desc: "Paste a URL, upload an .eml file, or enter a website address. Our API accepts all three threat vectors.",
  },
  {
    num: "02",
    title: "AI Analysis",
    desc: "Our ensemble of ML models — including transformer-based NLP and gradient boosting classifiers — analyze 200+ features simultaneously.",
  },
  {
    num: "03",
    title: "Threat Scoring",
    desc: "Each submission receives a risk score from 0–100 with confidence intervals and feature attribution.",
  },
  {
    num: "04",
    title: "Actionable Report",
    desc: "Get a detailed breakdown of detected indicators, severity level, and recommended actions in seconds.",
  },
];

const STATS: Stat[] = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "< 2s", label: "Avg. Scan Time" },
  { value: "12M+", label: "URLs Analyzed" },
  { value: "340K", label: "Threats Blocked" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CISO",
    company: "FinanceFirst Ltd.",
    text: "PhishGuard caught a sophisticated spear-phishing campaign targeting our CFO. The AI explanation made it trivial to brief our board on the threat.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    role: "SOC Analyst",
    company: "CyberShield MSSP",
    text: "We integrated the API in two hours. The threat intelligence feed alone replaced two other tools we were paying for separately.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "IT Security Lead",
    company: "EduTech Global",
    text: "The browser extension is invisible when safe and impossible to miss when dangerous. Perfect balance for a university environment.",
    rating: 5,
  },
];

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For individuals and students exploring phishing detection.",
    features: [
      "50 URL scans / month",
      "10 email scans / month",
      "Basic risk scoring",
      "Community threat intel",
      "Browser extension",
    ],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    desc: "For security professionals who need full-featured detection.",
    features: [
      "Unlimited URL scans",
      "500 email scans / month",
      "AI explanations",
      "PDF / CSV reports",
      "API access (10K calls/mo)",
      "Priority threat intel feed",
      "Website live scanner",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For teams and MSSPs requiring high-volume, white-label solutions.",
    features: [
      "Unlimited everything",
      "SLA-backed uptime",
      "SSO / SAML integration",
      "Dedicated ML model tuning",
      "Custom threat feeds",
      "On-prem deployment option",
      "24/7 dedicated support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How accurate is the AI detection?",
    a: "Our ensemble model achieves 99.2% accuracy on our benchmark dataset of 2M labeled URLs, 500K emails, and 300K websites. False positive rate is under 0.4%.",
  },
  {
    q: "How long does a scan take?",
    a: "URL scans complete in under 1 second. Email analysis takes 2–5 seconds depending on content length. Website scans with live screenshots average 8 seconds.",
  },
  {
    q: "Is my data stored or shared?",
    a: "Submitted content is processed in memory and not stored beyond the session unless you explicitly save a report. We never share your data with third parties.",
  },
  {
    q: "Can I integrate PhishGuard with my SIEM?",
    a: "Yes. Our REST API supports webhooks, JSON, and CSV exports. Enterprise plans include native SIEM connectors for Splunk, Sentinel, and IBM QRadar.",
  },
  {
    q: "Does the browser extension work on all browsers?",
    a: "The extension is available for Chrome, Firefox, and Edge. Safari support is in beta. It scans pages passively with no performance impact.",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Smooth scroll to anchor */
const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/** Hook: fires callback when element enters viewport */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Glassmorphism card */
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = ""
}) => (
  <div
    className={`rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm ${className}`}
    style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.3)" }}
  >
    {children}
  </div>
);

/** Animated count-up number (CSS only via transition on opacity) */
const StatCard: React.FC<{ stat: Stat; visible: boolean }> = ({ stat, visible }) => (
  <div
    className="text-center"
    style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
  >
    <div className="text-4xl font-bold text-white mb-1" style={{ fontFeatureSettings: "'tnum'" }}>
      {stat.value}
    </div>
    <div className="text-sm text-slate-400 uppercase tracking-widest">{stat.label}</div>
  </div>
);

/** FAQ accordion item */
const FAQItem: React.FC<{ item: FAQItem; open: boolean; toggle: () => void }> = ({
  item, open, toggle
}) => (
  <div className="border-b border-white/10 last:border-0">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between py-5 text-left gap-4 group"
    >
      <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
        {item.q}
      </span>
      <ChevronDown
        size={18}
        className="text-slate-400 shrink-0 transition-transform duration-300"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
      />
    </button>
    <div
      className="overflow-hidden transition-all duration-300"
      style={{ maxHeight: open ? "200px" : "0", opacity: open ? 1 : 0 }}
    >
      <p className="text-slate-400 pb-5 leading-relaxed">{item.a}</p>
    </div>
  </div>
);

// ─── Section: Navbar ──────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(2,6,23,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
          >
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Phish<span className="text-blue-400">Guard</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-slate-300 hover:text-white text-sm transition-colors px-4 py-2">
            Sign in
          </a>
          <a
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all"
            style={{ background: "#2563EB" }}
          >
            Get started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4" style={{ background: "rgba(2,6,23,0.97)" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => { scrollTo(item.href); setMobileOpen(false); }}
              className="text-slate-300 hover:text-white text-sm text-left transition-colors"
            >
              {item.label}
            </button>
          ))}
          <hr className="border-white/10" />
          <a href="/login" className="text-slate-300 text-sm">Sign in</a>
          <a href="/register" className="text-sm font-medium px-4 py-2 rounded-lg text-white text-center" style={{ background: "#2563EB" }}>
            Get started
          </a>
        </div>
      )}
    </nav>
  );
};

// ─── Section: Hero ───────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  const [inputVal, setInputVal] = useState("");

  /* Animated threat badges that float around the shield */
  const BADGES = [
    { label: "Phishing URL", color: "#EF4444", angle: -40, r: 180 },
    { label: "Malware Site", color: "#F59E0B", angle: 30, r: 190 },
    { label: "Safe ✓", color: "#22C55E", angle: 200, r: 170 },
    { label: "Spear Phish", color: "#EF4444", angle: 150, r: 185 },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#020617" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI-Powered Threat Detection — v2.0
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Stop phishing{" "}
              <span
                className="relative"
                style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED)" }}
              >
                before it lands
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              PhishGuard uses ensemble machine learning and transformer-based NLP
              to detect phishing attacks in URLs, emails, and websites — with{" "}
              <strong className="text-slate-200">99.2% accuracy</strong> and
              sub-second response times.
            </p>

            {/* URL quick-scan */}
            <div className="flex gap-2 mb-8">
              <div className="flex-1 flex items-center gap-2 bg-white/6 border border-white/12 rounded-xl px-4 py-3">
                <Link2 size={16} className="text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Paste a suspicious URL..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                />
              </div>
              <a
                href="/dashboard/url-scanner"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "#2563EB" }}
              >
                Scan <ArrowRight size={15} />
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Check size={13} className="text-green-400" /> No sign-up required</span>
              <span className="flex items-center gap-1.5"><Check size={13} className="text-green-400" /> Free 50 scans</span>
              <span className="flex items-center gap-1.5"><Check size={13} className="text-green-400" /> GDPR compliant</span>
            </div>
          </div>

          {/* Right: animated shield illustration */}
          <div className="relative flex items-center justify-center h-[420px]">
            {/* Orbital ring */}
            <div
              className="absolute w-80 h-80 rounded-full border border-blue-500/20"
              style={{ animation: "spin 20s linear infinite" }}
            />
            <div
              className="absolute w-56 h-56 rounded-full border border-purple-500/15"
              style={{ animation: "spin 14s linear infinite reverse" }}
            />

            {/* Central shield */}
            <div
              className="relative w-36 h-36 rounded-3xl flex items-center justify-center z-10"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(124,58,237,0.3))",
                border: "1px solid rgba(37,99,235,0.5)",
                boxShadow: "0 0 60px rgba(37,99,235,0.25), 0 0 120px rgba(37,99,235,0.1)",
              }}
            >
              <ShieldCheck size={56} className="text-blue-400" />
            </div>

            {/* Floating threat badges */}
            {BADGES.map((b, i) => {
              const rad = (b.angle * Math.PI) / 180;
              const x = Math.cos(rad) * b.r;
              const y = Math.sin(rad) * b.r;
              return (
                <div
                  key={i}
                  className="absolute px-3 py-1.5 rounded-lg text-xs font-medium text-white border"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    background: `${b.color}18`,
                    borderColor: `${b.color}40`,
                    color: b.color,
                    animation: `float ${2.5 + i * 0.4}s ease-in-out infinite`,
                  }}
                >
                  {b.label}
                </div>
              );
            })}

            {/* Live scan indicator */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs text-green-400 border border-green-400/30"
              style={{ background: "rgba(34,197,94,0.08)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Scanning in real-time
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// ─── Section: Stats Bar ───────────────────────────────────────────────────────

const StatsBar: React.FC = () => {
  const { ref, visible } = useInView();
  return (
    <section ref={ref} style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <div key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <StatCard stat={s} visible={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Features ────────────────────────────────────────────────────────

const Features: React.FC = () => {
  const { ref, visible } = useInView();
  return (
    <section id="features" ref={ref} className="py-28" style={{ background: "#020617" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">What we detect</p>
          <h2 className="text-4xl font-bold text-white mb-4">Three attack vectors. One platform.</h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Phishing attacks evolve every day. Our multi-modal AI stays ahead by
            analyzing threats across every channel attackers use.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <GlassCard
              key={i}
              className="p-6 group hover:border-white/16 transition-all duration-300 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(32px)",
                transition: `all 0.6s ease ${i * 0.08}s`,
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                style={{ background: `${f.accent}18`, color: f.accent, border: `1px solid ${f.accent}30` }}
              >
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: How AI Works ────────────────────────────────────────────────────

const HowAIWorks: React.FC = () => {
  const { ref, visible } = useInView();
  return (
    <section id="how-it-works" ref={ref} className="py-28" style={{ background: "#0F172A" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: steps */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-32px)", transition: "all 0.7s ease" }}>
            <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-3">Under the hood</p>
            <h2 className="text-4xl font-bold text-white mb-4">How the AI detects threats</h2>
            <p className="text-slate-400 mb-10 leading-relaxed">
              Our pipeline combines feature engineering, ensemble classifiers, and
              transformer-based language models to achieve industry-leading accuracy.
            </p>

            <div className="space-y-8">
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(37,99,235,0.15)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.3)" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal-style card */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(32px)", transition: "all 0.7s ease 0.2s" }}>
            <GlassCard className="overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-slate-500 text-xs font-mono">phishguard — analysis output</span>
              </div>

              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-slate-500">$ phishguard analyze --url "http://secure-bank-login.xyz/verify"</div>
                <div className="text-blue-400">→ Extracting 212 features...</div>
                <div className="text-slate-400 pl-4">lexical: suspicious TLD, hyphenation score 0.87</div>
                <div className="text-slate-400 pl-4">domain: age 3 days, no WHOIS privacy</div>
                <div className="text-slate-400 pl-4">NLP: urgency keywords detected (3/5)</div>
                <div className="text-blue-400">→ Running ensemble classifiers...</div>
                <div className="text-slate-400 pl-4">XGBoost: 0.97 phishing probability</div>
                <div className="text-slate-400 pl-4">BERT-phish: 0.94 phishing probability</div>
                <div className="text-slate-400 pl-4">Random Forest: 0.99 phishing probability</div>

                <div className="pt-2 p-3 rounded-lg border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }}>
                  <div className="text-red-400 font-bold">⚠ VERDICT: PHISHING — HIGH RISK</div>
                  <div className="text-red-300/70 text-xs mt-1">Confidence: 96.7% · Risk Score: 94/100</div>
                </div>

                <div className="text-green-400/70 text-xs pt-1">Scan completed in 847ms</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: Why Choose Us ───────────────────────────────────────────────────

const WhyUs: React.FC = () => {
  const { ref, visible } = useInView();
  const REASONS = [
    { icon: <Cpu size={18} />, title: "Ensemble ML architecture", desc: "XGBoost, Random Forest, and BERT working in parallel — not just a single model." },
    { icon: <Zap size={18} />, title: "Real-time scoring", desc: "Sub-second results even on complex website scans with live screenshot analysis." },
    { icon: <Eye size={18} />, title: "Explainable AI", desc: "Every result includes feature attribution so analysts understand the reasoning." },
    { icon: <Lock size={18} />, title: "Privacy by design", desc: "Content is analyzed in memory and never persisted without your explicit consent." },
    { icon: <TrendingUp size={18} />, title: "Continuously updated", desc: "Threat intelligence feeds refresh every 15 minutes from 40+ global sources." },
    { icon: <Users size={18} />, title: "Built for teams", desc: "Role-based access, shared dashboards, audit logs, and SSO out of the box." },
  ];

  return (
    <section ref={ref} className="py-28" style={{ background: "#020617" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease, transform 0.6s ease", transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-green-400 text-sm font-medium uppercase tracking-widest mb-3">Why PhishGuard</p>
          <h2 className="text-4xl font-bold text-white mb-4">Designed for security professionals</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            We built the tool we always wanted: fast, accurate, explainable, and built to slot into any security workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((r, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl border border-white/8 hover:border-white/16 transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `all 0.6s ease ${i * 0.07}s`,
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                {r.icon}
              </div>
              <div>
                <h4 className="text-white font-medium text-sm mb-1">{r.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Testimonials ────────────────────────────────────────────────────

const Testimonials: React.FC = () => {
  const { ref, visible } = useInView();
  return (
    <section ref={ref} className="py-28" style={{ background: "#0F172A" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-3">What users say</p>
          <h2 className="text-4xl font-bold text-white">Trusted by security teams worldwide</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <GlassCard
              key={i}
              className="p-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(32px)",
                transition: `all 0.6s ease ${i * 0.12}s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
                >
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}, {t.company}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Pricing ─────────────────────────────────────────────────────────

const Pricing: React.FC = () => {
  const { ref, visible } = useInView();
  return (
    <section id="pricing" ref={ref} className="py-28" style={{ background: "#020617" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-bold text-white mb-4">Start free, scale when you need to</h2>
          <p className="text-slate-400">No credit card required for the free plan.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border relative"
              style={{
                background: plan.highlight ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: plan.highlight ? "rgba(37,99,235,0.5)" : "rgba(255,255,255,0.08)",
                boxShadow: plan.highlight ? "0 0 48px rgba(37,99,235,0.15)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(32px)",
                transition: `all 0.6s ease ${i * 0.1}s`,
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "#2563EB" }}
                >
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-slate-400 text-sm font-medium mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/ {plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              <a
                href="/register"
                className="block w-full text-center py-2.5 rounded-xl text-sm font-medium mb-6 transition-all"
                style={
                  plan.highlight
                    ? { background: "#2563EB", color: "#fff" }
                    : { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {plan.cta}
              </a>

              <ul className="space-y-2.5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check size={14} className="text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: FAQ ─────────────────────────────────────────────────────────────

const FAQ: React.FC = () => {
  const { ref, visible } = useInView();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-28" style={{ background: "#0F172A" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-white">Common questions</h2>
        </div>

        <GlassCard className="px-6">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              open={openIdx === i}
              toggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </GlassCard>
      </div>
    </section>
  );
};

// ─── Section: CTA Banner ──────────────────────────────────────────────────────

const CTABanner: React.FC = () => (
  <section className="py-24" style={{ background: "#020617" }}>
    <div className="max-w-4xl mx-auto px-6 text-center">
      <div
        className="rounded-3xl p-12 border border-blue-500/20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.2), transparent)" }}
        />
        <div className="relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)" }}>
            <Shield size={28} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Start protecting yourself today</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of security professionals using PhishGuard to stay one step ahead of attackers. Free forever. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
              style={{ background: "#2563EB" }}
            >
              Create free account <ArrowRight size={16} />
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-300 font-medium border border-white/12 hover:border-white/24 transition-all"
            >
              View live demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Section: Footer ──────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold">Phish<span className="text-blue-400">Guard</span></span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-5">
            AI-powered phishing detection for URLs, emails, and websites.
          </p>
          <div className="flex gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white border border-white/8 hover:border-white/20 transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          {
            title: "Product",
            links: ["URL Scanner", "Email Scanner", "Website Scanner", "Threat Intel", "Browser Extension"],
          },
          {
            title: "Company",
            links: ["About", "Blog", "Careers", "Press", "Contact"],
          },
          {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-sm">© 2025 PhishGuard AI. All rights reserved.</p>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-green-400 text-xs"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </span>
          <span className="text-slate-600">FYP — Final Year Project</span>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Root Export ──────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => (
  <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#020617" }}>
    <Navbar />
    <Hero />
    <StatsBar />
    <Features />
    <HowAIWorks />
    <WhyUs />
    <Testimonials />
    <Pricing />
    <FAQ />
    <CTABanner />
    <Footer />
  </div>
);

export default LandingPage;
