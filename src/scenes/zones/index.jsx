import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import axios from 'axios';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../../components/Header";
import Topbar from "../global/TopBar";

const Zones = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [center, setCenter] = useState([]);
  const [zone, setZone] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [foundCenter, setFoundCenter] = useState(null);
  const [foundZone, setFoundZone] = useState([]);

  // Fetch centers data
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
        setCenter(response.data);

        const centerIdFromStorage = localStorage.getItem('center');

        if (centerIdFromStorage === "677d685033b4dc057ccc4585") {
          setFoundCenter({ centerName: "ALL" });
        } else {
          const matchedCenter = response.data.find(item => item._id === centerIdFromStorage);
          setFoundCenter(matchedCenter || null);
        }
      } catch (error) {
        setError("Error fetching centers");
        console.error("Error fetching center:", error);
      }
    };

    fetchCenter();
  }, []);

  // Fetch zone data based on center
  useEffect(() => {
    if (foundCenter?.centerName) {
      const fetchZone = async () => {
        try {
          const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
          setZone(response.data);

          if (foundCenter.centerName === "ALL") {
            setFoundZone(response.data);
          } else {
            const filteredZones = response.data.filter(
              item => item.center === foundCenter.centerName
            );
            setFoundZone(filteredZones);
          }

        } catch (error) {
          setError("Error fetching zones");
          console.error("Error fetching zone:", error);
        }
      };

      fetchZone();
    }
  }, [foundCenter]);

  // Update loading state when zones are fetched
  useEffect(() => {
    if (foundZone) {
      setLoading(false);
    }
  }, [foundZone]);

  const handleAddButtonClick = () => {
    navigate("/add-zone", { state: { foundCenter } });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Transform zone data
  useEffect(() => {
    if (foundZone) {
      const combinedData = foundZone.map((zone, index) => ({
        id: zone.zoneID || zone._id,
        zoneName: zone.zoneName,
        zoneLeader: zone.zoneLeader,
        zoneContact: zone.zoneContact,
        zoneEmail: zone.zoneEmail,
        center: zone.center
      }));
      setZonesList(combinedData);
    }
  }, [foundZone]);

  const finalZones = zonesList.filter(zones => {
    const query = searchQuery.toLowerCase();
    return (
      (zones.zoneName?.toLowerCase()?.includes(query)) ||
      (zones.zoneLeader?.toLowerCase()?.includes(query)) ||
      (zones.zoneContact?.toLowerCase()?.includes(query)) ||
      (zones.zoneEmail?.toLowerCase()?.includes(query))
    );
  });

  const columns = [
    { field: "id", headerName: "Zone ID", flex: 1 },
    { field: "zoneName", headerName: "Zone Name", flex: 1, editable: true },
    { field: "zoneLeader", headerName: "Zone Leader", flex: 1, editable: true },
    { field: "zoneContact", headerName: "Zone Contact", flex: 1, editable: true },
    { field: "zoneEmail", headerName: "Zone Email", flex: 1, editable: true }
  ];

  return (
    <Box m="20px">
      <Topbar onSearch={handleSearch} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={`${foundCenter?.centerName || "All"} Zones List`}
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
        <Typography color="error" variant="h6" align="center">{error}</Typography>
      ) : finalZones.length === 0 ? (
        <Typography align="center" mt={4}>No zones available.</Typography>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={finalZones}
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
