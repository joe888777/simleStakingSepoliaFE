import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyAccount: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedWallet = localStorage.getItem("walletAddress");
    const storedBalance = localStorage.getItem("walletBalance");

    if (storedUsername) setUsername(storedUsername);
    if (storedWallet) setWalletAddress(storedWallet);
    if (storedBalance) setWalletBalance(storedBalance);
  }, []);

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setWalletBalance(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletBalance");
  };

  const handleEditProfile = () => {
    // Navigate to a profile edit page
    navigate("/edit-profile");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 5,
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          bgcolor: "#121212",
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: "#e3c78b", color: "#000", fontSize: 24, width: 64, height: 64 }}>
            {username ? username[0].toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {username}
            </Typography>
            {walletAddress && (
              <Typography variant="body2" sx={{ color: "#e3c78b" }}>
                {walletAddress} | {walletBalance}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ bgcolor: "#333", mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#e3c78b",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#d4c77f" },
            }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>

          {walletAddress && (
            <Button
              variant="outlined"
              sx={{
                color: "#e3c78b",
                borderColor: "#e3c78b",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1f1f1f", borderColor: "#e3c78b" },
              }}
              onClick={handleWalletDisconnect}
            >
              Disconnect Wallet
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MyAccount;
