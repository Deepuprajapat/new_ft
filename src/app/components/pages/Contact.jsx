import React, { useState, useEffect } from "react";
import "../styles/css/contact.css";
import { sendOTP, verifyOTP, resendOTP } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    useremail: "",
    message: "",
    projectName: "",
    userType: "",
  });

  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo(0, 0);
  }, []);

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
        "Contact Page", // Project Name
        "ORGANIC", // Source
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
    <>
      <Helmet>
        <title>Contact Us</title>
        <meta
          name="description"
          content="For more details on On-Site Visits, Locations, Developers' Information, Property Age, Documentation, Bank Assistance, and many more feel free to connect."
        />
        <link rel="canonical" href="https://www.investmango.com/contact" />
      </Helmet>

      <div>
        <section className="main-body">
          <div className="container">
            <h1>Contact Us</h1>
            <p>
              <a href="/" className="styled-link">
                Home
              </a>{" "}
              / Contact Us
            </p>
          </div>

          <div className="main-con contactUs">
            <div className="container">
              <div className="content contactUsinner">
                <div className="row">
                  <div className="col-md-6">
                    <h2>
                      <p className="h3">Head Office</p>
                    </h2>
                    <div className="box-add">
                      <div className="cont_details">
                        <i className="fas fa-phone-alt"></i>
                        <p>
                          <a className="aRemove" href="tel:+918595189189">
                            +91-8595-189-189
                          </a>
                          <br />
                          <a className="aRemove" href="tel:+917428189189">
                            +91-7428-189-189
                          </a>
                          <br />
                          <a className="aRemove" href="tel:+919911189189">
                            +91-9911-189-189
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    {/* <p className="h3">&nbsp;</p> */}
                    <div className="box-add">
                      <div className="cont_details">
                        <i className="fas fa-envelope"></i>
                        <p>
                          <a
                            className="aRemove"
                            href="mailto:info@investmango.com"
                          >
                            info@investmango.com
                          </a>
                          <br />
                          <a
                            className="aRemove"
                            href="mailto:hr@investmango.com"
                          >
                            hr@investmango.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <h2 className="h3">Office Locations</h2>
                    <div className="box-add">
                      <div className="row">
                        {/* Noida Location */}
                        <div className="col-md-4 location-item">
                          <img
                            src="/images/Noida.png"
                            alt="Noida Location"
                            loading="lazy"
                            className="location-icon"
                          />
                          <span className="city-name">
                            <strong>Noida</strong>
                          </span>
                          <p
                            style={{ margin: 0, padding: 0, fontSize: "14px" }}
                          >
                            11th Floor, Plot no 6, Magnus Tower, Sector 73,
                            Noida, Uttar Pradesh 201307
                          </p>
                        </div>
                        {/* Gurugram Location */}
                        <div className="col-md-4 location-item">
                          <img
                            src="/images/Gurugram.png"
                            alt="Gurugram Location"
                            loading="lazy"
                            className="location-icon"
                          />
                          <span className="city-name">
                            <strong>Gurugram</strong>
                          </span>
                          <p
                            style={{ margin: 0, padding: 0, fontSize: "14px" }}
                          >
                            Office no. 307, Third Floor, (T2) DLF Corporate
                            Green - 2, Sector - 74A, Gurugram, Haryana -122004
                          </p>
                        </div>
                        {/* Pune Location */}
                        <div className="col-md-4 location-item">
                          <img
                            src="/images/Pune.png"
                            alt="Pune Location"
                            loading="lazy"
                            className="location-icon"
                          />
                          <span className="city-name">
                            <strong>Pune</strong>
                          </span>
                          <p
                            style={{ margin: 0, padding: 0, fontSize: "14px" }}
                          >
                            A-803A, Teerth Technospace, Bengaluru - Mumbai
                            Highway, Baner, Pune, Maharashtra - 411045
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    {!otpSent ? (
                      // Form to Send OTP
                      <div className="headline">
                        <form id="contactpage" onSubmit={handleFormSubmit}>
                          <div className="row">
                            <div className="col-md-12">
                              <label>Role:</label>
                              <select
                                name="userType"
                                className="form-select"
                                // style={{
                                //   width: "100%",
                                //   padding: "8px",
                                //   margin: "8px 0", // Similar to `margin="dense"`
                                //   borderRadius: "4px",
                                //   border: "1px solid #ccc",
                                // }}
                                value={formData.userType} // Ensure this is in your state
                                onChange={handleChange}
                              >
                                <option value="">Select</option>
                                <option value="Associate">Associate</option>
                                <option value="Builder">Builder</option>
                                <option value="Broker">Broker</option>
                                <option value="Seller">Seller</option>
                                <option value="Buyer">Buyer</option>
                              </select>
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

                              <label>Email :</label>
                              <input
                                name="useremail"
                                type="email"
                                placeholder="Enter Email"
                                maxLength="10"
                                className="form-control"
                                value={formData.useremail}
                                onChange={handleChange}
                              />

                              <label>Message:</label>
                              <textarea
                                name="message"
                                className="form-control"
                                rows="3"
                                placeholder="Message"
                                value={formData.message}
                                style={{ resize: "none", overflowY: "auto" }}
                                onChange={handleChange}
                              ></textarea>

                              {error && (
                                <div
                                  className="alert alert-danger"
                                  role="alert"
                                >
                                  {error}
                                </div>
                              )}

                              <button type="submit" className="theme-btn">
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
                          Enter the OTP sent to your phone number:{" "}
                          {formData.usermobile}
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
                  <div className="col-md-6">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14013.06956917024!2d77.3845057!3d28.5917541!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068cc0b5fd%3A0xdda5c5e0379288b2!2sInvest%20mango!5e0!3m2!1sen!2sin!4v1689407045260!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      style={{ border: "0" }}
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      title="location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;
