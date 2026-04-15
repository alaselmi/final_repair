import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, setLogoutHandler } from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'repair_saas_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setToken('');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, token);
    try {
      const [, payload] = token.split('.');
      const value = payload ? JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) : null;
      setUser(value || null);
    } catch {
      setUser(null);
    }
  }, [token]);

  async function login(credentials) {
    setLoading(true);
    setError('');

    try {
      const data = await loginApi(credentials);
      setToken(data.token);
      navigate('/');
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout, isAuthenticated: Boolean(token) }),
    [token, user, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
