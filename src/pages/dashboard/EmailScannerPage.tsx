/**
 * EmailScannerPage.tsx
 * PhishGuard AI — Email Scanner
 * Paste email body or upload .eml, analyze for spam score, phishing probability, extracted links, AI explanation
 */

import React, { useState, useRef } from "react";
import {
  Mail, Upload, FileText, Brain, ShieldAlert, ShieldCheck,
  Link2, Loader2, X, ArrowRight
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface EmailResult {
  spamScore: number;
  phishingProbability: number;
  prediction: "safe" | "phishing";
  extractedLinks: { url: string; risk: "safe" | "danger" }[];
  explanation: string;
  flags: string[];
}

async function fakeAnalyzeEmail(content: string): Promise<EmailResult> {
  await new Promise((r) => setTimeout(r, 2200));
  const isPhish = /urgent|verify|suspended|click here|act now|password/i.test(content);
  if (isPhish) {
    return {
      spamScore: 0.89,
      phishingProbability: 94.2,
      prediction: "phishing",
      extractedLinks: [
        { url: "http://secure-account-verify.xyz/login", risk: "danger" },
        { url: "http://bit.ly/3xK9pL2", risk: "danger" },
      ],
      explanation: "This email uses high-pressure urgency language ('act now', 'account suspended') combined with a mismatched sender domain and shortened URLs that redirect to a known phishing infrastructure pattern. NLP analysis detected 5 of 7 common phishing linguistic markers.",
      flags: ["Urgency language detected", "Sender domain mismatch", "Shortened/obfuscated URLs", "Requests credential input", "Generic greeting (no personalization)"],
    };
  }
  return {
    spamScore: 0.08,
    phishingProbability: 3.1,
    prediction: "safe",
    extractedLinks: [{ url: "https://github.com/notifications", risk: "safe" }],
    explanation: "This email shows standard transactional patterns with a verified sender domain, personalized greeting, and no urgency-based manipulation tactics. Embedded links resolve to the sender's verified domain.",
    flags: [],
  };
}

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>
    {children}
  </div>
);

const EmailScannerPage: React.FC = () => {
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setContent((e.target?.result as string) || "");
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setAnalyzing(true);
    setResult(null);
    const res = await fakeAnalyzeEmail(content);
    setResult(res);
    setAnalyzing(false);
  };

  return (
    <DashboardLayout activePath="/dashboard/email-scanner">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Email Scanner</h1>
        <p style={{ color: "#64748b", fontSize: 13 }}>Detect phishing emails using NLP-powered content analysis</p>
      </div>

      <GlassCard style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "rgba(255,255,255,.03)", padding: 4, borderRadius: 10, width: "fit-content" }}>
          {(["paste", "upload"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8,
                border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: tab === t ? "#2563EB" : "transparent",
                color: tab === t ? "#fff" : "#94a3b8",
              }}
            >
              {t === "paste" ? <FileText size={14} /> : <Upload size={14} />}
              {t === "paste" ? "Paste Email" : "Upload .eml"}
            </button>
          ))}
        </div>

        {tab === "paste" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the full email content here, including headers if available..."
            style={{
              width: "100%", height: 220, background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 16,
              color: "#f1f5f9", fontSize: 13, fontFamily: "monospace", resize: "vertical", outline: "none",
            }}
          />
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
            style={{
              height: 220, border: "2px dashed rgba(255,255,255,.15)", borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", gap: 10, background: "rgba(255,255,255,.02)",
            }}
          >
            <input ref={fileRef} type="file" accept=".eml" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
            <Upload size={28} color="#475569" />
            {fileName ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#cbd5e1" }}>{fileName}</span>
                <X size={14} color="#64748b" onClick={(e) => { e.stopPropagation(); setFileName(null); setContent(""); }} />
              </div>
            ) : (
              <>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Drag & drop your .eml file here, or click to browse</span>
                <span style={{ fontSize: 11, color: "#475569" }}>Supports .eml format up to 10MB</span>
              </>
            )}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !content.trim()}
          style={{
            marginTop: 16, display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12,
            background: "#2563EB", border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: analyzing || !content.trim() ? "not-allowed" : "pointer", opacity: analyzing || !content.trim() ? 0.6 : 1,
          }}
        >
          {analyzing ? <Loader2 size={16} className="spin" /> : <Brain size={16} />}
          {analyzing ? "Analyzing content..." : "Analyze Email"}
        </button>
      </GlassCard>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <GlassCard style={{
            padding: 22,
            background: result.prediction === "phishing" ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.08)",
            border: `1px solid ${result.prediction === "phishing" ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              {result.prediction === "phishing"
                ? <ShieldAlert size={20} color="#f87171" />
                : <ShieldCheck size={20} color="#4ade80" />}
              <span style={{ fontSize: 15, fontWeight: 700, color: result.prediction === "phishing" ? "#f87171" : "#4ade80" }}>
                {result.prediction === "phishing" ? "PHISHING DETECTED" : "EMAIL SAFE"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Spam Score</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9" }}>{(result.spamScore * 100).toFixed(0)}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>/ 100</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.spamScore * 100}%`, background: result.spamScore > 0.5 ? "#EF4444" : "#22C55E", borderRadius: 3 }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Phishing Probability</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9" }}>{result.phishingProbability}</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>%</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.phishingProbability}%`, background: result.phishingProbability > 50 ? "#EF4444" : "#22C55E", borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {result.flags.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>DETECTED INDICATORS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.flags.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#fca5a5" }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#f87171" }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Link2 size={15} color="#60a5fa" />
                <h3 style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>Extracted Links ({result.extractedLinks.length})</h3>
              </div>
              {result.extractedLinks.length === 0 ? (
                <p style={{ fontSize: 12.5, color: "#475569" }}>No links found in this email.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.extractedLinks.map((l, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      padding: "8px 12px", borderRadius: 8,
                      background: l.risk === "danger" ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.08)",
                      border: `1px solid ${l.risk === "danger" ? "rgba(239,68,68,.2)" : "rgba(34,197,94,.2)"}`,
                    }}>
                      <span style={{ fontSize: 11.5, color: "#cbd5e1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {l.url}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: l.risk === "danger" ? "#f87171" : "#4ade80", flexShrink: 0 }}>
                        {l.risk === "danger" ? "RISKY" : "SAFE"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Brain size={15} color="#a78bfa" />
                <h3 style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>AI Explanation</h3>
              </div>
              <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.7 }}>{result.explanation}</p>
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

export default EmailScannerPage;
