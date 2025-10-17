import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Unauthorized } from "./components/users/Unauthorized";
import PrivateRoute from "./components/users/PrivateRoute";

// Components
import Login from "./components/users/Login";
import AdminPage from "./components/users/AdminPage";
import UserPage from "./components/users/UserPage";
import HomePage from "./components/users/HomePage";
import Sidebar from "./scenes/global/Sidebar";

// Dashboards
import Dashboard from "./scenes/dashboard";
import CenterDashboard from "./scenes/dashboard/center";
import ZoneDashboard from "./scenes/dashboard/zone";
import BacentaDashboard from "./scenes/dashboard/bacenta";

// Other Pages
import Centers from "./scenes/centers";
import AddCenter from "./scenes/centers/addCenter";
import Zones from "./scenes/zones";
import AddZone from "./scenes/zones/addZones";
import Bacenta from "./scenes/bacentas/addBacenta";
import Bacentas from "./scenes/bacentas";
import Attendance from "./scenes/bacentas/attendance";
import AddAttendance from "./scenes/bacentas/addAttendance";
import Users from "./scenes/users";
import AddUser from "./scenes/users/addUser";
import Members from "./scenes/members";
import AddMember from "./scenes/members/addMember";

const useIsPublicRoute = () => {
  const location = useLocation();
  const publicRoutes = ["/login", "/unauthorized"];
  return publicRoutes.includes(location.pathname);
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const { isAuthenticated, userRoles } = useAuth();
  const [redirected, setRedirected] = useState(false);
  const isPublicRoute = useIsPublicRoute();

  /**
   * Decide the best dashboard based on priority
   * Returns a path with role + scopeItem when needed
   */
  const roleBasedRedirect = (roleAssignments) => {
    if (!roleAssignments || roleAssignments.length === 0) return "/login";

    const priorityOrder = [
      "administrator",
      "CenterLeader",
      "ZoneLeader",
      "BacentaLeader",
    ];

    const scopes = roleAssignments.map((r) => r.scopeType?.trim());
    const matchedRole = priorityOrder.find((p) => scopes.includes(p));
    const matchedObject = roleAssignments.find(
      (r) => r.scopeType?.trim() === matchedRole
    );

    console.log("✅ Highest priority role:", matchedRole || "None");
    console.log("✅ Matched scopeItem:", matchedObject?.scopeItem);

    switch (matchedRole) {
      case "administrator":
        return `/dashboard/${matchedRole}`;
      case "CenterLeader":
        return `/center-dashboard/${matchedRole}/${matchedObject?.scopeItem}`;
      case "ZoneLeader":
        return `/zone-dashboard/${matchedRole}/${matchedObject?.scopeItem}`;
      case "BacentaLeader":
        return `/bacenta-dashboard/${matchedRole}/${matchedObject?.scopeItem}`;
      default:
        return "/login";
    }
  };

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && !isPublicRoute && !redirected) {
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate(roleBasedRedirect(userRoles));
        setRedirected(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userRoles]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Sidebar only when authenticated and not on public routes */}
          {!isPublicRoute && isAuthenticated && (
            <Sidebar roleAssignments={userRoles} />
          )}
          <main className="content">
            <Routes>
              {/* Public */}
              <Route
                path="/"
                element={isAuthenticated ? <HomePage /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Dynamic Dashboards (params now optional with ?) */}
              <Route
                path="/dashboard/:role?"
                element={
                  <PrivateRoute
                    roles={["administrator"]}
                    element={<Dashboard />}
                  />
                }
              />
              <Route
                path="/center-dashboard/:role?/:scopeItem?"
                element={
                  <PrivateRoute
                    roles={["CenterLeader"]}
                    element={<CenterDashboard />}
                  />
                }
              />
              <Route
                path="/zone-dashboard/:role?/:scopeItem?"
                element={
                  <PrivateRoute
                    roles={["ZoneLeader"]}
                    element={<ZoneDashboard />}
                  />
                }
              />
              <Route
                path="/bacenta-dashboard/:role?/:scopeItem?"
                element={
                  <PrivateRoute
                    roles={["BacentaLeader"]}
                    element={<BacentaDashboard />}
                  />
                }
              />

              {/* Other Protected Pages */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={["admin"]} element={<AdminPage />} />
                }
              />
              <Route
                path="/user"
                element={
                  <PrivateRoute roles={["user", "admin"]} element={<UserPage />} />
                }
              />

              {/* Optional General Pages */}
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
