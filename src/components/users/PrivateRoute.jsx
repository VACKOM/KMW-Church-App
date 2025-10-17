import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ roles = [], element }) => {
  const { isAuthenticated, userRoles } = useAuth();

  console.log('🔒 PrivateRoute check');
  console.log('   isAuthenticated:', isAuthenticated);
  console.log('   userRoles:', userRoles);
  console.log('   required roles:', roles);

  if (!isAuthenticated) {
    console.log('➡️ Redirect: Not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const hasRequiredRole = userRoles.some(assign => {
      console.log('Comparing', assign.scopeType, 'with allowed', roles);
      return roles.includes(assign.scopeType);
    });

    console.log('   hasRequiredRole:', hasRequiredRole);

    if (!hasRequiredRole) {
      console.log('➡️ Redirect: No matching role');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ Access granted');
  return element;
};

export default PrivateRoute;
