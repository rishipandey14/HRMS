// Provide sensible defaults so the app still works during local dev
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
export const CHAT_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL || "http://127.0.0.1:5001";