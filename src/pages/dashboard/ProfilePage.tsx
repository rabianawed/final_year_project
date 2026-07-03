/**
 * ProfilePage.tsx
 * PhishGuard AI — User Profile
 * Avatar, edit profile, change password, API keys, security settings, activity log
 */

import React, { useState } from "react";
import {
  User, Mail, Camera, Lock, Key, Shield, Activity, Copy,
  Eye, EyeOff, Plus, Trash2, CheckCircle2, Smartphone
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

const TAB_LIST = ["Profile", "Password", "API Keys", "Security", "Activity Log"] as const;
type Tab = typeof TAB_LIST[number];

const API_KEYS = [
  { name: "Production Key", key: "pg_live_••••••••••••8f2a", created: "Mar 12, 2026", lastUsed: "2 hours ago" },
  { name: "Staging Key", key: "pg_test_••••••••••••c91d", created: "Jan 04, 2026", lastUsed: "5 days ago" },
];

const ACTIVITY_LOG = [
  { action: "Logged in", device: "Chrome on macOS", time: "Today, 9:42 AM", ip: "102.45.67.12" },
  { action: "API key generated", device: "Chrome on macOS", time: "Yesterday, 4:15 PM", ip: "102.45.67.12" },
  { action: "Password changed", device: "Safari on iOS", time: "Mar 18, 2026", ip: "102.45.67.99" },
  { action: "Logged in", device: "Firefox on Windows", time: "Mar 15, 2026", ip: "88.21.6.40" },
  { action: "Profile updated", device: "Chrome on macOS", time: "Mar 10, 2026", ip: "102.45.67.12" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif",
};

const primaryBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10,
  background: "#2563EB", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const eyeBtnStyle: React.CSSProperties = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex",
};

const iconActionBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#94a3b8", cursor: "pointer",
};

const SettingRow: React.FC<{ icon: React.ReactNode; title: string; desc: string; enabled: boolean; onToggle: () => void }> = ({
  icon, title, desc, enabled, onToggle
}) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
  }}>
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ color: "#60a5fa", marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{desc}</div>
      </div>
    </div>
    <div onClick={onToggle} style={{
      width: 40, height: 22, borderRadius: 99, cursor: "pointer", flexShrink: 0,
      background: enabled ? "#2563EB" : "rgba(255,255,255,.12)", position: "relative", transition: "background .2s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2,
        left: enabled ? 20 : 2, transition: "left .2s",
      }} />
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Profile");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <DashboardLayout activePath="/dashboard/profile">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Profile & Account</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Manage your account information, security, and API access</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
        <div>
          <GlassCard style={{ padding: 24, marginBottom: 16, textAlign: "center" }}>
            <div style={{ position: "relative", width: 84, height: 84, margin: "0 auto 14px" }}>
              <div style={{
                width: 84, height: 84, borderRadius: "50%",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#fff",
              }}>
                JD
              </div>
              <button style={{
                position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%",
                background: "#0F172A", border: "2px solid #020617", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#94a3b8",
              }}>
                <Camera size={13} />
              </button>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>Jane Doe</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>jane.doe@phishguard.ai</div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
              padding: "4px 12px", borderRadius: 99, background: "rgba(37,99,235,.12)", color: "#60a5fa",
              border: "1px solid rgba(37,99,235,.3)",
            }}>
              Pro Plan
            </span>
          </GlassCard>

          <GlassCard style={{ padding: 8 }}>
            {TAB_LIST.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 10,
                  border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 2,
                  background: tab === t ? "rgba(37,99,235,.14)" : "transparent",
                  color: tab === t ? "#fff" : "#94a3b8",
                  display: "flex", alignItems: "center", gap: 9,
                }}
              >
                {t === "Profile" && <User size={14} />}
                {t === "Password" && <Lock size={14} />}
                {t === "API Keys" && <Key size={14} />}
                {t === "Security" && <Shield size={14} />}
                {t === "Activity Log" && <Activity size={14} />}
                {t}
              </button>
            ))}
          </GlassCard>
        </div>

        <GlassCard style={{ padding: 26 }}>
          {tab === "Profile" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 18 }}>Edit Profile</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Full Name</label>
                  <input defaultValue="Jane Doe" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Email Address</label>
                  <input defaultValue="jane.doe@phishguard.ai" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Company</label>
                  <input defaultValue="CyberShield MSSP" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Role</label>
                  <input defaultValue="Security Analyst" style={inputStyle} />
                </div>
              </div>
              <button style={primaryBtnStyle}>Save Changes</button>
            </div>
          )}

          {tab === "Password" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 18 }}>Change Password</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showCurrentPw ? "text" : "password"} placeholder="••••••••" style={inputStyle} />
                    <button onClick={() => setShowCurrentPw(!showCurrentPw)} style={eyeBtnStyle}>
                      {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showNewPw ? "text" : "password"} placeholder="At least 8 characters" style={inputStyle} />
                    <button onClick={() => setShowNewPw(!showNewPw)} style={eyeBtnStyle}>
                      {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7 }}>Confirm New Password</label>
                  <input type="password" placeholder="Re-enter new password" style={inputStyle} />
                </div>
              </div>
              <button style={{ ...primaryBtnStyle, marginTop: 20 }}>Update Password</button>
            </div>
          )}

          {tab === "API Keys" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>API Keys</h3>
                <button style={{ ...primaryBtnStyle, padding: "8px 14px" }}>
                  <Plus size={13} /> Generate Key
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {API_KEYS.map((k, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, marginBottom: 3 }}>{k.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{k.key}</div>
                      <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Created {k.created} · Last used {k.lastUsed}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleCopy(k.key)} style={iconActionBtn}>
                        {copiedKey === k.key ? <CheckCircle2 size={14} color="#4ade80" /> : <Copy size={14} />}
                      </button>
                      <button style={{ ...iconActionBtn, color: "#f87171" }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Security" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 18 }}>Security Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <SettingRow
                  icon={<Smartphone size={16} />}
                  title="Two-Factor Authentication"
                  desc="Require a verification code in addition to your password"
                  enabled={twoFA}
                  onToggle={() => setTwoFA(!twoFA)}
                />
                <SettingRow
                  icon={<Mail size={16} />}
                  title="Email Alerts for New Logins"
                  desc="Get notified when your account is accessed from a new device"
                  enabled={emailAlerts}
                  onToggle={() => setEmailAlerts(!emailAlerts)}
                />
              </div>
            </div>
          )}

          {tab === "Activity Log" && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 18 }}>Activity Log</h3>
              <div>
                {ACTIVITY_LOG.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: i < ACTIVITY_LOG.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 2 }}>{a.action}</div>
                      <div style={{ fontSize: 11.5, color: "#64748b" }}>{a.device} · {a.ip}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#475569" }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
