import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Input, Snackbar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import MuiAlert from '@mui/material/Alert';

// Validation Schema
const UserSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().required("Email is required"),
  userContact: yup.string().required("User Contact is required"),
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

  const [centerID, setCenterID] = useState();
  const [zoneID, setZoneID] = useState([]);
  const [bacentaID, setBacentaID] = useState();

  const [foundCenter, setFoundCenter] = useState();
  const [foundZone, setFoundZone] = useState([]);
  const [foundBacenta, setFoundBacenta] = useState([]);

  
  // Loading states for each resource
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [loadingBacentas, setLoadingBacentas] = useState(true);

  const [profileImage, setProfileImage] = useState(null);  // State to store the image file
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar for error display
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Snackbar Alert
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Fetch all data (zones, centers, bacentas)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading each resource
        setLoadingZones(true);
        setLoadingCenters(true);
        setLoadingBacentas(true);

        const [zonesResponse, centersResponse, bacentasResponse] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/zones/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/centers/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/"),
        ]);
        
        // After data is fetched, set the state and end loading
        
        setZone(zonesResponse.data);
        setCenter(centersResponse.data);
        setBacenta(bacentasResponse.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage('Error fetching data');
        setOpenSnackbar(true);
      } finally {
        // End loading once all data has been fetched
        setLoadingZones(false);
        setLoadingCenters(false);
        setLoadingBacentas(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("userContact", values.userContact);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("permissions", JSON.stringify(values.permissions));
    formData.append("centerId", values.center);
    formData.append("bacentaId", values.bacenta);
    formData.append("zoneId", values.zone);
    formData.append("email", values.email);
  
    if (profileImage) {
      // Upload the profile image separately
      const imageData = new FormData();
      imageData.append("file", profileImage);
      imageData.append("contactNumber", values.userContact);
  
      try {
        const uploadResponse = await axios.post("https://church-management-system-39vg.onrender.com/api/upload", imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const profileImageUrl = uploadResponse.data.fileUrl;
        formData.append("profileImage", profileImageUrl);  // Append the image URL from S3
  
        // Now, submit the rest of the user data
        const response = await axios.post('https://church-management-system-39vg.onrender.com/api/users/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('User registered successfully!');
        navigate("/users");
      } catch (error) {
        console.error('There was an error uploading the profile image or registering the user!', error);
        setSnackbarMessage('Error registering user');
        setOpenSnackbar(true);
      }
    }
  };
  

  const getPermissionsByRole = (role) => {
    const rolePermissions = {
      'administrator': [
        'user:create', 'user:edit', 'user:delete', 'user:view',
        'center:create', 'center:edit', 'center:delete', 'center:view',
        'bacenta:create', 'bacenta:edit', 'bacenta:delete', 'bacenta:view',
        'role:manage', 'permission:manage', 'report:view', 'dashboard:view',
        'member:add', 'member:edit', 'member:view'
      ],
      
      // Bishop role with some management permissions 
      'bishop': [
       'member:view',  'user:view', 'user:edit','center:view', 'bacenta:view','bacenta:edit', 'center:edit',
        'report:view', 'dashboard:view', 'role:manage', 'permission:manage','donation:view', 'attendance:view'
      ],
      
      // Lead Pastor role with user and center management
      'lead_pastor': [
        'user:view', 'user:edit', 'center:view', 'member:view', 'center:edit', 'zone:view', 'zone:edit',
        'bacenta:view',  'report:view', 'dashboard:view', 'role:manage','attendance:view'
      ],
      
      // Center Manager role with member management and reports
      'center': [
        'member:add','member:view', 'member:edit', 'bacenta:view','zone:view','dashboard:view', 
         'report:view', 'donation:view', 'attendance:view'
      ],
      // Zone Manager role with member management and reports
      'zone': [
         'member:add','member:view', 'member:edit', 'bacenta:view','dashboard:view', 
         'report:view', 'donation:view', 'attendance:view'
      ],
      
      // Bacenta Leader role with basic bacenta and attendance management
      'bacenta': [
        'member:add', 'member:edit', 'member:view', 'report:view', 'dashboard:view',
        'attendance:add', 'attendance:view', 'donation:add'
      ]
      // Add more roles and their corresponding permissions as needed
    };
  
    // Default to an empty array if no role matches
    return rolePermissions[role] || [];
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

  // Ensure that the form doesn't render until the data has been fetched
  if (loadingZones || loadingCenters || loadingBacentas) {
    return <div>Loading...</div>;  // Loading screen while waiting for data
  }

  console.log(zone)

  return (
    <Box m="20px">
      <Header title="Create User" subtitle="Create a New User" />
      
      {/* Snackbar for Error Handling */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">{snackbarMessage}</Alert>
      </Snackbar>

      <Formik
        initialValues={{
          username: '',
          firstName: '',
          lastName: '',
          userContact: '',
          password: generateRandomPassword(), // Automatically set the password here,
          zone: zoneID, 
          bacenta: '',
          role: '',  // Default to no role selected
          center: centerID,
          email:'',
          permissions: [],  // Default to empty permissions
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

               {/* Firstname Text Field */}
               <TextField
                fullWidth
                variant="filled"
                label="Firstname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Lastname Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Lastname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Contact Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="UserContact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userContact}
                name="userContact"
                error={!!touched.userContact && !!errors.userContact}
                helperText={touched.userContact && errors.userContact}
                sx={{ gridColumn: "span 4" }}
              />
              

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

              {/* Role Select */}
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.role && !!errors.role}
              >
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={values.role}
                  //onChange={handleChange}
                  label="Role"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setFieldValue("role", selectedRole);
                    
                    // Update permissions based on selected role
                    const permissions = getPermissionsByRole(selectedRole);
                    setFieldValue("permissions", permissions);
                  }}
                >
                  <MenuItem value="administrator">Administrator</MenuItem>
                  <MenuItem value="bishop">Bishop</MenuItem>
                  <MenuItem value="lead_pastor">Lead Pastor</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="zone">Zone</MenuItem>
                  <MenuItem value="bacenta">Bacenta</MenuItem>
                </Select>
                <FormHelperText>{touched.role && errors.role}</FormHelperText>
              </FormControl>

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

 
  {/* Zone Select */}
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

              {/* Profile Image Upload */}
              <Input
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={(event) => {
                  setProfileImage(event.target.files[0]); // Store the selected file
                  setFieldValue("profileImage", event.target.files[0]);
                }}
                fullWidth
                sx={{ gridColumn: "span 4" }}
              />
              {profileImage && (
                <Box>
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                </Box>
              )}

              {/* Submit Button */}
              <Button
                fullWidth
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ gridColumn: "span 4" }}
              >
                Create User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default User;



