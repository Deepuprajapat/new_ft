import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";
import { sendOTP, verifyOTP, resendOTP } from "../../apis/api";

const MailSection = () => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    message: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "usermobile" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const phonePattern = /^[5-9][0-9]{9}$/;
    if (!phonePattern.test(formData.usermobile)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      // Send OTP
      await sendOTP(
        formData.usermobile,
        "index page", // Project Name
        "website", // Source
        formData.username,
        formData.message,
        "",
        formData.userType
        
      );
      swal("OTP Sent!", "Please check your phone for the OTP.", "success");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setError("Failed to send OTP. Please try again later.");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    try {
      await verifyOTP(formData.usermobile, otp);
      swal("Verified!", "OTP verification successful.", "success").then(() => {
        navigate("/thankYou");
      });
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      await resendOTP(formData.usermobile);
      swal(
        "OTP Resent!",
        "Please check your phone for the new OTP.",
        "success"
      );
    } catch (error) {
      console.error("Error resending OTP:", error.message);
      setOtpError("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="container mail-background">
      {!otpSent ? (
        // Form to Send OTP
        <div className="headline">
          <h3 className="h3">Still Confused?</h3>
          <p className="sub-headline">We are Here to Assist!</p>
          <form id="contactpage" onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-md-12">
                {/* <label>Role:</label>
                <select
                  name="userType"
                  className="form-select"
                  value={formData.userType} // Ensure this is in your state
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Associate">Associate</option>
                  <option value="Builder">Builder</option>
                  <option value="Broker">Broker</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </select> */}
                <label>Name:</label>
                <input
                  required
                  name="username"
                  type="text"
                  placeholder="Enter Name"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />

                <label>Phone Number:</label>
                <input
                  required
                  name="usermobile"
                  type="tel"
                  placeholder="Enter Phone Number"
                  maxLength="10"
                  className="form-control"
                  value={formData.usermobile}
                  onChange={handleChange}
                />

                <label>Message:</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="3"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ resize: "none", overflowY: "auto" }}
                ></textarea>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="theme-btn"
                  style={{ margintop: "20px!important" }}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        // Form to Verify OTP
        <div className="otp-verification">
          <h3 className="h3">Verify OTP</h3>
          <p className="sub-headline">
            Enter the OTP sent to your phone number: {formData.usermobile}
          </p>
          <form onSubmit={handleOtpVerification}>
            <div className="col-md-12">
              <label>OTP:</label>
              <input
                required
                type="text"
                maxLength="6"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
              />

              {otpError && (
                <div className="alert alert-danger" role="alert">
                  {otpError}
                </div>
              )}

              <button type="submit" className="theme-btn">
                Verify OTP
              </button>

              <button
                type="button"
                className="theme-btn btn-secondary mt-2"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MailSection;
