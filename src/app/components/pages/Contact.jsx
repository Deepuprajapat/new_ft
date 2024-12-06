import React, { useState } from 'react';
import "../styles/css/contact.css";
import axios from 'axios'; 
// import {noidaImage}  from './';
import noidaImage from "../../assets/img/Noida.png";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    username: '',
    usermobile: '',
    useremail: '',
    usermsg: '',
    enterotp: '',
  });

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

    const payload = {
      username: formData.username,
      usermobile: formData.usermobile,
      useremail: formData.useremail,
      usermsg: formData.usermsg,
    };

    try {
      const response = await axios.post(
       // 'http://148.66.133.154:8181/add/google/leads', 
        payload
      );
      console.log('Response:', response.data);
      if (response.data.success) {
        setOtpSent(true);
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('An error occurred while sending OTP.');
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const otpPayload = {
      usermobile: formData.usermobile,
      otp: formData.enterotp,
    };

    try {
      const response = await axios.post(
        // 'http://servermsg.com/api/SmsApi/', 
        otpPayload,
        {
          params: {
            UserID: 'Invest',
            Password: 'alva1032AL',
            EntityID: '1701158219615298561',
            TemplateID: '1707165293637284915',
            SenderID: 'IMANGO',
          },
        }
      );
      console.log('OTP Verification Response:', response.data);
      if (response.data.success) {
        setOtpVerified(true);
        alert('OTP verified successfully!');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred while verifying OTP.');
    }
  };

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            <a href="/" target="_blank" rel="noopener noreferrer" className="styled-link">
              Home
            </a>{' '}
            / Contact Us
          </p>
        </div>
        <div className="main-con contactUs">
          <div className="container">
            <div className="content contactUsinner">
              <div className="row">
              <div className="col-md-12">
              <h2><p className="h3">Head Office</p></h2>
                           </div>
                           <div className="col-md-6">
                            
                            <div className="box-add">
                            <div className="cont_details">
                                <i className="fas fa-phone-alt"></i>
                                <p> <a className="aRemove" href="tel:+918595189189"> +91-8595-189-189</a> <br/> <a  className="aRemove" href="tel:+917428189189">+91-7428-189-189</a>
                                <br/> <a  className="aRemove" href="tel:+919911189189">+91-9911-189-189</a></p>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="box-add">
                            <div className="cont_details">
                                <i className="fas fa-envelope"></i>
                                <p><a className="aRemove" href="mailto:info@investmango.com">info@investmango.com</a> <br/><a className="aRemove" href="mailto:hr@investmango.com"> hr@investmango.com</a></p>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h2 className="h3">Office Locations</h2>
                            <div className="box-add">
                                <div className="row">
                                    <div className="col-md-4 location-item">
                                        <img src={noidaImage} alt="Noida Location" className="location-icon"/>
                                        <span className="city-name"><strong>Noida</strong></span>
                                        <p >11th Floor, Plot no 6, Magnus Tower, Sector 73, Noida, Uttar Pradesh 201307</p>
                                    </div>
                                    <div className="col-md-4 location-item">
                                        <img src={noidaImage} alt="Gurugram Location" className="location-icon"/>
                                        <span className="city-name"><strong>Gurugram</strong></span>
                                        <p >Office no. 307, Third Floor, (T2) DLF Corporate Green - 2, Sector - 74A, Gurugram, Haryana -122004</p>
                                    </div>
                                    <div className="col-md-4 location-item">
                                        <img src={noidaImage} alt="Pune Location" className="location-icon"/>
                                        <span className="city-name"><strong>Pune</strong></span>
                                        <p >A-803A, Teerth Technospace, Bengaluru - Mumbai Highway, Baner, Pune, Maharashtra - 411045</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                <div className="col-md-6">
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
                          <button type="submit" name="send" id="contact_us" className="btn btn-primary" style={{width: 'auto'}}>
                            Send
                          </button>
                        </div>
                      </div>
                    </div>

                    {otpSent && !otpVerified && (
                      <div id="secondcon">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              name="enterotp"
                              className="form-control user_otp_brochure"
                              type="text"
                              placeholder="Enter OTP :"
                              value={formData.enterotp}
                              onChange={handleChange}
                              required
                            />
                            <button
                              style={{ margin: '0' }}
                              id="contact_otp"
                              className="theme-btn-contact"
                              onClick={handleVerifyOTP}
                            >
                              Verify OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                   {/* Google Maps */}
                   <div className="col-md-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14013.06956917024!2d77.3845057!3d28.5917541!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068cc0b5fd%3A0xdda5c5e0379288b2!2sInvest%20mango!5e0!3m2!1sen!2sin!4v1689407045260!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: "0" }}
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
