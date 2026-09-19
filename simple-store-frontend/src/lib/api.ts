const BASE_URL = 'http://localhost:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures cookies are sent automatically
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    const errorMsg = json?.message || 'Something went wrong';
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  // Handle successful wrapped response: { success: true, data: ..., timestamp: ... }
  if (json && json.success === true) {
    return json.data;
  }

  return json;
}
