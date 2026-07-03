/**
 * ExtensionPopup.tsx
 * PhishGuard AI — Browser Extension Popup (380x580px)
 * Scan current website, safety status, threat warning, safe badge, scan history, settings link
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw,
  Clock, Settings, ExternalLink, Loader2, Lock, Calendar, Globe
} from "lucide-react";

interface ScanResult {
  verdict: "safe" | "phishing" | "suspicious";
  riskScore: number;
  domain: string;
  ssl: boolean;
  domainAge: string;
  confidence: number;
}

const HISTORY: { domain: string; verdict: "safe"|"phishing"|"suspicious"; time: string }[] = [
  { domain: "github.com", verdict: "safe", time: "2m ago" },
  { domain: "secure-bank-login.xyz", verdict: "phishing", time: "14m ago" },
  { domain: "stripe.com", verdict: "safe", time: "1hr ago" },
  { domain: "amaz0n-claim.net", verdict: "suspicious", time: "2hr ago" },
];

async function fakeScan(domain: string): Promise<ScanResult> {
  await new Promise(r => setTimeout(r, 1800));
  const isPhish = /secure|verify|login|claim/i.test(domain) && !/github|stripe/i.test(domain);
  return isPhish
    ? { verdict: "phishing", riskScore: 93, domain, ssl: false, domainAge: "3 days", confidence: 96.2 }
    : { verdict: "safe", riskScore: 4, domain, ssl: true, domainAge: "12 years", confidence: 98.9 };
}

const VERDICT_CFG = {
  safe:       { color: "#22C55E", bg: "rgba(34,197,94,.12)",  border: "rgba(34,197,94,.3)",  icon: "✓", label: "SAFE" },
  phishing:   { color: "#EF4444", bg: "rgba(239,68,68,.12)",  border: "rgba(239,68,68,.3)",  icon: "⚠", label: "PHISHING" },
  suspicious: { color: "#F59E0B", bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.3)", icon: "?", label: "SUSPICIOUS" },
};

const ExtensionPopup: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [currentDomain] = useState("example-website.com");

  const handleScan = async () => {
    setScanning(true);
    setResult(null);
    const res = await fakeScan(currentDomain);
    setResult(res);
    setScanning(false);
  };

  const cfg = result ? VERDICT_CFG[result.verdict] : null;

  return (
    <div style={{
      width: 380, minHeight: 540, background: "#0F172A", fontFamily: "Inter, sans-serif",
      border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,.6)",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,.2), rgba(124,58,237,.2))",
        borderBottom: "1px solid rgba(255,255,255,.08)", padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🛡</div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Phish<span style={{ color: "#60a5fa" }}>Guard</span></span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#4ade80", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", borderRadius: 99, padding: "3px 9px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Active
          </span>
          <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}>
            <Settings size={15} />
          </button>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Current page */}
        <div style={{
          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 10, padding: "10px 12px", marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Globe size={13} color="#475569" />
            <span style={{ fontSize: 12.5, color: "#cbd5e1", fontFamily: "monospace" }}>{currentDomain}</span>
          </div>
          <ExternalLink size={12} color="#475569" />
        </div>

        {/* Main scan button / result area */}
        {!result && !scanning && (
          <button
            onClick={handleScan}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#7C3AED)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14,
            }}
          >
            <Shield size={16} /> Scan Current Website
          </button>
        )}

        {scanning && (
          <div style={{
            width: "100%", padding: "18px", borderRadius: 12, background: "rgba(37,99,235,.08)",
            border: "1px solid rgba(37,99,235,.25)", marginBottom: 14, textAlign: "center",
          }}>
            <Loader2 size={24} color="#60a5fa" style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 500 }}>Analyzing website...</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Running 212 feature checks</div>
          </div>
        )}

        {result && cfg && (
          <div style={{
            borderRadius: 12, padding: 16, marginBottom: 14,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
          }}>
            {/* Verdict badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: `${cfg.color}20`,
                border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {cfg.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: cfg.color }}>{cfg.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>Confidence {result.confidence}%</div>
              </div>
              <div style={{
                marginLeft: "auto", textAlign: "center", background: `${cfg.color}18`,
                border: `1px solid ${cfg.border}`, borderRadius: 10, padding: "6px 12px",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{result.riskScore}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", textTransform: "uppercase" }}>Risk</div>
              </div>
            </div>

            {/* Site info rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.5)" }}>
                  <Lock size={11} /> SSL Certificate
                </span>
                <span style={{ fontWeight: 600, color: result.ssl ? "#4ade80" : "#f87171" }}>
                  {result.ssl ? "Valid ✓" : "Invalid ✗"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.5)" }}>
                  <Calendar size={11} /> Domain Age
                </span>
                <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{result.domainAge}</span>
              </div>
            </div>

            {/* Warning banner for phishing */}
            {result.verdict === "phishing" && (
              <div style={{
                marginTop: 12, padding: "9px 12px", borderRadius: 9,
                background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)",
                fontSize: 11.5, color: "#fca5a5", lineHeight: 1.5,
              }}>
                ⛔ This site shows strong phishing indicators. Do not enter any credentials or personal information.
              </div>
            )}

            <button
              onClick={handleScan}
              style={{
                marginTop: 12, width: "100%", padding: "8px", borderRadius: 9,
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                color: "#cbd5e1", fontSize: 12, fontWeight: 500, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              <RefreshCw size={12} /> Re-scan
            </button>
          </div>
        )}

        {/* Scan history */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
            Recent History
          </div>
          {HISTORY.map((h, i) => {
            const hCfg = VERDICT_CFG[h.verdict];
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                borderBottom: i < HISTORY.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
              }}>
                <span style={{ fontSize: 12, color: hCfg.color, flexShrink: 0 }}>{hCfg.icon}</span>
                <span style={{ flex: 1, fontSize: 12, color: "#cbd5e1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.domain}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: hCfg.bg, color: hCfg.color, border: `1px solid ${hCfg.border}`, flexShrink: 0 }}>{h.verdict}</span>
                <span style={{ fontSize: 10.5, color: "#334155", flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}><Clock size={10}/>{h.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,.06)", padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,.02)",
      }}>
        <span style={{ fontSize: 11, color: "#334155" }}>PhishGuard v2.3.1</span>
        <Link to="/dashboard" style={{ fontSize: 11, color: "#60a5fa", textDecoration: "none" }}>Open Dashboard →</Link>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default ExtensionPopup;
