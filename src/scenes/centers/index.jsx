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
//   const [centers, setCenters] = useState([]);
//   const [centersList, setCentersList] = useState([]);
//   const [loading, setLoading] = useState(true); // Add a loading state
//   const [error, setError] = useState(null); // Add an error state
//   const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  

//   // Fetch centers
//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const response = await axios.get('https://node-js-inventory-system.onrender.com/api/asset/');
//         setCenters(response.data);
//         setLoading(false);  // Data is loaded
//       } catch (error) {
//         console.error('Error fetching centers:', error);
//         setError('Failed to load centers or no centers available');
//         setLoading(false);  // Data loading is done, but there was an error
//       }
//     };
//     fetchCenters();
//   }, []);

//   // Update centers list when centers data is fetched
//   useEffect(() => {
//     if (centers.length > 0) {
//       const combinedData = centers
//         .filter((asset) => asset.quantity > 0)  // Filter out centers with quantity 0
//         .map((asset) => {
//           return {
//             ID: asset._id,
//             id: asset.assetId, // Ensure each row has a unique 'id' property
//             assetId: asset.assetId,
//             name: asset.name,
//             description: asset.description,
//             quantity: asset.quantity ? asset.quantity : 0,
//             qtyTaken: asset.qtyTaken,
//             requestingOfficer: asset.requestingOfficer,
//             requestContact: asset.requestContact,
//             location: asset.location,
//             category: asset.category,
//             access: asset.access, // Assuming you have 'access' in your asset data
//           };
//         });
//       setCentersList(combinedData);  // Update the centersList state
//     }
//   }, [centers]);
  

//   // Button to generate QR Code
//   const handleButtonClick = (rowData) => {
//     console.log("Button clicked for asset: ", rowData);
//     const qrcode = `Asset ID: ${rowData.assetId}, Asset Name: ${rowData.name}, Asset Description: ${rowData.description}, Asset Location: ${rowData.location}`;
//     navigate(`/qrcode-generator?qrcode=${encodeURIComponent(qrcode)}`);
//   };

//   // Button to generate Claims
//   const handleClaimClick = (rowData) => {
//     navigate(`/claim-asset`);
//   };

  // Button Add New Asset click handler
  const handleAddButtonClick = () => {
    navigate("/add-center");
  };

//   const handleSearch = (query) => {
//     setSearchQuery(query); // Update the search query state 
//   };

//   // Filter centers based on the search query
//   const filteredCenters = centersList.filter(asset => {
//     const query = searchQuery.toLowerCase(); // Normalize the search query
//     return (
//       asset.name.toLowerCase().includes(query) ||
//       asset.description.toLowerCase().includes(query) ||
//       asset.requestingOfficer.toLowerCase().includes(query) ||
//       asset.requestContact.toLowerCase().includes(query)
//     );
//   });

//   // Handle row update (when user types into the grid)
//   const handleRowEdit = async (updatedRow) => {
//     const updatedCenters = centersList.map((asset) =>
//       asset.ID === updatedRow.ID ? { ...asset, ...updatedRow } : asset
//     );
//     setCentersList(updatedCenters);  // Update local state immediately for a better user experience

//     try {
//       // Make an API call to update the asset on the server
//       await axios.put(`https://node-js-inventory-system.onrender.com/api/asset/${updatedRow.ID}`, updatedRow);
//     } catch (error) {
//       console.error('Error updating asset:', error);
//     }

//     return updatedRow; // Return the updated row data for the grid to process
//   };

//   // Columns for DataGrid with editable fields
//   const columns = [
//     { field: "id", headerName: "Asset ID", editable: false },
//     { field: "name", headerName: "Asset Name", flex: 1, editable: true },
//     { field: "description", headerName: "Description", flex: 1, editable: true },
//     { field: "quantity", headerName: "Quantity", type: "number", headerAlign: "left", align: "left", editable: true },
//     { field: "requestingOfficer", headerName: "Requesting Officer", flex: 1, editable: true },
//     { field: "requestContact", headerName: "Contact", flex: 1, editable: true },
//     {
//       field: "qrCode", // This field represents the button
//       headerName: "QR Code",
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="neutral"
//           onClick={() => handleButtonClick(params.row)} // Use the row data as needed
//         >
//           Generate
//         </Button>
//       ),
//       width: 150, // You can adjust the width as needed
//     },
//   ];


//   const handleSelectionModelChange = (selectionModel) => {
//     // Log the selection model to ensure it's working
//     console.log('Selection Model:', selectionModel);

//     // Check if the selectionModel is not empty
//     if (selectionModel && selectionModel.length > 0) {
//         const selectedAssetIds = selectionModel.map((id) => {
//             const asset = centersList.find((asset) => asset.id === id);
//             return asset ? asset.assetId : null;
//         }).filter((assetId) => assetId !== null);  // Filter out any null values

//         // Show the alert with the selected asset IDs
//         if (selectedAssetIds.length > 0) {
//             alert(`Selected Asset IDs: ${selectedAssetIds.join(', ')}`);
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
//     navigate(`/claim-asset?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "requestingOfficer") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-asset?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "id") {
//     const requestInput = cellValue; // Get the cell value as the assetId
//     // URL-encode the requestInput (AssetId)
//     const encodedInput = encodeURIComponent(requestInput);
//     // Navigate with the encoded assetId as a query parameter
//     navigate(`/claim-asset?requestInput=${encodedInput}`);
// }
// };



  return (
    <Box m="20px">
      <Box>
        {/* <Topbar onSearch={handleSearch} /> Pass the handleSearch function */}
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
            onClick={handleClaimClick}
          >
            Asset Claims
          </Button> */}
        </Box>
      </Box>

      {/* {loading ? (
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
            processRowUpdate={handleRowEdit} // Handle row edits
            onCellClick={handleCellClick}  // Add this to handle cell clicks
            onSelectionModelChange={handleSelectionModelChange}  // Correct event handler for checkbox clicks
          />
        </Box>
      )} */}
    </Box>
  );
};

export default Centers;

