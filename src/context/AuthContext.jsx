import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children, onAuthStatusChange }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [centerId, setCenterId] = useState(null);
  const [zoneId, setZoneId] = useState(null);
  const [bacentaId, setBacentaId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track authentication status
  const [error, setError] = useState(null);  // State to handle error messages

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

  // Check for token on app load and set user accordingly
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

    if (onAuthStatusChange) {
      onAuthStatusChange(isAuthenticated);
    }
  }, [isAuthenticated, onAuthStatusChange]);

  // Login function
  const login = async (username, password) => {
    setError(null); // Reset error before attempting login
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
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
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Incorrect username or password"); // Specific error for unauthorized access
        console.log("error is here");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('permission');
    localStorage.removeItem('center');
    localStorage.removeItem('zone');
    localStorage.removeItem('bacenta');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
