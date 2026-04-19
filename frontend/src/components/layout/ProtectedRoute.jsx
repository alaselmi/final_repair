import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { canAccess } from '../../shared/utils/permissions';

function ProtectedRoute({ children, requiredRole = null }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !canAccess(auth.user?.role, requiredRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
