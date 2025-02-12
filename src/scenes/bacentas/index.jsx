import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate , useLocation } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const Bacentas = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [centers, setCenters] = useState([]);
  const [centerName,setCenterName] = useState([]);
  const [zones, setZones] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [bacentasList, setBacentasList] = useState([]);
  const[isRoleMatch,setIsRoleMatch] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation();
  const [foundCenter, setFoundCenter] = useState([]);
  const [foundZone, setFoundZone] = useState([]);
  
  const userRole = localStorage.getItem('role');

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get('https://church-management-system-39vg.onrender.com/api/centers/');
        setCenters(response.data);
        setFoundCenter(response.data.find(item => item._id === localStorage.getItem('center'))); // Set foundCenter
        setLoading(false);  // Data is loaded
       
      } catch (error) {
        console.error('Error fetching centers:', error);
        setError('Failed to load centers or no centers available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchCenters();
  }, []);


  // Fetch zone data based on center
  useEffect(() => {
    if (foundCenter?.centerName) {
      const fetchZone = async () => {
        try {
          const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
          setZones(response.data);
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


  // Fetch bacentas
  useEffect(() => {
    const fetchBacentas = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
        setBacentas(response.data);
        setLoading(false);  // Data is loaded
       
       
      } catch (error) {
        console.error('Error fetching bacentas:', error);
        setError('Failed to load bacentas or no bacentas available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchBacentas();
  }, []);

  // Update bacentas list when bacentas data is fetched
  useEffect(() => {
    if (bacentas.length > 0) {
      const combinedData = bacentas.map((bacenta) => {
          return {
            ID: bacenta._id,
            id: bacenta.bacentaID, // Ensure each row has a unique 'id' property
            bacentaId: bacenta.bacentaId,
            bacentaName: bacenta.bacentaName,
            bacentaLeader: bacenta.bacentaLeader,
            bacentaLocation:bacenta.bacentaLocation,
            bacentaContact: bacenta.bacentaContact,
            bacentaEmail: bacenta.bacentaEmail,
            bacentaDateStarted: bacenta.bacentaDateStarted,
            zone: bacenta.zone,
            center:bacenta.center
            
          };
        });
      setBacentasList(combinedData);  // Update the bacentasList state
      
    }
  }, [bacentas]);
 
//   // Button to generate QR Code
//   const handleButtonClick = (rowData) => {
//     console.log("Button clicked for bacenta: ", rowData);
//     const qrcode = `Bacenta ID: ${rowData.bacentaId}, Bacenta Name: ${rowData.name}, Bacenta Description: ${rowData.description}, Bacenta Location: ${rowData.location}`;
//     navigate(`/qrcode-generator?qrcode=${encodeURIComponent(qrcode)}`);
//   };

//   // Button to generate Claims
//   const handleClaimClick = (rowData) => {
//     navigate(`/claim-bacenta`);
//   };

  // Button Add New Bacenta click handler
  const handleAddButtonClick = () => {
    navigate("/add-bacenta" , { state: { foundCenter } });

  };

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  const filteredBacentas = bacentasList.filter(bacenta => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
  
    // Check if userRole is "center" and filter accordingly
    if (userRole === "center") {
      const centerId = localStorage.getItem('center'); // Get the centerId from local storage
      
      // Find the center based on the centerId
      const searchCenter = centers.find(center => center._id === centerId); // Find the center object
      
      if (!searchCenter) return false; // If no matching center, exclude this bacenta
      
      const centerName = searchCenter.centerName.toLowerCase(); // Get the centerName from the center object
      
      // Only include bacentas belonging to this center
      if (bacenta.center.toLowerCase() !== centerName) {
        return false;
      }
    }
    else if (userRole === "zone") {
      const zoneId = localStorage.getItem('zone'); // Get the centerId from local storage
      
      // Find the center based on the centerId
      const searchZone = zones.find(zone => zone._id === zoneId); // Find the center object
      
      if (!searchZone) return false; // If no matching center, exclude this bacenta
      
      const zoneName = searchZone.zoneName.toLowerCase(); // Get the centerName from the center object
      
      // Only include bacentas belonging to this center
      if (bacenta.zone.toLowerCase() !== zoneName) {
        return false;
      }
    }

    else if (userRole === "bacenta") {
      const bacentaId = localStorage.getItem('bacenta'); // Get the centerId from local storage
      
      // Find the center based on the centerId
      const searchBacenta = bacentas.find(bacenta => bacenta._id === bacentaId); // Find the center object
      
      if (!searchBacenta) return false; // If no matching center, exclude this bacenta
      
      const bacentaName = searchBacenta.bacentaName.toLowerCase(); // Get the centerName from the center object
      
      // Only include bacentas belonging to this center
      if (bacenta.bacentaName.toLowerCase() !== bacentaName) {
        return false;
      }
    }
  
    // Now filter by search query in relevant fields
    return (
      bacenta.bacentaName.toLowerCase().includes(query) ||
      bacenta.bacentaLeader.toLowerCase().includes(query) ||
      bacenta.bacentaContact.toLowerCase().includes(query) ||
      bacenta.bacentaEmail.toLowerCase().includes(query) ||
      bacenta.bacentaLocation.toLowerCase().includes(query) ||
      bacenta.bacentaDateStarted.includes(query)
      
    );
  });
  
  
 

//   // Handle row update (when user types into the grid)
//   const handleRowEdit = async (updatedRow) => {
//     const updatedBacentas = bacentasList.map((bacenta) =>
//       bacenta.ID === updatedRow.ID ? { ...bacenta, ...updatedRow } : bacenta
//     );
//     setBacentasList(updatedBacentas);  // Update local state immediately for a better user experience

//     try {
//       // Make an API call to update the bacenta on the server
//       await axios.put(`https://node-js-inventory-system.onrender.com/api/bacenta/${updatedRow.ID}`, updatedRow);
//     } catch (error) {
//       console.error('Error updating bacenta:', error);
//     }

//     return updatedRow; // Return the updated row data for the grid to process
//   };

  // Columns for DataGrid with editable fields
  const columns = [
    { field: "id", headerName: "Bacenta ID", editable: false },
    { field: "bacentaName", headerName: "Bacenta Name", flex: 1, editable: true },
    { field: "bacentaLeader", headerName: "Bacenta Leader", flex: 1, editable: true },
    { field: "bacentaContact", headerName: "Bacenta Contact", flex: 1, editable: true },
    { field: "bacentaLocation", headerName: "Bacenta Location", editable: true },
    { field: "bacentaDateStarted", headerName: "Bacenta Date Started", editable: true },
    { field: "bacentaEmail", headerName: "Bacenta Email", flex: 1, editable: true }
   
  ];


//   const handleSelectionModelChange = (selectionModel) => {
//     // Log the selection model to ensure it's working
//     console.log('Selection Model:', selectionModel);

//     // Check if the selectionModel is not empty
//     if (selectionModel && selectionModel.length > 0) {
//         const selectedBacentaIds = selectionModel.map((id) => {
//             const bacenta = bacentasList.find((bacenta) => bacenta.id === id);
//             return bacenta ? bacenta.bacentaId : null;
//         }).filter((bacentaId) => bacentaId !== null);  // Filter out any null values

//         // Show the alert with the selected bacenta IDs
//         if (selectedBacentaIds.length > 0) {
//             alert(`Selected Bacenta IDs: ${selectedBacentaIds.join(', ')}`);
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
//     navigate(`/claim-bacenta?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "requestingOfficer") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-bacenta?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "id") {
//     const requestInput = cellValue; // Get the cell value as the bacentaId
//     // URL-encode the requestInput (BacentaId)
//     const encodedInput = encodeURIComponent(requestInput);
//     // Navigate with the encoded bacentaId as a query parameter
//     navigate(`/claim-bacenta?requestInput=${encodedInput}`);
// }
// };



  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} /> 
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Bacentas List" subtitle="Managing the Bacentas" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New Bacenta
          </Button>

          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleClaimClick}
          >
            Bacenta Claims
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
            rows={filteredBacentas} 
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

export default Bacentas;