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

const All= "0000";
  // Fetch Picture path

  useEffect(() => {
    
    const fetchPicPath = async () => {
      try {
        // Ensure UserContact is available, and pass it correctly in the API request
        const response = await axios.get(`http://localhost:8080/api/users/pictures/${All}`);
        setPicturePath(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchPicPath();
  }, [All]);  // Make sure `UserContact` is correctly defined and triggers a re-fetch when it changes

  console.log(picturePath.fileUrl);
 
// Update users list when users data is fetched
useEffect(() => {
  if (users.length > 0 && picturePath.length > 0) {
    const combinedData = users.map((user) => {
      // Find the picturePath that matches the user's contact number
      const userPicture = picturePath.find(pic => pic.originalName === user.userContact);
      
      // If a picture is found, set the fileUrl, otherwise set a default image or leave it empty
      const profileImagePath = userPicture ? userPicture.fileUrl : 'path/to/default/image.jpg'; 

      return {
        ID: user._id,
        id: user._id,
        username: user.username,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImagePath: profileImagePath
      };
    });

    setUsersList(combinedData);  // Update the usersList state
  }
}, [users, picturePath]); // Dependency on both users and picturePath

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
    { field: "id", headerName: "User ID", editable: false },
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
    { field: "email", headerName: "User Email", flex: 1, editable: true }
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

