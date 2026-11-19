import { API_CONFIG } from '../constants/api';
import { session } from './session';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const token = session.token();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Cannot reach the EcoCollect server. Check your connection.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // A rejected token means the session is over (expired or account deactivated).
    if (response.status === 401 && token) session.expire();
    throw new ApiError(response.status, (data as { error?: string }).error || `Request failed (${response.status})`);
  }
  return data as T;
};

export const apiPost = <T>(endpoint: string, body?: unknown, method = 'POST') =>
  apiCall<T>(endpoint, { method, body: body === undefined ? undefined : JSON.stringify(body) });
