// ─── Centralized API Configuration ───────────────────────────────────────────
//
//  Development  → reads from .env.development  (localhost)
//  Production   → reads from .env.production   (Render URLs)
//
//  Vite bakes VITE_* variables into the bundle at build time.
//  Never use hardcoded IPs or localhost in fallbacks here.
// ─────────────────────────────────────────────────────────────────────────────

export const API_URL       = import.meta.env.VITE_API_URL;
export const AUTH_API_URL  = import.meta.env.VITE_AUTH_API_URL;
export const CHAT_API_URL  = import.meta.env.VITE_CHAT_API_URL;
export const CNIC_API_URL  = import.meta.env.VITE_CNIC_API_URL;
export const DISPUTE_API_URL = import.meta.env.VITE_DISPUTE_API_URL;

export default API_URL;
