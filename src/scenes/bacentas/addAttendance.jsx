import React, {useState, useEffect} from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook




// Validation Schema
const attendanceSchema = yup.object().shape({
    bacentaMembership: yup.string().required("Membership Number is required"),
    adultAttendance: yup.string().required("Adult Attendance is required"),
    // attendanceID: yup.string(),
    childrenAttendance: yup.string().required("Children Attendance is required"),
    soulsInChurch: yup.string().required("No of Souls Brought Today is required"),
    newBelieversSchoolAttendance: yup.string().required("New Belivers School attendance is required"),
    bacentaMeetingAttendance: yup.string().required("Bacenta Meeting attendance is required"),
    membersAbsent: yup.string().required("Number of Members Absent is required"),
    laySchoolAttendance: yup.string().required("Lay schools attendance is required"),
    centerName: yup.string().required("Center is required"),
    bacentaName: yup.string().required("Bacenta Name is required"),
    noBacentaMeeting: yup.string().required("No of no Bacenta Meeting is required"),
    dateAttendance: yup.string().required("Attendance Date is required")

  });

const addAttendance = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

   // State hooks to hold data
   const [center, setCenter] = useState([]);
   const [bacenta, setBacenta] = useState([]);
   const navigate = useNavigate(); // Initialize the navigate function

 
   // Fetch Centers data
   useEffect(() => {
     const fetchCenters = async () => {
       try {
         const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
         setCenter(response.data); // Adjust according to your API response
       } catch (error) {
         console.error("Error fetching center:", error);
       }
     };
     fetchCenters();
   }, []);


   // Fetch Bacenta data
   useEffect(() => {
    const fetchBacentas = async () => {
      try {
        const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
        setBacenta(response.data); // Adjust according to your API response
      } catch (error) {
        console.error("Error fetching bacenta:", error);
      }
    };
    fetchBacentas();
  }, []);


  //  // Fetch Bacentas data
  //  useEffect(() => {
  //   const fetchBacentas = async () => {
  //     try {
  //       const response = await axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/");
  //       setBcenta(response.data); // Adjust according to your API response
  //     } catch (error) {
  //       console.error("Error fetching bacenta:", error);
  //     }
  //   };
  //   fetchBacentas();
  // }, []);
 

    // SKU generation logic (attendance, random number)
  // const generateID = (center) => {
  //   const centerPrefix = center.substring(0, 2).toUpperCase();
  //   const randomNum = Math.floor(Math.random() * 1000);
  //   return `ATT/${centerPrefix}/${randomNum}`;
  // };



  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://church-management-system-39vg.onrender.com/api/attendances/', values);
      alert('Attendance filled successfully!');
      navigate("/attendance");
    } catch (error) {
      console.error('There was an error submitting the attendance form!', error); 
      alert('Error Submitting the Attendance');
    }
  };

  return (
    <>
      <Box m="20px">
        <Header title="Attendance Recorder" subtitle="Enter  Attendance " />

        <Formik
          initialValues={{
            bacentaMembership: "",
            adultAttendance: "",
            childrenAttendance: "",
            soulsInChurch: "",
            bacentaMeetingAttendance: "",
            newBelieversSchoolAttendance: "",
            membersAbsent: "",
            laySchoolAttendance: "",
            centerName: "",
            bacentaName: "",
            dateAttendance: "",
            noBacentaMeeting:""
          }}
          validationSchema={attendanceSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
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
                

                 {/* Date of Attendance */}
                 <TextField
                  fullWidth
                  variant="filled"
                  label="Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dateAttendance}
                  name="dateAttendance"
                  error={
                    !!touched.dateAttendance && !!errors.dateAttendance
                  }
                  helperText={
                    touched.dateAttendance && errors.dateAttendance
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                 {/* Center Select*/}

                <FormControl
                  variant="filled"
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                  error={!!touched.centerName && !!errors.centerName}
                >
                  <InputLabel id="center-label">Center</InputLabel>
                  <Select
                    labelId="center-label"
                    id="center"
                    value={values.centerName}
                    onChange={(e) => {
                      const selectedCenter = e.target.value;
                      setFieldValue("centerName", selectedCenter);
                     
                    }}
                    onBlur={handleBlur}
                    name="centerName"
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
                  <FormHelperText>{touched.centerName && errors.centerName}</FormHelperText>
                </FormControl>

                    
                {/* Bacenta Select*/}

                <FormControl
                  variant="filled"
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                  error={!!touched.bacentaName && !!errors.bacentaName}
                >
                  <InputLabel id="bacenta-label">Bacenta</InputLabel>
                  <Select
                    labelId="bacenta-label"
                    id="bacenta"
                    value={values.bacentaName}
                    onChange={(e) => {
                      const selectedBacenta = e.target.value;
                      setFieldValue("bacentaName", selectedBacenta);
                     
                    }}
                    onBlur={handleBlur}
                    name="bacentaName"
                    label="Bacenta"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {bacenta.map((cat) => (
                      <MenuItem key={cat._id} value={cat.bacentaName}>
                        {cat.bacentaName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.bacentaName && errors.bacentaName}</FormHelperText>
                </FormControl>
                    

                {/* Zone Select
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
              </FormControl> */}

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

                {/* Bacenta Membership Number */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Membership"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaMembership}
                  name="bacentaMembership"
                  error={
                    !!touched.bacentaMembership && !!errors.bacentaMembership
                  }
                  helperText={
                    touched.bacentaMembership && errors.bacentaMembership
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Sunday Adult Attendance*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="Adults Attendance"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.adultAttendance}
                  name="adultAttendance"
                  error={!!touched.adultAttendance && !!errors.adultAttendance}
                  helperText={touched.adultAttendance && errors.adultAttendance}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Sunday Children Attendance*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="Children Attendance"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.childrenAttendance}
                  name="childrenAttendance"
                  error={
                    !!touched.childrenAttendance && !!errors.childrenAttendance
                  }
                  helperText={
                    touched.childrenAttendance && errors.childrenAttendance
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Number of Souls Brought to Church*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="Number of Souls Brought to Church"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.soulsInChurch}
                  name="soulsInChurch"
                  error={!!touched.soulsInChurch && !!errors.soulsInChurch}
                  helperText={touched.soulsInChurch && errors.soulsInChurch}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Bacenta Meeting Attendance*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="Bacenta Meeting Attendance"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bacentaMeetingAttendance}
                  name="bacentaMeetingAttendance"
                  error={
                    !!touched.bacentaMeetingAttendance &&
                    !!errors.bacentaMeetingAttendance
                  }
                  helperText={
                    touched.bacentaMeetingAttendance &&
                    errors.bacentaMeetingAttendance
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/* New Believers Attendance*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="New Believers School Attendance"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.newBelieversSchoolAttendance}
                  name="newBelieversSchoolAttendance"
                  error={
                    !!touched.newBelieversSchoolAttendance &&
                    !!errors.newBelieversSchoolAttendance
                  }
                  helperText={
                    touched.newBelieversSchoolAttendance &&
                    errors.newBelieversSchoolAttendance
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                 {/* Lay School Attendance */}
                 <TextField
                  fullWidth
                  variant="filled"
                  label="Lay School Attendace"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.laySchoolAttendance}
                  name="laySchoolAttendance"
                  error={
                    !!touched.laySchoolAttendance && !!errors.laySchoolAttendance
                  }
                  helperText={
                    touched.laySchoolAttendance && errors.laySchoolAttendance
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/*Number of Members Absent From Church*/}

                <TextField
                  fullWidth
                  variant="filled"
                  label="Number of Members Absent From Church"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.membersAbsent}
                  name="membersAbsent"
                  error={!!touched.membersAbsent && !!errors.membersAbsent}
                  helperText={touched.membersAbsent && errors.membersAbsent}
                  sx={{ gridColumn: "span 4" }}
                />


            {/*No Bacenta Meetings*/}
                <TextField
                  fullWidth
                  variant="filled"
                  label="No Bacenta Meetings"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.noBacentaMeeting}
                  name="noBacentaMeeting"
                  error={!!touched.noBacentaMeeting && !!errors.noBacentaMeeting}
                  helperText={touched.noBacentaMeeting && errors.noBacentaMeeting}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Submit Attendance
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default addAttendance;