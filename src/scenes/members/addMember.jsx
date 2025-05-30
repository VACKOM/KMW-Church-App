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
const MemberSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  mname: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dob: yup.string().required("Date of Birth is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  address: yup.string().required("Address is required"),
  digital: yup.string().required("Digital Address is required"),
  contact: yup.string().required("Member's Contact is required"),
  occupation: yup.string().required("Member's Occupation is required"),
  baptism: yup.string().required("Baptism Status is required"),
  basonta: yup.string().required("Basonta is required"),
  bacenta: yup.string().required("Bacenta is required"),
  gender: yup.string().required("Gender is required"),
  role: yup.string().required("Role is required"),
  center: yup.string().required("Center is required"),
  zone: yup.string().required("Zone is required"),
  school: yup.string().required("Lay School is required"),
  date_joined: yup.string().required("Date Joined is required"),
  profileImage: yup.mixed().required("Profile image is required"),  // Added validation for profile image
  reference: yup.string().required("Reference is required"),

  
  
});



const Member = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  // const role = localStorage.getItem('role');
  
  const [bacenta, setBacenta] = useState([]);
  const [zone, setZone] = useState([]);
  const [center, setCenter] = useState([]);

  const [centerID, setCenterID] = useState();
  const [zoneID, setZoneID] = useState([]);
  const [bacentaID, setBacentaID] = useState();

  //const [foundCenter, setFoundCenter] = useState();
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

  

  const handleSubmit = async (values) => {
   //.log("Submit button has been clicked");
  
    // Upload image first
    let profileImageUrl = "";
    if (profileImage) {
      const imageData = new FormData();
      imageData.append("file", profileImage);
      imageData.append("contactNumber", values.contact);
  
      try {
        const uploadResponse = await axios.post("https://church-management-system-39vg.onrender.com/api/upload", imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        profileImageUrl = uploadResponse.data.fileUrl;
        console.log("Uploaded image URL:", profileImageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        setSnackbarMessage("Error uploading image");
        setOpenSnackbar(true);
        return;
      }
    }
  
    // Now prepare data to send as JSON
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      mname: values.mname,
      dob: values.dob,
      email: values.email,
      address: values.address,
      digital: values.digital,
      contact: values.contact,
      occupation: values.occupation,
      baptism: values.baptism,
      basonta: values.basonta,
      bacenta: values.bacenta,
      gender: values.gender,
      role: values.role,
      center: values.center,
      zone: values.zone,
      school: values.school,
      date_joined: values.date_joined,
      reference: values.reference,
      profileImage: profileImageUrl,
    };
  
   //console.log("Final data to POST:", data);
  
    try {
      const response = await axios.post("https://church-management-system-39vg.onrender.com/api/members", data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      alert("Member registered successfully!");
      navigate("/members");
    } catch (error) {
      console.error("Error registering member:");
  
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
  
      setSnackbarMessage("Error registering Member");
      setOpenSnackbar(true);
    }
  };
  

  // Ensure that the form doesn't render until the data has been fetched
  if (loadingZones || loadingCenters || loadingBacentas) {
    return <div>Loading...</div>;  // Loading screen while waiting for data
  }

  //console.log(zone)

  return (
    <Box m="20px">
      <Header title="Create Member" subtitle="Create a New Member" />
      
      {/* Snackbar for Error Handling */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">{snackbarMessage}</Alert>
      </Snackbar>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          mname: '',
          dob: '',
          gender: '',
          email: '', // Automatically set the password here,
          zone: zoneID, 
          bacenta: bacentaID,
          role: '',  // Default to no role selected
          center: centerID,
          address: '',  // Default to empty permissions
          profileImage: null,  // Initialize profileImage as null
          digital:'',
          contact: '',
          occupation:'',
          baptism:'',
          basonta: '',
          reference: '',
          school:'',
          date_joined:''
         
        }}
        validationSchema={MemberSchema}
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

               {/* Firstname Text Field */}
               <TextField
                fullWidth
                variant="filled"
                label="First Name"
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
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* middlename Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mname}
                name="mname"
                error={!!touched.mname && !!errors.mname}
                helperText={touched.mname && errors.mname}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Date of birth Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Date of Birth"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dob}
                name="dob"
                error={!!touched.dob&& !!errors.dob}
                helperText={touched.dob && errors.dob}
                sx={{ gridColumn: "span 4" }}
              />

                {/* Gender Select */}
 <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.gender && !!errors.gender}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={values.gender}
                  //onChange={handleChange}
                  label="Gender"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedgender = e.target.value;
                    setFieldValue("gender", selectedgender);
      
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  
                  
                </Select>
                <FormHelperText>{touched.gender && errors.gender}</FormHelperText>
              </FormControl>


              {/* Contact Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Contact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
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


              {/* Address Text Field*/}
              <TextField
                fullWidth
                variant="filled"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
                />

                 {/* Dgital Text Field*/}
              <TextField
                fullWidth
                variant="filled"
                label="Digital"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.digital}
                name="digital"
                error={!!touched.digital && !!errors.digital}
                helperText={touched.digital && errors.digital}
                sx={{ gridColumn: "span 4" }}
                />

                  {/* Occupation Text Field*/}
              <TextField
                fullWidth
                variant="filled"
                label="occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={!!touched.occupation && !!errors.occupation}
                helperText={touched.occupation && errors.occupation}
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
                    //const permissions = getPermissionsByRole(selectedRole);
                    //setFieldValue("permissions", permissions);
                  }}
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Shepherd">Shepherd</MenuItem>
                  <MenuItem value="Pastor">Pastor</MenuItem>
                 
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

             {/* baptism_status Select */}
 <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.baptism && !!errors.baptism}
              >
                <InputLabel>Baptism Status</InputLabel>
                <Select
                  name="baptism"
                  value={values.baptism}
                  //onChange={handleChange}
                  label="baptism"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedbaptism= e.target.value;
                    setFieldValue("baptism", selectedbaptism);
      
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                  
                  
                </Select>
                <FormHelperText>{touched.baptism&& errors.baptism}</FormHelperText>
              </FormControl>

{/* basonta Select */}
<FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.basonta && !!errors.basonta}
              >
                <InputLabel>Basonta</InputLabel>
                <Select
                  name="basonta"
                  value={values.basonta}
                  //onChange={handleChange}
                  label="basonta"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedbasonta = e.target.value;
                    setFieldValue("basonta", selectedbasonta);
                    
      
                  }}
                >
                  <MenuItem value="basonta 1">Basonta 1</MenuItem>
                  <MenuItem value="basonta 2">Basonta 2</MenuItem>
                  <MenuItem value="basonta 3">Basonta 3</MenuItem>
                  
                </Select>
                <FormHelperText>{touched.basonta && errors.basonta}</FormHelperText>
              </FormControl>
              
             
{/* Lay School Select */}
<FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 4" }}
                error={!!touched.school && !!errors.school}
              >
                <InputLabel>Lay School</InputLabel>
                <Select
                  name="school"
                  value={values.school}
                  //onChange={handleChange}
                  label="Lay School"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedschool = e.target.value;
                    setFieldValue("school", selectedschool);
                    
      
                  }}
                >
                  <MenuItem value="lay 1">Lay School 1</MenuItem>
                  <MenuItem value="lay 2">Lay School 2</MenuItem>
                  <MenuItem value="lay 3">Lay School 3</MenuItem>
                  
                </Select>
                <FormHelperText>{touched.school && errors.school}</FormHelperText>
              </FormControl>


                    {/* Reference Text Field*/}
                    <TextField
                fullWidth
                variant="filled"
                label="Reference"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reference}
                name="reference"
                error={!!touched.reference && !!errors.reference}
                helperText={touched.reference && errors.reference}
                sx={{ gridColumn: "span 4" }}
                />


              {/* Date joined Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Date Joined"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date_joined}
                name="date_joined"
                error={!!touched.date_joined&& !!errors.date_joined}
                helperText={touched.date_joined && errors.date_joined}
                sx={{ gridColumn: "span 4" }}
              />


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
                Create Member
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Member;



