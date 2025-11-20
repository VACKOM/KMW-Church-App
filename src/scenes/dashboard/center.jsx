import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Header from "../../components/Header";
import LineChart from "../../components/AdminLineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCenterTargets } from '../../hook/useCenterTargets.jsx';

const Center = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Auth
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State
  const [foundCenter, setFoundCenter] = useState(null);
  const [foundZone, setFoundZone] = useState([]);
  const [foundBacenta, setFoundBacenta] = useState([]);
  const [membership, setMembership] = useState(0);
  const [bacentaAttendance, setBacentaAttendance] = useState(0);
  const [sundayAttendance, setSundayAttendance] = useState(0);

  // Get center leader scope
  const storedRoles = localStorage.getItem('roles');
  const roles = storedRoles ? JSON.parse(storedRoles) : [];
  const centerLeaderRole = roles.find(r => r.scopeType === "CenterLeader");
  const centerId = centerLeaderRole?.scopeItem;

  // Hook: fetch targets
  const { membershipTarget, bacentaTarget, attendanceTarget } = useCenterTargets(centerId);

  // ✅ Authentication check
  useEffect(() => {
    if (!user) {
      navigate('/login');
      setIsAuthenticated(false);
    } else if (!centerLeaderRole) {
      navigate('/unauthorized');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [user, centerLeaderRole, navigate]);

  // Fetch center
  useEffect(() => {
    if (!centerId) return;
    axios.get("https://church-management-system-39vg.onrender.com/api/centers/")
      .then(res => setFoundCenter(res.data.find(c => c._id === centerId)))
      .catch(err => console.error(err));
  }, [centerId]);

  // Fetch zones
  useEffect(() => {
    if (!foundCenter) return;
    axios.get("https://church-management-system-39vg.onrender.com/api/zones/")
      .then(res => setFoundZone(res.data.filter(z => z.center === foundCenter._id)))
      .catch(err => console.error(err));
  }, [foundCenter]);

  // Fetch bacentas
  useEffect(() => {
    if (!foundCenter) return;
    axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/")
      .then(res => setFoundBacenta(res.data.filter(b => b.center === foundCenter._id)))
      .catch(err => console.error(err));
  }, [foundCenter]);

  // Fetch membership
  useEffect(() => {
    if (!centerId) return;
    axios.get("https://church-management-system-39vg.onrender.com/api/membership/")
      .then(res => {
        const filtered = res.data.filter(m => m.center === centerId);
        setMembership(filtered.reduce((sum, m) => sum + (m.membershipCount || 0), 0));
      })
      .catch(err => console.error(err));
  }, [centerId]);

  // Fetch attendance
  useEffect(() => {
    if (!centerId) return;
    axios.get("https://church-management-system-39vg.onrender.com/api/attendances/")
      .then(res => {
        const filtered = res.data.filter(a => a.center === centerId);
        setSundayAttendance(filtered.reduce((sum, a) => sum + (a.adultAttendance || 0), 0));
        setBacentaAttendance(filtered.reduce((sum, a) => sum + (a.bacentaMeetingAttendance || 0), 0));
      })
      .catch(err => console.error(err));
  }, [centerId]);

  // Calculate progress dynamically
  const bacentaProgress = bacentaTarget ? ((foundBacenta.length / bacentaTarget) * 100).toFixed(2) : 0;
  const membershipProgress = membershipTarget ? ((membership / membershipTarget) * 100).toFixed(2) : 0;
  const attendanceProgress = attendanceTarget ? ((sundayAttendance / attendanceTarget) * 100).toFixed(2) : 0;

  // Navigation handlers
  const handleZonePageClick = () => navigate('/zones', { state: { foundZone } });
  const handleBacentaPageClick = () => navigate('/bacentas');

  const columns = [
    { field: "id", headerName: "Summary", editable: false },
    { field: "adults", headerName: "Adults", flex: 1 },
    { field: "keeplet", headerName: "Keeplets", flex: 1 },
    { field: "total", headerName: "Total", flex: 1 },
  ];

  const rows = [
    { id: 'Head Count', adults: 371, keeplet: 227, total: 598 },
    { id: 'Center Data', adults: 248, keeplet: 60, total: 308 },
    { id: 'Difference', adults: 123, keeplet: 167, total: 290 },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={`DASHBOARD - ${foundCenter?.centerName || ""} Center`} subtitle="Welcome to your dashboard" />
        <Button sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}>
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns={isMobile ? "repeat(4, 1fr)" : "repeat(9, 1fr)"} gridAutoRows="140px" gap="20px">

        {/* Zones */}
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
            title={foundZone.length}
            subtitle="No of Zones"
            // progress="0.50"
            // increase="+21%"
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
            title={foundBacenta.length}
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

        {/* Sunday Attendance */}
        <Box gridColumn={isMobile ? "span 4" : "span 8"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>Sunday Attendance</Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>{sundayAttendance}</Typography>
            </Box>
            <Box>
              <IconButton><DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} /></IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>




        {/* Bacenta Attendance */}
        <Box gridColumn={isMobile ? "span 4" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">Bacenta Meeting Attendance</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" progress={bacentaAttendance / membership} />
            <Typography variant="h3" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>{((bacentaAttendance / membership) * 100).toFixed(2)}%</Typography>
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>{bacentaAttendance} attendance recorded</Typography>
          </Box>
        </Box>

        {/* Other charts */}
        <Box gridColumn={isMobile ? "span 4" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>Centers Attendance</Typography>
          <Box height="250px" mt="-20px"><BarChart isDashboard={true} /></Box>
        </Box>
        <Box gridColumn={isMobile ? "span 4" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]} padding="30px">
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

export default Center;
