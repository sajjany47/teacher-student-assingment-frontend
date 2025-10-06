import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../component/Loader";
import { setUser } from "../store/reducer/authReducer";
import { UserLogin } from "../MainService";
import { Form, Formik } from "formik";
import { InputField } from "../component/CustomField";
import * as Yup from "yup";

// ✅ Validation Schema
const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  // ✅ Handle Form Submission
  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await UserLogin(payload);
      setLoading(false);

      dispatch(
        setUser({
          token: res.data.accessToken,
          user: res.data.user,
        })
      );

      enqueueSnackbar("Login successful!", { variant: "success" });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.message || "Login failed", {
        variant: "error",
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {loading && <Loader />}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <InputField
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    fullWidth
                  />

                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    fullWidth
                  />

                  {/* ✅ Fix: Add type="submit" */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Container>
          </Form>
        )}
      </Formik>
    </ThemeProvider>
  );
}
