export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { fullName: string; email: string; password: string }
export interface AuthUser { id: string; name: string; email: string; plan: "free"|"pro"|"enterprise"; role: "user"|"admin" }
export interface AuthResponse { token: string; user: AuthUser }
