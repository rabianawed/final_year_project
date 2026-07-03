/**
 * AdminPanelPage.tsx
 * PhishGuard AI — Admin Panel
 * Manage Users, Reports, Detection Logs, ML Models, System Analytics
 */
import React, { useState } from "react";
import { Users, FileText, List, Cpu, BarChart3, Trash2, Edit, ShieldCheck, ShieldAlert, RefreshCw, TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>{children}</div>
);

const TABS = ["Users","Reports","Detection Logs","ML Models","System Analytics"] as const;
type Tab = typeof TABS[number];

const USERS = [
  { name: "Jane Doe", email: "jane@phishguard.ai", plan: "Pro", role: "Admin", scans: 1240, status: "active" },
  { name: "Marcus Webb", email: "marcus@cyshield.com", plan: "Pro", role: "User", scans: 874, status: "active" },
  { name: "Priya Sharma", email: "priya@edutech.io", plan: "Free", role: "User", scans: 48, status: "active" },
  { name: "Alex Kim", email: "alex@startup.io", plan: "Free", role: "User", scans: 12, status: "suspended" },
  { name: "Sarah Chen", email: "sarah@finco.com", plan: "Enterprise", role: "Admin", scans: 5820, status: "active" },
];

const DETECTION_LOGS = [
  { id: "LOG-4821", target: "secure-bank-login.xyz", type: "URL", result: "phishing", model: "XGBoost", confidence: 97.2, time: "09:42:11" },
  { id: "LOG-4820", target: "github.com", type: "URL", result: "safe", model: "Ensemble", confidence: 99.1, time: "09:38:55" },
  { id: "LOG-4819", target: "Urgent Account Email", type: "Email", result: "phishing", model: "BERT-phish", confidence: 94.7, time: "09:31:02" },
  { id: "LOG-4818", target: "paypal-verify.net", type: "Website", result: "phishing", model: "Ensemble", confidence: 98.3, time: "09:24:17" },
  { id: "LOG-4817", target: "stripe.com", type: "Website", result: "safe", model: "RF", confidence: 99.8, time: "09:18:44" },
];

const ML_MODELS = [
  { name: "XGBoost v3.1", type: "URL", accuracy: "99.1%", status: "active", lastTrained: "Jun 20, 2026", dataPoints: "2.4M" },
  { name: "BERT-phish v2.0", type: "Email/NLP", accuracy: "98.7%", status: "active", lastTrained: "Jun 15, 2026", dataPoints: "1.1M" },
  { name: "Random Forest v5.2", type: "Website", accuracy: "98.4%", status: "active", lastTrained: "Jun 10, 2026", dataPoints: "890K" },
  { name: "XGBoost v3.2 (beta)", type: "URL", accuracy: "99.4%", status: "training", lastTrained: "Training…", dataPoints: "3.1M" },
];

const SYSTEM_STATS = [
  { label: "Total Users", value: "1,204", icon: <Users size={18}/>, color: "#2563EB" },
  { label: "Total Scans Today", value: "8,471", icon: <List size={18}/>, color: "#22C55E" },
  { label: "Phishing Detected", value: "1,102", icon: <ShieldAlert size={18}/>, color: "#EF4444" },
  { label: "Model Uptime", value: "99.98%", icon: <TrendingUp size={18}/>, color: "#8B5CF6" },
];

const AdminPanelPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Users");

  return (
    <DashboardLayout activePath="/dashboard/admin">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Panel</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Manage users, models, detection logs, and system analytics</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,.03)", padding: 4, borderRadius: 12, width: "fit-content", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
            background: tab===t ? "#2563EB" : "transparent", color: tab===t ? "#fff" : "#94a3b8",
          }}>{t}</button>
        ))}
      </div>

      {/* ── Users ── */}
      {tab === "Users" && (
        <GlassCard style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>Manage Users ({USERS.length})</h3>
            <button style={{ padding: "8px 14px", borderRadius: 9, background: "#2563EB", border: "none", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>+ Invite User</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Name","Email","Plan","Role","Scans","Status","Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {USERS.map((u, i) => (
                  <tr key={i} style={{ borderBottom: i<USERS.length-1 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                    <td style={{ padding: "12px", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>{u.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: u.plan==="Enterprise"?"rgba(139,92,246,.15)":u.plan==="Pro"?"rgba(37,99,235,.15)":"rgba(255,255,255,.07)", color: u.plan==="Enterprise"?"#a78bfa":u.plan==="Pro"?"#60a5fa":"#94a3b8", border: "1px solid rgba(255,255,255,.1)" }}>{u.plan}</span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>{u.role}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#e2e8f0" }}>{u.scans.toLocaleString()}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: u.status==="active"?"rgba(34,197,94,.12)":"rgba(239,68,68,.12)", color: u.status==="active"?"#4ade80":"#f87171", border: `1px solid ${u.status==="active"?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)"}` }}>{u.status}</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit size={13}/></button>
                        <button style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── Detection Logs ── */}
      {tab === "Detection Logs" && (
        <GlassCard style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 }}>Detection Logs</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Log ID","Target","Type","Result","Model","Confidence","Time"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {DETECTION_LOGS.map((l, i) => (
                  <tr key={i} style={{ borderBottom: i<DETECTION_LOGS.length-1?"1px solid rgba(255,255,255,.05)":"none" }}>
                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{l.id}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.target}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>{l.type}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: l.result==="safe"?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)", color: l.result==="safe"?"#4ade80":"#f87171", border: `1px solid ${l.result==="safe"?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)"}` }}>{l.result.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>{l.model}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{l.confidence}%</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── ML Models ── */}
      {tab === "ML Models" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ML_MODELS.map((m, i) => (
            <GlassCard key={i} style={{ padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={18} color="#60a5fa"/>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Type: {m.type} · Training data: {m.dataPoints}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>{m.accuracy}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Accuracy</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 2 }}>{m.lastTrained}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Last trained</div>
                </div>
                <span style={{ alignSelf: "center", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: m.status==="active"?"rgba(34,197,94,.1)":"rgba(245,158,11,.1)", color: m.status==="active"?"#4ade80":"#fbbf24", border: `1px solid ${m.status==="active"?"rgba(34,197,94,.3)":"rgba(245,158,11,.3)"}` }}>
                  {m.status.toUpperCase()}
                </span>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.3)", color: "#60a5fa", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                  <RefreshCw size={13}/> Retrain
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── System Analytics ── */}
      {tab === "System Analytics" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
            {SYSTEM_STATS.map((s, i) => (
              <GlassCard key={i} style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{s.value}</div><div style={{ fontSize: 11.5, color: "#64748b" }}>{s.label}</div></div>
              </GlassCard>
            ))}
          </div>
          <GlassCard style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 14 }}>System Health</h3>
            {[
              { label: "API Latency (avg)", value: "47ms", ok: true },
              { label: "Model Inference Time", value: "820ms", ok: true },
              { label: "Database Query Time", value: "12ms", ok: true },
              { label: "Cache Hit Rate", value: "94.2%", ok: true },
              { label: "Error Rate (24h)", value: "0.02%", ok: true },
              { label: "Active WebSockets", value: "284", ok: true },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i<5?"1px solid rgba(255,255,255,.05)":"none" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: row.ok?"#4ade80":"#f87171" }}>{row.value}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {/* ── Reports tab ── */}
      {tab === "Reports" && (
        <GlassCard style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 }}>Manage Reports</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>View, delete, or export user-generated scan reports across all accounts.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Export All (CSV)","Export All (PDF)","Delete Old Reports"].map((btn, i) => (
              <button key={i} style={{ padding: "9px 16px", borderRadius: 10, background: i===2?"rgba(239,68,68,.1)":"rgba(37,99,235,.12)", border: `1px solid ${i===2?"rgba(239,68,68,.3)":"rgba(37,99,235,.3)"}`, color: i===2?"#f87171":"#60a5fa", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{btn}</button>
            ))}
          </div>
        </GlassCard>
      )}
    </DashboardLayout>
  );
};
export default AdminPanelPage;
