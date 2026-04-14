import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-shell"><div className="card centered-card">Checking authentication...</div></div>;
  }

  return isAuthenticated ? children : fallback;
}
