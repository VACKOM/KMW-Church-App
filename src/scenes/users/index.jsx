import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Topbar from "../global/TopBar";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [bacentas, setBacentas] = useState([]);
  const [picturePath, setPicturePath] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('https://church-management-system-39vg.onrender.com/api/users/');
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch centers, zones, bacentas in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, zRes, bRes] = await Promise.all([
          axios.get('https://church-management-system-39vg.onrender.com/api/centers/'),
          axios.get('https://church-management-system-39vg.onrender.com/api/zones/'),
          axios.get('https://church-management-system-39vg.onrender.com/api/bacentas/')
        ]);
        setCenters(cRes.data || []);
        setZones(zRes.data || []);
        setBacentas(bRes.data || []);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Failed to load centers/zones/bacentas");
      }
    };
    fetchAll();
  }, []);

  // Fetch pictures
  useEffect(() => {
    const fetchPicPath = async () => {
      try {
        const { data } = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/pictures/0000`);
        setPicturePath(data || []);
      } catch (err) {
        console.error("Error fetching user pictures:", err);
      }
    };
    fetchPicPath();
  }, []);

  // Combine data when all pieces are available

  useEffect(() => {
    if (!users.length || !centers.length || !zones.length || !bacentas.length) return;
  
    const combinedData = users.map(user => {
      const userPic = picturePath.find(pic => pic.originalName === user.userContact);
      const profileImagePath = userPic ? userPic.fileUrl : 'path/to/default.jpg';
  
      let roleNames = [];
      let centerNames = [];
      let zoneNames = [];
      let bacentaNames = [];
  
      if (Array.isArray(user.roleAssignments)) {
        user.roleAssignments.forEach(role => {
          switch (role.scopeType) {
            case "CenterLeader":
              roleNames.push("Center Leader");
              const foundCenter = centers.find(ct => ct._id === role.scopeItem);
              if (foundCenter && !centerNames.includes(foundCenter.centerName)) {
                centerNames.push(foundCenter.centerName);
              }
              break;
            case "ZoneLeader":
              roleNames.push("Zone Leader");
              const foundZone = zones.find(zz => zz._id === role.scopeItem);
              if (foundZone && !zoneNames.includes(foundZone.zoneName)) {
                zoneNames.push(foundZone.zoneName);
              }
              break;
            case "BacentaLeader":
              roleNames.push("Bacenta Leader");
              const foundBacenta = bacentas.find(bt => bt._id === role.scopeItem);
              if (foundBacenta && !bacentaNames.includes(foundBacenta.bacentaName)) {
                bacentaNames.push(foundBacenta.bacentaName);
              }
              break;
            default:
              break;
          }
        });
      }
  
      return {
        ID: user._id,
        id: user._id,
        username: user.username,
        userName: user.userName,
        contact: user.userContact,
        role: roleNames.length ? roleNames.join(", ") : "N/A",
        center: centerNames.length ? centerNames.join(", ") : "N/A",
        zone: zoneNames.length ? zoneNames.join(", ") : "N/A",
        bacenta: bacentaNames.length ? bacentaNames.join(", ") : "N/A",
        profileImagePath
      };
    });
  
    console.log("Combined User Data:", combinedData); // ✅ Full user role mapping
  
    setUsersList(combinedData);
  }, [users, picturePath, centers, zones, bacentas]);
  
  
  

  const handleAddButtonClick = () => navigate("/add-user");
  const handleSearch = (q) => setSearchQuery(q);

  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.contact?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      field: "profileImagePath",
      headerName: "Profile",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src={params.value}
            alt="Profile"
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </Box>
      )
    },
    { field: "username", headerName: "User Name", flex: 1 },
    { field: "role", headerName: "Roles", flex: 1 },
    { field: "center", headerName: "Center", flex: 1 },
    { field: "zone", headerName: "Zone", flex: 1 },
    { field: "bacenta", headerName: "Bacenta", flex: 1 },
    { field: "contact", headerName: "Contact", flex: 1 }
  ];

  return (
    <Box m="20px">
      <Topbar onSearch={handleSearch} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Users List" subtitle="Managing the Users" />
        <Button variant="contained" color="neutral" onClick={handleAddButtonClick}>
          Add New User
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6" align="center">{error}</Typography>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid rows={filteredUsers} columns={columns} />
        </Box>
      )}
    </Box>
  );
};

export default Users;
