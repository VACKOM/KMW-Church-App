import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const Centers = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [centers, setCenters] = useState([]);
  const [centersList, setCentersList] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get('https://church-management-system-39vg.onrender.com/api/centers/');
        setCenters(response.data);
        setLoading(false);  // Data is loaded
       
      } catch (error) {
        console.error('Error fetching centers:', error);
        setError('Failed to load centers or no centers available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchCenters();
  }, []);

  // Update centers list when centers data is fetched
  useEffect(() => {
    if (centers.length > 0) {
      const combinedData = centers.map((center) => {
          return {
            ID: center._id,
            id: center.centerID, // Ensure each row has a unique 'id' property
            //centerId: center.centerId,
            centerName: center.centerName,
            centerLeader: center.centerLeader,
            centerContact: center.centerContact,
            centerEmail: center.centerEmail
            
          };
        });
      setCentersList(combinedData);  // Update the centersList state
      
    }
  }, [centers]);
 
//   // Button to generate QR Code
//   const handleButtonClick = (rowData) => {
//     console.log("Button clicked for center: ", rowData);
//     const qrcode = `Center ID: ${rowData.centerId}, Center Name: ${rowData.name}, Center Description: ${rowData.description}, Center Location: ${rowData.location}`;
//     navigate(`/qrcode-generator?qrcode=${encodeURIComponent(qrcode)}`);
//   };

//   // Button to generate Claims
//   const handleClaimClick = (rowData) => {
//     navigate(`/claim-center`);
//   };

  // Button Add New Center click handler
  const handleAddButtonClick = () => {
    navigate("/add-center");
  };

    // Button Add New Target click handler


  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Filter centers based on the search query
  const filteredCenters = centersList.filter(center => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
    return (
      center.centerName.toLowerCase().includes(query) ||
      center.centerLeader.toLowerCase().includes(query) ||
      center.centerContact.toLowerCase().includes(query) ||
      center.centerEmail.toLowerCase().includes(query) 
     
    );
  });
 

//   // Handle row update (when user types into the grid)
//   const handleRowEdit = async (updatedRow) => {
//     const updatedCenters = centersList.map((center) =>
//       center.ID === updatedRow.ID ? { ...center, ...updatedRow } : center
//     );
//     setCentersList(updatedCenters);  // Update local state immediately for a better user experience

//     try {
//       // Make an API call to update the center on the server
//       await axios.put(`https://node-js-inventory-system.onrender.com/api/center/${updatedRow.ID}`, updatedRow);
//     } catch (error) {
//       console.error('Error updating center:', error);
//     }

//     return updatedRow; // Return the updated row data for the grid to process
//   };

  // Columns for DataGrid with editable fields
  const columns = [

    { field: "id", headerName: "Center ID", editable: false },
    { field: "centerName", headerName: "Center Name", flex: 1, editable: true },
    { field: "centerLeader", headerName: "Center Pastor", flex: 1, editable: true },
    { field: "centerContact", headerName: "Center Contact", flex: 1, editable: true },
    { field: "centerEmail", headerName: "Center Email", flex: 1, editable: true }
   
  ];


//   const handleSelectionModelChange = (selectionModel) => {
//     // Log the selection model to ensure it's working
//     console.log('Selection Model:', selectionModel);

//     // Check if the selectionModel is not empty
//     if (selectionModel && selectionModel.length > 0) {
//         const selectedCenterIds = selectionModel.map((id) => {
//             const center = centersList.find((center) => center.id === id);
//             return center ? center.centerId : null;
//         }).filter((centerId) => centerId !== null);  // Filter out any null values

//         // Show the alert with the selected center IDs
//         if (selectedCenterIds.length > 0) {
//             alert(`Selected Center IDs: ${selectedCenterIds.join(', ')}`);
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
//     navigate(`/claim-center?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "requestingOfficer") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-center?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "id") {
//     const requestInput = cellValue; // Get the cell value as the centerId
//     // URL-encode the requestInput (CenterId)
//     const encodedInput = encodeURIComponent(requestInput);
//     // Navigate with the encoded centerId as a query parameter
//     navigate(`/claim-center?requestInput=${encodedInput}`);
// }
// };



  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} /> 
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Centers List" subtitle="Managing the Centers" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New Center
          </Button>

          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleAddTargetClick}
          >
            Add Yearly Target
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
            rows={filteredCenters} 
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

export default Centers;

