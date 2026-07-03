/**
 * RegisterPage.tsx
 * PhishGuard AI — Authentication: Register
 * Features: Full name, email, password + confirm, terms checkbox, password strength meter
 */

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle,
  ArrowRight, CheckCircle2, ShieldCheck, Zap, Link2, Mail as MailIcon
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
  general?: string;
}

// ─── Password strength logic ───────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "#334155" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#EF4444" };
  if (score <= 3) return { score: 2, label: "Fair", color: "#F59E0B" };
  if (score === 4) return { score: 3, label: "Good", color: "#3B82F6" };
  return { score: 4, label: "Strong", color: "#22C55E" };
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.fullName.trim()) errs.fullName = "Full name is required.";
  else if (form.fullName.trim().length < 2) errs.fullName = "Name must be at least 2 characters.";

  if (!form.email) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";

  if (!form.password) errs.password = "Password is required.";
  else if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";

  if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
  else if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";

  if (!form.agreeTerms) errs.agreeTerms = "You must agree to the Terms to continue.";

  return errs;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ScanCard: React.FC<{ label: string; value: string; status: "safe" | "danger" | "warning"; delay: string }> = ({
  label, value, status, delay
}) => {
  const colors = {
    safe: { bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.28)", text: "#4ade80", dot: "#22c55e" },
    danger: { bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.28)", text: "#f87171", dot: "#ef4444" },
    warning: { bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.28)", text: "#fbbf24", dot: "#f59e0b" },
  };
  const c = colors[status];
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12,
      padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
      animation: "float 3s ease-in-out infinite", animationDelay: delay,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{value}</div>
      </div>
    </div>
  );
};

const IllustrationPanel: React.FC = () => (
  <div style={{
    flex: 1, background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    position: "relative", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", padding: "60px 48px",
    overflow: "hidden", minHeight: "100vh",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(37,99,235,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.05) 1px,transparent 1px)",
      backgroundSize: "40px 40px", pointerEvents: "none",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(124,58,237,.18) 0%, transparent 70%)",
      pointerEvents: "none",
    }} />

    <div style={{ position: "relative", marginBottom: 48, zIndex: 1 }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 220, height: 220, borderRadius: "50%",
        border: "1px solid rgba(124,58,237,.2)", transform: "translate(-50%,-50%)",
        animation: "spin 24s linear infinite",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 160, height: 160, borderRadius: "50%",
        border: "1px dashed rgba(37,99,235,.18)", transform: "translate(-50%,-50%)",
        animation: "spin 16s linear infinite reverse",
      }} />
      <div style={{
        width: 100, height: 100, borderRadius: 24,
        background: "linear-gradient(135deg, rgba(124,58,237,.3), rgba(37,99,235,.3))",
        border: "1px solid rgba(124,58,237,.5)", boxShadow: "0 0 60px rgba(124,58,237,.22)",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2,
      }}>
        <ShieldCheck size={44} color="#a78bfa" />
      </div>
    </div>

    <div style={{ position: "absolute", top: "20%", left: "8%", zIndex: 3 }}>
      <ScanCard label="Account Created" value="Welcome ✓" status="safe" delay="0s" />
    </div>
    <div style={{ position: "absolute", top: "35%", right: "6%", zIndex: 3 }}>
      <ScanCard label="Free Plan" value="50 scans/mo" status="warning" delay="0.6s" />
    </div>
    <div style={{ position: "absolute", bottom: "28%", left: "5%", zIndex: 3 }}>
      <ScanCard label="2FA Available" value="Recommended" status="safe" delay="1.2s" />
    </div>
    <div style={{ position: "absolute", bottom: "20%", right: "8%", zIndex: 3 }}>
      <ScanCard label="API Key" value="Generated" status="safe" delay="0.9s" />
    </div>

    <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
      <h2 style={{ color: "#f8fafc", fontSize: 26, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>
        Join thousands of<br />
        <span style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg,#a78bfa,#60a5fa)" } as React.CSSProperties}>
          security professionals
        </span>
      </h2>
      <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, maxWidth: 320 }}>
        Get 50 free scans per month, AI explanations, and access to our
        threat intelligence feed.
      </p>
    </div>

    <div style={{ display: "flex", gap: 24, marginTop: 40, position: "relative", zIndex: 2 }}>
      {[
        { icon: <Link2 size={14} />, label: "Free forever plan" },
        { icon: <MailIcon size={14} />, label: "No credit card" },
        { icon: <Zap size={14} />, label: "Instant access" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", fontSize: 12 }}>
          <span style={{ color: "#7C3AED" }}>{s.icon}</span>
          {s.label}
        </div>
      ))}
    </div>

    <style>{`
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      @keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    `}</style>
  </div>
);

const FormField: React.FC<{
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon: React.ReactNode; error?: string; rightSlot?: React.ReactNode;
}> = ({ label, type, value, onChange, placeholder, icon, error, rightSlot }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 7 }}>
      {label}
    </label>
    <div style={{
      display: "flex", alignItems: "center", background: "rgba(255,255,255,.045)",
      border: `1px solid ${error ? "rgba(239,68,68,.5)" : "rgba(255,255,255,.1)"}`,
      borderRadius: 12, padding: "0 14px", gap: 10, transition: "border-color .2s",
    }}>
      <span style={{ color: error ? "#f87171" : "#475569", display: "flex", flexShrink: 0 }}>{icon}</span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, padding: "13px 0", fontFamily: "Inter, sans-serif" }}
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

/** Password strength meter — 4 segment bar */
const StrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  if (!password) return null;
  return (
    <div style={{ marginTop: 8, marginBottom: 2 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < strength.score ? strength.color : "rgba(255,255,255,.08)",
              transition: "background .3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: strength.color }}>{strength.label}</span>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", password: "", confirmPassword: "", agreeTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setErrors({});
    const result = await register(form.fullName, form.email, form.password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 900);
    } else {
      setErrors({ general: result.message });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#020617" }}>
      <IllustrationPanel />

      <div style={{
        width: "480px", flexShrink: 0, background: "#0F172A", display: "flex",
        flexDirection: "column", justifyContent: "center", padding: "48px 48px",
        borderLeft: "1px solid rgba(255,255,255,.06)", position: "relative", overflowY: "auto",
      }}>
        <div style={{ position: "absolute", top: 26, left: 48, display: "flex", alignItems: "center", gap: 10 }}>
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

        <div style={{ animation: "fadeUp .5s ease both", marginTop: 36 }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ color: "#f8fafc", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Start detecting phishing threats in minutes
            </p>
          </div>

          {errors.general && (
            <div style={{
              background: "rgba(239,68,68,.09)", border: "1px solid rgba(239,68,68,.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 18,
              display: "flex", alignItems: "center", gap: 8, animation: "shake .4s ease",
            }}>
              <AlertCircle size={14} color="#f87171" />
              <span style={{ color: "#f87171", fontSize: 13 }}>{errors.general}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(34,197,94,.09)", border: "1px solid rgba(34,197,94,.3)",
              borderRadius: 10, padding: "12px 14px", marginBottom: 18,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <CheckCircle2 size={16} color="#4ade80" />
              <span style={{ color: "#4ade80", fontSize: 13 }}>Account created — redirecting to dashboard...</span>
            </div>
          )}

          <div onKeyDown={handleKeyDown}>
            <FormField
              label="Full name"
              type="text"
              value={form.fullName}
              onChange={set("fullName") as (v: string) => void}
              placeholder="Jane Doe"
              icon={<User size={16} />}
              error={errors.fullName}
            />

            <FormField
              label="Email address"
              type="email"
              value={form.email}
              onChange={set("email") as (v: string) => void}
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              error={errors.email}
            />

            <div>
              <FormField
                label="Password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password") as (v: string) => void}
                placeholder="At least 8 characters"
                icon={<Lock size={16} />}
                error={errors.password}
                rightSlot={
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div style={{ marginTop: -12, marginBottom: 18 }}>
                <StrengthMeter password={form.password} />
              </div>
            </div>

            <FormField
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={set("confirmPassword") as (v: string) => void}
              placeholder="Re-enter your password"
              icon={<Lock size={16} />}
              error={errors.confirmPassword}
              rightSlot={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", padding: 0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Terms checkbox */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <div
                onClick={() => set("agreeTerms")(!form.agreeTerms)}
                style={{
                  width: 18, height: 18, borderRadius: 5, marginTop: 1,
                  border: `2px solid ${errors.agreeTerms ? "rgba(239,68,68,.6)" : form.agreeTerms ? "#2563EB" : "rgba(255,255,255,.2)"}`,
                  background: form.agreeTerms ? "#2563EB" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, transition: "all .2s",
                }}
              >
                {form.agreeTerms && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>
                I agree to the{" "}
                <a href="/terms" style={{ color: "#60a5fa", textDecoration: "none" }}>Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "#60a5fa", textDecoration: "none" }}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, marginLeft: 28 }}>
                <AlertCircle size={12} color="#f87171" />
                <span style={{ color: "#f87171", fontSize: 12 }}>{errors.agreeTerms}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            style={{
              width: "100%", padding: "13px", borderRadius: 12,
              background: success ? "#16a34a" : "#2563EB", border: "none", color: "#fff",
              fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif",
              cursor: loading || success ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background .2s, opacity .2s", opacity: loading ? 0.8 : 1, marginBottom: 22,
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" style={{ animation: "spin 0.8s linear infinite", transformOrigin: "center" }} />
                </svg>
                Creating account...
              </>
            ) : success ? (
              <><CheckCircle2 size={16} /> Account created</>
            ) : (
              <>Create account <ArrowRight size={15} /></>
            )}
          </button>

          <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default RegisterPage;
