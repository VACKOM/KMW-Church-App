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

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [center, setCenter] = useState([]);
  const [zone, setZone] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [foundCenter, setFoundCenter] = useState([]);
  const [foundZone, setFoundZone] = useState([]);
  // Fetch centers data
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
        setCenter(response.data);
        setFoundCenter(response.data.find(item => item._id === localStorage.getItem('center'))); // Set foundCenter
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
          const response = await axios.get("http://localhost:8080/api/zones/");
          setZone(response.data);
          // Filter zones based on the centerName
          const filteredZones = response.data.filter(item => item.center === foundCenter.centerName);
          setFoundZone(filteredZones); // Set zones that match the centerName
        } catch (error) {
          setError("Error fetching zones");
          console.error("Error fetching zone:", error);
        }
      };
      fetchZone();
    }
  }, [foundCenter]); // Trigger fetchZone when foundCenter changes

  // Set loading state to false when data is loaded
  useEffect(() => {
    if (foundZone && foundZone.length > 0) {
      setLoading(false); // Data has been fetched
    }
  }, [foundZone]);

  const handleAddButtonClick = () => {
    navigate("/add-zone", { state: { foundCenter } });
  };

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Update zones list when foundZone data is available
  useEffect(() => {
    if (foundZone && foundZone.length > 0) {
      const combinedData = foundZone.map((zone, index) => ({
        id: zone.zoneID || zone._id, // Ensure each row has a unique 'id'
        zoneName: zone.zoneName,
        zoneLeader: zone.zoneLeader,
        zoneContact: zone.zoneContact,
        zoneEmail: zone.zoneEmail,
        center: zone.center
      }));
      setZonesList(combinedData);
      //console.log("Updated zonesList:", combinedData);
    }
  }, [foundZone]);

  // Final filtered list based on search query
  const finalZones = zonesList.filter(zones => {
    const query = searchQuery.toLowerCase();
    return (
      (zones.zoneName?.toLowerCase()?.includes(query)) ||
      (zones.zoneLeader?.toLowerCase()?.includes(query)) ||
      (zones.zoneContact?.toLowerCase()?.includes(query)) ||
      (zones.zoneEmail?.toLowerCase()?.includes(query))
    );
  });

  //console.log("Final Zones Data:", finalZones);

  const columns = [
    { field: "id", headerName: "Zone ID", flex: 1 },
    { field: "zoneName", headerName: "Zone Name", flex: 1, editable: true },
    { field: "zoneLeader", headerName: "Zone Leader", flex: 1, editable: true },
    { field: "zoneContact", headerName: "Zone Contact", flex: 1, editable: true },
    { field: "zoneEmail", headerName: "Zone Email", flex: 1, editable: true }
  ];

  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={`${foundCenter.centerName} Zones List`} subtitle="Managing the Zones" />
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
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid 
            rows={finalZones} // Set filteredZones directly to rows
            columns={columns} 
            pageSize={5} // Optional: Add pagination
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
};

export default Zones;
