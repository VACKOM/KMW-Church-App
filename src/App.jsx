import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // React Router v6
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext'; // Auth context
import { Unauthorized } from './components/users/Unauthorized';
import PrivateRoute from './components/users/PrivateRoute';

// Import components
import Login from './components/users/Login';
import AdminPage from './components/users/AdminPage';
import UserPage from './components/users/UserPage';
import HomePage from './components/users/HomePage';
import Sidebar from './scenes/global/SideBar';
//Dashboards Imports
import Dashboard from './scenes/dashboard';
import CenterDashboard from './scenes/dashboard/center';
import ZoneDashboard from './scenes/dashboard/zone';
import BacentaDashboard from './scenes/dashboard/bacenta';
import Users from './scenes/users/addUser';

//Other Pages
import Centers from './scenes/centers';
import AddCenter from './scenes/centers/addCenter';
import Zones from './scenes/zones';
import AddZone from './scenes/zones/addZones';
import Bacenta from './scenes/bacentas/addBacenta';
import Bacentas from './scenes/bacentas';
import Attendance from './scenes/bacentas/attendance';
import AddAttendance from './scenes/bacentas/addAttendance';

// Custom hook to determine if the current path is a public route
const useIsPublicRoute = () => {
  const location = useLocation(); // useLocation is now imported from react-router-dom
  return location.pathname === "/login" || location.pathname === "/unauthorized";
};



const App = () => {
  const [theme, colorMode] = useMode();
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isPublicRoute = useIsPublicRoute(); // Determine if the route is public

  const role = localStorage.getItem('role');

  // Update authentication state based on user state
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);
  console.log(isAuthenticated);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Only show Sidebar if user is logged in and route is not public */}
          {!isPublicRoute && isAuthenticated && <Sidebar userRole={role} />}
          <main className="content">
            <Routes>
              
              {/* Public Routes */}
              
              <Route
              path="/"
              element={
                (() => {
                  if (isAuthenticated && role === "center") {
                    return <Navigate to="/center-dashboard" />;
                  } else if (isAuthenticated && role === "zone") {
                    console.log("It is zone");
                    return <Navigate to="/zone-dashboard" />;
                  } else if (isAuthenticated && role === "bacenta") {
                    return <Navigate to="/bacenta-dashboard" />;
                  } else if (isAuthenticated && role === "administrator") {
                    return <Navigate to="/dashboard" />;
                  }else {
                    return <Login />;
                  }
                })()
              }
            />



              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute roles={['user', 'admin']} element={<HomePage />} />} />
              <Route path="/admin" element={<PrivateRoute roles={['admin']} element={<AdminPage />} />} />
              <Route path="/user" element={<PrivateRoute roles={['user', 'admin']} element={<UserPage />} />} />

              {/* Other app routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/centers" element={<Centers />} />
              <Route path="/add-center" element={<AddCenter />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/add-zone" element={<AddZone />} />
              <Route path="/bacentas" element={<Bacentas />} />
              <Route path="/add-bacenta" element={<Bacenta />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/add-attendance" element={<AddAttendance />} />
              <Route path="/center-dashboard" element={<CenterDashboard />} />
              <Route path="/zone-dashboard" element={<ZoneDashboard />} />
              <Route path="/bacenta-dashboard" element={<BacentaDashboard />} />
              <Route path="/users" element={<Users />} />
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
