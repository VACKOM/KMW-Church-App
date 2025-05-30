import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Unauthorized } from './components/users/Unauthorized';
import PrivateRoute from './components/users/PrivateRoute';

// Import components
import Login from './components/users/Login';
import AdminPage from './components/users/AdminPage';
import UserPage from './components/users/UserPage';
import HomePage from './components/users/HomePage';
import Sidebar from './scenes/global/Sidebar';
// Dashboards Imports
import Dashboard from './scenes/dashboard';
import CenterDashboard from './scenes/dashboard/center';
import ZoneDashboard from './scenes/dashboard/zone';
import BacentaDashboard from './scenes/dashboard/bacenta';


// Other Pages
import Centers from './scenes/centers';
import AddCenter from './scenes/centers/addCenter';
import Zones from './scenes/zones';
import AddZone from './scenes/zones/addZones';
import Bacenta from './scenes/bacentas/addBacenta';
import Bacentas from './scenes/bacentas';
import Attendance from './scenes/bacentas/attendance';
import AddAttendance from './scenes/bacentas/addAttendance';
import Users from './scenes/users';
import AddUser from './scenes/users/addUser';
import Members from './scenes/members';
import AddMember from './scenes/members/addMember';

const useIsPublicRoute = () => {
  const location = useLocation();
  const publicRoutes = ["/login", "/unauthorized"]; // Add any additional public routes here
  return publicRoutes.includes(location.pathname); // Checks if the current path is public
};

const App = () => {
  const navigate = useNavigate();  // Get the navigate function
  const [theme, colorMode] = useMode();
  const { isAuthenticated, userRole } = useAuth();
  const [redirected, setRedirected] = useState(false);  // State to track redirection
  const isPublicRoute = useIsPublicRoute();

  useEffect(() => {
    // Check if user is authenticated, not on a public route, and hasn't been redirected yet
    if (isAuthenticated && !isPublicRoute && !redirected) {
      const redirectPath = roleBasedRedirect(userRole);
      // Only navigate if the user is not already on the correct page
      if (location.pathname !== redirectPath) {
        navigate(redirectPath);
        setRedirected(true);  // Mark as redirected
      }
    }
  }, [isAuthenticated, userRole, isPublicRoute, location.pathname, navigate, redirected]);

  const roleBasedRedirect = (role) => {
    if (!role) {
      return "/login";  // Fallback to login if the role is invalid
    }

    switch (role) {
      case "center":
        return "/center-dashboard";
      case "zone":
        return "/zone-dashboard";
      case "bacenta":
        return "/bacenta-dashboard";
      case "administrator":
        return "/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isPublicRoute && isAuthenticated && <Sidebar userRole={userRole} />}
          <main className="content">
            <Routes>
              {/* The main route logic */}
              <Route
                path="/"
                element={isAuthenticated ? <HomePage /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/center-dashboard" element={<CenterDashboard />} />
              <Route path="/zone-dashboard" element={<ZoneDashboard />} />
              <Route path="/bacenta-dashboard" element={<BacentaDashboard />} />

              {/* Other routes */}
              <Route path="/admin" element={<PrivateRoute roles={['admin']} element={<AdminPage />} />} />
              <Route path="/user" element={<PrivateRoute roles={['user', 'admin']} element={<UserPage />} />} />
              <Route path="/centers" element={<Centers />} />
              <Route path="/add-center" element={<AddCenter />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/add-zone" element={<AddZone />} />
              <Route path="/bacentas" element={<Bacentas />} />
              <Route path="/add-bacenta" element={<Bacenta />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/add-attendance" element={<AddAttendance />} />
              <Route path="/users" element={<Users />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/members" element={<Members />} />
              <Route path="/add-member" element={<AddMember />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const Root = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default Root;
