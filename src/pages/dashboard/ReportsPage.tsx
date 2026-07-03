/**
 * ReportsPage.tsx
 * PhishGuard AI — Reports
 * Download PDF/CSV, filter by date, search, statistics
 */

import React, { useState, useMemo } from "react";
import {
  FileText, Download, Search, Calendar, FileSpreadsheet,
  ShieldAlert, ShieldCheck, TrendingUp, Filter
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface ReportRow {
  id: string;
  target: string;
  type: "URL" | "Email" | "Website";
  verdict: "safe" | "phishing" | "suspicious";
  riskScore: number;
  date: string;
}

const REPORT_DATA: ReportRow[] = [
  { id: "SC-9284", target: "secure-bank-login.xyz/verify", type: "URL", verdict: "phishing", riskScore: 94, date: "2026-06-29" },
  { id: "SC-9283", target: "github.com/anthropics/claude", type: "URL", verdict: "safe", riskScore: 2, date: "2026-06-29" },
  { id: "SC-9282", target: "Urgent: Account Suspended", type: "Email", verdict: "phishing", riskScore: 91, date: "2026-06-28" },
  { id: "SC-9281", target: "paypal-secure-verify.com", type: "Website", verdict: "phishing", riskScore: 98, date: "2026-06-28" },
  { id: "SC-9280", target: "amaz0n-rewards-claim.net", type: "URL", verdict: "suspicious", riskScore: 61, date: "2026-06-27" },
  { id: "SC-9279", target: "stripe.com/dashboard", type: "Website", verdict: "safe", riskScore: 3, date: "2026-06-27" },
  { id: "SC-9278", target: "Quarterly Newsletter", type: "Email", verdict: "safe", riskScore: 5, date: "2026-06-26" },
  { id: "SC-9277", target: "office365-renewal.info", type: "URL", verdict: "phishing", riskScore: 87, date: "2026-06-25" },
];

const VERDICT_CFG = {
  safe: { color: "#22C55E", bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.3)", icon: <ShieldCheck size={12} /> },
  phishing: { color: "#EF4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.3)", icon: <ShieldAlert size={12} /> },
  suspicious: { color: "#F59E0B", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.3)", icon: <ShieldAlert size={12} /> },
};

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

const ReportsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "URL" | "Email" | "Website">("all");
  const [dateFrom, setDateFrom] = useState("2026-06-20");
  const [dateTo, setDateTo] = useState("2026-06-29");

  const filtered = useMemo(() => {
    return REPORT_DATA.filter((r) => {
      const matchesSearch = r.target.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || r.type === typeFilter;
      const matchesDate = r.date >= dateFrom && r.date <= dateTo;
      return matchesSearch && matchesType && matchesDate;
    });
  }, [search, typeFilter, dateFrom, dateTo]);

  const totalScans = filtered.length;
  const threatsFound = filtered.filter((r) => r.verdict !== "safe").length;
  const avgRisk = filtered.length ? Math.round(filtered.reduce((a, r) => a + r.riskScore, 0) / filtered.length) : 0;

  const handleExport = (format: "PDF" | "CSV") => {
    alert(`Exporting ${filtered.length} records as ${format}... (connect to backend export endpoint)`);
  };

  return (
    <DashboardLayout activePath="/dashboard/reports">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Reports</h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Export and review historical scan data</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleExport("PDF")} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10,
            background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <FileText size={14} /> Download PDF
          </button>
          <button onClick={() => handleExport("CSV")} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10,
            background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#4ade80",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <FileSpreadsheet size={14} /> Download CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
        <GlassCard style={{ padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>{totalScans}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Total scans in range</div>
        </GlassCard>
        <GlassCard style={{ padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>{threatsFound}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Threats identified</div>
        </GlassCard>
        <GlassCard style={{ padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>{avgRisk}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Average risk score</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px", flex: 1, minWidth: 200,
          }}>
            <Search size={14} color="#475569" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by target or scan ID..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px" }}>
            <Calendar size={13} color="#475569" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: "#cbd5e1", fontSize: 12.5, colorScheme: "dark" }} />
            <span style={{ color: "#475569", fontSize: 12 }}>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: "#cbd5e1", fontSize: 12.5, colorScheme: "dark" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={13} color="#475569" />
            {(["all", "URL", "Email", "Website"] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                border: typeFilter === t ? "1px solid rgba(37,99,235,.4)" : "1px solid rgba(255,255,255,.08)",
                background: typeFilter === t ? "rgba(37,99,235,.15)" : "transparent",
                color: typeFilter === t ? "#93c5fd" : "#64748b",
              }}>
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Results table */}
      <GlassCard style={{ padding: 20 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Scan ID", "Target", "Type", "Verdict", "Risk Score", "Date"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const cfg = VERDICT_CFG[r.verdict];
                return (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{r.id}</td>
                    <td style={{ padding: "12px", fontSize: 12.5, color: "#e2e8f0", fontFamily: "monospace", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.target}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>{r.type}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase",
                        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      }}>
                        {cfg.icon} {r.verdict}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 12.5, color: "#e2e8f0", fontWeight: 600 }}>{r.riskScore}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b" }}>{r.date}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#475569", fontSize: 13 }}>No reports match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
};

export default ReportsPage;
