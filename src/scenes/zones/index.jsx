import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const Zones = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [zones, setZones] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  

  // Fetch zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get('https://church-management-system-39vg.onrender.com/api/zones/');
        setZones(response.data);
        setLoading(false);  // Data is loaded
       
      } catch (error) {
        console.error('Error fetching zones:', error);
        setError('Failed to load zones or no zones available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchZones();
  }, []);

  // Update zones list when zones data is fetched
  useEffect(() => {
    if (zones.length > 0) {
      const combinedData = zones.map((zone) => {
          return {
            ID: zone._id,
            id: zone.zoneID, // Ensure each row has a unique 'id' property
            //zoneId: zone.zoneId,
            zoneName: zone.zoneName,
            zoneLeader: zone.zoneLeader,
            zoneContact: zone.zoneContact,
            zoneEmail: zone.zoneEmail,
            center: zone.center
            
          };
        });
      setZonesList(combinedData);  // Update the zonesList state
      
    }
  }, [zones]);
 
//   // Button to generate QR Code
//   const handleButtonClick = (rowData) => {
//     console.log("Button clicked for zone: ", rowData);
//     const qrcode = `Zone ID: ${rowData.zoneId}, Zone Name: ${rowData.name}, Zone Description: ${rowData.description}, Zone Location: ${rowData.location}`;
//     navigate(`/qrcode-generator?qrcode=${encodeURIComponent(qrcode)}`);
//   };

//   // Button to generate Claims
//   const handleClaimClick = (rowData) => {
//     navigate(`/claim-zone`);
//   };

  // Button Add New Zone click handler
  const handleAddButtonClick = () => {
    navigate("/add-zone");
  };

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Filter zones based on the search query
  const filteredZones = zonesList.filter(zone => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
    return (
      zone.zoneName.toLowerCase().includes(query) ||
      zone.zoneLeader.toLowerCase().includes(query) ||
      zone.zoneContact.toLowerCase().includes(query) ||
      zone.zoneEmail.toLowerCase().includes(query) ||
      zone.center.toLowerCase().includes(query)
     
    );
  });
 

//   // Handle row update (when user types into the grid)
//   const handleRowEdit = async (updatedRow) => {
//     const updatedZones = zonesList.map((zone) =>
//       zone.ID === updatedRow.ID ? { ...zone, ...updatedRow } : zone
//     );
//     setZonesList(updatedZones);  // Update local state immediately for a better user experience

//     try {
//       // Make an API call to update the zone on the server
//       await axios.put(`https://node-js-inventory-system.onrender.com/api/zone/${updatedRow.ID}`, updatedRow);
//     } catch (error) {
//       console.error('Error updating zone:', error);
//     }

//     return updatedRow; // Return the updated row data for the grid to process
//   };

  // Columns for DataGrid with editable fields
  const columns = [

    { field: "id", headerName: "Zone ID", editable: false },
    { field: "zoneName", headerName: "Zone Name", flex: 1, editable: true },
    { field: "zoneLeader", headerName: "Zone Pastor", flex: 1, editable: true },
    { field: "zoneContact", headerName: "Zone Contact", flex: 1, editable: true },
    { field: "zoneEmail", headerName: "Zone Email", flex: 1, editable: true },
    { field: "center", headerName: "Zone Center", flex: 1, editable: true }
   
  ];


//   const handleSelectionModelChange = (selectionModel) => {
//     // Log the selection model to ensure it's working
//     console.log('Selection Model:', selectionModel);

//     // Check if the selectionModel is not empty
//     if (selectionModel && selectionModel.length > 0) {
//         const selectedZoneIds = selectionModel.map((id) => {
//             const zone = zonesList.find((zone) => zone.id === id);
//             return zone ? zone.zoneId : null;
//         }).filter((zoneId) => zoneId !== null);  // Filter out any null values

//         // Show the alert with the selected zone IDs
//         if (selectedZoneIds.length > 0) {
//             alert(`Selected Zone IDs: ${selectedZoneIds.join(', ')}`);
//         }
//     } else {
//         console.log('No rows selected');
//     }
// };



//   // Handle cell click and alert the content
// const handleCellClick = (params) => {
//   const columnName = params.field;  // The field name (column header)
//   const cellValue = params.value;   // The value in the clicked cell
//   let requestInput = "";            // Use 'let' to allow reassignment
//   // alert(`Column: ${columnName}\nContent: ${cellValue}`);

//   if (columnName === "requestContact") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-zone?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "requestingOfficer") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-zone?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "id") {
//     const requestInput = cellValue; // Get the cell value as the zoneId
//     // URL-encode the requestInput (ZoneId)
//     const encodedInput = encodeURIComponent(requestInput);
//     // Navigate with the encoded zoneId as a query parameter
//     navigate(`/claim-zone?requestInput=${encodedInput}`);
// }
// };



  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} /> 
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Zones List" subtitle="Managing the Zones" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New Zone
          </Button>

          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleClaimClick}
          >
            Zone Claims
          </Button> */}
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
            //checkboxSelection 
            rows={filteredZones} 
            columns={columns} 
            //processRowUpdate={handleRowEdit} // Handle row edits
            //onCellClick={handleCellClick}  // Add this to handle cell clicks
           // onSelectionModelChange={handleSelectionModelChange}  // Correct event handler for checkbox clicks
          />
        </Box>
      )}
    </Box>
  );
};

export default Zones;

