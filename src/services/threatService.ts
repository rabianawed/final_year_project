import api from "./api";
export const threatService = {
  getLatestThreats: () => api.get("/threats/latest"),
  getMaliciousDomains: () => api.get("/threats/domains"),
  getMaliciousIPs: () => api.get("/threats/ips"),
  getStats: () => api.get("/threats/stats"),
};
