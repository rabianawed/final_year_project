import api from "./api";
export const reportService = {
  getReports: (params: { from?: string; to?: string; type?: string }) => api.get("/reports", { params }),
  exportPDF: (ids: string[]) => api.post("/reports/export/pdf", { ids }, { responseType: "blob" }),
  exportCSV: (ids: string[]) => api.post("/reports/export/csv", { ids }, { responseType: "blob" }),
};
