const KEY = 'ecocollect.admin.session';

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const adminSession = {
  get(): AdminSession | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  },
  set(s: AdminSession) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
  },
  clear() {
    try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
  },
};
