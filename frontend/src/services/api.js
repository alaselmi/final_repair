const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
let logoutHandler = () => {};

export function setLogoutHandler(handler) {
  logoutHandler = handler;
}

function getToken() {
  return localStorage.getItem('repair_saas_token');
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 401) {
    logoutHandler();
    throw new Error('Session expired. Please log in again.');
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
