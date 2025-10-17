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
  
  export default function BacentaAccordionMenu({ colors, selected, setSelected, logout }) {
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color={colors.grey[100]}>
            Bacenta Menu
          </Typography>
        </AccordionSummary>
  
        <AccordionDetails>
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

        </AccordionDetails>
      </Accordion>
    );
  }
  