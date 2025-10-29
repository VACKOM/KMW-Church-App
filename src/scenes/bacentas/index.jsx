import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "../global/TopBar";

const Bacentas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [bacentasList, setBacentasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCenterId, setUserCenterId] = useState(null);
  const [userZoneId, setUserZoneId] = useState(null);
  const [userBacentaId, setUserBacentaId] = useState(null);
  const [userCenterName, setUserCenterName] = useState("All Centers");
  const [roleType, setRoleType] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ STEP 1: Parse roleAssignments and store user scope IDs
  useEffect(() => {
    const roleData = localStorage.getItem("roles");
    const parsed = roleData ? JSON.parse(roleData) : [];

    if (Array.isArray(parsed)) {
      const center = parsed.find((r) => r.scopeType === "CenterLeader");
      const zone = parsed.find((r) => r.scopeType === "ZoneLeader");
      const bacenta = parsed.find((r) => r.scopeType === "BacentaLeader");

      if (center) {
        setUserCenterId(center.scopeItem);
        setRoleType("CenterLeader");
      } else if (zone) {
        setUserZoneId(zone.scopeItem);
        setRoleType("ZoneLeader");
      } else if (bacenta) {
        setUserBacentaId(bacenta.scopeItem);
        setRoleType("BacentaLeader");
      } else {
        setRoleType("Global"); // fallback if none matched
      }
    }
  }, []);

  // ✅ STEP 2: Fetch Centers and Zones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, zonesRes] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/centers/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/zones/")
        ]);

        setCenters(centersRes.data);
        setZones(zonesRes.data);

        // Set user center name if applicable
        if (userCenterId) {
          const matchedCenter = centersRes.data.find((c) => c._id === userCenterId);
          if (matchedCenter) {
            setUserCenterName(matchedCenter.centerName);
          }
        }
      } catch (err) {
        console.error("Error fetching centers/zones:", err);
        setError("Failed to load centers or zones");
      }
    };

    fetchData();
  }, [userCenterId]);

  // ✅ STEP 3: Fetch all bacentas
  useEffect(() => {
    const fetchBacentas = async () => {
      try {
        const { data } = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
        setBacentas(data);
      } catch (err) {
        console.error("Error fetching bacentas:", err);
        setError("Failed to load bacentas");
      } finally {
        setLoading(false);
      }
    };

    fetchBacentas();
  }, []);

  // ✅ STEP 4: Filter bacentas based on role
  useEffect(() => {
    if (!bacentas.length) return;

    let filtered = bacentas;

    if (roleType === "CenterLeader" && userCenterId) {
      filtered = bacentas.filter((b) => b.center === userCenterId);
    } else if (roleType === "ZoneLeader" && userZoneId) {
      filtered = bacentas.filter((b) => b.zone === userZoneId);
    } else if (roleType === "BacentaLeader" && userBacentaId) {
      filtered = bacentas.filter((b) => b._id === userBacentaId);
    }

    // Map data for DataGrid
    const formatted = filtered.map((bacenta) => ({
      ID: bacenta._id,
      id: bacenta.bacentaID,
      bacentaName: bacenta.bacentaName,
      bacentaLeader: bacenta.bacentaLeader,
      bacentaContact: bacenta.bacentaContact,
      bacentaLocation: bacenta.bacentaLocation,
      bacentaEmail: bacenta.bacentaEmail,
      bacentaDateStarted: bacenta.bacentaDateStarted,
      zone: bacenta.zone,
      center: bacenta.center
    }));

    setBacentasList(formatted);
  }, [bacentas, roleType, userCenterId, userZoneId, userBacentaId]);

  // ✅ STEP 5: Handle search
  const filteredBacentas = bacentasList.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.bacentaName.toLowerCase().includes(query) ||
      b.bacentaLeader.toLowerCase().includes(query) ||
      b.bacentaContact.toLowerCase().includes(query) ||
      b.bacentaEmail.toLowerCase().includes(query) ||
      b.bacentaLocation.toLowerCase().includes(query) ||
      b.bacentaDateStarted.toLowerCase().includes(query)
    );
  });

  const handleAddButtonClick = () => {
    const matchedCenter = centers.find((c) => c._id === userCenterId) || null;
    navigate("/add-bacenta", { state: { foundCenter: matchedCenter } });
  };

  const columns = [
    { field: "id", headerName: "Bacenta ID", flex: 1 },
    { field: "bacentaName", headerName: "Bacenta Name", flex: 1 },
    { field: "bacentaLeader", headerName: "Bacenta Leader", flex: 1 },
    { field: "bacentaContact", headerName: "Contact", flex: 1 },
    { field: "bacentaLocation", headerName: "Location", flex: 1 },
    { field: "bacentaDateStarted", headerName: "Date Started", flex: 1 },
    { field: "bacentaEmail", headerName: "Email", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Topbar onSearch={setSearchQuery} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Bacentas List" subtitle={`Managing Bacentas (${userCenterName})`} />
        <Button variant="contained" color="neutral" onClick={handleAddButtonClick}>
          Add New Bacenta
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid rows={filteredBacentas} columns={columns} />
        </Box>
      )}
    </Box>
  );
};

export default Bacentas;
