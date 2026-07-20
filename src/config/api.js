// ─── Centralized API Configuration ───────────────────────────────────────────
// Ye file APK build mein VITE_ env vars bake ho jati hain
// Kabhi bhi localhost use nahi karna — 10.3.11.33 static IP hai

const IP = '10.3.11.33';

export const API_URL       = import.meta.env.VITE_API_URL       || `http://${IP}:5003`;
export const AUTH_API_URL  = import.meta.env.VITE_AUTH_API_URL  || `http://${IP}:5003`;
export const CHAT_API_URL  = import.meta.env.VITE_CHAT_API_URL  || `http://${IP}:5001`;
export const CNIC_API_URL  = import.meta.env.VITE_CNIC_API_URL  || `http://${IP}:8000`;
export const DISPUTE_API_URL = import.meta.env.VITE_DISPUTE_API_URL || `http://${IP}:5000`;

export default API_URL;
