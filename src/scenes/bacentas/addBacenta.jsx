import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// Validation Schema
const bacentaSchema = yup.object().shape({
 
    bacentaName: yup.string().required("Bacenta name is required"),
    bacentaLeader: yup.string().required("Bacenta Leader's name is required"),
    // zoneName: yup.string().required("Zone should be selected"),
    bacentaID: yup.string(),
    bacentaLocation: yup.string().required("Bacenta's Location is required"),
    bacentaContact: yup.string().required("Bacenta contact is required"),
    bacentaDateStarted: yup.string().required("Bacenta date is required"),
    bacentaEmail: yup.string().required("Bacenta email is required"),
});

const Bacenta = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); 

  // State hooks to hold data
  const [zone, setZone] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch Zones data
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
        setZone(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching zone:", error);
      }
    };
    fetchZones();
  }, []);




  // SKU generation logic (zone, random number)
  const generateID = (zone) => {
    const zonePrefix = zone.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ZON/${zonePrefix}/${randomNum}`;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://church-management-system-39vg.onrender.com/api/bacentas/', values);
      alert('Bacenta registered successfully!');
      console.log(response.data);
      navigate("/bacentas");
    } catch (error) {
      console.error('There was an error registering the bacenta!', error); 
      alert('Error registering bacenta');
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Bacenta" subtitle="Create a New Bacenta" />

      <Formik
        initialValues={{
          bacentaName: '',
          bacentaLeader: '',
          zone:'',
          bacentaID: '',
          bacentaLocation:'',
          bacentaContact: '',
          bacentaDateStarted:'',
          bacentaEmail: '',       

        }}
        validationSchema={bacentaSchema}
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

               {/* Bacenta ID Text Field */}
               <TextField
                fullWidth
                variant="filled"
                label="Bacenta ID"
                onBlur={handleBlur}
                value={values.bacentaID}
                name="bacentaID"
                error={!!touched.bacentaID && !!errors.bacentaID}
                helperText={touched.bacentaID && errors.bacentaID}
                sx={{ gridColumn: "span 4" }}
                disabled
              />

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
                  value={values.zone}
                  onChange={(e) => {
                    const selectedZone = e.target.value;
                    setFieldValue('zone', selectedZone);
                    const sku = generateID(selectedZone, values.zone);
                    setFieldValue('bacentaID', sku);
                  }}
                  onBlur={handleBlur}
                  name="zone"
                  label="Zone"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {zone.map((cat) => (
                    <MenuItem key={cat._id} value={cat.zoneName}>
                      {cat.zoneName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.zone && errors.zone}</FormHelperText>
              </FormControl>

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
                
                {/* Bacenta Location*/}
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

                {/* Bacenta Contact*/}
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


                {/* Date Started*/}
                <TextField
                fullWidth
                variant="filled"
                label="Date Started"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bacentaDateStarted}
                name="bacentaDateStarted"
                error={!!touched.bacentaDateStarted && !!errors.bacentaDateStarted}
                helperText={touched.bacentaDateStarted && errors.bacentaDateStarted}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Date Started*/}
              {/* <DatePicker
                label="Bacenta Date Started"
                value={values.bacentaDateStarted}
                onChange={(newValue) => setFieldValue("bacentaDateStarted", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!touched.bacentaDateStarted && !!errors.bacentaDateStarted}
                    helperText={touched.bacentaDateStarted && errors.bacentaDateStarted}
                    fullWidth
                  />
                )}
                sx={{ gridColumn: "span 4" }}
              /> */}


               {/* Bacenta Email */}
               <TextField
                fullWidth
                variant="filled"
                label="Bacenta Email"
                type="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bacentaEmail}
                name="bacentaEmail"
                error={!!touched.bacentaEmail && !!errors.bacentaEmail}
                helperText={touched.bacentaEmail && errors.bacentaEmail}
                sx={{ gridColumn: "span 4" }}
              />

             
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Bacenta
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Bacenta;