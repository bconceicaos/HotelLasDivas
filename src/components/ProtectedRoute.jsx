// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (role && user.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
