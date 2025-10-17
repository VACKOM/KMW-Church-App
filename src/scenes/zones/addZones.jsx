import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Validation Schema
const zoneSchema = yup.object().shape({
  zoneID: yup.string(),
  zoneName: yup.string().required("Zone name is required"),
  zoneLeader: yup.string().required("Zone Leader's name is required"),
  zoneContact: yup.string().required("Zone contact is required"),
  zoneEmail: yup.string().required("Zone email is required"),
  center: yup.string().required("Center is required"),
});

const Zone = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get center passed from previous page (if any)
  const { foundCenter: receivedCenter } = location.state || {};

  const [centers, setCenters] = useState([]);

  // ✅ Fetch all centers (only needed if you may use them for display)
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get(
          "https://church-management-system-39vg.onrender.com/api/centers/"
        );
        setCenters(response.data);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };
    fetchCenters();
  }, []);

  // ✅ Generate Zone ID
  const randomNum = Math.floor(Math.random() * 1000);
  const generateID = `ZON/${randomNum}`;

  // ✅ Form Submit Handler
  const handleSubmit = async (values) => {
    try {
      console.log("Submitting:", values);
      await axios.post("http://localhost:8080/api/zones/", values);
      alert("Zone registered successfully!");
      navigate("/zones");
    } catch (error) {
      console.error("Error registering zone:", error);
      alert("Error registering zone");
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Zone" subtitle="Create a New Zone" />

      <Formik
        initialValues={{
          zoneID: generateID,
          zoneName: "",
          zoneLeader: "",
          zoneContact: "",
          zoneEmail: "",
          // ✅ Save only the center _id (hidden)
          center: receivedCenter ? receivedCenter._id : "",
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
        }) => (
          <form onSubmit={handleSubmit}>
            {/* ✅ Hidden input to keep center _id */}
            <input type="hidden" name="center" value={values.center} />

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Zone ID (Auto-generated, disabled) */}
              <TextField
                fullWidth
                variant="filled"
                label="Zone ID"
                value={values.zoneID}
                name="zoneID"
                onBlur={handleBlur}
                disabled
                sx={{ gridColumn: "span 4" }}
              />

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

              {/* Zone Contact */}
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
