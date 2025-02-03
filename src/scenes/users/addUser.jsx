import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Input } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";

// Validation Schema
const UserSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().required("Email is required"),
  role: yup.string().required("Role is required"),
  center: yup.string().required("Center is required"),
  zone: yup.string().required("Zone is required"),
  bacenta: yup.string().required("Bacenta is required"),
  profileImage: yup.mixed().required("Profile image is required"),  // Added validation for profile image
});

const User = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [bacenta, setBacenta] = useState([]);
  const [zone, setZone] = useState([]);
  const [center, setCenter] = useState([]);
  const [foundCenter, setFoundCenter] = useState();
  const [foundZone, setFoundZone] = useState([]);
  const [foundBacenta, setFoundBacenta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Loading state to prevent form submission before data is ready
  const [centerID, setCenterID] = useState();
  const [zoneID, setZoneID] = useState([]);
  const [bacentaID, setBacentaID] = useState();
  const [profileImage, setProfileImage] = useState(null);  // State to store the image file

  // Fetch zones data and filter by center
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/zones/");
        setZone(response.data);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching zone:", error);
      }
    };
    fetchZones();
  }, []);

  // Fetch center data
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/centers/");
        setCenter(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    const fetchBacenta = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
        console.log("Fetched Bacenta Data:", response.data);  // Check the structure of the response
        setBacenta(response.data);  // Store the fetched bacenta data
      } catch (error) {
        console.error("Error fetching bacenta:", error);
      }
    };
    fetchBacenta();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("permissions", JSON.stringify(values.permissions));
    formData.append("centerId", centerID);
    formData.append("bacentaId", bacentaID);
    formData.append("zoneId", zoneID);
    formData.append("email", values.email)

    if (profileImage) {
      formData.append("profileImage", profileImage);  // Append the selected profile image
    }
      // Log the FormData contents
  for (let [key, value] of formData.entries()) {
    console.log(key + ": " + value);
  }

    try {
      const response = await axios.post('http://localhost:8080/api/users/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Ensure the request is sent as multipart
        },
      });
      alert('User registered successfully!');
      navigate("/users");
    } catch (error) {
      console.error('There was an error registering the user!', error);
      alert('Error registering user');
    }
  };

  // Function to generate a random 8-character password
const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$&#";
    let password = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  // Ensure that the form doesn't render until the zone data has been fetched
  if (isLoading) {
    return <div>Loading...</div>;  // Loading screen while waiting for data
  }

  return (
    <Box m="20px">
      <Header title="Create User" subtitle="Create a New User" />

      <Formik
        initialValues={{
          username: '',
          password: generateRandomPassword(), // Automatically set the password here,
          zone: zoneID, 
          bacenta: '',
          role: '',
          center: centerID,
          email:'',
          permissions: [
            'member:add','member:view', 'member:edit', 'bacenta:view','dashboard:view', 
            'report:view', 'donation:view', 'attendance:view'
         ],
          profileImage: null,  // Initialize profileImage as null
        }}
        validationSchema={UserSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
               {/* Username Text Field */}
               <TextField
                fullWidth
                variant="filled"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />

               {/* Password Text Field
               <TextField
                fullWidth
                variant="filled"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              /> */}

              {/* Email Text Field*/}
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
                />

              {/* Center Select */}
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.center && !!errors.center}
              >
                <InputLabel id="center-label">Center</InputLabel>
                <Select
                  labelId="center-label"
                  id="center"
                  value={values.center}
                  onChange={(e) => {
                    const selectedCenterName = e.target.value;
                    const selectedCenter = center.find(c => c.centerName === selectedCenterName);
                    if (selectedCenter) {
                      const centerId = selectedCenter._id;
                      setCenterID(centerId);
                      setFieldValue('center', centerId);
                    }
                    const filteredZones = zone.filter(z => z.center === selectedCenterName);
                    setFoundZone(filteredZones);
                    setFieldValue('zone', '');
                    setFieldValue('bacenta', '');
                  }}
                  onBlur={handleBlur}
                  name="center"
                  label="Center"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {center.map((cat) => (
                    <MenuItem key={cat._id} value={cat.centerName}>
                      {cat.centerName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.center && errors.center}</FormHelperText>
              </FormControl>

              <FormControl
  variant="filled"
  fullWidth
  sx={{ gridColumn: "span 4" }}
  error={!!touched.zone && !!errors.zone}
>
  <InputLabel id="zone-label">Zone</InputLabel>
  <Select
    labelId="zone-label"
    id="zone"
    value={foundZone.find(z => z._id === values.zone)?.zoneName || ''} // Set the value to zoneName
    onChange={(e) => {
      const selectedZoneName = e.target.value;
      const selectedZone = foundZone.find(z => z.zoneName === selectedZoneName);
      if (selectedZone) {
        const zoneId = selectedZone._id;
        setZoneID(zoneId);
        setFieldValue('zone', zoneId); // Store the ID, not the name
      }
      const filteredBacenta = bacenta.filter(b => b.zone === selectedZoneName);
      setFoundBacenta(filteredBacenta);
      setFieldValue('bacenta', ''); // Clear bacenta selection
    }}
    onBlur={handleBlur}
    name="zone"
    label="Zone"
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    {foundZone.map((zoneItem) => (
      <MenuItem key={zoneItem._id} value={zoneItem.zoneName}>
        {zoneItem.zoneName}
      </MenuItem>
    ))}
  </Select>
  <FormHelperText>{touched.zone && errors.zone}</FormHelperText>
</FormControl>


              {/* Bacenta Select */}
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.bacenta && !!errors.bacenta}
              >
                <InputLabel id="bacenta-label">Bacenta</InputLabel>
                <Select
                  labelId="bacenta-label"
                  id="bacenta"
                  value={values.bacenta}
                  onChange={(e) => {
                    setBacentaID(e.target.value);
                    setFieldValue('bacenta', e.target.value);
                  }}
                  onBlur={handleBlur}
                  name="bacenta"
                  label="Bacenta"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {foundBacenta.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.bacentaName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.bacenta && errors.bacenta}</FormHelperText>
              </FormControl>

              {/* Role Select */}
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.role && !!errors.role}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={values.role}
                  onChange={(e) => setFieldValue('role', e.target.value)}
                  onBlur={handleBlur}
                  name="role"
                  label="Role"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="bishop">Bishop</MenuItem>
                  <MenuItem value="lead_pastor">Lead Pastor</MenuItem>
                  <MenuItem value="administrator">Administrator</MenuItem>
                  <MenuItem value="center">Center Leader</MenuItem>
                  <MenuItem value="zone">Zone Leader</MenuItem>
                  <MenuItem value="bacenta">Bacenta Leader</MenuItem>
                </Select>
                <FormHelperText>{touched.role && errors.role}</FormHelperText>
              </FormControl>

              {/* Image Upload */}
              // Image Upload Section
              <FormControl
  variant="filled"
  fullWidth
  sx={{ gridColumn: "span 4" }}
  error={!!touched.profileImage && !!errors.profileImage}
>
  <InputLabel id="profileImage-label">Profile Image</InputLabel>
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files ? e.target.files[0] : null; // Check if the file exists
      if (file) {
        console.log("File selected:", file); // Log the entire file object
        setProfileImage(file);  // Store the file object in the state
        setFieldValue('profileImage', file);  // Ensure Formik knows about the file
      } else {
        console.log("No file selected");
      }
    }}
    style={{ gridColumn: "span 4" }}
  />
  {errors.profileImage && touched.profileImage && (
    <FormHelperText error>{errors.profileImage}</FormHelperText>
  )}
</FormControl>


            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default User;

