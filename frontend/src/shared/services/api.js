const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add CSRF token for mutations
  if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include httpOnly cookies
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    // Dispatch logout event instead of callback
    window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'Session expired' } }));
    throw new Error('Session expired. Please log in again.');
  }

  if (response.status === 403) {
    throw new Error('Forbidden: You do not have permission to access this resource.');
  }

  const contentType = response.headers.get('content-type');
  const payload = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'An unexpected error occurred.');
  }

  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    const responseData = payload.data;
    if (payload.meta && typeof responseData === 'object' && responseData !== null) {
      return { ...responseData, meta: payload.meta };
    }
    return responseData;
  }

  return payload;
}

export function login(payload) {
  return request('/login', { method: 'POST', body: payload });
}

export function get(path) {
  return request(path, { method: 'GET' });
}

export function post(path, payload) {
  return request(path, { method: 'POST', body: payload });
}

export function put(path, payload) {
  return request(path, { method: 'PUT', body: payload });
}

export function del(path) {
  return request(path, { method: 'DELETE' });
}
