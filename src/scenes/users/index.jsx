import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const Users = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [centers, setCenters] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [zones, setZones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const[picturePath,setPicturePath]= useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://church-management-system-39vg.onrender.com/api/users/');
        setUsers(response.data);
        console.log(response.data);
        setLoading(false);  // Data is loaded
       
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users or no users available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchUsers();
  }, []);

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

  
  // Fetch zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
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
  
  


const All= "0000";
  // Fetch Picture path

  useEffect(() => {
    
    const fetchPicPath = async () => {
      try {
        // Ensure UserContact is available, and pass it correctly in the API request
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/pictures/${All}`);
        setPicturePath(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchPicPath();
  }, [All]);  // Make sure `UserContact` is correctly defined and triggers a re-fetch when it changes

  //console.log(picturePath.fileUrl);
 
  useEffect(() => {
    if (users.length > 0 && picturePath.length > 0) {
      const combinedData = users.map((user) => {
        const userPicture = picturePath.find(pic => pic.originalName === user.userContact);
        const profileImagePath = userPicture ? userPicture.fileUrl : 'path/to/default/image.jpg'; 
  
        const userCenter = centers.find(center => center._id === user.centerId);
        const centerName = userCenter ? userCenter.centerName : "N/A";

        const userZone = zones.find(zone => zone._id === user.zoneId);
        const zoneName = userZone ? userZone.zoneName : "N/A";

        const userBacenta = bacentas.find(bacenta => bacenta._id === user.bacentaId);
        const bacentaName = userBacenta? userBacenta.bacentaName : "N/A";

        //console.log(bacentas);
  
        return {
          ID: user._id,
          id: user._id,
          username: user.username,
          userName: user.userName,
          contact: user.userContact,
          role: user.role,
          center: centerName,  // Display name only
          zone: zoneName,
          bacenta: bacentaName,
          profileImagePath: profileImagePath
        };
      });
  
      setUsersList(combinedData);
    }
  }, [users, picturePath, centers]);
  

  // Button Add New User click handler
  const handleAddButtonClick = () => {
    navigate("/add-user");
  };

    // Button Add New Target click handler


  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Filter users based on the search query
  const filteredUsers = usersList.filter(user => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
    return (
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) 

     
    );
  });
 

  // Columns for DataGrid with editable fields
  const columns = [
    //{ field: "id", headerName: "User ID", editable: false },
    {
      field: "profileImagePath", 
      headerName: "Profile Image", 
      flex: 1, 
      editable: true,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={params.value} 
              alt="Profile" 
              style={{
                width: 50,  // Set width as per your need
                height: 50, // Set height as per your need
                borderRadius: '50%', // Make the image circular
                objectFit: 'cover'  // Ensure the image covers the space without distortion
              }}
            />
          </Box>
        );
      }
    },
    { field: "username", headerName: "User Name", flex: 1, editable: true },
    { field: "role", headerName: "User Role", flex: 1, editable: true },
    { field: "center", headerName: "User Center", flex: 1, editable: true },
    { field: "zone", headerName: "User Zone", flex: 1, editable: true },
    { field: "bacenta", headerName: "User Bacenta", flex: 1, editable: true },
    { field: "contact", headerName: "User Contact", flex: 1, editable: true }
  ];
  



  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} /> 
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Users List" subtitle="Managing the Users" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New User
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
            //checkboxSelection 
            rows={filteredUsers} 
            columns={columns} 
        
          />
        </Box>
      )}
    </Box>
  );
};

export default Users;

