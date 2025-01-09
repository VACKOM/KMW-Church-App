import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const AddAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [attendances, setAttendances] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  

  // Fetch Attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/attendances/");
        setAttendances(response.data);
        setLoading(false);  // Data is loaded
        
       
      } catch (error) {
        console.error('Error fetching attendances:', error);
        setError('Failed to load attendance or attendance not filled yet');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchAttendance();
  }, []);

  // Update attendances list when attendance data is fetched
  useEffect(() => {
    if (attendances.length > 0) {
      const combinedData = attendances.map((attendance) => {
          return {
           // id: attendance._id,
            // id: attendance.attendanceID, // Ensure each row has a unique 'id' property
            //attendanceId: attendance.attendanceId,
            dateAttendance:attendance.dateAttendance,
            id: attendance.bacentaName,
            bacentaMembership: attendance.bacentaMembership,
            adultAttendance: attendance.adultAttendance,
            childrenAttendance:attendance.childrenAttendance,
            soulsInChurch: attendance.soulsInChurch,
            newBelieversSchoolAttendance: attendance.newBelieversSchoolAttendance,
            bacentaMeetingAttendance:attendance.bacentaMeetingAttendance,
            membersAbsent: attendance.membersAbsent,
            laySchoolAttendance: attendance.laySchoolAttendance,
            // center: attendance.center
          };
        });
      setAttendanceList(combinedData);  // Update the attendancesList state
      
    }
  }, [attendances]);
 
//   // Button to generate QR Code
//   const handleButtonClick = (rowData) => {
//     console.log("Button clicked for attendance: ", rowData);
//     const qrcode = `Bacenta ID: ${rowData.attendanceId}, Bacenta Name: ${rowData.name}, Bacenta Description: ${rowData.description}, Bacenta Location: ${rowData.location}`;
//     navigate(`/qrcode-generator?qrcode=${encodeURIComponent(qrcode)}`);
//   };

//   // Button to generate Claims
//   const handleClaimClick = (rowData) => {
//     navigate(`/claim-attendance`);
//   };

  // Button Add New Attendance click handler
  const handleAddButtonClick = () => {
    navigate("/add-attendance");
  };

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Filter attendances based on the search query
  const filteredAttendance = attendanceList.filter(attendance => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
    return (
      attendance.dateAttendance.toLowerCase().includes(query) ||
      attendance.bacentaName.toLowerCase().includes(query) ||
      attendance.bacentaMembership.toLowerCase().includes(query) ||
      attendance.childrenAttendance.toLowerCase().includes(query) ||
      attendance.soulsInChurch.toLowerCase().includes(query) ||
      attendance.newBelieversSchoolAttendance.includes(query) ||
      attendance.bacentaMeetingAttendance.includes(query) ||
      attendance.membersAbsent.toLowerCase().includes(query) ||
      attendance.laySchoolAttendance.toLowerCase().includes(query)
     
    );
  });
 

//   // Handle row update (when user types into the grid)
//   const handleRowEdit = async (updatedRow) => {
//     const updatedBacentas = attendancesList.map((attendance) =>
//       attendance.ID === updatedRow.ID ? { ...attendance, ...updatedRow } : attendance
//     );
//     setBacentasList(updatedBacentas);  // Update local state immediately for a better user experience

//     try {
//       // Make an API call to update the attendance on the server
//       await axios.put(`https://node-js-inventory-system.onrender.com/api/attendance/${updatedRow.ID}`, updatedRow);
//     } catch (error) {
//       console.error('Error updating attendance:', error);
//     }

//     return updatedRow; // Return the updated row data for the grid to process
//   };

  // Columns for DataGrid with editable fields
  const columns = [
    { field: "dateAttendance", headerName: "Date", flex: 1, editable: true },
    { field: "id", headerName: "Bacenta Name", editable: false },
   // { field: "bacenataName", headerName: "Bacenta Name", flex: 1, editable: true },
    //{ field: "center", headerName: "Bacenta's Center", flex: 1, editable: false },
    { field: "bacentaMembership", headerName: "Membership", flex: 1, editable: true },
    { field: "adultAttendance", headerName: "Adult", flex: 1, editable: true },
    { field: "childrenAttendance", headerName: "Children", editable: true },
    { field: "soulsInChurch", headerName: "Souls In Church", editable: true },
    { field: "newBelieversSchoolAttendance", headerName: "New Believers", flex: 1, editable: true },
    { field: "bacentaMeetingAttendance", headerName: "Bacenta Meeting", flex: 1, editable: true },
    { field: "laySchoolAttendance", headerName: "Lay School", flex: 1, editable: true },
    { field: "membersAbsent", headerName: "Absent", flex: 1, editable: true },

    

   
  ];


//   const handleSelectionModelChange = (selectionModel) => {
//     // Log the selection model to ensure it's working
//     console.log('Selection Model:', selectionModel);

//     // Check if the selectionModel is not empty
//     if (selectionModel && selectionModel.length > 0) {
//         const selectedBacentaIds = selectionModel.map((id) => {
//             const attendance = attendancesList.find((attendance) => attendance.id === id);
//             return attendance ? attendance.attendanceId : null;
//         }).filter((attendanceId) => attendanceId !== null);  // Filter out any null values

//         // Show the alert with the selected attendance IDs
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
//     navigate(`/claim-attendance?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "requestingOfficer") {
//     requestInput = cellValue;       // Now you can reassign the value
//     navigate(`/claim-attendance?requestInput=${encodeURIComponent(requestInput)}`);
//   }
//   else if (columnName === "id") {
//     const requestInput = cellValue; // Get the cell value as the attendanceId
//     // URL-encode the requestInput (BacentaId)
//     const encodedInput = encodeURIComponent(requestInput);
//     // Navigate with the encoded attendanceId as a query parameter
//     navigate(`/claim-attendance?requestInput=${encodedInput}`);
// }
// };



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
            rows={filteredAttendance} 
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

export default AddAttendance;