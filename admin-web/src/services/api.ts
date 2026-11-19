import { adminSession } from './session';

export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const s = adminSession.get();
  if (s) {
    headers.Authorization = `Bearer ${s.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('Cannot reach the EcoCollect API (is the backend running on :4000?)');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Expired token or no longer an admin: drop the session and go back to login.
    if (s && (response.status === 401 || response.status === 403) && endpoint.startsWith('/admin')) {
      adminSession.clear();
      window.location.assign('/login');
    }
    throw new Error((data as { error?: string }).error || `HTTP error ${response.status}`);
  }
  return data as T;
};
