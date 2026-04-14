import { createContext, useCallback, useEffect, useState } from 'react';
import useToast from '../hooks/useToast';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  registerUnauthorizedHandler,
  clearUnauthorizedHandler,
} from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    addToast('Session expired', 'error');
    window.location.href = '/';
  }, [addToast]);

  useEffect(() => {
    registerUnauthorizedHandler(handleSessionExpired);
    return () => {
      clearUnauthorizedHandler();
    };
  }, [handleSessionExpired]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data?.user ?? null);
    } catch (fetchError) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await loginRequest(email, password);
      setUser(response.data?.user ?? null);
      return response;
    } catch (fetchError) {
      addToast(fetchError.message, 'error');
      setUser(null);
      throw fetchError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await logoutRequest();
      setUser(null);
      addToast('Logged out successfully', 'success');
    } catch (fetchError) {
      addToast(fetchError.message, 'error');
      setUser(null);
      throw fetchError;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
