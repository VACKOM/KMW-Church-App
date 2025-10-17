import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Bacenta = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [bacenta, setBacenta] = useState([]);
  const [foundBacenta, setFoundBacenta] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [membership, setMembership] = useState(422);
  const [bacentaProgress, setBacentaProgress] = useState(0);
  const [sundayAttendanceProgress, setSundayAttendanceProgress] = useState(0);
  const [bacentaAttendanceProgress, setBacentaAttendanceProgress] = useState(0);
  const [membershipProgress, setMembershipProgress] = useState(0);

  const [bacentaTarget] = useState(240);
  const [attendanceTarget] = useState(1300);
  const [membershipTarget] = useState(4000);

  const navigate = useNavigate();
  const { user } = useAuth();

  const storedRoles = localStorage.getItem('roles');
  const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
  const bacentaScopeItem = parsedRoles.find(item => item.scopeType === "BacentaLeader")?.scopeItem || null;

  const isBacentaLeader = parsedRoles.some(role => role.scopeType === "BacentaLeader");

  // Redirect unauthorized users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isBacentaLeader) {
      navigate('/unauthorized');
    }
  }, [user, navigate, isBacentaLeader]);

  // Fetch Bacenta
  useEffect(() => {
    if (!bacentaScopeItem) return;

    const fetchBacenta = async () => {
      try {
        const { data } = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
        setBacenta(data);

        const matched = data.find(b => b._id === bacentaScopeItem);
        setFoundBacenta(matched || null);
        console.log("Matched Bacenta:", matched);
      } catch (err) {
        console.error("Error fetching bacentas:", err);
      }
    };

    fetchBacenta();
  }, [bacentaScopeItem]);

  // Fetch Attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("https://church-management-system-39vg.onrender.com/api/attendances/");
        setAttendance(res.data);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, []);

  // Calculate stats
  useEffect(() => {
    const totalBacentaAttendance = attendance.reduce((sum, item) => sum + item.bacentaMeetingAttendance, 0);
    const totalSundayAttendance = attendance.reduce((sum, item) => sum + item.adultAttendance, 0);

    setMembershipProgress((membership / membershipTarget).toFixed(2));
    setBacentaProgress(((bacenta.length / bacentaTarget) * 100).toFixed(2));
    setBacentaAttendanceProgress(totalBacentaAttendance);
    setSundayAttendanceProgress(totalSundayAttendance);
  }, [bacenta, attendance, membership, bacentaTarget, membershipTarget]);

  const handleZonePageClick = () => navigate('/zones');

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

  // ✅ Show loading screen while fetching bacenta
  if (!foundBacenta) {
    return (
      <Box m="20px">
        <Typography variant="h4" color="textSecondary">
          Loading Bacenta Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={`DASHBOARD - ${foundBacenta?.bacentaName} Bacenta`}
          subtitle="Welcome to your dashboard"
        />
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

      {/* GRID LAYOUT */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(4, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Membership */}
        <Box
          gridColumn={isMobile ? "span 4" : "span 6"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={membership}
            subtitle="Total Membership"
            progress={membershipProgress}
            increase={`${(membershipProgress * 100).toFixed(2)}%`}
            icon={<Diversity1Icon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* Bacenta Attendance */}
        <Box
          gridColumn={isMobile ? "span 4" : "span 6"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleZonePageClick}
        >
          <StatBox
            title={bacentaAttendanceProgress}
            subtitle="Bacenta Meeting Attendance"
            progress={bacentaAttendanceProgress / membership}
            increase={`${(bacentaAttendanceProgress / membership * 100).toFixed(2)}%`}
            icon={<GpsFixedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* Sunday Attendance Chart */}
        <Box
          gridColumn={isMobile ? "span 4" : "span 12"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Sunday Attendance
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {sundayAttendanceProgress}
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* Attendance Table */}
        <Box
          gridColumn={isMobile ? "span 4" : "span 12"}
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

export default Bacenta;

