import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
  } from "@mui/material";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  
  import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
  import ZoneOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
  import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
  import MembershipOutlinedIcon from "@mui/icons-material/PeopleOutlined";
  import AttendanceOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
  import ReportOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
  import UserProfileOutlinedIcon from "@mui/icons-material/PersonOutline";
  import LogoutIcon from "@mui/icons-material/Logout";
  
  import Item from "../sideBarMenu/Item.jsx"; // your custom menu item component
  
  export default function AdminAccordionMenu({ colors, selected, setSelected, logout }) {
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color={colors.grey[100]}>
            Administrator Menu
          </Typography>
        </AccordionSummary>
  
        <AccordionDetails>
          <Item
            title="Dashboard"
            to="/dashboard"
            icon={<DashboardOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Center Management
          </Typography>
          <Item
            title="Center List"
            to="/centers"
            icon={<ZoneOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Zone Management
          </Typography>
          <Item
            title="Zone List"
            to="/zones"
            icon={<ZoneOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Bacenta Management
          </Typography>
          <Item
            title="Bacenta List"
            to="/bacentas"
            icon={<CategoryOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
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
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Report Management
          </Typography>
          <Item
            title="Report Generator"
            to="/report"
            icon={<ReportOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
  
          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
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
  
  <Box mt={2}>
  <Item
    title="Logout"
    icon={<LogoutIcon />}
    selected={selected}
    setSelected={setSelected}
    onClick={logout} // works without `to`
  />
</Box>
        </AccordionDetails>
      </Accordion>
    );
  }
  