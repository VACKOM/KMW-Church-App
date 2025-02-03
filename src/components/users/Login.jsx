import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, CircularProgress, Typography, Paper, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tokens } from "../../theme";

const Login = () => {
  const { login } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // To store error message
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Validation Schema
  const userSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
  });

  // Handle login submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError(null); // Reset error message on new submit attempt

    try {
      // Assuming the login function sends the request
      await login(values.username, values.password);
     
    } catch (error) {
     // Check if the error is from the server and has a response
    
    if (error.response) {
      if (error.response.status === 400) {
        setError("Incorrect username or password");  // Unauthorized (wrong credentials)
      } else if (error.response.status === 500) {
        setError("Server error. Please try again later.");  // Internal server error
      } else {
        setError("An unexpected error occurred. Please try again.");  // Catch other errors
      }
    } else {
      // If no response (e.g., network error)
      setError("Network error. Please check your connection.");
    }
  } finally {
    setIsLoading(false);  // Stop the loading indicator
  }
  };

  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        padding: isNonMobile ? '0 50px' : '0 20px',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isNonMobile ? '400px' : '100%',
          padding: '30px',
          borderRadius: '8px',
          backgroundColor: colors.primary[500],
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          State of the Keepers App
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary" paragraph>
          Access your dashboard by logging in.
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" gutterBottom>
            {error}
          </Typography>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={userSchema}
          onSubmit={handleSubmit} // Use Formik's onSubmit
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
                display="flex"
                flexDirection="column"
                gap="20px"
              >
                <TextField
                  variant="outlined"
                  label="Username"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  fullWidth
                />
                <TextField
                  type="password"
                  variant="outlined"
                  label="Password"
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  fullWidth
                />
              </Box>

              <Box display="flex" justifyContent="center" mt="20px">
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                  >
                    Login
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Login;

