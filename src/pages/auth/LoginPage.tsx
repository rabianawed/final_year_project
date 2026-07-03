/**
 * LoginPage.tsx
 * PhishGuard AI — Authentication: Login
 * Features: Email/password, remember me, forgot password, Google + GitHub OAuth, animated illustration
 */

import React, { useState } from "react";
import {
  Shield, Mail, Lock, Eye, EyeOff, AlertCircle,
  Github, Chrome, ArrowRight, CheckCircle2, ShieldCheck,
  Zap, Globe, Link2
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// ─── Dummy auth (replace with real API call via authService) ──────────────────

const DEMO_CREDENTIALS = { email: "demo@phishguard.ai", password: "demo1234" };

async function fakeLogin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { success: true };
  }
  return { success: false, message: "Invalid email or password." };
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.email) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errs.password = "Password is required.";
  } else if (form.password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  }
  return errs;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Floating scan card used in the left illustration */
const ScanCard: React.FC<{
  label: string;
  value: string;
  status: "safe" | "danger" | "warning";
  delay: string;
}> = ({ label, value, status, delay }) => {
  const colors = {
    safe: { bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.28)", text: "#4ade80", dot: "#22c55e" },
    danger: { bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.28)", text: "#f87171", dot: "#ef4444" },
    warning: { bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.28)", text: "#fbbf24", dot: "#f59e0b" },
  };
  const c = colors[status];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: `float 3s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{value}</div>
      </div>
    </div>
  );
};

/** Left panel: animated security illustration */
const IllustrationPanel: React.FC = () => (
  <div
    style={{
      flex: 1,
      background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 48px",
      overflow: "hidden",
      minHeight: "100vh",
    }}
  >
    {/* Grid bg */}
    <div
      style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(37,99,235,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.05) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }}
    />

    {/* Radial glow */}
    <div
      style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(37,99,235,.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    {/* Central shield */}
    <div style={{ position: "relative", marginBottom: 48, zIndex: 1 }}>
      {/* Orbital rings */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 220, height: 220,
        borderRadius: "50%",
        border: "1px solid rgba(37,99,235,.2)",
        transform: "translate(-50%,-50%)",
        animation: "spin 24s linear infinite",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 160, height: 160,
        borderRadius: "50%",
        border: "1px dashed rgba(124,58,237,.18)",
        transform: "translate(-50%,-50%)",
        animation: "spin 16s linear infinite reverse",
      }} />

      {/* Shield core */}
      <div style={{
        width: 100, height: 100,
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(37,99,235,.3), rgba(124,58,237,.3))",
        border: "1px solid rgba(37,99,235,.5)",
        boxShadow: "0 0 60px rgba(37,99,235,.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
      }}>
        <ShieldCheck size={44} color="#60a5fa" />
      </div>
    </div>

    {/* Floating scan cards */}
    <div style={{ position: "absolute", top: "20%", left: "10%", zIndex: 3 }}>
      <ScanCard label="URL Scanned" value="Safe ✓" status="safe" delay="0s" />
    </div>
    <div style={{ position: "absolute", top: "35%", right: "8%", zIndex: 3 }}>
      <ScanCard label="Email Threat" value="Phishing Detected" status="danger" delay="0.6s" />
    </div>
    <div style={{ position: "absolute", bottom: "28%", left: "6%", zIndex: 3 }}>
      <ScanCard label="Risk Score" value="12 / 100 — Low" status="safe" delay="1.2s" />
    </div>
    <div style={{ position: "absolute", bottom: "20%", right: "10%", zIndex: 3 }}>
      <ScanCard label="SSL Status" value="⚠ Expired cert" status="warning" delay="0.9s" />
    </div>

    {/* Copy block */}
    <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
      <h2 style={{ color: "#f8fafc", fontSize: 26, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>
        AI-powered protection<br />
        <span style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg,#60a5fa,#a78bfa)" } as React.CSSProperties}>
          across every attack vector
        </span>
      </h2>
      <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, maxWidth: 320 }}>
        Detect phishing in URLs, emails, and websites in under 2 seconds
        with 99.2% accuracy.
      </p>
    </div>

    {/* Bottom stats row */}
    <div style={{ display: "flex", gap: 24, marginTop: 40, position: "relative", zIndex: 2 }}>
      {[
        { icon: <Link2 size={14} />, label: "12M+ URLs" },
        { icon: <Mail size={14} />, label: "99.2% Accurate" },
        { icon: <Globe size={14} />, label: "< 2s Scan" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", fontSize: 12 }}>
          <span style={{ color: "#2563EB" }}>{s.icon}</span>
          {s.label}
        </div>
      ))}
    </div>

    {/* Keyframes injected once */}
    <style>{`
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      @keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    `}</style>
  </div>
);

/** Styled input with icon + error */
const FormField: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  rightSlot?: React.ReactNode;
}> = ({ label, type, value, onChange, placeholder, icon, error, rightSlot }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 7 }}>
      {label}
    </label>
    <div
      style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,.045)",
        border: `1px solid ${error ? "rgba(239,68,68,.5)" : "rgba(255,255,255,.1)"}`,
        borderRadius: 12,
        padding: "0 14px",
        gap: 10,
        transition: "border-color .2s",
      }}
    >
      <span style={{ color: error ? "#f87171" : "#475569", display: "flex", flexShrink: 0 }}>{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: "#f1f5f9",
          fontSize: 14,
          padding: "13px 0",
          fontFamily: "Inter, sans-serif",
        }}
      />
      {rightSlot}
    </div>
    {error && (
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
        <AlertCircle size={12} color="#f87171" />
        <span style={{ color: "#f87171", fontSize: 12 }}>{error}</span>
      </div>
    )}
  </div>
);

/** Social login button */
const SocialBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "11px 16px",
      borderRadius: 12,
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#cbd5e1",
      fontSize: 13,
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      cursor: "pointer",
      transition: "background .2s, border-color .2s",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.08)";
      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.18)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.04)";
      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.1)";
    }}
  >
    {icon}
    {label}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await fakeLogin(form.email, form.password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      // Navigate to dashboard after short delay
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } else {
      setErrors({ general: result.message });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "#020617",
      }}
    >
      {/* ── Left: illustration (hidden on mobile via media query) ── */}
      <IllustrationPanel />

      {/* ── Right: login form ── */}
      <div
        style={{
          width: "480px",
          flexShrink: 0,
          background: "#0F172A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 48px",
          borderLeft: "1px solid rgba(255,255,255,.06)",
          position: "relative",
          overflowY: "auto",
        }}
      >
        {/* Top logo */}
        <div style={{ position: "absolute", top: 28, left: 48, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={16} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            Phish<span style={{ color: "#60a5fa" }}>Guard</span>
          </span>
        </div>

        {/* Form card */}
        <div
          style={{
            animation: "fadeUp .5s ease both",
            animationDelay: shake ? undefined : "0s",
            transform: shake ? undefined : undefined,
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: "#f8fafc", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              Welcome back
            </h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Sign in to your PhishGuard account
            </p>
          </div>

          {/* Demo hint */}
          <div
            style={{
              background: "rgba(37,99,235,.1)",
              border: "1px solid rgba(37,99,235,.3)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 24,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Zap size={13} color="#60a5fa" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.55 }}>
              <strong>Demo credentials:</strong> demo@phishguard.ai / demo1234
            </p>
          </div>

          {/* General error */}
          {errors.general && (
            <div
              style={{
                background: "rgba(239,68,68,.09)",
                border: "1px solid rgba(239,68,68,.3)",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "shake .4s ease",
              }}
            >
              <AlertCircle size={14} color="#f87171" />
              <span style={{ color: "#f87171", fontSize: 13 }}>{errors.general}</span>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div
              style={{
                background: "rgba(34,197,94,.09)",
                border: "1px solid rgba(34,197,94,.3)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} color="#4ade80" />
              <span style={{ color: "#4ade80", fontSize: 13 }}>Login successful — redirecting to dashboard...</span>
            </div>
          )}

          <div onKeyDown={handleKeyDown}>
            {/* Email */}
            <FormField
              label="Email address"
              type="email"
              value={form.email}
              onChange={set("email") as (v: string) => void}
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              error={errors.email}
            />

            {/* Password */}
            <FormField
              label="Password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password") as (v: string) => void}
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              error={errors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", padding: 0 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Remember me + Forgot password */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: -4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div
                onClick={() => set("rememberMe")(!form.rememberMe)}
                style={{
                  width: 18, height: 18,
                  borderRadius: 5,
                  border: `2px solid ${form.rememberMe ? "#2563EB" : "rgba(255,255,255,.2)"}`,
                  background: form.rememberMe ? "#2563EB" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, transition: "all .2s",
                }}
              >
                {form.rememberMe && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>Remember me</span>
            </label>
            <a
              href="/forgot-password"
              style={{ color: "#60a5fa", fontSize: 13, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              background: success ? "#16a34a" : "#2563EB",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              cursor: loading || success ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background .2s, opacity .2s",
              opacity: loading ? 0.8 : 1,
              marginBottom: 24,
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" style={{ animation: "spin 0.8s linear infinite", transformOrigin: "center" }} />
                </svg>
                Verifying...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={16} />
                Signed in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
            <span style={{ color: "#334155", fontSize: 12 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            <SocialBtn
              icon={<Github size={16} />}
              label="GitHub"
              onClick={() => console.log("GitHub OAuth")}
            />
            <SocialBtn
              icon={<Chrome size={16} />}
              label="Google"
              onClick={() => console.log("Google OAuth")}
            />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
            Don't have an account?{" "}
            <a
              href="/register"
              style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Create one free
            </a>
          </p>
        </div>

        {/* Bottom legal */}
        <p style={{
          position: "absolute", bottom: 24, left: 0, right: 0,
          textAlign: "center", color: "#1e293b", fontSize: 11,
        }}>
          By signing in you agree to our{" "}
          <a href="/terms" style={{ color: "#334155" }}>Terms</a> &{" "}
          <a href="/privacy" style={{ color: "#334155" }}>Privacy Policy</a>
        </p>
      </div>

      {/* Inline spin keyframe for loading spinner */}
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default LoginPage;
