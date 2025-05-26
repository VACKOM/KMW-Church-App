import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Topbar from "../global/TopBar";  // Import your Topbar component

const Members = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [members, setMembers] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const[picturePath,setPicturePath]= useState([]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/members/');
        setMembers(response.data);
        console.log(response.data);
        setLoading(false);  // Data is loaded
       
      } catch (error) {
        console.error('Error fetching members:', error);
        setError('Failed to load members or no members available');
        setLoading(false);  // Data loading is done, but there was an error
      }
    };
    fetchMembers();
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
        console.error("Error fetching member data:", error);
      }
    };
  
    fetchPicPath();
  }, [All]);  // Make sure `UserContact` is correctly defined and triggers a re-fetch when it changes

  console.log(picturePath.fileUrl);
 
// Update members list when members data is fetched
useEffect(() => {
  if (members.length > 0 && picturePath.length > 0) {
    const combinedData = members.map((member) => {
      // Find the picturePath that matches the member's contact number
      const memberPicture = picturePath.find(pic => pic.originalName === member.contact);
      
      // If a picture is found, set the fileUrl, otherwise set a default image or leave it empty
      const profileImagePath = memberPicture ? memberPicture.fileUrl : 'path/to/default/image.jpg'; 

      return {
        ID: member._id,
        id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        contact: member.contact,
        date_joined: member.date_joined,
        profileImagePath: profileImagePath
      };
    });

    setMembersList(combinedData);  // Update the membersList state
  }
}, [members, picturePath]); // Dependency on both members and picturePath

  // Button Add New User click handler
  const handleAddButtonClick = () => {
    navigate("/add-member");
  };

    // Button Add New Target click handler


  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state 
  };

  // Filter members based on the search query
  const filteredMembers = membersList.filter(member => {
    const query = searchQuery.toLowerCase(); // Normalize the search query
    return (
      member.firstName.toLowerCase().includes(query) ||
      member.lastName.toLowerCase().includes(query) ||
      member.contact.toLowerCase().includes(query) ||
      member.date_joined.toLowerCase().includes(query) 

     
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
    { field: "firstName", headerName: "First Name", flex: 1, editable: true },
    { field: "lastName", headerName: "Last Name", flex: 1, editable: true },
    { field: "contact", headerName: "Contact", flex: 1, editable: true },
    { field: "date_joined", headerName: "Date Joined", flex: 1, editable: true }
  ];
  



  return (
    <Box m="20px">
      <Box>
        <Topbar onSearch={handleSearch} /> 
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Members List" subtitle="Managing the Members" />
        <Box display="flex" justifyContent="flex-end" gap="10px">
          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddButtonClick}
          >
            Add New Member
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
            rows={filteredMembers} 
            columns={columns} 
        
          />
        </Box>
      )}
    </Box>
  );
};

export default Members;

