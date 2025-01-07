import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

// Validation Schema
const zoneSchema = yup.object().shape({
 
    zoneID: yup.string(),
    zoneName: yup.string().required("Zone name is required"),
    zoneLeader: yup.string().required("Zone Leader's name is required"),
    zoneContact: yup.string().required("Zone contact is required"),
    zoneEmail: yup.string().required("Zone email is required"),
});

const Zone = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // State hooks to hold data
  const [center, setCenter] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch centers data
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
        setCenter(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching center:", error);
      }
    };
    fetchCenter();
  }, []);




  // SKU generation logic (zone, random number)
  const generateID = (center) => {
    const centerPrefix = center.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ZON/${centerPrefix}/${randomNum}`;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://church-management-system-39vg.onrender.com/api/zones/', values);
      alert('Zone registered successfully!');
      console.log(response.data);
      navigate("/zones");
    } catch (error) {
      console.error('There was an error registering the zone!', error);
      alert('Error registering zone');
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Zone" subtitle="Create a New Zone" />

      <Formik
        initialValues={{
          zoneID: '',
          zoneName: '',
          zoneLeader: '',
          zoneContact: '',
          zoneEmail: '',
          center: ''
         

        }}
        validationSchema={zoneSchema}
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
              {/* Zone ID Text Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Zone ID"
                onBlur={handleBlur}
                value={values.zoneID}
                name="zoneID"
                error={!!touched.zoneID && !!errors.zoneID}
                helperText={touched.zoneID && errors.zoneID}
                sx={{ gridColumn: "span 4" }}
                disabled
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
                    const selectedCenter = e.target.value;
                    setFieldValue('center', selectedCenter);
                    const sku = generateID(selectedCenter, values.center);
                    setFieldValue('zoneID', sku);
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

              {/* Zone Name */}
              <TextField
                fullWidth
                variant="filled"
                label="Zone Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.zoneName}
                name="zoneName"
                error={!!touched.zoneName && !!errors.zoneName}
                helperText={touched.zoneName && errors.zoneName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Zone Leader */}
              <TextField
                fullWidth
                variant="filled"
                label="Zone Leader"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.zoneLeader}
                name="zoneLeader"
                error={!!touched.zoneLeader && !!errors.zoneLeader}
                helperText={touched.zoneLeader && errors.zoneLeader}
                sx={{ gridColumn: "span 4" }}
              />

                {/* Zone Contact*/}
                <TextField
                fullWidth
                variant="filled"
                label="Zone Contact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.zoneContact}
                name="zoneContact"
                error={!!touched.zoneContact && !!errors.zoneContact}
                helperText={touched.zoneContact && errors.zoneContact}
                sx={{ gridColumn: "span 4" }}
              />

               {/* Zone Email */}
               <TextField
                fullWidth
                variant="filled"
                label="Zone Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.zoneEmail}
                name="zoneEmail"
                error={!!touched.zoneEmail && !!errors.zoneEmail}
                helperText={touched.zoneEmail && errors.zoneEmail}
                sx={{ gridColumn: "span 4" }}
              />

             
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Zone
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Zone;
