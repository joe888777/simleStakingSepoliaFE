import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../api/axiosInstance";

interface AuthPageProps {
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
  showPiaSetter?: (value: boolean) => void; // optional
}

const AuthPage: React.FC<AuthPageProps> = ({ setToken, setUsername,showPiaSetter  }) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [commonError, setCommonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!emailOrUsername.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername))
      newErrors.email = "Enter a valid email address";

    if (resetStep === 0 || resetStep === 2) {
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    }

    if ((tab === "signup" || resetStep === 2) && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit for login/signup/reset
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setCommonError(null);

    try {
      // Password reset: Step 1 (request)
      if (resetStep === 1) {
        const res = await api.post("/auth/request-reset", { email: emailOrUsername });
        if (res.status === 200) {
          alert("Reset link sent to your email");
          setResetStep(2);
        } else {
          setCommonError(res.data?.message || "Failed to send reset link");
        }
        return;
      }

      // Password reset: Step 2 (reset)
      if (resetStep === 2) {
        const res = await api.post("/auth/reset-password", { email: emailOrUsername, newPassword: password });
        if (res.status === 200) {
          alert("Password reset successful!");
          setResetStep(0);
          setTab("login");
          setPassword("");
          setConfirmPassword("");
        } else {
          setCommonError(res.data?.message || "Failed to reset password");
        }
        return;
      }

      // Login
      if (tab === "login") {
        const res = await api.post("/auth/login", { useredetail: emailOrUsername, password });
        if (res.data.statusCode === 200) {
          const token = res.data.accessToken;
          const username = res.data.username || emailOrUsername.split("@")[0];

          localStorage.setItem("authToken", token);
          localStorage.setItem("username", username);
          setAuthToken(token);

          setToken(token);
          setUsername(username);

          navigate("/plans");
        } else {
          setCommonError(res.data?.message || "Login failed");
        }
      }

      // Signup
      if (tab === "signup") {
        const res = await api.post("/auth/signup", { Email: emailOrUsername, password });
        if (res.status === 200) {
          debugger
          const token = res.data.accessToken;
          console.log(res.data)
          const username = res.data.username || emailOrUsername.split("@")[0];
          console.log(token)
          localStorage.setItem("authToken", token);
          localStorage.setItem("username", username);
          setAuthToken(token);

          setToken(token);
          setUsername(username);
          showPiaSetter?.(true); 
          navigate("/pia"); 
        } else {
          setCommonError(res.data?.message || "Signup failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      setCommonError(err.response?.data?.message || "Network or server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", background: "linear-gradient(135deg, #0f1115, #1a1c23)", pt: 12, px: 2 }}>
      <Paper elevation={12} sx={{ width: "100%", maxWidth: 440, p: 5, borderRadius: 4, bgcolor: "#161821", textAlign: "center", boxShadow: "0 0 40px rgba(227,199,139,0.2)" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#e3c78b", fontWeight: 700, textShadow: "0 0 10px #e3c78b, 0 0 20px #e3c78b" }}>
          {resetStep === 1 ? "Reset Password" : resetStep === 2 ? "Enter New Password" : tab === "login" ? "Welcome Back" : "Create Account"}
        </Typography>

        {resetStep === 0 && (
          <Tabs value={tab} onChange={(_, newValue) => { setTab(newValue); setPassword(""); setConfirmPassword(""); setErrors({}); setCommonError(null); }} variant="fullWidth"
            sx={{ mb: 4, "& .MuiTabs-indicator": { backgroundColor: "#e3c78b", height: 4, borderRadius: 3 }, "& .MuiTab-root": { color: "#aaa", fontWeight: 600 }, "& .Mui-selected": { color: "#e3c78b" } }}>
            <Tab label="Login" value="login" />
            <Tab label="Sign Up" value="signup" />
          </Tabs>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Email input */}
          {(resetStep !== 2) && (
            <TextField
              label="Email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              variant="filled"
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#e3c78b" }} /></InputAdornment> }}
              sx={{ backgroundColor: "#1f212b", borderRadius: 2, input: { color: "#fff" }, label: { color: "#e3c78b" } }}
            />
          )}

          {/* Password fields */}
          {(resetStep === 0 || resetStep === 2) && (
            <>
              <TextField
                label={resetStep === 2 ? "New Password" : "Password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                variant="filled"
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#e3c78b" }} /></InputAdornment> }}
                sx={{ backgroundColor: "#1f212b", borderRadius: 2, input: { color: "#fff" }, label: { color: "#e3c78b" } }}
              />
              {(tab === "signup" || resetStep === 2) && (
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  variant="filled"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#e3c78b" }} /></InputAdornment> }}
                  sx={{ backgroundColor: "#1f212b", borderRadius: 2, input: { color: "#fff" }, label: { color: "#e3c78b" } }}
                />
              )}
            </>
          )}

          {/* Forgot password */}
          {tab === "login" && resetStep === 0 && (
            <Box sx={{ textAlign: "right", mt: -2 }}>
              <Link sx={{ color: "#e3c78b", fontWeight: 700, fontSize: 13, cursor: "pointer" }} onClick={() => setResetStep(1)}>Forgot Password?</Link>
            </Box>
          )}

          {/* Common error */}
          {commonError && <Typography sx={{ color: "red", textAlign: "center", mt: -1 }}>{commonError}</Typography>}

          {/* Submit button */}
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            sx={{ mt: 1, bgcolor: "#e3c78b", color: "#000", fontWeight: "bold", fontSize: "1rem", py: 1.5, borderRadius: 3, boxShadow: "0 0 15px #e3c78b", transition: "0.3s", "&:hover": { bgcolor: "#d4b86b", boxShadow: "0 0 25px #e3c78b" } }}
          >
            {loading ? "Please wait..." : resetStep === 1 ? "Next" : resetStep === 2 ? "Reset Password" : tab === "login" ? "Login" : "Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;
