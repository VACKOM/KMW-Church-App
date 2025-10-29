import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Topbar from "../global/TopBar";

const Attendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [attendances, setAttendances] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ✅ Retrieve user scope info
  const roleAssignments = localStorage.getItem("roles");
  const parsedRoles = roleAssignments ? JSON.parse(roleAssignments) : [];

  const centerLeader = parsedRoles.find(
    (r) => r.scopeType === "CenterLeader"
  )?.scopeItem;
  const zoneLeader = parsedRoles.find(
    (r) => r.scopeType === "ZoneLeader"
  )?.scopeItem;
  const bacentaLeader = parsedRoles.find(
    (r) => r.scopeType === "BacentaLeader"
  )?.scopeItem;

  const userScopeType =
    (centerLeader && "CenterLeader") ||
    (zoneLeader && "ZoneLeader") ||
    (bacentaLeader && "BacentaLeader");

  // ✅ Fetch Attendance, Zones, and Bacentas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, zoneRes, bacentaRes] = await Promise.all([
          axios.get(
            "https://church-management-system-39vg.onrender.com/api/attendances/"
          ),
          axios.get(
            "https://church-management-system-39vg.onrender.com/api/zones/"
          ),
          axios.get(
            "https://church-management-system-39vg.onrender.com/api/bacentas/"
          ),
        ]);

        setAttendances(attendanceRes.data);
        setZones(zoneRes.data);
        setBacentas(bacentaRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendances:", error);
        setError("Failed to load attendance or attendance not filled yet");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Combine Attendance + Bacenta + Zone + Center + Filter by Scope
  useEffect(() => {
    if (attendances.length > 0 && bacentas.length > 0 && zones.length > 0) {
      const combined = attendances.map((attendance) => {
        const relatedBacenta =
          bacentas.find((b) => b._id === attendance.bacenta) || {};
        const relatedZone =
          zones.find((z) => z._id === relatedBacenta.zone) || {};

        // ✅ Format date as DD/MM/YYYY
        let formattedDate = "Invalid Date";
        if (attendance.date) {
          const d = new Date(attendance.date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          formattedDate = `${day}/${month}/${year}`;
        }

        return {
          id: attendance._id,
          bacentaId: attendance.bacenta, // ✅ added so we can filter properly
          date: formattedDate,
          bacentaName:
            relatedBacenta.bacentaName ||
            attendance.bacentaName ||
            "Unknown Bacenta",
          bacentaMembersNo: attendance.bacentaMembersNo,
          adultAttendance: attendance.adultAttendance,
          childrenAttendance: attendance.childrenAttendance,
          soulsInChurch: attendance.soulsInChurch,
          newBelieversSchoolAttendance:
            attendance.newBelieversSchoolAttendance,
          bacentaMeetingAttendance: attendance.bacentaMeetingAttendance,
          membersAbsent: attendance.membersAbsent,
          laySchoolAttendance: attendance.laySchoolAttendance,
          zoneId: relatedBacenta.zone,
          centerId: relatedZone.center,
        };
      });

      // ✅ Filter based on user's scope
      let scopedAttendances = combined;

      if (userScopeType === "BacentaLeader" && bacentaLeader) {
        // ✅ Show only attendances for this bacenta
        scopedAttendances = combined.filter(
          (att) => att.bacentaId === bacentaLeader
        );
      } else if (userScopeType === "ZoneLeader" && zoneLeader) {
        // ✅ Show attendances under this zone
        scopedAttendances = combined.filter((att) => att.zoneId === zoneLeader);
      } else if (userScopeType === "CenterLeader" && centerLeader) {
        // ✅ Show attendances under this center
        scopedAttendances = combined.filter(
          (att) => att.centerId === centerLeader
        );
      }

      setAttendanceList(scopedAttendances);
    }
  }, [attendances, bacentas, zones, centerLeader, zoneLeader, bacentaLeader]);

  // ✅ Search filter
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAttendance = attendanceList.filter((attendance) => {
    const q = searchQuery.toLowerCase();
    return (
      attendance.date?.toLowerCase().includes(q) ||
      attendance.bacentaName?.toLowerCase().includes(q) ||
      attendance.soulsInChurch?.toString().includes(q)
    );
  });

  // ✅ Add Attendance button
  const handleAddButtonClick = () => {
    navigate("/add-attendance");
  };

  // ✅ Columns for DataGrid
  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "bacentaName", headerName: "Bacenta Name", flex: 1 },
    { field: "bacentaMembersNo", headerName: "Members", flex: 1 },
    { field: "adultAttendance", headerName: "Adults", flex: 1 },
    { field: "childrenAttendance", headerName: "Children", flex: 1 },
    { field: "soulsInChurch", headerName: "Souls in Church", flex: 1 },
    {
      field: "newBelieversSchoolAttendance",
      headerName: "New Believers",
      flex: 1,
    },
    {
      field: "bacentaMeetingAttendance",
      headerName: "Bacenta Meeting",
      flex: 1,
    },
    { field: "laySchoolAttendance", headerName: "Lay School", flex: 1 },
    { field: "membersAbsent", headerName: "Absent", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Attendance List" subtitle="Attendance Management" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New Attendance
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid rows={filteredAttendance} columns={columns} />
        </Box>
      )}
    </Box>
  );
};

export default Attendance;
