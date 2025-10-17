import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { AuthProvider, useAuth } from '../../context/AuthContext'; // Auth context

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for mobile size
  const [center, setCenter] = useState([]);
  const [zone, setZone] = useState([]);
  const [bacenta, setBacenta] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [membership, setMembership] = useState(422);
  const [bacentaProgress, setBacentaProgress] = useState(0);
  const [sundayAttendanceProgress, setSundayAttendanceProgress] = useState(0);
  const [bacentaTarget, setBacentaTarget] = useState([]);
  const [attendanceTarget, setAttendanceTarget] = useState([]);
  const [membershipTarget, setMembershipTarget] = useState([]);
  const [membershipProgress, setMembershipProgress] = useState([]);
  const [bacentaAttendanceProgress, setBacentaAttendanceProgress] = useState([]);
  const navigate = useNavigate(); // Initialize navigate hook
  //const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
// ✅ Get stored values
const storedUser = localStorage.getItem("user");
const storedRoles = localStorage.getItem("roles");

const user = storedUser ? JSON.parse(storedUser) : null;
const roles = storedRoles ? JSON.parse(storedRoles) : [];

// ✅ Authentication check
useEffect(() => {
  if (!user) {
    // No user → send to login
    navigate("/login");
    setIsAuthenticated(false);
    return;
  }

  // Find a role with scopeType === administrator (case-insensitive)
  const isAdmin = roles.some(
    (r) => r.scopeType?.toLowerCase() === "administrator"
  );

  if (!isAdmin) {
    // User exists but not administrator → block
    navigate("/unauthorized");
    setIsAuthenticated(false);
    return;
  }

  // User exists and is administrator → allow
  setIsAuthenticated(true);
}, [user, roles, navigate]);


// Fetch centers data
 useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
        setCenter(response.data); // Adjust according to your API response
        
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };
    fetchCenter();
  }, []);


 // Fetch zones data

 useEffect(() => {
   const fetchZone = async () => {
     try {
       const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
       setZone(response.data); // Adjust according to your API response
       
     } catch (error) {
       console.error("Error fetching zone:", error);
     }
   };
   fetchZone();
 }, []);

   // Fetch bacentas data

   useEffect(() => {
     const fetchBacenta = async () => {
       try {
         const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
         setBacenta(response.data); // Adjust according to your API response
         
       } catch (error) {
         console.error("Error fetching bacenta:", error);
       }
     };
     fetchBacenta();
   }, []);

    // Fetch attendance data

    useEffect(() => {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get("https://church-management-system-39vg.onrender.com/api/attendances/");
          setAttendance(response.data); // Adjust according to your API response
          
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      };
      fetchAttendance();
    }, []);

// CALCULATING THE PERCENTAGE ACHIEVED FOR BACENTA

useEffect(() => {
  const calculateProgress = () => {
    setBacentaTarget(240);
    setAttendanceTarget(1300);
    setMembershipTarget(4000);
    setMembership(422);

    // Calculate progress and ensure it's a percentage between 0 and 100
    if (bacenta.length && bacentaTarget > 0) {
      const progress = (bacenta.length / bacentaTarget) * 100;  // Multiplying by 100 to get percentage
      setBacentaProgress(progress.toFixed(2));  // Format to 2 decimal places
    } else {
      setBacentaProgress(0);  // Return 0 if no progress
    }
    
    // For membership progress
    setMembershipProgress((membership / membershipTarget).toFixed(2));

    //Calculating for bacenta attendance progress
    const totalBacentaMeetingAttendance = attendance.reduce((sum, item) => sum + item.bacentaMeetingAttendance, 0);
    setBacentaAttendanceProgress(totalBacentaMeetingAttendance);

    //Calculating for sunday attendance progress
    const totalSundayAttendance = attendance.reduce((sum, item) => sum + item.adultAttendance, 0);
    setSundayAttendanceProgress(totalSundayAttendance);
  };

  calculateProgress();
}, [bacenta]);  // Ensure this effect runs when `bacenta` changes

  const handleNextPageClick = () => navigate('/centers');
  const handleZonePageClick = () => navigate('/zones');
  const handleBacentaPageClick = () => navigate('/bacentas');
  const handleAttenancePageClick = () => navigate('/attendance');

  const columns = [
    { field: "id", headerName: "Summary", editable: false },
    { field: "adults", headerName: "Adults", flex: 1, editable: true },
    { field: "keeplet", headerName: "Keeplets", flex: 1, editable: true },
    { field: "total", headerName: "Total", flex: 1, editable: true },
  ];

  const rows = [
    { id: 'Head Count', adults: 371, keeplet: 227, total: 598 },
    { id: 'Center Data', adults: 248, keeplet: 60, total: 308 },
    { id: 'Difference', adults: 123, keeplet: 167, total: 290 },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(4, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={isMobile ? "span 4" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleNextPageClick}
        >
          <StatBox
            title={center.length}
            subtitle="No of Centers"
            progress="0.75"
            increase="+0%"
            icon={<CenterFocusStrongIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>
        <Box
          gridColumn={isMobile ? "span 4" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleZonePageClick}
        >
          <StatBox
            title={zone.length}
            subtitle="No of Zones"
            progress="0.50"
            increase="+21%"
            icon={<GpsFixedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn={isMobile ? "span 4" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleBacentaPageClick}
        >
          <StatBox
            title={bacenta.length}
            subtitle="No of Bacentas"
            progress={bacentaProgress / 100}
            increase={`${bacentaProgress}%`}
            icon={<WorkspacesIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn={isMobile ? "span 4" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={membership}
            subtitle="Total Membership"
            progress={membershipProgress}
            increase={`${membershipProgress * 100}%`}
            icon={<Diversity1Icon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn={isMobile ? "span 4" : "span 8"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Sunday Attendance
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                422
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 4" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600" alignItems="center">
            Overall Sunday Attendance
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px" sx={{ cursor: 'pointer' }} onClick={handleAttenancePageClick}>
            <ProgressCircle size="125" progress={sundayAttendanceProgress / membership} />
            <Typography variant="h3" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              {((sundayAttendanceProgress / membership) * 100).toFixed(2)}%
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              {sundayAttendanceProgress} attendance recorded
            </Typography>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box gridColumn={isMobile ? "span 4" : "span 3"} gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600" alignItems="center">
            Bacenta Meeting Attendance
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={bacentaAttendanceProgress / membership} />
            <Typography variant="h3" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              {((bacentaAttendanceProgress / membership) * 100).toFixed(2)}%
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              {bacentaAttendanceProgress} attendance recorded
            </Typography>
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 4" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Centers Attendance
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 4" : "span 5"} gridRow="span 2" backgroundColor={colors.primary[400]} padding="30px">
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
