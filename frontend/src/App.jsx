import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RepairCacheProvider } from './context/RepairCacheContext';
import ErrorBoundary from './components/ErrorBoundary';
import useAuth from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import ToastContainer from './components/ToastContainer';
import { fetchRepairs } from './api';

function AppContent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card centered-card">Loading authentication...</div>
      </div>
    );
  }

  return (
    <>
      <PrivateRoute fallback={<LoginPage onLogin={login} />}>
        <DashboardPage user={user} onLogout={logout} onFetchRepairs={fetchRepairs} />
      </PrivateRoute>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RepairCacheProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </RepairCacheProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
