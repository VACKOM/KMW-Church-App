// import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from "../../components/Header";
// import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
// import Topbar from "../global/TopBar";  // Import your Topbar component

// const Members = ({}) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [members, setMembers] = useState([]);
//   const [membersList, setMembersList] = useState([]);
//   const [loading, setLoading] = useState(true); // Add a loading state
//   const [error, setError] = useState(null); // Add an error state
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate(); // Initialize the navigate function
//   const[picturePath,setPicturePath]= useState([]);

//   // Fetch members
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await axios.get('https://church-management-system-39vg.onrender.com/api/members/');
//         setMembers(response.data);
//         //console.log(response.data);
//         setLoading(false);  // Data is loaded

//       } catch (error) {
//         console.error('Error fetching members:', error);
//         setError('Failed to load members or no members available');
//         setLoading(false);  // Data loading is done, but there was an error
//       }
//     };
//     fetchMembers();
//   }, []);

// const All= "0000";
//   // Fetch Picture path

//   useEffect(() => {

//     const fetchPicPath = async () => {
//       try {
//         // Ensure UserContact is available, and pass it correctly in the API request
//         const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/pictures/${All}`);
//         setPicturePath(response.data); // Adjust according to your API response
//       } catch (error) {
//         console.error("Error fetching member data:", error);
//       }
//     };

//     fetchPicPath();
//   }, [All]);  // Make sure `UserContact` is correctly defined and triggers a re-fetch when it changes

//   //console.log(picturePath.fileUrl);

// // Update members list when members data is fetched
// useEffect(() => {
//   if (members.length > 0 && picturePath.length > 0) {
//     const combinedData = members.map((member) => {
//       // Find the picturePath that matches the member's contact number
//       const memberPicture = picturePath.find(pic => pic.originalName === member.contact);

//       // If a picture is found, set the fileUrl, otherwise set a default image or leave it empty
//       const profileImagePath = memberPicture ? memberPicture.fileUrl : 'path/to/default/image.jpg'; 

//       return {
//         ID: member._id,
//         id: member._id,
//         firstName: member.firstName,
//         lastName: member.lastName,
//         contact: member.contact,
//         date_joined: member.date_joined,
//         profileImagePath: profileImagePath
//       };
//     });

//     setMembersList(combinedData);  // Update the membersList state
//   }
// }, [members, picturePath]); // Dependency on both members and picturePath

//   // Button Add New User click handler
//   const handleAddButtonClick = () => {
//     navigate("/add-member");
//   };

//     // Button Add New Target click handler


//   const handleSearch = (query) => {
//     setSearchQuery(query); // Update the search query state 
//   };

//   // Filter members based on the search query
//   const filteredMembers = membersList.filter(member => {
//     const query = searchQuery.toLowerCase(); // Normalize the search query
//     return (
//       member.firstName.toLowerCase().includes(query) ||
//       member.lastName.toLowerCase().includes(query) ||
//       member.contact.toLowerCase().includes(query) ||
//       member.date_joined.toLowerCase().includes(query) 


//     );
//   });


//   // Columns for DataGrid with editable fields
//   const columns = [
//     { field: "id", headerName: "User ID", editable: false },
//     {
//       field: "profileImagePath", 
//       headerName: "Profile Image", 
//       flex: 1, 
//       editable: true,
//       renderCell: (params) => {
//         return (
//           <Box display="flex" justifyContent="center" alignItems="center">
//             <img
//               src={params.value} 
//               alt="Profile" 
//               style={{
//                 width: 50,  // Set width as per your need
//                 height: 50, // Set height as per your need
//                 borderRadius: '50%', // Make the image circular
//                 objectFit: 'cover'  // Ensure the image covers the space without distortion
//               }}
//             />
//           </Box>
//         );
//       }
//     },
//     { field: "firstName", headerName: "First Name", flex: 1, editable: true },
//     { field: "lastName", headerName: "Last Name", flex: 1, editable: true },
//     { field: "contact", headerName: "Contact", flex: 1, editable: true },
//     { field: "date_joined", headerName: "Date Joined", flex: 1, editable: true }
//   ];




//   return (
//     <Box m="20px">
//       <Box>
//         <Topbar onSearch={handleSearch} /> 
//       </Box>

//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Header title="Members List" subtitle="Managing the Members" />
//         <Box display="flex" justifyContent="flex-end" gap="10px">
//           <Button
//             variant="contained"
//             color="neutral"
//             onClick={handleAddButtonClick}
//           >
//             Add New Member
//           </Button>

//         </Box>
//       </Box>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error" variant="h6" align="center">{error}</Typography>
//       ) : (
//         <Box m="40px 0 0 0" height="75vh">
//           <DataGrid 
//             //checkboxSelection 
//             rows={filteredMembers} 
//             columns={columns} 

//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Members;



// Above code is for individual Membership..........................


import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Topbar from "../global/TopBar";

const Membership = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [zones, setZones] = useState([]);
  const [filteredMembership, setFilteredMembership] = useState([]);

  const [scopeType, setScopeType] = useState(null);
  const [scopeItem, setScopeItem] = useState(null);
  const [userCenterName, setUserCenterName] = useState("All Centers");

  // ✅ Determine user access scope
  useEffect(() => {
    const roleData = localStorage.getItem("roles");
    const roleAssignments = roleData ? JSON.parse(roleData) : [];

    const assignedRole = roleAssignments[0]; // Assume one primary role
    if (assignedRole) {
      setScopeType(assignedRole.scopeType);
      setScopeItem(assignedRole.scopeItem);
    } else {
      setScopeType("Administrator");
      setScopeItem("ALL");
    }
  }, []);

  // ✅ Fetch centers, zones, bacentas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, zonesRes, bacentasRes] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/centers/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/zones/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/"),
        ]);

        setCenters(centersRes.data);
        setZones(zonesRes.data);
        setBacentas(bacentasRes.data);
      } catch (err) {
        setError("Error fetching structure data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ✅ Fetch membership and filter by scope
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const { data } = await axios.get("https://church-management-system-39vg.onrender.com/api/membership/");

        let filtered = data;

        if (scopeType === "CenterLeader") {
          filtered = data.filter((m) => m.center === scopeItem);
        } else if (scopeType === "ZoneLeader") {
          filtered = data.filter((m) => m.zone === scopeItem);
        } else if (scopeType === "BacentaLeader") {
          filtered = data.filter((m) => m.bacenta === scopeItem);
        } else if (scopeType === "administrator" || scopeItem === "ALL") {
          filtered = data;
        }

        setFilteredMembership(filtered);
      } catch (err) {
        setError("Error fetching membership data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (scopeType) fetchMembership();
  }, [scopeType, scopeItem]);

  // ✅ Handle search
  const handleSearch = (query) => setSearchQuery(query);

  // ✅ Merge names
  const membershipWithNames = filteredMembership.map((m) => {
    const centerName =
      centers.find((c) => c._id === m.center)?.centerName || "Unknown Center";
    const zoneName =
      zones.find((z) => z._id === m.zone)?.zoneName || "Unknown Zone";
    const bacentaName =
      bacentas.find((b) => b._id === m.bacenta)?.bacentaName || "Unknown Bacenta";

    return {
      ...m,
      centerName,
      zoneName,
      bacentaName,
    };
  });

  const finalMembership = membershipWithNames.filter((membership) => {
    const q = searchQuery.toLowerCase();
    return (
      membership.centerName.toLowerCase().includes(q) ||
      membership.zoneName.toLowerCase().includes(q) ||
      membership.bacentaName.toLowerCase().includes(q)
    );
  });

  // ✅ Totals
  const totalMembers = finalMembership.reduce(
    (acc, m) => acc + (m.membershipCount || 0),
    0
  );

  const totalCenters = new Set(finalMembership.map((m) => m.centerName)).size;
  const totalZones = new Set(finalMembership.map((m) => m.zoneName)).size;
  const totalBacentas = new Set(finalMembership.map((m) => m.bacentaName)).size;

  const columns = [
    { field: "centerName", headerName: "Center", flex: 1 },
    { field: "zoneName", headerName: "Zone", flex: 1 },
    { field: "bacentaName", headerName: "Bacenta", flex: 1 },
    { field: "membershipCount", headerName: "Members", flex: 1 },
  ];

  const rows = finalMembership.map((m, index) => ({
    id: index + 1,
    centerName: m.centerName,
    zoneName: m.zoneName,
    bacentaName: m.bacentaName,
    membershipCount: m.membershipCount,
  }));

  const StatCard = ({ title, value, color }) => (
    <Card
      sx={{
        backgroundColor: color,
        color: colors.grey[100],
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" mt={1}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box m="20px">
      <Topbar onSearch={handleSearch} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header
          title="Membership Summary"
          subtitle="Overview of Membership by Bacenta"
        />
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Members" value={totalMembers} color={colors.greenAccent[700]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Centers" value={totalCenters} color={colors.blueAccent[700]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Zones" value={totalZones} color={colors.primary[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Bacentas" value={totalBacentas} color={colors.redAccent[700]} />
        </Grid>
      </Grid>

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
          No membership data available.
        </Typography>
      ) : (
        <Box m="20px 0 0 0" height="75vh">
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

export default Membership;

