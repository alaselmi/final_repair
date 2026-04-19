import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../shared/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user on app load to validate session
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const response = await request('/auth/me');
        setUser(response.user);
      } catch (err) {
        setUser(null);
        setError('');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for logout events from API
    const handleLogout = () => {
      setUser(null);
      navigate('/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const response = await request('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await request('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export default AuthContext;
