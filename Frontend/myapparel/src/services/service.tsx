import { jwtDecode } from "jwt-decode"; 
import type { JwtPayload } from "jwt-decode";


export interface TokenPayload extends JwtPayload { 
  sub: string;
  role: "user" | "admin";
  user_id?: string;
}

const TOKEN_KEY = "token";

export const jwtService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token); 
      return decoded;
    } catch (err) {
      console.error("Invalid token:", err);
      this.removeToken();
      return null;
    }
  },

  getRole(): "user" | "admin" | null {
    const payload = this.getPayload();
    return payload?.role || null;
  },

  getEmail(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null;
  },

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getRole();
  },
};