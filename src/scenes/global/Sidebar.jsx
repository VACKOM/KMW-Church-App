import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery ,Accordion,AccordionSummary,AccordionDetails,} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { useAuth } from '../../context/AuthContext';
//import UserPicture from '../../components/assets/images/female.jpg';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MembershipOutlinedIcon from '@mui/icons-material/Groups2';
import AttendanceOutlinedIcon from '@mui/icons-material/FactCheck';
import ReportOutlinedIcon from '@mui/icons-material/Assessment';
import UserProfileOutlinedIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import ZoneOutlinedIcon from '@mui/icons-material/Grain';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdminAccordionMenu from '../../components/sideBarMenu/AdminAccordionMenu.jsx'
import CenterAccordionMenu from '../../components/sideBarMenu/CenterAccordionMenu.jsx'
import BacentaAccordionMenu from "../../components/sideBarMenu/BacentaAccordionMenu.jsx";
import ZoneAccordionMenu from '../../components/sideBarMenu/ZoneAccordionMenu.jsx'
import { fetchScopeDetails } from "../../utils/fetchScopeDetails.js";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={(e) => {
        setSelected(title); // Set the selected state
        if (onClick) onClick(e); // Call onClick handler if it's passed in
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ roleAssignments }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useState({});
  const[zone,setZone]= useState([]);
  const[center,setCenter]= useState([]);
  const[bacenta,setBacenta]= useState([]);
  const[picturePath,setPicturePath]= useState([]);

  // Get the stored string
const storedUser = localStorage.getItem('user');

// Convert it to an object
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// Safely grab the id
const userId = parsedUser?.id;

//console.log(userId); // -> "68c2a7ee251ee8ff7232110a"
  // const zoneId = localStorage.getItem('zone');
  // const centerId = localStorage.getItem('center');
  // const bacentaId = localStorage.getItem('bacenta');
  const navigate = useNavigate(); // Get the navigate function
  //const role = localStorage.getItem('role');
  const { logout } = useAuth();  // Accessing logout function from context
  // console.log(roleAssignments)
  // console.log(roleAssignments[0].scopeType)
  const scopeItems = roleAssignments.map(r => r.scopeItem);

  //console.log("All scope items:", scopeItems);

  // Fetch User data

  useEffect(() => {
    const fetchUser= async () => {
      try {
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/${userId}`);
        setUser(response.data); // Adjust according to your API response
        //console.log("User detail", response.data)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  //const UserPicture = user.profileImagePath;

  // Fetch Zone data
  

  // useEffect(() => {
  //   const fetchZone= async () => {
  //     try {
  //       const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/zones/${zoneId}`);
  //       setZone(response.data); // Adjust according to your API response
        
  //     } catch (error) {
  //       console.error("Error fetching zone:", error);
  //     }
  //   };
  //   fetchZone();
  // }, []);

  // Fetch center data

  // useEffect(() => {
  //   const fetchCenter= async () => {
  //     try {
  //       const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/centers/${centerId}`);
  //       setCenter(response.data); // Adjust according to your API response
        
  //     } catch (error) {
  //       console.error("Error fetching center:", error);
  //     }
  //   };
  //   fetchCenter();
  // }, []);

   // Fetch bacenta data

  //  useEffect(() => {
  //   const fetchBacenta= async () => {
  //     try {
  //       const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/bacentas/${bacentaId}`);
  //       setBacenta(response.data); // Adjust according to your API response
        
  //     } catch (error) {
  //       console.error("Error fetching bacenta:", error);
  //     }
  //   };
  //   fetchBacenta();
  // }, []);

// fetching all scopes eg. Center, Zones and Bacenta Details from Database
  useEffect(() => {
    if (roleAssignments?.length) {
      fetchScopeDetails(roleAssignments).then((data) => {
        //console.log("Scope Details:", data);
        // Do something with the fetched center/zone/bacenta details
      });
    }
  }, [roleAssignments]);

const UserContact = user?.userContact || null;

//console.log(UserContact);


   // Fetch Picture path

   useEffect(() => {
    if (!UserContact) return;   // ✅ Don’t run until we actually have a value
    const fetchPicPath = async () => {
      try {
        const response = await axios.get(
          `https://church-management-system-39vg.onrender.com/api/users/picturepath/${UserContact}`
        );
        setPicturePath(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchPicPath();
  }, [UserContact]);
  
  
  


const UserPicture = picturePath.fileUrl;// Example URL from the database';
 
//console.log(UserPicture);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  // To handle logout---------------

  const handleLogout = async () => {

   
   
    try {
      
      // Call the backend logout route to clear any server-side sessions or tokens.
      await axios.post('https://church-management-system-39vg.onrender.com/api/auth/logout'); // Replace with your logout route

      // Remove the token or session from localStorage or sessionStorage
      localStorage.removeItem('token'); // Or sessionStorage.removeItem('token'), depending on where you store it
      sessionStorage.clear();
      // Optionally, clear any other authentication-related data stored in the app
      // localStorage.removeItem('userData');

      // Redirect to the login page after logout
      //navigate('/login');
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    
    <Box
      sx={{
        display: "flex",
    height: "100vh", // Full height of the page
    "& .pro-sidebar-inner": {
      background: `${colors.primary[400]} !important`,
      height: "100vh !important",
      overflow: "hidden", // Prevent scroll on inner sidebar content
      display: "flex",
      justifyContent: "center", // Center content horizontally
      alignItems: "center", // Center content vertically
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },

        
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h4" color={colors.grey[100]}>
                  KMWCI
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
             {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={UserPicture}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.username}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]} sx={{ m: "20px 0 0 0" }}>
                  {bacenta.bacentaName}
                </Typography>

                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {/* {roleAssignments.charAt(0).toUpperCase() + roleAssignments.slice(1)} Leader */}
                </Typography>
              </Box>
            </Box>
          )}
          </MenuItem>

         {/* Conditional rendering based on user role */}
          {/* Bishop's Sidebar */}
          {roleAssignments === "bishop" && (
            <>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Admin Panel"
                to="/admin"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* Add more items for admins */}
            </>
          )}

          {/* Lead-Pastor's Sidebar */}

          {roleAssignments === "lead_pastor" && (
            <>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Centers List"
                to="/centers"
                icon={<InventoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* Add manager-specific items */}
            </>
          )}

          
          {/* Administrators SideBar */}
{roleAssignments[0].scopeType === "administrator" && (
  <>

    {/* Accordion Menu Component */}
    <AdminAccordionMenu
      colors={colors}
      selected={selected}
      setSelected={setSelected}
      logout={logout}
    />
  </>
)}


               {/* Center Leaders SideBar */}

               {roleAssignments[0].scopeType === "CenterLeader" && (
            <>
            
              {/* Accordion Menu Component */}
    <CenterAccordionMenu
      colors={colors}
      selected={selected}
      setSelected={setSelected}
      logout={logout}
    />
            </>
          )}

             {/* Zone Leaders SideBar */}

             {roleAssignments.some(role => role.scopeType === "ZoneLeader") && (
            
            <>
            
             <ZoneAccordionMenu
      colors={colors}
      selected={selected}
      setSelected={setSelected}
      logout={logout}
    />
              {/* Add user-specific items */}
            </>
          )}



          {/* Bacenta Leaders SideBar */}

          {roleAssignments.some(role => role.scopeType === "BacentaLeader") && (
            
            <>
            
             <BacentaAccordionMenu
      colors={colors}
      selected={selected}
      setSelected={setSelected}
      logout={logout}
    />
              {/* Add user-specific items */}
            </>
          )}

        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
