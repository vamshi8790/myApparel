import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtService } from '../services/service';

interface ProtectedRouteProps {
  allowedRoles: Array<'user' | 'admin'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isLoggedIn = jwtService.isLoggedIn();
  const userRole = jwtService.getRole();

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />; 
  }
};

export default ProtectedRoute;