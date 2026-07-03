export const isValidURL = (url: string): boolean => {
  try { new URL(url.startsWith("http") ? url : `https://${url}`); return true; } catch { return false; }
};
export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isStrongPassword = (pw: string): boolean => pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
