import React, { useState, useEffect } from "react";
import "../styles/css/popup.css";
import { sendOTP, verifyOTP, resendOTP } from "../../apis/api";


const LeadFormPopup = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    usermsg: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0 && otpSent) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, otpSent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!formData.username.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.usermobile || formData.usermobile.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setTimer(60);
    try {
      const response = await sendOTP(
        formData.usermobile,
        "", // project name if needed
        "ORGANIC",
        formData.username,
        formData.usermsg
      );
      if (response) setOtpSent(true);
      else setError("Failed to send OTP. Please try again.");
    } catch {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await verifyOTP(formData.usermobile, otp);
      if (response && response.message === "OTP Validated Successfully") {
        setOtpVerified(true);
        setError("");
      } else {
        setError("OTP verification failed. Please try again.");
        setOtpVerified(false);
      }
    } catch {
      setError("Failed to verify OTP. Please try again.");
      setOtpVerified(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await resendOTP(formData.usermobile);
      if (response) {
        setTimer(60);
        setError("");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="lead-popup-overlay">
      <div className="lead-popup two-column-popup">
        {/* Left Column: Project Info/Features */}
        <div className="popup-left">
          <div className="project-title">ACE Starlit</div>
          <div className="feature-list">
            <div className="feature-item">
              <img src="/images/icon-return-call.svg" alt="Instant Call Back" className="feature-icon" />
              <span>INSTANT CALL BACK</span>
            </div>
            <div className="feature-item">
              {/* Replace image with Font Awesome icon */}
              <img src="/images/icon-hand-shake.svg" alt="Unmatched Price" className="feature-icon" />
              {/* <i className="fa fa-handshake-o feature-icon" aria-hidden="true" style={{ fontSize: '43px', color: '#2c94d2' }}></i> */}
              <span>FREE SITE VISIT</span>
            </div>
            <div className="feature-item">
              <img src="/images/icon-price.svg" alt="Unmatched Price" className="feature-icon" />
              <span>UNMATCHED PRICE</span>
            </div>
          </div>
        </div>
        {/* Right Column: Form, Logo, Close Button */}
        <div className="popup-right">
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="popup-header" style={{ textAlign: 'center', marginBottom: 20 }}>
            {/* <img src="images/PopupLogo.svg" alt="Logo" className="popup-logo" /> */}
            <h2 style={{textAlign: 'center', fontSize: '1.7rem', fontWeight: 700, color: '#2067d1', margin: 0, marginBottom: 6 }}>Invest Mango</h2>
            <p style={{ fontSize: '1.05rem', color: '#222', margin: 0 }}>
              Register here and Avail the <span className="highlight" style={{ color: '#2067d1', fontWeight: 600 }}>Best Offers!!</span>
            </p>
          </div>
          {!otpSent && !otpVerified && (
            <form onSubmit={e => e.preventDefault()}>
              <input
                name="username"
                type="text"
                placeholder="Enter Name"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                name="usermobile"
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.usermobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <textarea
                name="usermsg"
                placeholder="Message"
                value={formData.usermsg}
                onChange={handleChange}
              />
              {error && <div className="error">{error}</div>}
              <button type="button" className="send-btn" onClick={sendOtp}>SEND</button>
            </form>
          )}
          {otpSent && !otpVerified && (
            <div>
              <div className="success-msg">
                OTP sent to your mobile number{" "}
                <a href="#" onClick={() => setOtpSent(false)}>Edit</a>
              </div>
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
              {error && <div className="error">{error}</div>}
              <div className="otp-actions">
                <button onClick={resendOtp} disabled={timer > 0}>
                  Resend {timer > 0 && `(${timer}s)`}
                </button>
                <button onClick={verifyOtp}>Verify OTP</button>
              </div>
            </div>
          )}
          {otpVerified && (
            <div className="success-msg">
              OTP verified! We will connect with you shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFormPopup; 