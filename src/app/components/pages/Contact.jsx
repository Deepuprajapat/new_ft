import React, { useState } from 'react';
import "../styles/css/contact.css"
// import "../styles/css/projectCard.css";
//import './ContactUs.css'; // Import your CSS file for styling

const ContactUs = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    username: '',
    usermobile: '',
    useremail: '',
    usermsg: '',
    enterotp: '',
  });

  // State to manage OTP verification visibility
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your form submission logic here
    // For example, send formData to your backend API
    console.log('Form Submitted:', formData);
    setOtpSent(true);
  };

  // Handle OTP verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    // Implement your OTP verification logic here
    // For example, verify formData.enterotp with your backend
    console.log('OTP Entered:', formData.enterotp);
    setOtpVerified(true);
  };

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="styled-link"
            >
              Home
            </a>{' '}
            / Contact Us
          </p>
        </div>

        <div className="main-con contactUs">
          <div className="container">
            <div className="content contactUsinner">
              <div className="row">
                {/* Contact Details */}
                <div className="col-md-4">
                  <h2 className="h3">Head Office</h2>
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
                  <div className="box-add">
                    <div className="cont_details">
                      <i className="fas fa-envelope"></i>
                      <p>
                        <a className="aRemove" href="mailto:info@investmango.com">
                          info@investmango.com
                        </a>
                        <br />
                        <a className="aRemove" href="mailto:hr@investmango.com">
                          hr@investmango.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="box-add">
                    <div className="cont_details">
                      <i className="fas fa-building"></i>
                      <p>11th Floor, Plot no 6, Magnus Tower, Sector 73, Noida, Uttar Pradesh 201307</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="col-md-6">
                  <div>
                    <form id="contactpage" onSubmit={handleSubmit}>
                      <div id="firstcon">
                        <div className="row">
                          <div className="col-md-6">
                            <label htmlFor="username">Name :</label>
                            <input
                              required
                              name="username"
                              type="text"
                              placeholder="Enter Name"
                              className="form-control name_valid"
                              value={formData.username}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="usermobile">Phone Number :</label>
                            <input
                              required
                              name="usermobile"
                              type="tel"
                              placeholder="Enter Phone Number"
                              maxLength="10"
                              pattern="[5-9][0-9]{9}"
                              className="form-control mobile_valid"
                              value={formData.usermobile}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="useremail">Email :</label>
                            <input
                              name="useremail"
                              type="email"
                              placeholder="Enter Email"
                              className="form-control"
                              value={formData.useremail}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="usermsg">Message :</label>
                            <textarea
                              name="usermsg"
                              className="form-control"
                              rows="3"
                              placeholder="Message"
                              value={formData.usermsg}
                              onChange={handleChange}
                              required
                            ></textarea>
                          </div>
                          <div className="col-md-12">
                            <button type="submit" name="send" id="contact_us" className="theme-btn">
                              Send
                            </button>
                            <br />
                            {!otpSent && (
                              <div className="alert con_error_display alert-danger" style={{ display: 'none' }} role="alert">
                                <span className="con_error_text"></span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {otpSent && !otpVerified && (
                        <div id="secondcon">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="alert alert-success error_class_con" role="alert">
                                <b className="error_con"> OTP sent to your mobile number </b>
                              </div>
                              <div>
                                <input
                                  name="enterotp"
                                  className="form-control user_otp_brochure"
                                  type="text"
                                  placeholder="Enter OTP :"
                                  value={formData.enterotp}
                                  onChange={handleChange}
                                  required
                                />
                                <button style={{ margin: '0' }} id="contact_otp" className="theme-btn" onClick={handleVerifyOTP}>
                                  Verify OTP
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="col-md-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14013.06956917024!2d77.3845057!3d28.5917541!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068cc0b5fd%3A0xdda5c5e0379288b2!2sInvest%20mango!5e0!3m2!1sen!2sin!4v1689407045260!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: '0' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </section>
    </div>
  );
};

export default ContactUs;
