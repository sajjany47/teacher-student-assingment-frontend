import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../component/Loader";
import { setUser } from "../store/reducer/authReducer";
import { UserLogin } from "../MainService";
import { Form, Formik } from "formik";
import { InputField } from "../component/CustomField";
import * as Yup from "yup";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await UserLogin({
        email: values.email,
        password: values.password,
      });

      setLoading(false);
      dispatch(setUser({ token: res.data.accessToken, user: res.data.user }));
      enqueueSnackbar("Login successful!", { variant: "success" });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.message || "Login failed", {
        variant: "error",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {loading && <Loader />}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#2a5298" }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "600" }}
              >
                Welcome Back 👋
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mb: 3 }}>
                Sign in to continue to your dashboard
              </Typography>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginValidationSchema}
                onSubmit={handleFormSubmit}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <InputField
                      name="email"
                      label="Email"
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

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.3,
                        fontSize: "16px",
                        backgroundColor: "#1e3c72",
                        "&:hover": {
                          backgroundColor: "#2a5298",
                        },
                        textTransform: "none",
                      }}
                    >
                      Sign In
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
