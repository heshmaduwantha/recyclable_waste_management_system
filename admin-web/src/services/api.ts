export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const apiCall = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Admin API call to ${endpoint} failed, falling back to dynamic backend service handler:`, error);
    throw error;
  }
};
