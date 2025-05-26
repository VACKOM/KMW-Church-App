import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children, onAuthStatusChange }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [centerId, setCenterId] = useState(null);
  const [zoneId, setZoneId] = useState(null);
  const [bacentaId, setBacentaId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate for redirection

  // Function to parse JWT
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse token:', e);
      return null;
    }
  }

  // Check for token on app load and set user accordingly (Runs only once on mount)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedPayload = parseJwt(token);
      if (decodedPayload) {
        setUser(decodedPayload.id);
        setUserRole(decodedPayload.role);
        setPermissions(decodedPayload.permissions);
        setCenterId(decodedPayload.centerId);
        setZoneId(decodedPayload.zoneId);
        setBacentaId(decodedPayload.bacentaId);
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);  // Only run once on mount

  // Login function
 

  const login = async (username, password) => {
    setError(null); // Reset error before attempting login
    
    try {
      const response = await axios.post('https://church-management-system-39vg.onrender.com/api/auth/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);  // Store token on login
      const decodedPayload = parseJwt(token);
      
      if (decodedPayload) {
        setUser(decodedPayload.id);
        setUserRole(decodedPayload.role);
        setPermissions(decodedPayload.permissions);
        setCenterId(decodedPayload.centerId);
        setZoneId(decodedPayload.zoneId);
        setBacentaId(decodedPayload.bacentaId);
        setIsAuthenticated(true);
  
        // Store other user data in localStorage after login
        localStorage.setItem('role', decodedPayload.role);
        localStorage.setItem('permission', JSON.stringify(decodedPayload.permissions));
        localStorage.setItem('center', decodedPayload.centerId);
        localStorage.setItem('zone', decodedPayload.zoneId);
        localStorage.setItem('bacenta', decodedPayload.bacentaId);
        localStorage.setItem('userId', decodedPayload.id);
  
        // Redirect based on the user's role
        const roleBasedRedirect = (role) => {
          switch (role) {
            case 'center':
              return '/center-dashboard';
            case 'zone':
              return '/zone-dashboard';
            case 'bacenta':
              return '/bacenta-dashboard';
            case 'administrator':
              return '/dashboard';
            default:
              return '/login';
          }
        };
  
        const redirectPath = roleBasedRedirect(decodedPayload.role);
        navigate(redirectPath);  // Redirect to the appropriate dashboard
      }
    } catch (err) {
      // Handle Network Error specifically
      if (!err.response) {
        // Network error (could be due to server down or no internet)
        setError('Network Error: Please check your connection.');
      } else if (err.response.status === 400) {
        setError('Incorrect username or password');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Login error:', err);
    }
  };
  
  

  // Ensure `onAuthStatusChange` is called after `isAuthenticated` is set
  useEffect(() => {
    if (onAuthStatusChange) {
      onAuthStatusChange(isAuthenticated);
    }
  }, [isAuthenticated, onAuthStatusChange]);

  // Logout function
  const logout = () => {
    // Clear all session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('permission');
    localStorage.removeItem('center');
    localStorage.removeItem('zone');
    localStorage.removeItem('bacenta');
    localStorage.removeItem('userId');
    
    // Reset state values
    setUser(null);
    setUserRole(null);
    setPermissions(null);
    setCenterId(null);
    setZoneId(null);
    setBacentaId(null);
    setIsAuthenticated(false);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, userRole, login, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
