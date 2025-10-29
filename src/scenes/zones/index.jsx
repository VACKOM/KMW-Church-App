import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Topbar from "../global/TopBar";

const Zones = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [userCenterId, setUserCenterId] = useState(null);
  const [userCenterName, setUserCenterName] = useState("All Centers");

  // ✅ Fetch centers and determine user center details
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await axios.get(
          "https://church-management-system-39vg.onrender.com/api/centers/"
        );
        setCenters(data);

        // ✅ Get stored roles
        const roleData = localStorage.getItem("roles");
        const roleAssignments = roleData ? JSON.parse(roleData) : [];

        // ✅ Identify CenterLeader
        const centerLeader = roleAssignments.find(
          (role) => role.scopeType === "CenterLeader"
        );

        if (centerLeader) {
          const centerScopeItem = centerLeader.scopeItem; // _id of the center
          setUserCenterId(centerScopeItem);

          // ✅ Find center name for the heading
          const matchedCenter = data.find((c) => c._id === centerScopeItem);
          if (matchedCenter) {
            setUserCenterName(matchedCenter.centerName);
          } else {
            setUserCenterName("Unknown Center");
          }
        } else {
          // ✅ Global user (can see all)
          setUserCenterId("ALL");
          setUserCenterName("All Centers");
        }
      } catch (err) {
        setError("Error fetching centers");
        console.error("Error fetching centers:", err);
      }
    };

    fetchCenters();
  }, []);

  // ✅ Fetch zones and filter by center _id
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await axios.get(
          "https://church-management-system-39vg.onrender.com/api/zones/"
        );
        setZones(data);

        if (userCenterId === "ALL") {
          setFilteredZones(data);
        } else if (userCenterId) {
          const matchedZones = data.filter((z) => z.center === userCenterId);
          setFilteredZones(matchedZones);
        }
      } catch (err) {
        setError("Error fetching zones");
        console.error("Error fetching zones:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userCenterId) fetchZones();
  }, [userCenterId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddButtonClick = () => {
    const matchedCenter = centers.find((c) => c._id === userCenterId) || null;
    navigate("/add-zone", { state: { foundCenter: matchedCenter } });
  };

  // ✅ Filter zones based on search query
  const finalZones = filteredZones.filter((zone) => {
    const q = searchQuery.toLowerCase();
    return (
      zone.zoneName?.toLowerCase().includes(q) ||
      zone.zoneLeader?.toLowerCase().includes(q) ||
      zone.zoneContact?.toLowerCase().includes(q) ||
      zone.zoneEmail?.toLowerCase().includes(q) ||
      zone.center?.toLowerCase().includes(q) // still searchable by center _id
    );
  });

  const columns = [
    { field: "id", headerName: "Zone ID", flex: 1 },
    { field: "zoneName", headerName: "Zone Name", flex: 1 },
    { field: "zoneLeader", headerName: "Zone Leader", flex: 1 },
    { field: "zoneContact", headerName: "Zone Contact", flex: 1 },
    { field: "zoneEmail", headerName: "Zone Email", flex: 1 },
    //{ field: "center", headerName: "Center ID", flex: 1 }, // ✅ still shows _id
  ];

  const rows = finalZones.map((z) => ({
    id: z.zoneID || z._id,
    zoneName: z.zoneName,
    zoneLeader: z.zoneLeader,
    zoneContact: z.zoneContact,
    zoneEmail: z.zoneEmail,
    center: z.center, // remains the _id
  }));

  return (
    <Box m="20px">
      <Topbar onSearch={handleSearch} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* ✅ Heading now shows centerName */}
        <Header
          title={`${userCenterName} Zones List`}
          subtitle="Managing the Zones"
        />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button variant="contained" color="neutral" onClick={handleAddButtonClick}>
            Add New Zone
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      ) : rows.length === 0 ? (
        <Typography align="center" mt={4}>
          No zones available.
        </Typography>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
};

export default Zones;
