/**
 * DashboardPage.tsx
 * PhishGuard AI — Dashboard Overview
 * Stat cards, threat trend chart, scan distribution donut, recent activity feed
 */

import React from "react";
import {
  Link2, Mail, ShieldCheck, ShieldAlert, Target, Cpu,
  TrendingUp, TrendingDown, ArrowUpRight, Clock, AlertTriangle, CheckCircle2
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
}

const STAT_CARDS: StatCard[] = [
  { label: "Total URLs Scanned", value: "12,847", change: "+12.4%", trend: "up", positive: true, icon: <Link2 size={18} />, accent: "#2563EB" },
  { label: "Safe URLs", value: "11,203", change: "+9.1%", trend: "up", positive: true, icon: <ShieldCheck size={18} />, accent: "#22C55E" },
  { label: "Phishing URLs", value: "1,644", change: "+3.2%", trend: "up", positive: false, icon: <ShieldAlert size={18} />, accent: "#EF4444" },
  { label: "Emails Scanned", value: "4,392", change: "+18.7%", trend: "up", positive: true, icon: <Mail size={18} />, accent: "#8B5CF6" },
  { label: "Threat Score (avg)", value: "23.4", change: "-5.8%", trend: "down", positive: true, icon: <Target size={18} />, accent: "#F59E0B" },
  { label: "Model Accuracy", value: "99.2%", change: "+0.3%", trend: "up", positive: true, icon: <Cpu size={18} />, accent: "#0EA5E9" },
];

const TREND_DATA = [
  { day: "Mon", safe: 1240, phishing: 180 },
  { day: "Tue", safe: 1380, phishing: 210 },
  { day: "Wed", safe: 1190, phishing: 290 },
  { day: "Thu", safe: 1520, phishing: 160 },
  { day: "Fri", safe: 1610, phishing: 240 },
  { day: "Sat", safe: 980, phishing: 130 },
  { day: "Sun", safe: 870, phishing: 110 },
];

const DISTRIBUTION_DATA = [
  { name: "URLs", value: 12847, color: "#2563EB" },
  { name: "Emails", value: 4392, color: "#8B5CF6" },
  { name: "Websites", value: 2156, color: "#22C55E" },
];

interface Activity {
  type: "phishing" | "safe" | "scan" | "warning";
  title: string;
  detail: string;
  time: string;
}

const RECENT_ACTIVITY: Activity[] = [
  { type: "phishing", title: "Phishing URL detected", detail: "secure-bank-login.xyz/verify — Risk 94/100", time: "2 minutes ago" },
  { type: "safe", title: "URL verified safe", detail: "github.com/anthropics/claude — Risk 2/100", time: "8 minutes ago" },
  { type: "warning", title: "Suspicious email flagged", detail: "Urgent: Account Suspended — Spam score 0.87", time: "15 minutes ago" },
  { type: "phishing", title: "Phishing URL detected", detail: "paypal-secure-verify.com — Risk 98/100", time: "23 minutes ago" },
  { type: "safe", title: "Website scan completed", detail: "stripe.com — SSL valid, domain age 14yr", time: "41 minutes ago" },
  { type: "scan", title: "Bulk scan completed", detail: "247 URLs processed — 12 flagged", time: "1 hour ago" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)",
    boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style,
  }}>
    {children}
  </div>
);

const StatCardView: React.FC<{ stat: StatCard }> = ({ stat }) => (
  <GlassCard style={{ padding: 18 }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: `${stat.accent}18`, color: stat.accent, border: `1px solid ${stat.accent}30`,
      }}>
        {stat.icon}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, fontWeight: 600,
        color: stat.positive ? "#4ade80" : "#f87171",
      }}>
        {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {stat.change}
      </div>
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", marginBottom: 3 }}>{stat.value}</div>
    <div style={{ fontSize: 12, color: "#64748b" }}>{stat.label}</div>
  </GlassCard>
);

const ACTIVITY_CONFIG = {
  phishing: { icon: <ShieldAlert size={14} />, color: "#ef4444", bg: "rgba(239,68,68,.12)" },
  safe: { icon: <CheckCircle2 size={14} />, color: "#22c55e", bg: "rgba(34,197,94,.12)" },
  warning: { icon: <AlertTriangle size={14} />, color: "#f59e0b", bg: "rgba(245,158,11,.12)" },
  scan: { icon: <Link2 size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,.12)" },
};

const ActivityRow: React.FC<{ activity: Activity }> = ({ activity }) => {
  const cfg = ACTIVITY_CONFIG[activity.type];
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: cfg.bg, color: cfg.color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, marginBottom: 2 }}>{activity.title}</div>
        <div style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {activity.detail}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#334155", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <Clock size={11} /> {activity.time}
      </div>
    </div>
  );
};

// Custom tooltip for charts
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F172A", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10,
      padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: p.color, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color }} />
          {p.name}: {p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout activePath="/dashboard">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Dashboard Overview</h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Real-time threat detection summary — last updated just now</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/dashboard/url-scanner" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10,
            background: "#2563EB", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>
            New Scan <ArrowUpRight size={14} />
          </a>
          <a href="/dashboard/reports" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10,
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            color: "#cbd5e1", fontSize: 13, fontWeight: 500, textDecoration: "none",
          }}>
            View Reports
          </a>
        </div>
      </div>

      {/* Stat cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 20 }}>
        {STAT_CARDS.map((s, i) => <StatCardView key={i} stat={s} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Threat trend chart */}
        <GlassCard style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Weekly Threat Trend</h3>
              <p style={{ color: "#64748b", fontSize: 12 }}>Safe vs. phishing detections over the last 7 days</p>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "#2563EB" }} /> Safe
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "#EF4444" }} /> Phishing
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={TREND_DATA} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="phishGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={11.5} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11.5} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="safe" name="Safe" stroke="#2563EB" strokeWidth={2} fill="url(#safeGrad)" />
              <Area type="monotone" dataKey="phishing" name="Phishing" stroke="#EF4444" strokeWidth={2} fill="url(#phishGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Distribution donut */}
        <GlassCard style={{ padding: 20 }}>
          <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Scan Distribution</h3>
          <p style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>By content type</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={DISTRIBUTION_DATA} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}
              >
                {DISTRIBUTION_DATA.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {DISTRIBUTION_DATA.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94a3b8" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} /> {d.name}
                </div>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent activity */}
      <GlassCard style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600 }}>Recent Activity</h3>
          <a href="/dashboard/reports" style={{ color: "#60a5fa", fontSize: 12.5, textDecoration: "none" }}>View all →</a>
        </div>
        <div>
          {RECENT_ACTIVITY.map((a, i) => <ActivityRow key={i} activity={a} />)}
        </div>
      </GlassCard>
    </DashboardLayout>
  );
};

export default DashboardPage;
