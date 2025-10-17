import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, onAuthStatusChange }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Decode JWT safely
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse token:', e);
      return null;
    }
  }

  // ✅ Determine redirect path based on roleAssignments array
  const getRedirectPath = (roles) => {
    if (!roles || roles.length === 0) return '/dashboard';
    const primary = roles[0];
    const scope = primary.scopeType?.toLowerCase();

    switch (scope) {
      case 'zoneleader':
        return '/zone-dashboard';
      case 'bacentaleader':
        return '/bacenta-dashboard';
      case 'centerleader':
        return '/center-dashboard';
      default:
        return '/dashboard';
    }
  };

  // ✅ Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded) {
      console.log('🔥 Frontend decoded token on refresh:', decoded);
      console.log('🔥 Role assignments from token:', decoded.roleAssignments);

      const userData = {
        id: decoded.id,
        username: decoded.username,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        userContact: decoded.userContact,
      };

      const roles = decoded.roleAssignments || [];
      setUser(userData);
      setUserRoles(roles);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Login and redirect
  const login = async (username, password) => {
    setError(null);
    try {
      const response = await axios.post(
        'https://church-management-system-39vg.onrender.com/api/auth/login',
        { username, password }
      );

      const token = response.data.token;
      localStorage.setItem('token', token);

      const decoded = parseJwt(token);
      if (!decoded) throw new Error('Invalid token received');

      console.log('🔥 Frontend decoded token on login:', decoded);
      console.log('🔥 Role assignments from token:', decoded.roleAssignments);

      const userData = {
        id: decoded.id,
        username: decoded.username,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        userContact: decoded.userContact,
      };

      const roles = decoded.roleAssignments || [];
      setUser(userData);
      setUserRoles(roles);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('roles', JSON.stringify(roles));

      const redirectPath = getRedirectPath(roles);
      navigate(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) setError('Network Error: Please check your connection.');
      else if (err.response.status === 400)
        setError('Incorrect username or password.');
      else setError('An error occurred. Please try again later.');
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserRoles([]);
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    if (onAuthStatusChange) onAuthStatusChange(isAuthenticated);
  }, [isAuthenticated, onAuthStatusChange]);

  return (
    <AuthContext.Provider
      value={{ user, userRoles, login, logout, isAuthenticated, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
