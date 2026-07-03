/**
 * SettingsPage.tsx
 * PhishGuard AI — Settings
 */
import React, { useState } from "react";
import { Sun, Moon, Globe, Bell, Key, Cpu, Puzzle, ChevronDown, Save } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", boxShadow: "0 4px 24px rgba(0,0,0,.25)", ...style }}>{children}</div>
);
const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", flexShrink: 0, background: enabled ? "#2563EB" : "rgba(255,255,255,.12)", position: "relative", transition: "background .2s" }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: enabled ? 20 : 2, transition: "left .2s" }} />
  </div>
);
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, color, border: `1px solid ${color}30`, flexShrink: 0 }}>{icon}</div>
    <div><div style={{ fontSize: 14.5, fontWeight: 600, color: "#f1f5f9" }}>{title}</div><div style={{ fontSize: 12, color: "#64748b" }}>{desc}</div></div>
  </div>
);
const SettingRow: React.FC<{ label: string; desc?: string; children: React.ReactNode }> = ({ label, desc, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,.05)", gap: 16 }}>
    <div><div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{label}</div>{desc && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{desc}</div>}</div>
    {children}
  </div>
);
const SelectField: React.FC<{ value: string; options: string[]; onChange: (v: string) => void }> = ({ value, options, onChange }) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ appearance: "none", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 9, padding: "7px 32px 7px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "Inter, sans-serif", cursor: "pointer", outline: "none" }}>
      {options.map((o) => <option key={o} value={o} style={{ background: "#0F172A" }}>{o}</option>)}
    </select>
    <ChevronDown size={13} color="#64748b" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
  </div>
);

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("UTC+0 (London)");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [notifPhishing, setNotifPhishing] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifThreatFeed, setNotifThreatFeed] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [apiVersion, setApiVersion] = useState("v2 (Latest)");
  const [rateLimit, setRateLimit] = useState("10,000 requests/month");
  const [modelSensitivity, setModelSensitivity] = useState("Balanced");
  const [confidenceThreshold, setConfidenceThreshold] = useState("70%");
  const [explainability, setExplainability] = useState(true);
  const [autoBlock, setAutoBlock] = useState(false);
  const [extAutoScan, setExtAutoScan] = useState(true);
  const [extBadge, setExtBadge] = useState(true);
  const [extSoundAlert, setExtSoundAlert] = useState(false);
  const [extBlockHighRisk, setExtBlockHighRisk] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DashboardLayout activePath="/dashboard/settings">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Configure your PhishGuard experience and preferences</p>
        </div>
        <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: saved ? "#16a34a" : "#2563EB", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .3s" }}>
          <Save size={14} />{saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Sun size={17} />} title="Appearance" desc="Choose your interface theme" color="#F59E0B" />
          <div style={{ display: "flex", gap: 12 }}>
            {(["dark","light"] as const).map((t) => (
              <div key={t} onClick={() => setTheme(t)} style={{ flex: 1, padding: "16px 20px", borderRadius: 12, cursor: "pointer", textAlign: "center", border: theme===t ? "1px solid rgba(37,99,235,.5)" : "1px solid rgba(255,255,255,.08)", background: theme===t ? "rgba(37,99,235,.12)" : "rgba(255,255,255,.02)", transition: "all .2s" }}>
                {t==="dark" ? <Moon size={20} color={theme===t?"#60a5fa":"#64748b"}/> : <Sun size={20} color={theme===t?"#60a5fa":"#64748b"}/>}
                <div style={{ fontSize: 12.5, fontWeight: 500, color: theme===t?"#93c5fd":"#94a3b8", marginTop: 8 }}>{t==="dark"?"Dark Mode":"Light Mode"}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Globe size={17} />} title="Language & Region" desc="Localization and display preferences" color="#0EA5E9" />
          <SettingRow label="Language" desc="Interface language"><SelectField value={language} onChange={setLanguage} options={["English (US)","English (UK)","Spanish","French","German","Arabic","Urdu"]}/></SettingRow>
          <SettingRow label="Timezone" desc="For report timestamps"><SelectField value={timezone} onChange={setTimezone} options={["UTC+0 (London)","UTC+1 (Paris)","UTC+5 (Karachi)","UTC-5 (New York)","UTC-8 (Los Angeles)"]}/></SettingRow>
          <SettingRow label="Date Format"><SelectField value={dateFormat} onChange={setDateFormat} options={["YYYY-MM-DD","DD/MM/YYYY","MM/DD/YYYY"]}/></SettingRow>
        </GlassCard>

        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Bell size={17} />} title="Notifications" desc="Control when and how you are alerted" color="#8B5CF6" />
          <SettingRow label="Phishing detected alerts" desc="Instant alert when a high-risk scan result is found"><Toggle enabled={notifPhishing} onToggle={() => setNotifPhishing(!notifPhishing)}/></SettingRow>
          <SettingRow label="Weekly scan summary" desc="Receive a weekly digest of your detection activity"><Toggle enabled={notifWeekly} onToggle={() => setNotifWeekly(!notifWeekly)}/></SettingRow>
          <SettingRow label="Threat intelligence feed updates"><Toggle enabled={notifThreatFeed} onToggle={() => setNotifThreatFeed(!notifThreatFeed)}/></SettingRow>
          <SettingRow label="Email notifications"><Toggle enabled={notifEmail} onToggle={() => setNotifEmail(!notifEmail)}/></SettingRow>
          <SettingRow label="Browser push notifications"><Toggle enabled={notifBrowser} onToggle={() => setNotifBrowser(!notifBrowser)}/></SettingRow>
        </GlassCard>

        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Key size={17} />} title="API Settings" desc="Control API version and rate limits" color="#22C55E" />
          <SettingRow label="API Version"><SelectField value={apiVersion} onChange={setApiVersion} options={["v2 (Latest)","v1 (Legacy)"]}/></SettingRow>
          <SettingRow label="Rate limit tier" desc="Your current plan allocation"><SelectField value={rateLimit} onChange={setRateLimit} options={["10,000 requests/month","50,000 requests/month","Unlimited"]}/></SettingRow>
          <SettingRow label="Webhook URL" desc="Send scan results to your endpoint">
            <input placeholder="https://your-server.com/webhook" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, padding: "7px 12px", color: "#f1f5f9", fontSize: 12.5, outline: "none", fontFamily: "monospace", width: 260 }}/>
          </SettingRow>
        </GlassCard>

        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Cpu size={17} />} title="Model Settings" desc="Tune the AI detection engine to your needs" color="#EF4444" />
          <SettingRow label="Detection sensitivity" desc="Higher sensitivity reduces false negatives but may increase false positives"><SelectField value={modelSensitivity} onChange={setModelSensitivity} options={["Strict (Low FP)","Balanced","Aggressive (Low FN)"]}/></SettingRow>
          <SettingRow label="Confidence threshold" desc="Minimum confidence required to flag content as phishing"><SelectField value={confidenceThreshold} onChange={setConfidenceThreshold} options={["50%","60%","70%","80%","90%"]}/></SettingRow>
          <SettingRow label="AI Explanations" desc="Include explainability output in scan results"><Toggle enabled={explainability} onToggle={() => setExplainability(!explainability)}/></SettingRow>
          <SettingRow label="Auto-block high-risk URLs" desc="Automatically block URLs scoring above 90/100"><Toggle enabled={autoBlock} onToggle={() => setAutoBlock(!autoBlock)}/></SettingRow>
        </GlassCard>

        <GlassCard style={{ padding: 22 }}>
          <SectionHeader icon={<Puzzle size={17} />} title="Browser Extension" desc="Configure the PhishGuard Chrome/Firefox extension" color="#60a5fa" />
          <SettingRow label="Auto-scan pages on load" desc="Silently scan every page you visit in real-time"><Toggle enabled={extAutoScan} onToggle={() => setExtAutoScan(!extAutoScan)}/></SettingRow>
          <SettingRow label="Show safety badge in toolbar"><Toggle enabled={extBadge} onToggle={() => setExtBadge(!extBadge)}/></SettingRow>
          <SettingRow label="Sound alert on threat detection"><Toggle enabled={extSoundAlert} onToggle={() => setExtSoundAlert(!extSoundAlert)}/></SettingRow>
          <SettingRow label="Block high-risk sites (score > 85)" desc="Intercept navigation to flagged pages with a warning screen"><Toggle enabled={extBlockHighRisk} onToggle={() => setExtBlockHighRisk(!extBlockHighRisk)}/></SettingRow>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};
export default SettingsPage;
