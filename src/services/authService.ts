import api from "./api";
export const authService = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (data: { fullName:string; email:string; password:string }) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};
