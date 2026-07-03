/**
 * ThreatIntelPage.tsx
 * PhishGuard AI — Threat Intelligence
 * Latest threats, detected domains, malicious IPs, statistics, attack trends, threat heat map
 */

import React from "react";
import {
  Radar, Globe2, Server, TrendingUp, AlertTriangle, MapPin, Clock
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface ThreatEntry {
  domain: string;
  type: string;
  severity: "critical" | "high" | "medium";
  ip: string;
  country: string;
  firstSeen: string;
}

const LATEST_THREATS: ThreatEntry[] = [
  { domain: "secure-bank-login.xyz", type: "Credential Phishing", severity: "critical", ip: "185.220.101.42", country: "RU", firstSeen: "12 min ago" },
  { domain: "paypal-secure-verify.com", type: "Brand Impersonation", severity: "critical", ip: "92.118.39.18", country: "NL", firstSeen: "34 min ago" },
  { domain: "amaz0n-rewards-claim.net", type: "Fake Rewards Scam", severity: "high", ip: "104.244.78.12", country: "US", firstSeen: "1 hr ago" },
  { domain: "office365-renewal.info", type: "Office365 Phishing", severity: "high", ip: "45.95.169.3", country: "DE", firstSeen: "2 hr ago" },
  { domain: "crypto-wallet-restore.io", type: "Crypto Wallet Scam", severity: "critical", ip: "194.36.189.77", country: "FR", firstSeen: "3 hr ago" },
  { domain: "irs-tax-refund-claim.com", type: "Tax Authority Spoof", severity: "medium", ip: "23.95.118.34", country: "US", firstSeen: "5 hr ago" },
];

const ATTACK_TREND_DATA = [
  { month: "Jan", attacks: 1240 },
  { month: "Feb", attacks: 1480 },
  { month: "Mar", attacks: 1320 },
  { month: "Apr", attacks: 1890 },
  { month: "May", attacks: 2140 },
  { month: "Jun", attacks: 1960 },
];

const HEATMAP_REGIONS = [
  { region: "North America", intensity: 78, count: "4,210" },
  { region: "Europe", intensity: 92, count: "5,890" },
  { region: "Asia Pacific", intensity: 64, count: "3,120" },
  { region: "South America", intensity: 41, count: "1,640" },
  { region: "Africa", intensity: 28, count: "980" },
  { region: "Middle East", intensity: 55, count: "2,310" },
];

const STATS = [
  { label: "Active Threats", value: "1,644", icon: <AlertTriangle size={18} />, color: "#EF4444" },
  { label: "Malicious Domains", value: "8,932", icon: <Globe2 size={18} />, color: "#F59E0B" },
  { label: "Flagged IPs", value: "3,217", icon: <Server size={18} />, color: "#8B5CF6" },
  { label: "Countries Affected", value: "47", icon: <MapPin size={18} />, color: "#0EA5E9" },
];

const SEVERITY_CFG = {
  critical: { color: "#EF4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.3)" },
  high: { color: "#F59E0B", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.3)" },
  medium: { color: "#3B82F6", bg: "rgba(59,130,246,.1)", border: "rgba(59,130,246,.3)" },
};

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#f87171", fontWeight: 600 }}>{payload[0].value.toLocaleString()} attacks</div>
    </div>
  );
};

const ThreatIntelPage: React.FC = () => {
  return (
    <DashboardLayout activePath="/dashboard/threat-intel">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Threat Intelligence</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Live feed of detected phishing campaigns, malicious infrastructure, and global attack trends</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 20 }}>
        {STATS.map((s, i) => (
          <GlassCard key={i} style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30`, flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>{s.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Attack trend chart */}
        <GlassCard style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <TrendingUp size={15} color="#60a5fa" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>Attack Trends</h3>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Monthly phishing attack volume</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={ATTACK_TREND_DATA} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" fontSize={11.5} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11.5} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
              <Bar dataKey="attacks" fill="#EF4444" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Heat map */}
        <GlassCard style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <MapPin size={15} color="#f87171" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>Threat Heat Map</h3>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Attack intensity by region</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HEATMAP_REGIONS.map((r, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, color: "#cbd5e1" }}>{r.region}</span>
                  <span style={{ fontSize: 11.5, color: "#64748b" }}>{r.count}</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${r.intensity}%`, borderRadius: 4,
                    background: r.intensity > 75 ? "linear-gradient(90deg,#EF4444,#F59E0B)" : r.intensity > 50 ? "linear-gradient(90deg,#F59E0B,#3B82F6)" : "#3B82F6",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Latest threats table */}
      <GlassCard style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Radar size={15} color="#f87171" />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>Latest Detected Threats</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Domain", "Threat Type", "Severity", "IP Address", "Origin", "First Seen"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LATEST_THREATS.map((t, i) => {
                const cfg = SEVERITY_CFG[t.severity];
                return (
                  <tr key={i} style={{ borderBottom: i < LATEST_THREATS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                    <td style={{ padding: "12px", fontSize: 12.5, color: "#e2e8f0", fontFamily: "monospace" }}>{t.domain}</td>
                    <td style={{ padding: "12px", fontSize: 12.5, color: "#94a3b8" }}>{t.type}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase",
                        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      }}>
                        {t.severity}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{t.ip}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b" }}>{t.country}</td>
                    <td style={{ padding: "12px", fontSize: 11.5, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} /> {t.firstSeen}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
};

export default ThreatIntelPage;
