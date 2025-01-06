import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

// Validation Schema
const centerSchema = yup.object().shape({
  centerID: yup.string(),
  centerName: yup.string().required("Center name is required"),
  centerLeader: yup.string().required("Center Leader's name is required"),
  centerContact: yup.string().required("Center Leader contact is required"),
  centerEmail: yup.string().required("Center email is required")
});

const AddCenter = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize the navigate function

  // ID generation logic
  const randomNum = Math.floor(Math.random() * 10000);
  const generateID = `CEN/${randomNum.toString().padStart(4, '0')}`; // Pads the number to always be 4 digits

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true); // Set loading to true
    try {
      const response = await axios.post('http://localhost:8080/api/centers/', values);
      alert('Center registered successfully!');
      navigate("/centers");
    } catch (error) {
      console.error('Error registering Center:', error);
      alert('Error registering Center');
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Center" subtitle="Create a New Center" />

      <Formik
        initialValues={{
          centerID: generateID, // Set the center ID as the generated ID
          centerName: '',
          centerLeader: '',
          centerContact: '',
          centerEmail: ''
        
        }}
        validationSchema={centerSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
              {/* Center ID (disabled) */}
              <TextField
                fullWidth
                variant="filled"
                label="Center ID"
                value={generateID}
                name="centerID"
                sx={{ gridColumn: "span 4" }}
                disabled
              />

              {/* Center Name */}
              <TextField
                fullWidth
                variant="filled"
                label="Center Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.centerName}
                name="centerName"
                error={!!touched.centerName && !!errors.centerName}
                helperText={touched.centerName && errors.centerName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Leader */}
              <TextField
                fullWidth
                variant="filled"
                label="Center Pastor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.centerLeader}
                name="centerLeader"
                error={!!touched.centerLeader && !!errors.centerLeader}
                helperText={touched.centerLeader && errors.centerLeader}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Leader Contact */}
              <TextField
                fullWidth
                variant="filled"
                label="Center Pastor Contact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.centerContact}
                name="centerContact"
                error={!!touched.centerContact && !!errors.centerContact}
                helperText={touched.centerContact && errors.centerContact}
                sx={{ gridColumn: "span 4" }}
              />

                      {/* Leader Email */}
                      <TextField
                fullWidth
                variant="filled"
                label="Center Pastor Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.centerEmail}
                name="centerEmail"
                error={!!touched.centerEmail && !!errors.centerEmail}
                helperText={touched.centerEmail && errors.centerEmail}
                sx={{ gridColumn: "span 4" }}
              />

            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Button type="submit" color="secondary" variant="contained">
                  Create New Center
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddCenter;
