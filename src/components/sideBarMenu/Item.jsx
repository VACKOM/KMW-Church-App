import { MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

export default function Item({ title, to, icon, selected, setSelected, onClick }) {
  const handleClick = () => {
    setSelected(title);
    if (onClick) {
      onClick(); // run logout or custom logic
    }
  };

  if (to) {
    return (
      <MenuItem
        component={Link}
        to={to}
        selected={selected === title}
        onClick={handleClick}
      >
        {icon}
        {title}
      </MenuItem>
    );
  }

  // fallback for Logout
  return (
    <MenuItem
      selected={selected === title}
      onClick={handleClick}
    >
      {icon}
      {title}
    </MenuItem>
  );
}
