import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook from the correct location

const PrivateRoute = ({ roles, element }) => {
  const { user, isAuthenticated } = useAuth();  // Get user and authentication status from context

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return Navigate("/login") ;
  }

  // If user does not have necessary roles, redirect to unauthorized page
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return Navigate("/unauthorized") ;
  }

  // If user is authenticated and has required roles, render the component
  return element;
};

export default PrivateRoute;

