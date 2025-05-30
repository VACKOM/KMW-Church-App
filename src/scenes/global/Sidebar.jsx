import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
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

const Sidebar = ({ userRole }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const[user,setUser]= useState([]);
  const[zone,setZone]= useState([]);
  const[center,setCenter]= useState([]);
  const[bacenta,setBacenta]= useState([]);
  const[picturePath,setPicturePath]= useState([]);

  const userId = localStorage.getItem('userId');
  const zoneId = localStorage.getItem('zone');
  const centerId = localStorage.getItem('center');
  const bacentaId = localStorage.getItem('bacenta');
  const navigate = useNavigate(); // Get the navigate function
  const role = localStorage.getItem('role');
  const { logout } = useAuth();  // Accessing logout function from context
  

  // Fetch User data

  useEffect(() => {
    const fetchUser= async () => {
      try {
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/${userId}`);
        setUser(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  //const UserPicture = user.profileImagePath;

  // Fetch Zone data

  useEffect(() => {
    const fetchZone= async () => {
      try {
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/zones/${zoneId}`);
        setZone(response.data); // Adjust according to your API response
        
      } catch (error) {
        console.error("Error fetching zone:", error);
      }
    };
    fetchZone();
  }, []);

  // Fetch center data

  useEffect(() => {
    const fetchCenter= async () => {
      try {
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/centers/${centerId}`);
        setCenter(response.data); // Adjust according to your API response
        
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };
    fetchCenter();
  }, []);

   // Fetch bacenta data

   useEffect(() => {
    const fetchBacenta= async () => {
      try {
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/bacentas/${bacentaId}`);
        setBacenta(response.data); // Adjust according to your API response
        
      } catch (error) {
        console.error("Error fetching bacenta:", error);
      }
    };
    fetchBacenta();
  }, []);
  
const UserContact = user.userContact



   // Fetch Picture path

   useEffect(() => {
    const fetchPicPath = async () => {
      try {
        // Ensure UserContact is available, and pass it correctly in the API request
        const response = await axios.get(`https://church-management-system-39vg.onrender.com/api/users/picturepath/${UserContact}`);
        setPicturePath(response.data); // Adjust according to your API response
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchPicPath();
  }, [UserContact]);  // Make sure `UserContact` is correctly defined and triggers a re-fetch when it changes
  
  
  


const UserPicture = picturePath.fileUrl;// Example URL from the database';
 
console.log(UserPicture);

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
       
      // Optionally, clear any other authentication-related data stored in the app
      // localStorage.removeItem('userData');

      // Redirect to the login page after logout
      navigate('/login');
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
          </MenuItem>

         {/* Conditional rendering based on user role */}
          {/* Bishop's Sidebar */}
          {userRole === "bishop" && (
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

          {userRole === "lead_pastor" && (
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

          {userRole === "administrator" && (
            <>
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
                  ADMIN
                </Typography>
                

                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {/* {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Leader */}
                </Typography>
              </Box>
            </Box>
          )}
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Center Management
            </Typography>
            <Item
                title="Center List"
                to="/centers"
                icon={<ZoneOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Zone Management
            </Typography>
            <Item
                title="Zone List"
                to="/zones"
                icon={<ZoneOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bacenta Management
            </Typography>
              <Item
                title="Bacenta List"
                to="/bacentas"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membership Management
            </Typography>
            <Item
                title="Membership List"
                to="/members"
                icon={<MembershipOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Item
                title="Attendance"
                to="/attendance"
                icon={<AttendanceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Report Management
            </Typography>

            <Item
                title="Report Generator"
                to="/report"
                icon={<ReportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User Management
            </Typography>
            <Item
                title="User List"
                to="/users"
                icon={<UserProfileOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            <Item
                title="Profile"
                to="/profile"
                icon={<UserProfileOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              _________________________________________
          
              <Item
                title="Logout"
                to="/login"
                icon={<LogoutIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => logout()} // Pass the function reference here
              />
              {/* Add user-specific items */}
            </>
          )}

               {/* Center Leaders SideBar */}

               {userRole === "center" && (
            <>
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
                  {center.centerName}
                </Typography>

                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Leader
                </Typography>
              </Box>
            </Box>
          )}
              <Item
                title="Dashboard"
                to="/center-dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Zone Management
            </Typography>
            <Item
                title="Zone List"
                to="/zones"
                icon={<ZoneOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bacenta Management
            </Typography>
              <Item
                title="Bacenta List"
                to="/bacentas"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membership Management
            </Typography>
            <Item
                title="Membership List"
                to="/members"
                icon={<MembershipOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Item
                title="Attendance"
                to="/attendance"
                icon={<AttendanceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Report Management
            </Typography>

            <Item
                title="Report Generator"
                to="/report"
                icon={<ReportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User Management
            </Typography>
            <Item
                title="Profile"
                to="/profile"
                icon={<UserProfileOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              _________________________________________
          
              <Item
               title="Logout"
               icon={<LogoutIcon />}
               selected={selected}
               setSelected={setSelected}
               onClick={() => logout()} // Pass the function reference here
              />
              {/* Add user-specific items */}
            </>
          )}

             {/* Zone Leaders SideBar */}

            {userRole === "zone" && (
          
            <>
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
                  {zone.zoneName}
                </Typography>

                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Leader
                </Typography>
              </Box>
            </Box>
          )}
              <Item
                title="Dashboard"
                to="/zone-dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bacenta Management
            </Typography>
              <Item
                title="Bacenta List"
                to="/bacentas"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membership Management
            </Typography>
            <Item
                title="Membership List"
                to="/members"
                icon={<MembershipOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Item
                title="Attendance Recorder"
                to="/attendance"
                icon={<AttendanceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Report Management
            </Typography>

            <Item
                title="Report Generator"
                to="/report"
                icon={<ReportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User Management
            </Typography>
            <Item
                title="Profile"
                to="/profile"
                icon={<UserProfileOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              _________________________________________
          
              <Item
                title="Logout"
                to="/login"
                icon={<LogoutIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => logout()} // Pass the function reference here
              />
              
              {/* Add user-specific items */}
            </>
          )}

          {/* Bacenta Leaders SideBar */}

          {userRole === "bacenta" && (
            <>
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
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Leader
                </Typography>
              </Box>
            </Box>
          )}
              <Item
                title="Dashboard"
                to="/bacenta-dashboard"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membership Management
            </Typography>
            <Item
                title="Membership List"
                to="/members"
                icon={<MembershipOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Item
                title="Attendance Recorder"
                to="/attendance"
                icon={<AttendanceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Report Management
            </Typography>

            <Item
                title="Report Generator"
                to="/report"
                icon={<ReportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User Management
            </Typography>
            <Item
                title="Profile"
                to="/profile"
                icon={<UserProfileOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              _________________________________________
          
              <Item
                title="Logout"
                to="/login"
                icon={<LogoutIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={() => logout()} // Pass the function reference here
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
