import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const attendanceSchema = yup.object().shape({
  date: yup.string().required("Attendance Date is required"),
  bacentaMembersNo: yup.string().required("No of Members is required"),
  adultAttendance: yup.string().required("Adult Attendance is required"),
  childrenAttendance: yup.string().required("Children Attendance is required"),
  soulsInChurch: yup.string().required("No of Souls Brought Today is required"),
  newBelieversSchoolAttendance: yup
    .string()
    .required("New Believers School attendance is required"),
  bacentaMeetingAttendance: yup
    .string()
    .required("Bacenta Meeting attendance is required"),
  membersAbsent: yup.string().required("Number of Members Absent is required"),
  laySchoolAttendance: yup
    .string()
    .required("Lay schools attendance is required"),
  offering: yup.string().required("Offering is required"),
});

const AddAttendance = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [bacentas, setBacentas] = useState([]);

  // ✅ Get user role info
  const roleAssignments = localStorage.getItem("roles");
  const parsedRoles = roleAssignments ? JSON.parse(roleAssignments) : [];

  const admin = parsedRoles.find((r) => r.scopeType === "administrator");
  const centerLeader = parsedRoles.find(
    (r) => r.scopeType === "CenterLeader"
  )?.scopeItem;
  const zoneLeader = parsedRoles.find(
    (r) => r.scopeType === "ZoneLeader"
  )?.scopeItem;
  const bacentaLeader = parsedRoles.find(
    (r) => r.scopeType === "BacentaLeader"
  )?.scopeItem;

  const userScopeType =
    (admin && "administrator") ||
    (centerLeader && "CenterLeader") ||
    (zoneLeader && "ZoneLeader") ||
    (bacentaLeader && "BacentaLeader");

  // ✅ Fetch centers, zones, bacentas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centerRes, zoneRes, bacentaRes] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/centers/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/zones/"),
          axios.get("https://church-management-system-39vg.onrender.com/api/bacentas/"),
        ]);
        setCenters(centerRes.data);
        setZones(zoneRes.data);
        setBacentas(bacentaRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle form submit
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        center: centerLeader || values.center || null,
        zone: zoneLeader || values.zone || null,
        bacenta: bacentaLeader || values.bacenta || null,
      };

      // Convert string to numbers
      const numericFields = [
        "bacentaMembersNo",
        "adultAttendance",
        "childrenAttendance",
        "soulsInChurch",
        "newBelieversSchoolAttendance",
        "bacentaMeetingAttendance",
        "membersAbsent",
        "laySchoolAttendance",
        "offering",
      ];
      numericFields.forEach((f) => {
        payload[f] = Number(payload[f]) || 0;
      });

      // Compute total attendance
      payload.totalAttendance =
        Number(payload.adultAttendance || 0) +
        Number(payload.childrenAttendance || 0);

      console.log("Submitting:", payload);

      await axios.post(
        "https://church-management-system-39vg.onrender.com/api/attendances/",
        payload
      );
      alert("Attendance submitted successfully!");
      navigate("/attendance");
    } catch (error) {
      console.error("There was an error submitting attendance!", error);
      alert(
        `Error submitting attendance: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <Box m="20px">
      <Header title="Attendance Recorder" subtitle="Enter Attendance" />

      <Formik
        enableReinitialize
        initialValues={{
          date: "",
          bacentaMembersNo: "",
          adultAttendance: "",
          childrenAttendance: "",
          soulsInChurch: "",
          bacentaMeetingAttendance: "",
          newBelieversSchoolAttendance: "",
          membersAbsent: "",
          laySchoolAttendance: "",
          offering: "",
          center: centerLeader || "",
          zone: zoneLeader || "",
          bacenta: bacentaLeader || "",
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
        }) => {
          // ✅ Auto-calculate membersAbsent
          useEffect(() => {
            const members = Number(values.bacentaMembersNo) || 0;
            const adults = Number(values.adultAttendance) || 0;
            const absent = Math.max(members - adults, 0);
            if (absent !== Number(values.membersAbsent)) {
              setFieldValue("membersAbsent", absent);
            }
          }, [values.bacentaMembersNo, values.adultAttendance]);

          // ✅ Derive zone & center from selected bacenta
          useEffect(() => {
            if (values.bacenta && (!zoneLeader || !centerLeader)) {
              const selectedBacenta = bacentas.find(
                (b) => b._id === values.bacenta
              );

              if (selectedBacenta) {
                // Auto-fill zone if empty
                if (!zoneLeader && !values.zone && selectedBacenta.zone) {
                  setFieldValue("zone", selectedBacenta.zone);
                }

                // Auto-fill center if empty
                const bacentaZone = zones.find(
                  (z) => z._id === selectedBacenta.zone
                );
                if (!centerLeader && !values.center && bacentaZone?.center) {
                  setFieldValue("center", bacentaZone.center);
                }
              }
            }
          }, [values.bacenta]);

          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {/* ✅ Date */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date}
                  name="date"
                  error={!!touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* ✅ Administrator: can select both Zone and Bacenta */}
                {userScopeType === "administrator" && (
                  <>
                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <InputLabel>Zone</InputLabel>
                      <Select
                        name="zone"
                        value={values.zone}
                        onChange={handleChange}
                      >
                        {zones.map((z) => (
                          <MenuItem key={z._id} value={z._id}>
                            {z.zoneName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <InputLabel>Bacenta</InputLabel>
                      <Select
                        name="bacenta"
                        value={values.bacenta}
                        onChange={handleChange}
                      >
                        {bacentas
                          .filter(
                            (b) =>
                              !values.zone || b.zone === values.zone
                          )
                          .map((b) => (
                            <MenuItem key={b._id} value={b._id}>
                              {b.bacentaName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </>
                )}

                {/* ✅ CenterLeader: select from their center */}
                {userScopeType === "CenterLeader" && (
                  <>
                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 4" }}
                    >
                      <InputLabel>Zone</InputLabel>
                      <Select
                        name="zone"
                        value={values.zone}
                        onChange={handleChange}
                      >
                        {zones
                          .filter((z) => z.center === centerLeader)
                          .map((z) => (
                            <MenuItem key={z._id} value={z._id}>
                              {z.zoneName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 4" }}
                    >
                      <InputLabel>Bacenta</InputLabel>
                      <Select
                        name="bacenta"
                        value={values.bacenta}
                        onChange={handleChange}
                      >
                        {bacentas
                          .filter((b) => b.zone === values.zone)
                          .map((b) => (
                            <MenuItem key={b._id} value={b._id}>
                              {b.bacentaName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </>
                )}

                {/* ✅ ZoneLeader: can only select Bacenta */}
                {userScopeType === "ZoneLeader" && (
                  <FormControl
                    fullWidth
                    variant="filled"
                    sx={{ gridColumn: "span 4" }}
                  >
                    <InputLabel>Bacenta</InputLabel>
                    <Select
                      name="bacenta"
                      value={values.bacenta}
                      onChange={handleChange}
                    >
                      {bacentas
                        .filter((b) => b.zone === zoneLeader)
                        .map((b) => (
                          <MenuItem key={b._id} value={b._id}>
                            {b.bacentaName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}

                {/* ✅ BacentaLeader: read-only IDs */}
                {userScopeType === "BacentaLeader" && (
                  <Box
                    sx={{
                      gridColumn: "span 4",
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    <div>Center ID: {centerLeader}</div>
                    <div>Zone ID: {zoneLeader}</div>
                    <div>Bacenta ID: {bacentaLeader}</div>
                  </Box>
                )}

                {/* ✅ Attendance Fields */}
                {[
                  { name: "bacentaMembersNo", label: "No of Members" },
                  { name: "adultAttendance", label: "Adults Attendance" },
                  { name: "childrenAttendance", label: "Children Attendance" },
                  { name: "soulsInChurch", label: "Souls in Church" },
                  {
                    name: "bacentaMeetingAttendance",
                    label: "Bacenta Meeting Attendance",
                  },
                  { name: "offering", label: "Offering (₵)" },
                  {
                    name: "newBelieversSchoolAttendance",
                    label: "New Believers School Attendance",
                  },
                  { name: "laySchoolAttendance", label: "Lay School Attendance" },
                  { name: "membersAbsent", label: "Members Absent", readOnly: true },
                ].map((field) => (
                  <TextField
                    key={field.name}
                    fullWidth
                    variant="filled"
                    label={field.label}
                    type="number"
                    name={field.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values[field.name]}
                    error={!!touched[field.name] && !!errors[field.name]}
                    helperText={touched[field.name] && errors[field.name]}
                    InputProps={{
                      readOnly: field.readOnly || false,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
                ))}
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Submit Attendance
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AddAttendance;


