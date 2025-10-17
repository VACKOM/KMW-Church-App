import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ScopeSelect = ({ assignment, index, setFieldValue, datasets }) => {
  const { center, zone, bacenta } = datasets;

  // Pick correct dataset based on scopeType
  let options = [];
  if (assignment.scopeType === "CenterLeader" || assignment.scopeType === "Center") {
    options = center;
  } else if (assignment.scopeType === "ZoneLeader"|| assignment.scopeType === "Zone") {
    options = zone;
  } else if (assignment.scopeType === "BacentaLeader"|| assignment.scopeType === "Bacenta") {
    options = bacenta;
  }

  // Function to auto-detect label field
  const getLabel = (item) => {
    return (
      item.name ||
      item.centerName ||
      item.zoneName ||
      item.bacentaName ||
      item.title || // fallback if your schema uses `title`
      item.label || // generic fallback
      "Unnamed"
    );
  };

  return (
    <>
      {assignment.scopeType && assignment.scopeType !== "None" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>{assignment.scopeType}</InputLabel>
          <Select
            value={assignment.scopeItem || ""}
            onChange={(e) =>
              setFieldValue(`roleAssignments[${index}].scopeItem`, e.target.value)
            }
          >
            {options.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {getLabel(item)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default ScopeSelect;
