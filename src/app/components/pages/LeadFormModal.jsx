import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { sendOTP, verifyOTP, resendOTP } from "../../apis/api"; // Import API methods

const LeadFormModal = ({ open, onClose, onDownload }) => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    projectName: "CamparePage",
    source: "Organic",
    userType: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!formData.username || !formData.usermobile) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const response = await sendOTP(
        formData.usermobile,
        formData.projectName,
        formData.source,
        formData.username,
        "",
        "",
        formData.userType
      );
      console.log("OTP Response:", response); // Debugging
      if (response.message === "Leads Saved Successfully") {
        setOtpSent(true);
        setError("");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP Sending Error:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(formData.usermobile, otp);
      setOtpVerified(true);
      setError("");
      onDownload(); // Trigger PDF download after OTP verification
      onClose();
      // Refresh the page after OTP verification
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adding a short delay for a smooth experience
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(formData.usermobile);
      setError("OTP resent successfully.");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Download a PDF of your compared projects</DialogTitle>
      <DialogContent>
        {!otpSent ? (
          <>
            {/* <select
              name="userType"
              className="form-select"
              style={{
                width: "100%",
                padding: "8px",
                margin: "8px 0", // Similar to `margin="dense"`
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              value={formData.userType} // Ensure this is in your state
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Associate">Associate</option>
              <option value="Builder">Builder</option>
              <option value="Broker">Broker</option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
            </select> */}

            <TextField
              name="username"
              label="Name"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
            <TextField
              name="usermobile"
              label="Mobile"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSendOTP}
            >
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <TextField
              name="otp"
              label="Enter OTP"
              fullWidth
              margin="dense"
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleResendOTP}
            >
              Resend OTP
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormModal;
