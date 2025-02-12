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


const Center = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for mobile size
  const [center, setCenter] = useState([]);
  const [zone, setZone] = useState([]);
  const [bacenta, setBacenta] = useState([]);
  const [foundBacenta, setFoundBacenta] = useState([]);
  const [foundCenter, setFoundCenter] = useState([]);
  const [foundZone, setFoundZone] = useState([]);
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
   const { user } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  //Checking for user Authentication
  const role = localStorage.getItem('role');
  const userCenter = localStorage.getItem('center');
  
    useEffect(() => {
      if (!user) {
        // Redirect to login if no user is found
        navigate('/login');
        setIsAuthenticated(false);
      } else if (role !== 'center') {
        navigate('/unauthorized');
        setIsAuthenticated(false);
      } else {
        // User exists and has the required permission, so continue normal operation
        setIsAuthenticated(true);
        // Perform additional logic if needed
      }
    }, [user, navigate]);

// Fetch centers data
 useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
        setCenter(response.data); // Adjust according to your API response
        setFoundCenter(response.data.find(item => item._id === userCenter)); // Find the center by _id
        
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };
    fetchCenter();
  }, []);


  useEffect(() => {
    const fetchZone = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
        setZone(response.data); // Assuming this is an array of zones
        
        // Filter zones based on the centerName
        const filteredZones = response.data.filter(item => item.center === foundCenter.centerName);
        setFoundZone(filteredZones); // Set zones that match the centerName
        
      } catch (error) {
        console.error("Error fetching zone:", error);
      }
    };
    fetchZone();
  }, [foundCenter]); // Dependency on foundCenter to update when it changes

   // Fetch bacentas data

   useEffect(() => {
     const fetchBacenta = async () => {
       try {
         const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
         setBacenta(response.data); // Adjust according to your API response

          // Filter bacenta based on the centerName
        const filteredBacentas = response.data.filter(item => item.center === foundCenter.centerName);
        setFoundBacenta(filteredBacentas); // Set zones that match the centerName
         
       } catch (error) {
         console.error("Error fetching bacenta:", error);
       }
     };
     fetchBacenta();
   }, [[foundCenter]]);

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
    if(foundCenter.centerName === "BANK QUARTERS"){
      setBacentaTarget(120);
      setAttendanceTarget(500);
      setMembershipTarget(2000);
    }
    else  if(foundCenter.centerName === "TOPBASE DAM HEIGHTS"){
      setBacentaTarget(30);
      setAttendanceTarget(200);
      setMembershipTarget(500);
    }else  if(foundCenter.centerName === "OBLOGO"){
      setBacentaTarget(30);
      setAttendanceTarget(200);
      setMembershipTarget(500);
    }else  if(foundCenter.centerName === "NEW GBAWE CP"){
      setBacentaTarget(30);
      setAttendanceTarget(200);
      setMembershipTarget(500);
    }else  if(foundCenter.centerName === "WEMBLEY"){
      setBacentaTarget(30);
      setAttendanceTarget(200);
      setMembershipTarget(500);
    }else  if(foundCenter.centerName === "ESCHATOS"){
      setBacentaTarget(30);
      setAttendanceTarget(200);
      setMembershipTarget(500);
    }

    


    setMembership(422);

    // Calculate progress and ensure it's a percentage between 0 and 100
    if (foundBacenta.length && bacentaTarget > 0) {
      const progress = (foundBacenta.length / bacentaTarget) * 100;  // Multiplying by 100 to get percentage
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
  const handleZonePageClick = () => {
    navigate('/zones', {
      state: { foundZone }  // Passing the filteredZone data to the next page
    });
  };
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
        <Header title={`DASHBOARD - ${foundCenter.centerName} Center`} subtitle="Welcome to your dashboard" />
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

      <Box
  display="grid"
  gridTemplateColumns={isMobile ? "repeat(4, 1fr)" : "repeat(12, 1fr)"} // Columns for different screen sizes
  gridAutoRows="140px"
  gap="20px"
>
  {/* ROW 1 - 3 boxes */}
  <Box
    gridColumn={isMobile ? "span 4" : "span 4"} // Each box takes 4 columns on large screens
    backgroundColor={colors.primary[400]}
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{ cursor: 'pointer' }}
    onClick={handleZonePageClick}
  >
    <StatBox
      title={foundZone.length}
      subtitle="No of Zones"
      progress="0.50"
      increase="+21%"
      icon={<GpsFixedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
    />
  </Box>
  <Box
    gridColumn={isMobile ? "span 4" : "span 4"} // Each box takes 4 columns on large screens
    backgroundColor={colors.primary[400]}
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{ cursor: 'pointer' }}
    onClick={handleBacentaPageClick}
  >
    <StatBox
      title={foundBacenta.length}
      subtitle="No of Bacentas"
      progress={bacentaProgress / 100}
      increase={`${bacentaProgress}%`}
      icon={<WorkspacesIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
    />
  </Box>
  <Box
    gridColumn={isMobile ? "span 4" : "span 4"} // Each box takes 4 columns on large screens
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

  {/* ROW 2 - 2 boxes */}
  <Box
    gridColumn={isMobile ? "span 4" : "span 8"} // Box spans 8 columns in large view
    gridRow="span 2"
    backgroundColor={colors.primary[400]}
  >
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
  <Box
    gridColumn={isMobile ? "span 4" : "span 4"} // Box spans 4 columns in large view
    gridRow="span 2"
    backgroundColor={colors.primary[400]}
    p="30px"
  >
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

  {/* ROW 3 - 2 boxes */}
  <Box
    gridColumn={isMobile ? "span 4" : "span 6"} // Box spans 6 columns in large view
    gridRow="span 2"
    backgroundColor={colors.primary[400]}
  >
    <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
      Centers Attendance
    </Typography>
    <Box height="250px" mt="-20px">
      <BarChart isDashboard={true} />
    </Box>
  </Box>
  <Box
    gridColumn={isMobile ? "span 4" : "span 6"} // Box spans 6 columns in large view
    gridRow="span 2"
    backgroundColor={colors.primary[400]}
    padding="30px"
  >
    <DataGrid rows={rows} columns={columns} />
  </Box>
</Box>

    </Box>
  );
};

export default Center;
