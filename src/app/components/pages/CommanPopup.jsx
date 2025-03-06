import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  // checkPhoneNumberExists,
  submitLead,
} from "../../apis/api";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const BASE_BROCHURE_URL =
  "https://myimwebsite.s3.ap-south-1.amazonaws.com/images";
const FALLBACK_BROCHURE = "/images/For-Website.jpg"; // Assuming it's in public/images

const PopupDialog = ({ open, onClose, projectName }) => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    usermsg: projectName || "",
  });

  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, usermsg: projectName }));
  }, [projectName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "usermobile") {
      if (!/^\d*$/.test(value)) return; // Allow only digits
      if (value.length > 10) return; // Limit to 10 digits
    }
    setFormData({ ...formData, [name]: value });
  };

  const generateComingSoonPDF = (projectName) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BROCHURE COMING SOON", 50, 80);
    doc.setFontSize(14);
    doc.text(`Project: ${projectName || "Unknown Project"}`, 50, 100);
    doc.save(`${projectName || "Brochure"}-Coming-Soon.pdf`);
  };

  const handleSubmit = async () => {
    const { username, usermobile } = formData;

    if (!username || !usermobile) {
      setError("Please fill in all fields.");
      return;
    }

    if (usermobile.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      await sendOTP(usermobile, projectName, "brochure", username, "");
      setIsOtpSent(true);
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: `An OTP has been sent to ${formData.usermobile}.`,
        backdrop: true,
        allowOutsideClick: false,
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "2000";
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleOtpVerification = async () => {
    try {
      const response = await verifyOTP(formData.usermobile, otp);

      if (response.message === "OTP Validated Successfully") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your OTP has been verified successfully!",
          backdrop: true,
          allowOutsideClick: false,
        }).then(() => {
            window.location.reload(); // Refresh the page
        });

        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: response.message || "Please enter the correct OTP.",
          backdrop: true,
          allowOutsideClick: false,
          didOpen: () => {
            document.querySelector(".swal2-container").style.zIndex = "2000";
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "OTP Verification Failed",
        text: error.response?.data?.message || "Invalid OTP, please try again.",
        backdrop: true,
        allowOutsideClick: false,
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "2000";
        },
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(formData.usermobile);
      Swal.fire({
        icon: "info",
        title: "OTP Resent",
        text: "A new OTP has been sent to your phone.",
        backdrop: true, // Keeps modal focus
        allowOutsideClick: false, // Prevents accidental closure
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "2000"; // Ensures visibility
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to resend OTP. Try again later.",
        backdrop: true, // Keeps modal focus
        allowOutsideClick: false, // Prevents accidental closure
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "2000"; // Ensures visibility
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {!isOtpSent ? (
          <>
            <p style={{ padding: "10px", color: "black" }}>
              <img
                src="/images/IM-Fabicon.png"
                alt="Favicon"
                loading="lazy"
                style={{ width: "24px", height: "24px", marginRight: "8px" }}
              />
              Enter your contact details to download the brochure of <br />
              <div
                style={{
                  fontSize: "24px",
                  color: "#2067d1",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {projectName || "Invest Mango"}
              </div>
            </p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Name"
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="usermobile"
              value={formData.usermobile}
              onChange={handleChange}
              placeholder="Enter Phone"
              required
              style={{
                width: "100%",
                padding: "8px",
                margin: "8px 0", // Similar to `margin="dense"`
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        ) : (
          <>
            <p style={{ padding: "10px", color: "black" }}>
              Enter the OTP sent to {formData.usermobile} to verify your
              identity.
            </p>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              style={{
                width: "100%",
                padding: "8px",
                margin: "8px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!isOtpSent ? (
          <>
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleResendOTP} color="secondary">
              Resend OTP
            </Button>
            <Button onClick={handleOtpVerification} color="primary">
              Verify OTP
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;
