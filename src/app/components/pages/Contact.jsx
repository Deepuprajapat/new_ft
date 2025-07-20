import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { sendOTP, verifyOTP, resendOTP } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

// Styled Components
const Section = styled.section`
  background: #f5f8fd;
  min-height: 100vh;
`;
const ContactWrapper = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(32,103,209,0.10);
  border: 1.5px solid #e3eaf5;
  padding: 40px 0 40px 0;
  margin: 32px auto;
  max-width: 1600px;
  transition: box-shadow 0.2s;
  @media (max-width: 991px) {
    padding: 18px 0 18px 0;
    margin: 12px 0;
    border-radius: 10px;
  }
  @media (max-width: 480px) {
    padding: 8px 0 8px 0;
    margin: 8px 0;
    border-radius: 8px;
  }
`;
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;
const OfficeTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 28px;
  letter-spacing: -1px;
  text-align: center;
  @media (max-width: 991px) {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;
const Col = styled.div`
  flex: 1 1 50%;
  max-width: 50%;
  padding: 10px;
  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
  }
`;
const OfficeBox = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(32,103,209,0.07);
  border: none;
  margin-bottom: 22px;
  transition: box-shadow 0.2s;
  padding: 22px 18px;
  &:hover {
    box-shadow: 0 4px 24px rgba(32,103,209,0.15);
  }
  @media (max-width: 991px) {
    padding: 16px 10px;
  }
  @media (max-width: 767px) {
    margin-bottom: 18px;
  }
`;
const OfficeIcon = styled.div`
  color: #2067d1;
  margin-bottom: 8px;
`;
const OfficeName = styled.div`
  font-size: 1.18rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: #222;
`;
const OfficeInfo = styled.div`
  font-size: 15px;
  color: #444;
  margin-top: 8px;
  & i {
    width: 22px;
    text-align: center;
    color: #2067d1;
    margin-right: 8px;
  }
`;
const MainCon = styled.div`
  margin-top: 32px;
`;
const HeadLine = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(32,103,209,0.07);
  padding: 32px 24px;
  margin-bottom: 32px;
  @media (max-width: 991px) {
    padding: 18px 8px 10px 8px;
  }
  @media (max-width: 767px) {
    padding: 12px 4px 6px 4px;
  }
  @media (max-width: 480px) {
    padding: 6px 2px 4px 2px;
  }
`;
const Form = styled.form``;
const FormGroup = styled.div`
  margin-bottom: 15px;
`;
const FormControl = styled.input`
  width: 100%;
  padding: 12px 14px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #d6e0ef;
  font-size: 15px;
  margin-bottom: 14px;
  background: #f8fafd;
  transition: border-color 0.2s;
  &:focus {
    border-color: #2067d1;
    box-shadow: 0 0 0 2px #e3edfa;
    background: #fff;
  }
  @media (max-width: 768px) {
    padding: 8px;
  }
`;
const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #d6e0ef;
  font-size: 15px;
  margin-bottom: 14px;
  background: #f8fafd;
  transition: border-color 0.2s;
  resize: none;
  overflow-y: auto;
  &:focus {
    border-color: #2067d1;
    box-shadow: 0 0 0 2px #e3edfa;
    background: #fff;
  }
`;
const ThemeBtn = styled.button`
  background: #2067d1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  transition: background 0.2s;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(32,103,209,0.07);
  &:hover, &:focus {
    background: #174a9b;
    color: #fff;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 14px 0;
    font-size: 17px;
    display: block;
  }
`;
const BtnSecondary = styled(ThemeBtn)`
  background: #f0f4fa;
  color: #2067d1;
  border: 1px solid #d6e0ef;
`;
const Alert = styled.div`
  margin-top: 10px;
  font-size: 0.97rem;
  padding: 8px 12px;
  background: #ffeaea;
  color: #d32f2f;
  border: 1px solid #ffd6d6;
  border-radius: 6px;
`;
const OTPVerification = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(32,103,209,0.07);
  padding: 32px 24px;
  margin-bottom: 32px;
`;
const MapOuter = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(32,103,209,0.07);
  border: none;
  padding: 10px;
  margin-top: 0;
  overflow: hidden;
  @media (max-width: 991px) {
    margin-top: 24px;
    min-height: 250px;
  }
  @media (max-width: 767px) {
    margin-top: 18px;
    padding: 6px;
    min-height: 180px;
  }
  @media (max-width: 480px) {
    padding: 4px;
  }
`;
const GMapCanvas = styled.div`
  & iframe {
    width: 100%;
    height: 350px;
    border: 0;
    border-radius: 12px;
  }
`;

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

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const phonePattern = /^[5-9][0-9]{9}$/;
    if (!phonePattern.test(formData.usermobile)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      await sendOTP(
        formData.usermobile,
        "Contact Page",
        "ORGANIC",
        formData.username,
        formData.message,
        formData.useremail,
        formData.userType
      );
      swal("OTP Sent!", "Please check your phone for the OTP.", "success");
      setOtpSent(true);
    } catch (error) {
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
      const response = await verifyOTP(formData.usermobile, otp);
      console.log("OTP Verification Response:", response);
      
      if (response && response.data.message === "OTP Validated Successfully") {
        swal("Verified!", "OTP verification successful.", "success").then(() => {
          navigate("/thankYou");
        });
      } else {
        console.log("Unexpected response format:", response);
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      // Check if it's a network error vs API error  
      if (error.response && error.response.status === 200) {
        swal("Verified!", "OTP verification successful.", "success").then(() => {
          navigate("/thankYou");
        });
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      await resendOTP(formData.usermobile);
      swal("OTP Resent!", "Please check your phone for the new OTP.", "success");
    } catch (error) {
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

      <Section>
        <ContactWrapper>
          <Container>
            {/* <h1>Contact Us</h1>
            <p>
              <a href="/" className="styled-link">
                Home
              </a>{" "}
              / Contact Us
            </p> */}

            {/* --- OFFICE LOCATIONS SECTION AT THE TOP --- */}
            <div className="container mb-5">
              <OfficeTitle className="office-title mb-4">Discover Our Office Locations</OfficeTitle>
              <Row>
                {/* Noida Branch & Pune Branch */}
                <Col>
                  <OfficeBox>
                    <OfficeIcon>
                      <i className="fas fa-building fa-2x"></i>
                    </OfficeIcon>
                    <OfficeName>Noida Branch (Head Office )</OfficeName>
                    <OfficeInfo>
                      <div><i className="fas fa-envelope"></i> Info@investmango.com</div>
                      <div><i className="fas fa-map-marker-alt"></i> 11th Floor, Magnus Tower, Sec-73 Sarfabad, Noida 201304</div>
                      <div><i className="fas fa-phone-alt"></i> +91 8543-189-189</div>
                    </OfficeInfo>
                  </OfficeBox>
                  <OfficeBox>
                    <OfficeIcon>
                      <i className="fas fa-building fa-2x"></i>
                    </OfficeIcon>
                    <OfficeName>Pune Branch</OfficeName>
                    <OfficeInfo>
                      <div><i className="fas fa-envelope"></i> Info@investmango.com</div>
                      <div><i className="fas fa-map-marker-alt"></i> 803A, Teerth Technospace, Bengaluru, Mumbai Highway, Baner, Pune , Maharashtra - 411045</div>
                      <div><i className="fas fa-phone-alt"></i> +91 9911-189-189</div>
                    </OfficeInfo>
                  </OfficeBox>
                </Col>
                {/* Gurgaon & Lucknow */}
                <Col>
                  <OfficeBox>
                    <OfficeIcon>
                      <i className="fas fa-building fa-2x"></i>
                    </OfficeIcon>
                    <OfficeName>Gurgaon Branch</OfficeName>
                    <OfficeInfo>
                      <div><i className="fas fa-envelope"></i> Info@investmango.com</div>
                      <div><i className="fas fa-map-marker-alt"></i> Office no. 307, 3rd Floor, Tower-2, Sector-74a, DLF Corporate Green, Gurgaon Haryana - 122004</div>
                      <div><i className="fas fa-phone-alt"></i> +91 7428-189-189</div>
                    </OfficeInfo>
                  </OfficeBox>
                  {/* <OfficeBox>
                    <OfficeIcon>
                      <i className="fas fa-building fa-2x"></i>
                    </OfficeIcon>
                    <OfficeName>Lucknow Branch</OfficeName>
                    <OfficeInfo>
                      <div><i className="fas fa-envelope"></i> Info@investmango.com</div>
                      <div><i className="fas fa-map-marker-alt"></i> 11th Floor, Magnus Tower, Sec-73 Sarfabad, Noida 201304</div>
                      <div><i className="fas fa-phone-alt"></i> +91 8543-189-189</div>
                    </OfficeInfo>
                  </OfficeBox> */}
                </Col>
              </Row>
            </div>
            {/* --- END OF OFFICE LOCATIONS SECTION --- */}
          </Container>

          <MainCon>
            <Container>
              {/* <div className="content contactUsinner"> */}
                <OfficeTitle className="office-title mb-4">Let's Connect With Us</OfficeTitle>
                <Row>
                  {/* Contact Form */}
                  <Col>
                    {!otpSent ? (
                      <HeadLine>
                        <Form id="contactpage" onSubmit={handleFormSubmit}>
                          <Row>
                            <Col>
                              <FormGroup>
                                <label>Name:</label>
                                <FormControl
                                  required
                                  name="username"
                                  type="text"
                                  placeholder="Enter Name"
                                  value={formData.username}
                                  onChange={handleChange}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label>Phone Number:</label>
                                <FormControl
                                  required
                                  name="usermobile"
                                  type="tel"
                                  placeholder="Enter Phone Number"
                                  maxLength="10"
                                  value={formData.usermobile}
                                  onChange={e => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleChange({
                                      target: {
                                        name: 'usermobile',
                                        value,
                                      }
                                    });
                                  }}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label>Email :</label>
                                <FormControl
                                  name="useremail"
                                  type="email"
                                  placeholder="Enter Email"
                                  value={formData.useremail}
                                  onChange={handleChange}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label>Message:</label>
                                <FormTextarea
                                  name="message"
                                  rows="3"
                                  placeholder="Message"
                                  value={formData.message}
                                  onChange={handleChange}
                                ></FormTextarea>
                              </FormGroup>

                              {error && (
                                <Alert role="alert">
                                  {error}
                                </Alert>
                              )}

                              <FormGroup>
                                <div
                                  className="form-group my-3"
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    width: "100%",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    id="consentCheckbox"
                                    required
                                    style={{
                                      marginTop: 3,
                                      accentColor: "#2067d1", // modern browsers
                                      width: window.innerWidth <= 600 ? 22 : 18,
                                      height: window.innerWidth <= 600 ? 22 : 18,
                                      minWidth: window.innerWidth <= 600 ? 22 : 18,
                                      minHeight: window.innerWidth <= 600 ? 22 : 18,
                                      cursor: "pointer",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <label
                                    htmlFor="consentCheckbox"
                                    style={{
                                      fontSize: window.innerWidth <= 600 ? 13 : 14,
                                      lineHeight: 1.5,
                                      padding: 0,
                                      width: "100%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    I authorize <strong>Invest Mango</strong> and its representative to contact
                                    me with updates and notifications via Email, SMS, WhatsApp, and Call. This
                                    will override the registry on DND / NDNC.
                                  </label>
                                </div>
                              </FormGroup>

                              <ThemeBtn type="submit">
                                Send
                              </ThemeBtn>
                            </Col>
                          </Row>
                        </Form>
                      </HeadLine>
                    ) : (
                      <OTPVerification>
                        <h3 className="h3">Verify OTP</h3>
                        <p className="sub-headline">
                          Enter the OTP sent to your phone number: {formData.usermobile}
                        </p>
                        <Form onSubmit={handleOtpVerification}>
                          <Col>
                            <FormGroup>
                              <label>OTP:</label>
                              <FormControl
                                required
                                type="text"
                                maxLength="6"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={handleOtpChange}
                              />
                            </FormGroup>

                            {otpError && (
                              <Alert role="alert">
                                {otpError}
                              </Alert>
                            )}

                            <ThemeBtn type="submit">
                              Verify OTP
                            </ThemeBtn>

                            <BtnSecondary
                              type="button"
                              onClick={handleResendOtp}
                            >
                              Resend OTP
                            </BtnSecondary>
                          </Col>
                        </Form>
                      </OTPVerification>
                    )}
                  </Col>
                  {/* Map */}
                  <Col>
                    <MapOuter>
                      <GMapCanvas>
                        <iframe
                          title="Google Map"
                          width="100%"
                          height="450"
                          id="gmap_canvas"
                          loading="lazy"
                          src="https://maps.google.com/maps?q=Invest%20Mango%20-%20Real%20Estate%20Consultants%20in%20Delhi%20NCR&t=&z=13&ie=UTF8&iwloc=&output=embed"
                          frameBorder="0"
                          allowFullScreen=""
                          aria-hidden="false"
                          tabIndex="0"
                        ></iframe>
                      </GMapCanvas>
                    </MapOuter>
                  </Col>
                </Row>
              {/* </div> */}
            </Container>
          </MainCon>
        </ContactWrapper>
      </Section>
    </>
  );
};

export default ContactUs;
