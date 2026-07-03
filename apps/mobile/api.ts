import * as tokenStorage from './auth/tokenStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

type FetchOptions = RequestInit & {
  // No explicit token here, it's read from storage
};

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const token = await tokenStorage.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred');
  }

  return response.status === 204 ? null : response.json();
}

export default apiFetch;