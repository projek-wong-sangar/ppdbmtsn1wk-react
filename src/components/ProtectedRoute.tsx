import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';

type Role = 'siswa' | 'admin';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const role: Role | undefined = user?.role;

    if (!role || !allowedRoles.includes(role)) {
      const redirectPath =
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'siswa'
          ? '/siswa/dashboard'
          : '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;