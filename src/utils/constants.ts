export const APP_NAME = "PhishGuard AI";
export const APP_VERSION = "2.3.1";
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2";
export const RISK_COLORS = { low:"#22C55E", medium:"#F59E0B", high:"#EF4444", critical:"#DC2626" } as const;
export const PLAN_LIMITS = { free:{ urlScans:50,emailScans:10 }, pro:{ urlScans:Infinity,emailScans:500 } } as const;
