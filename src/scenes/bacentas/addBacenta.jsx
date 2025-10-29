import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const bacentaSchema = yup.object().shape({
  bacentaID: yup.string(),
  bacentaName: yup.string().required("Bacenta name is required"),
  bacentaLeader: yup.string().required("Bacenta Leader's name is required"),
  bacentaContact: yup.string().required("Bacenta contact is required"),
  bacentaEmail: yup.string().required("Bacenta email is required"),
  bacentaLocation: yup.string().required("Bacenta location is required"),
  bacentaDateStarted: yup.date().required("Start date is required"),
  center: yup.string().required("Center is required"),
  zone: yup.string().required("Zone is required"),
});

const AddBacenta = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCenter, setUserCenter] = useState("");
  const [userZone, setUserZone] = useState("");

  // ✅ Fetch centers, zones, and user role data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, zonesRes] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/centers/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/zones/"),
        ]);

        setCenters(centersRes.data);
        setZones(zonesRes.data);

        // ✅ Parse role data from localStorage
        const roleData = localStorage.getItem("roles");
        const parsedRoles = roleData ? JSON.parse(roleData) : [];

        const adminRole = parsedRoles.find(
          (role) => role.scopeType === "administrator"
        );
        const centerLeader = parsedRoles.find(
          (role) => role.scopeType === "CenterLeader"
        );
        const zoneLeader = parsedRoles.find(
          (role) => role.scopeType === "ZoneLeader"
        );

        setIsAdmin(!!adminRole);
        if (centerLeader) setUserCenter(centerLeader.scopeItem);
        if (zoneLeader) setUserZone(zoneLeader.scopeItem);
      } catch (error) {
        console.error("Error fetching centers/zones:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Generate Bacenta ID
  const randomNum = Math.floor(Math.random() * 1000);
  const generateID = `BAC/${randomNum}`;

  // ✅ Handle Submit
  const handleSubmit = async (values) => {
    try {
      console.log("Submitting:", values);
      await axios.post("https://church-management-system-39vg.onrender.com/api/bacentas/", values);
      alert("Bacenta registered successfully!");
      navigate("/bacentas");
    } catch (error) {
      console.error("There was an error registering the bacenta!", error);
      alert("Error registering bacenta!");
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Bacenta" subtitle="Register a New Bacenta" />

      <Formik
        initialValues={{
          bacentaID: generateID,
          bacentaName: "",
          bacentaLeader: "",
          bacentaContact: "",
          bacentaEmail: "",
          bacentaLocation: "",
          bacentaDateStarted: "",
          center: isAdmin ? "" : userCenter || "",
          zone: "",
        }}
        validationSchema={bacentaSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => {
          // ✅ Filter zones dynamically
          const filteredZones = isAdmin
            ? zones.filter((zone) => zone.center === values.center)
            : zones.filter((zone) => zone.center === userCenter);

          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {/* Bacenta ID */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta ID"
                  value={values.bacentaID}
                  name="bacentaID"
                  onBlur={handleBlur}
                  disabled
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Name */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaName}
                  name="bacentaName"
                  error={!!touched.bacentaName && !!errors.bacentaName}
                  helperText={touched.bacentaName && errors.bacentaName}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Leader */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Leader"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaLeader}
                  name="bacentaLeader"
                  error={!!touched.bacentaLeader && !!errors.bacentaLeader}
                  helperText={touched.bacentaLeader && errors.bacentaLeader}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Contact */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaContact}
                  name="bacentaContact"
                  error={!!touched.bacentaContact && !!errors.bacentaContact}
                  helperText={touched.bacentaContact && errors.bacentaContact}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Email */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaEmail}
                  name="bacentaEmail"
                  error={!!touched.bacentaEmail && !!errors.bacentaEmail}
                  helperText={touched.bacentaEmail && errors.bacentaEmail}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Location */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaLocation}
                  name="bacentaLocation"
                  error={!!touched.bacentaLocation && !!errors.bacentaLocation}
                  helperText={touched.bacentaLocation && errors.bacentaLocation}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Date Started */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date Started"
                  InputLabelProps={{ shrink: true }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaDateStarted}
                  name="bacentaDateStarted"
                  error={!!touched.bacentaDateStarted && !!errors.bacentaDateStarted}
                  helperText={touched.bacentaDateStarted && errors.bacentaDateStarted}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Center Dropdown (Admin only) */}
                {isAdmin && (
                  <TextField
                    select
                    fullWidth
                    variant="filled"
                    label="Select Center"
                    name="center"
                    value={values.center}
                    onChange={handleChange}
                    error={!!touched.center && !!errors.center}
                    helperText={touched.center && errors.center}
                    sx={{ gridColumn: "span 4" }}
                  >
                    <MenuItem value="">Select a Center</MenuItem>
                    {centers.map((center) => (
                      <MenuItem key={center._id} value={center._id}>
                        {center.centerName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {/* Zone Dropdown */}
                <TextField
                  select
                  fullWidth
                  variant="filled"
                  label="Select Zone"
                  name="zone"
                  value={values.zone}
                  onChange={handleChange}
                  error={!!touched.zone && !!errors.zone}
                  helperText={touched.zone && errors.zone}
                  sx={{ gridColumn: "span 4" }}
                >
                  <MenuItem value="">Select a Zone</MenuItem>
                  {filteredZones.map((zone) => (
                    <MenuItem key={zone._id} value={zone._id}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create New Bacenta
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AddBacenta;
