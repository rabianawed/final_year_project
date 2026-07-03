import api from "./api";
export const scanService = {
  scanURL: (url: string) => api.post("/scan/url", { url }),
  scanEmail: (content: string) => api.post("/scan/email", { content }),
  scanWebsite: (url: string) => api.post("/scan/website", { url }),
  getHistory: (page = 1, limit = 20) => api.get(`/scan/history?page=${page}&limit=${limit}`),
};
