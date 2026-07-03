/**
 * WebsiteScannerPage.tsx
 * PhishGuard AI — Website Scanner
 * Enter URL, live screenshot, SSL status, domain age, risk meter, AI prediction
 */

import React, { useState } from "react";
import {
  Globe, Search, Loader2, Lock, Unlock, Calendar, ShieldCheck,
  ShieldAlert, Server, Brain, ExternalLink
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface WebsiteResult {
  url: string;
  prediction: "safe" | "phishing";
  riskScore: number;
  ssl: { valid: boolean; issuer: string; expires: string };
  domainAge: string;
  registrar: string;
  explanation: string;
}

async function fakeScanWebsite(url: string): Promise<WebsiteResult> {
  await new Promise((r) => setTimeout(r, 2400));
  const isPhish = /secure|verify|login|bank|claim/i.test(url) && !/stripe|github/i.test(url);
  if (isPhish) {
    return {
      url, prediction: "phishing", riskScore: 89,
      ssl: { valid: false, issuer: "Self-signed", expires: "N/A" },
      domainAge: "3 days",
      registrar: "NameCheap (privacy protected)",
      explanation: "This website was registered 3 days ago and uses a self-signed SSL certificate rather than a certificate from a trusted authority. Visual layout analysis shows strong similarity to a known financial institution's login page, suggesting brand impersonation.",
    };
  }
  return {
    url, prediction: "safe", riskScore: 5,
    ssl: { valid: true, issuer: "DigiCert EV", expires: "Mar 2027" },
    domainAge: "14 years, 3 months",
    registrar: "MarkMonitor Inc.",
    explanation: "This website has a long-established domain history, a valid Extended Validation SSL certificate, and consistent branding with no detected visual impersonation patterns.",
  };
}

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

const RiskMeter: React.FC<{ score: number; color: string }> = ({ score, color }) => {
  const r = 48, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 118, height: 118 }}>
      <svg width="118" height="118" viewBox="0 0 118 118">
        <circle cx="59" cy="59" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10" />
        <circle cx="59" cy="59" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 59 59)"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc" }}>{score}</span>
        <span style={{ fontSize: 9, color: "#64748b" }}>/ 100</span>
      </div>
    </div>
  );
};

/** Fake browser chrome with mock screenshot illustration */
const LiveScreenshot: React.FC<{ url: string; verdict: "safe" | "phishing" }> = ({ url, verdict }) => (
  <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)" }}>
    {/* Browser chrome */}
    <div style={{ background: "#1e293b", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 5 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef444499" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b99" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e99" }} />
      </div>
      <div style={{
        flex: 1, background: "rgba(0,0,0,.25)", borderRadius: 6, padding: "4px 10px",
        fontSize: 11, color: "#94a3b8", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {verdict === "phishing" ? "⚠ " : "🔒 "}{url}
      </div>
    </div>
    {/* Mock page render */}
    <div style={{
      height: 240, background: verdict === "phishing" ? "linear-gradient(145deg,#1c1014,#0f0a0c)" : "linear-gradient(145deg,#0f1729,#0a1120)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative",
    }}>
      {verdict === "phishing" && (
        <div style={{
          position: "absolute", top: 12, right: 12, background: "rgba(239,68,68,.15)",
          border: "1px solid rgba(239,68,68,.4)", borderRadius: 8, padding: "5px 10px",
          fontSize: 10, color: "#f87171", fontWeight: 700,
        }}>
          ⚠ THREAT DETECTED
        </div>
      )}
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: verdict === "phishing" ? "rgba(239,68,68,.12)" : "rgba(37,99,235,.12)",
        border: `1px solid ${verdict === "phishing" ? "rgba(239,68,68,.3)" : "rgba(37,99,235,.3)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {verdict === "phishing" ? <ShieldAlert size={28} color="#f87171" /> : <Globe size={28} color="#60a5fa" />}
      </div>
      <div style={{ width: 180, height: 8, borderRadius: 4, background: "rgba(255,255,255,.08)" }} />
      <div style={{ width: 130, height: 8, borderRadius: 4, background: "rgba(255,255,255,.06)" }} />
      <div style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>Live screenshot capture · rendered headlessly</div>
    </div>
  </div>
);

const WebsiteScannerPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<WebsiteResult | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    const res = await fakeScanWebsite(url.trim());
    setResult(res);
    setScanning(false);
  };

  return (
    <DashboardLayout activePath="/dashboard/website-scanner">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Website Scanner</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Live screenshot analysis with SSL, domain, and visual impersonation detection</p>
      </div>

      <GlassCard style={{ padding: 24, marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 10 }}>
          Enter a website address
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <Globe size={17} color="#475569" />
            <input
              value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="example.com"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, fontFamily: "monospace" }}
            />
          </div>
          <button
            onClick={handleScan} disabled={scanning || !url.trim()}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "0 24px", borderRadius: 12,
              background: "#2563EB", border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: scanning || !url.trim() ? "not-allowed" : "pointer", opacity: scanning || !url.trim() ? 0.6 : 1,
            }}
          >
            {scanning ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
            {scanning ? "Capturing & analyzing..." : "Scan Website"}
          </button>
        </div>
      </GlassCard>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          {/* Screenshot */}
          <GlassCard style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 12 }}>Live Screenshot</h3>
            <LiveScreenshot url={result.url} verdict={result.prediction} />
          </GlassCard>

          {/* Security panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard style={{
              padding: 20,
              background: result.prediction === "phishing" ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.08)",
              border: `1px solid ${result.prediction === "phishing" ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)"}`,
              display: "flex", alignItems: "center", gap: 18,
            }}>
              <RiskMeter score={result.riskScore} color={result.prediction === "phishing" ? "#EF4444" : "#22C55E"} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  {result.prediction === "phishing" ? <ShieldAlert size={16} color="#f87171" /> : <ShieldCheck size={16} color="#4ade80" />}
                  <span style={{ fontSize: 13, fontWeight: 700, color: result.prediction === "phishing" ? "#f87171" : "#4ade80" }}>
                    {result.prediction === "phishing" ? "PHISHING SITE" : "SAFE WEBSITE"}
                  </span>
                </div>
                <p style={{ fontSize: 11.5, color: "#64748b" }}>AI Prediction · Risk Score {result.riskScore}/100</p>
              </div>
            </GlassCard>

            <GlassCard style={{ padding: 20 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", marginBottom: 14 }}>Security Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {result.ssl.valid ? <Lock size={14} color="#4ade80" /> : <Unlock size={14} color="#f87171" />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#cbd5e1" }}>SSL Certificate</div>
                    <div style={{ fontSize: 11, color: result.ssl.valid ? "#4ade80" : "#f87171" }}>
                      {result.ssl.valid ? `Valid — ${result.ssl.issuer}` : "Invalid — " + result.ssl.issuer}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Calendar size={14} color="#60a5fa" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#cbd5e1" }}>Domain Age</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{result.domainAge}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Server size={14} color="#a78bfa" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#cbd5e1" }}>Registrar</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{result.registrar}</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Brain size={15} color="#a78bfa" />
                <h3 style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>AI Explanation</h3>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{result.explanation}</p>
            </GlassCard>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </DashboardLayout>
  );
};

export default WebsiteScannerPage;
