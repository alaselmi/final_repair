const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let unauthorizedHandler = null;

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function clearUnauthorizedHandler() {
  unauthorizedHandler = null;
}

export function getErrorMessage(error) {
  if (!error) {
    return 'Something went wrong';
  }
  if (error.data?.message) {
    return String(error.data.message);
  }
  return error.message || 'Something went wrong';
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || 'Server error';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    if (response.status === 401 && path !== '/api/login' && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler();
    }
    throw error;
  }

  return data;
}

export async function login(email, password) {
  return fetchJson('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetchJson('/api/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  return fetchJson('/api/me', {
    method: 'GET',
  });
}

export async function fetchRepairs({ page = 1, limit = 10, status = '', search = '' } = {}) {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (status) {
    query.set('status', status);
  }
  if (search) {
    query.set('search', search);
  }
  return fetchJson(`/api/repairs?${query.toString()}`);
}

export async function getRepairById(id) {
  return fetchJson(`/api/repairs/${id}`, {
    method: 'GET',
  });
}

export async function createRepair(data) {
  return fetchJson('/api/repairs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRepairStatus(id, status) {
  return fetchJson(`/api/repairs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
