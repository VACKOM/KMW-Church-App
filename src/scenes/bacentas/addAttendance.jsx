import React, {useState, useEffect} from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';



// Validation Schema
const attendanceSchema = yup.object().shape({
    date: yup.string().required("Attendance Date is required"),
    sundayAttendance:yup.string().required("Sunday Attendance is required"),
    adultAttendance: yup.string().required("Adult Attendance is required"),
    childrenAttendance: yup.string().required("Children Attendance is required"),
    soulsInChurch: yup.string().required("No of Souls Brought Today is required"),
    newBelieversSchoolAttendance: yup.string().required("New Belivers School attendance is required"),
    bacentaMeetingAttendance: yup.string().required("Bacenta Meeting attendance is required"),
    membersAbsent: yup.string().required("Number of Members Absent is required"),
    laySchoolAttendance: yup.string().required("Lay schools attendance is required"),
   
    

  });

const addAttendance = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

   // State hooks to hold data
   const [center, setCenter] = useState([]);
   const [bacenta, setBacenta] = useState([]);
   const [zone, setZone] = useState([]);
   const navigate = useNavigate(); // Initialize the navigate function

   const userCenter = localStorage.getItem('center');
   const userZone = localStorage.getItem('zone');
   const userBacenta = localStorage.getItem('bacenta');

 
 // Fetch Centers data
useEffect(() => {
  const fetchCenters = async () => {
    try {
      const response = await axios.get("https://church-management-system-39vg.onrender.com/api/centers/");
      
      // Find the specific center by matching with userBacenta
      const specificCenter = response.data.find(center => center._id === userCenter);

      if (specificCenter) {
        setCenter(specificCenter); // Assuming setCenter is for one center
      } else {
        console.warn('No matching center found for:', userCenter);
      }

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
       // Find the specific center by matching with userBacenta
      const specificBacenta = response.data.find(bacenta => bacenta._id === userBacenta);

      if (specificBacenta) {
        setBacenta(specificBacenta); // Assuming setCenter is for one bacenta
      } else {
        console.warn('No matching bacenta found for:', userBacenta);
      }
     
      } catch (error) {
        console.error("Error fetching bacenta:", error);
      }
    };
    fetchBacentas();
  }, []);

     // Fetch Zone data
     useEffect(() => {
      const fetchZones = async () => {
        try {
          const response = await axios.get("https://church-management-system-39vg.onrender.com/api/zones/");
         // Find the specific center by matching with userZone
        const specificZone = response.data.find(zone => zone._id === userZone);
  
        if (specificZone) {
          setZone(specificZone); // Assuming setCenter is for one bacenta
        } else {
          console.warn('No matching zone found for:', userZone);
        }
       
        } catch (error) {
          console.error("Error fetching zone:", error);
        }
      };
      fetchZones();
    }, []);

  //console.log(zone.zoneName);

 

    // SKU generation logic (attendance, random number)
  // const generateID = (center) => {
  //   const centerPrefix = center.substring(0, 2).toUpperCase();
  //   const randomNum = Math.floor(Math.random() * 1000);
  //   return `ATT/${centerPrefix}/${randomNum}`;
  // };



  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Submitting values:", values);
    try {
      const response = await axios.post('https://church-management-system-39vg.onrender.com/api/attendances/', values);
      alert('Attendance filled successfully!');
      navigate("/attendance");
    } catch (error) {
      console.error('There was an error submitting the attendance form!', error); 
      alert('Error Submitting the Attendance');
    }
  };

 console.log(center.centerName);
 if (!center.centerName || !bacenta.bacentaName || !zone.zoneName) {
  return <div>Loading...</div>; // Or a spinner if you prefer
}


  return (
    <>
      <Box m="20px">
        <Header title="Attendance Recorder" subtitle="Enter  Attendance " />

        <Formik
          enableReinitialize
          initialValues={{
            date: "",
            sundayAttendance:"",
            adultAttendance: "",
            childrenAttendance: "",
            soulsInChurch: "",
            bacentaMeetingAttendance: "",
            newBelieversSchoolAttendance: "",
            membersAbsent: "",
            laySchoolAttendance: "",
            centerName: center.centerName,
            bacentaName: bacenta.bacentaName,
            zoneName: zone.zoneName,
            
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
                
<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Date"
    value={values.date}
    onChange={(newValue) => {
      handleChange({
        target: {
          name: 'date',
          value: newValue,
        },
      });
    }}
    onBlur={handleBlur}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        variant="filled"
        name="date"
        error={!!touched.date && !!errors.date}
        helperText={touched.date && errors.date}
        //sx={{ gridColumn: "span 4" }}
      />
    )}
    sx={{ gridColumn: "span 4" }}
  />
</LocalizationProvider>

{/* Sunday Attendance*/}

<TextField
                  fullWidth
                  variant="filled"
                  label="Sunday Attendance"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sundayAttendance}
                  name="sundayAttendance"
                  error={!!touched.sundayAttendance && !!errors.sundayAttendance}
                  helperText={touched.sundayAttendance && errors.sundayAttendance}
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
                  type="number"
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