import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Typography,
  Input,
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as yup from "yup";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ScopeSelect from "../../components/ScopeSelect.jsx";

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8) + "Aa1";
  
};

// ✅ Schema validation
const UserSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  userContact: yup.string().required("User Contact is required"),
  roleAssignments: yup
    .array()
    .of(
      yup.object().shape({
        roleId: yup.string().required("Role is required"),
        scopeType: yup.string().nullable(),
        scopeItem: yup.string().nullable(),
      })
    )
    .min(1, "At least one role assignment is required"),
  profileImage: yup.mixed().required("Profile image is required"),
});

const AddUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [center, setCenter] = useState([]);
  const [zone, setZone] = useState([]);
  const [bacenta, setBacenta] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch roles + scope collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, centersRes, zonesRes, bacentasRes] = await Promise.all([
          axios.get("https://church-management-system-39vg.onrender.com/api/roles"),
          axios.get("https://church-management-system-39vg.onrender.com/api/centers"),
          axios.get("https://church-management-system-39vg.onrender.com/api/zones"),
          axios.get("https://church-management-system-39vg.onrender.com/api/bacentas"),
        ]);
        setRoles(rolesRes.data);
        setCenter(centersRes.data);
        setZone(zonesRes.data);
        setBacenta(bacentasRes.data);
      } catch (err) {
        console.error("Error fetching roles/scopes:", err);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      userContact: "",
      password: generateRandomPassword(),
      email: "",
      roleAssignments: [], // { roleId: "", scopeType: "", scopeItem: "" }
      permissions: [],
      profileImage: null,
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        
        console.log(values.password);
        // ✅ Append normal fields
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("userContact", values.userContact);
        formData.append("username", values.username);
        formData.append("password", values.password);
        formData.append("email", values.email);
        formData.append("permissions", JSON.stringify(values.permissions));

        // ✅ Directly append roleAssignments
        formData.append("roleAssignments", JSON.stringify(values.roleAssignments));

        // ✅ Upload image first if provided
        if (profileImage) {
          const imageData = new FormData();
          imageData.append("file", profileImage);
          imageData.append("contactNumber", values.userContact);

          const uploadResponse = await axios.post(
            "https://church-management-system-39vg.onrender.com/api/upload",
            imageData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          const profileImageUrl = uploadResponse.data.fileUrl;
          formData.append("profileImage", profileImageUrl);
        }

        // Debug what’s being sent
        for (let [key, val] of formData.entries()) {
          console.log(key, ":", val);
        }

        // ✅ Always send user creation request
        const userRes = await axios.post("https://church-management-system-39vg.onrender.com/api/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("User created:", userRes.data);
        alert("User registered successfully!");
        navigate("/users");
      } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        alert("Error registering user");
      }
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } = formik;

  return (
    <Box m="20px">
      <Header title="Create User" subtitle="Create a New User" />

      <FormikProvider value={formik}>
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add User
          </Typography>

          {/* Basic Info */}
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="userContact"
            value={values.userContact}
            onChange={handleChange}
            error={touched.userContact && Boolean(errors.userContact)}
            helperText={touched.userContact && errors.userContact}
          />

          {/* Role Assignments */}
          <FieldArray
            name="roleAssignments"
            render={({ push, remove }) => (
              <Box>
                {values.roleAssignments.map((assignment, index) => (
                  <Box
                    key={index}
                    sx={{ border: "1px solid #ddd", borderRadius: "8px", p: 2, mb: 2 }}
                  >
                    {/* Role Dropdown */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={assignment.roleId || ""}
                        onChange={(e) => {
                          const selectedRoleId = e.target.value;
                          setFieldValue(`roleAssignments[${index}].roleId`, selectedRoleId);

                          const selectedRole = roles.find((r) => r._id === selectedRoleId);
                          if (selectedRole) {
                            const roleName = selectedRole.name.toLowerCase();
                            let scopeType = "None";
                            if (roleName === "centerleader") scopeType = "CenterLeader";
                            if (roleName === "zoneleader") scopeType = "ZoneLeader";
                            if (roleName === "bacentaleader") scopeType = "BacentaLeader";
                            setFieldValue(`roleAssignments[${index}].scopeType`, scopeType);
                            setFieldValue(`roleAssignments[${index}].scopeItem`, "");
                          }
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role._id} value={role._id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Scope Dropdown */}
                    <ScopeSelect
                      assignment={assignment}
                      index={index}
                      setFieldValue={setFieldValue}
                      datasets={{ center, zone, bacenta }}
                    />

                    <Button color="error" onClick={() => remove(index)} sx={{ mt: 1 }}>
                      Remove Role
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => push({ roleId: "", scopeType: "None", scopeItem: "" })}
                >
                  Add Role
                </Button>
              </Box>
            )}
          />

          {/* Profile Image Upload */}
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(event) => {
              setProfileImage(event.target.files[0]);
              setFieldValue("profileImage", event.target.files[0]);
            }}
            fullWidth
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

          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Register User
            </Button>
          </Box>
        </Box>
      </FormikProvider>
    </Box>
  );
};

export default AddUser;
