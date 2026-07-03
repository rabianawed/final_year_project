/**
 * URLScannerPage.tsx
 * PhishGuard AI — URL Scanner
 * Large input, scan button, loading animation, results with confidence/risk/AI explanation, recent history
 */

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Link2, Search, ShieldCheck, ShieldAlert, AlertTriangle, Clock,
  Brain, Activity, ExternalLink, Loader2
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface ScanResult {
  url: string;
  prediction: "safe" | "phishing" | "suspicious";
  confidence: number;
  riskScore: number;
  features: { label: string; value: string; flag: boolean }[];
  explanation: string;
}

interface HistoryItem {
  url: string;
  prediction: "safe" | "phishing" | "suspicious";
  riskScore: number;
  time: string;
}

const HISTORY: HistoryItem[] = [
  { url: "secure-bank-login.xyz/verify", prediction: "phishing", riskScore: 94, time: "2 min ago" },
  { url: "github.com/anthropics/claude", prediction: "safe", riskScore: 2, time: "8 min ago" },
  { url: "paypal-secure-verify.com", prediction: "phishing", riskScore: 98, time: "23 min ago" },
  { url: "amaz0n-rewards-claim.net", prediction: "suspicious", riskScore: 61, time: "1 hr ago" },
  { url: "stripe.com/dashboard", prediction: "safe", riskScore: 3, time: "2 hr ago" },
];

async function fakeScanURL(url: string): Promise<ScanResult> {
  await new Promise((r) => setTimeout(r, 2000));
  const isPhish = /secure|verify|login|bank|claim|reward/i.test(url) && !/github|stripe/i.test(url);
  if (isPhish) {
    return {
      url, prediction: "phishing", confidence: 96.4, riskScore: 91,
      features: [
        { label: "Domain age", value: "3 days", flag: true },
        { label: "TLD reputation", value: "Suspicious (.xyz)", flag: true },
        { label: "SSL certificate", value: "Self-signed", flag: true },
        { label: "URL length", value: "87 characters", flag: true },
        { label: "Subdomain count", value: "3 (excessive)", flag: true },
        { label: "Brand impersonation", value: "Detected", flag: true },
      ],
      explanation: "This URL exhibits multiple high-risk indicators: a newly registered domain (3 days old), suspicious top-level domain, self-signed SSL certificate, and lexical patterns consistent with brand impersonation. The ensemble model assigns 96.4% confidence to phishing classification based on 212 extracted features.",
    };
  }
  return {
    url, prediction: "safe", confidence: 98.7, riskScore: 4,
    features: [
      { label: "Domain age", value: "14+ years", flag: false },
      { label: "TLD reputation", value: "Trusted (.com)", flag: false },
      { label: "SSL certificate", value: "Valid (EV)", flag: false },
      { label: "URL length", value: "24 characters", flag: false },
      { label: "Subdomain count", value: "1 (normal)", flag: false },
      { label: "Brand impersonation", value: "None detected", flag: false },
    ],
    explanation: "This URL shows no significant risk indicators. The domain has a long, established history, valid SSL certification, and standard URL structure consistent with legitimate websites. The model assigns high confidence (98.7%) to a safe classification.",
  };
}

const VERDICT_CONFIG = {
  safe: { color: "#22C55E", bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.3)", icon: <ShieldCheck size={22} />, label: "SAFE" },
  phishing: { color: "#EF4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.3)", icon: <ShieldAlert size={22} />, label: "PHISHING DETECTED" },
  suspicious: { color: "#F59E0B", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.3)", icon: <AlertTriangle size={22} />, label: "SUSPICIOUS" },
};

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

/** Circular risk meter */
const RiskMeter: React.FC<{ score: number; color: string }> = ({ score, color }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc" }}>{score}</span>
        <span style={{ fontSize: 10, color: "#64748b" }}>/ 100</span>
      </div>
    </div>
  );
};

const URLScannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setUrl(q);
  }, [searchParams]);

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    const res = await fakeScanURL(url.trim());
    setResult(res);
    setScanning(false);
  };

  return (
    <DashboardLayout activePath="/dashboard/url-scanner">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>URL Scanner</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Analyze any URL for phishing indicators using our ensemble ML models</p>
      </div>

      {/* Scan input */}
      <GlassCard style={{ padding: 24, marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 10 }}>
          Enter a URL to analyze
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <Link2 size={17} color="#475569" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="https://example.com/suspicious-link"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, fontFamily: "monospace" }}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "0 24px", borderRadius: 12,
              background: "#2563EB", border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: scanning || !url.trim() ? "not-allowed" : "pointer", opacity: scanning || !url.trim() ? 0.6 : 1,
            }}
          >
            {scanning ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
            {scanning ? "Scanning..." : "Scan URL"}
          </button>
        </div>

        {/* Loading state */}
        {scanning && (
          <div style={{ marginTop: 20, padding: 16, background: "rgba(37,99,235,.06)", border: "1px solid rgba(37,99,235,.2)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Activity size={15} color="#60a5fa" className="pulse" />
              <span style={{ fontSize: 13, color: "#93c5fd" }}>Extracting features and running ensemble classifiers...</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
              <div className="loading-bar" style={{ height: "100%", background: "linear-gradient(90deg, #2563EB, #7C3AED)", borderRadius: 2 }} />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Results */}
      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, marginBottom: 20 }}>
          {/* Verdict card */}
          <GlassCard style={{
            padding: 24, background: VERDICT_CONFIG[result.prediction].bg,
            border: `1px solid ${VERDICT_CONFIG[result.prediction].border}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ color: VERDICT_CONFIG[result.prediction].color, marginBottom: 10 }}>
                {VERDICT_CONFIG[result.prediction].icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: VERDICT_CONFIG[result.prediction].color, marginBottom: 4 }}>
                {VERDICT_CONFIG[result.prediction].label}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 20, wordBreak: "break-all", maxWidth: 220 }}>{result.url}</div>

              <RiskMeter score={result.riskScore} color={VERDICT_CONFIG[result.prediction].color} />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Risk Score</div>

              <div style={{ display: "flex", gap: 20, marginTop: 18, width: "100%" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{result.confidence}%</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Confidence</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,.08)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{result.prediction === "safe" ? "Low" : "High"}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Severity</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* AI explanation */}
            <GlassCard style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Brain size={16} color="#a78bfa" />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>AI Explanation</h3>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{result.explanation}</p>
            </GlassCard>

            {/* Feature breakdown */}
            <GlassCard style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 14 }}>Detection Features</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {result.features.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 12px", borderRadius: 9,
                    background: f.flag ? "rgba(239,68,68,.07)" : "rgba(34,197,94,.07)",
                    border: `1px solid ${f.flag ? "rgba(239,68,68,.18)" : "rgba(34,197,94,.18)"}`,
                  }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{f.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: f.flag ? "#f87171" : "#4ade80" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Recent scan history */}
      <GlassCard style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 14 }}>Recent Scan History</h3>
        <div>
          {HISTORY.map((h, i) => {
            const cfg = VERDICT_CONFIG[h.prediction];
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
                borderBottom: i < HISTORY.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
              }}>
                <div style={{ color: cfg.color, flexShrink: 0 }}>{React.cloneElement(cfg.icon, { size: 16 })}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e2e8f0", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {h.url}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                  color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, flexShrink: 0,
                }}>
                  Risk {h.riskScore}
                </span>
                <div style={{ fontSize: 11, color: "#334155", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, width: 80 }}>
                  <Clock size={11} /> {h.time}
                </div>
                <ExternalLink size={13} color="#334155" style={{ flexShrink: 0, cursor: "pointer" }} />
              </div>
            );
          })}
        </div>
      </GlassCard>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .loading-bar { width: 40%; animation: loadingSlide 1.2s ease-in-out infinite; }
        @keyframes loadingSlide { 0%{margin-left:0%} 50%{margin-left:60%} 100%{margin-left:0%} }
      `}</style>
    </DashboardLayout>
  );
};

export default URLScannerPage;
