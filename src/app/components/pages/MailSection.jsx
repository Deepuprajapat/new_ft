import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";

const MailSection = () => {
  const [showOtpSection, setShowOtpSection] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement your form submission logic here
    setShowOtpSection(true);
  };

  return (
      <div className="container mail-background">
        <div className="headline">
          <h3 className="h3">Still Confused?</h3>
          <p className="sub-headline">We are Here to Assist!</p>
          <form id="contactpage" onSubmit={handleFormSubmit}>
            <div id="firstcon" className={showOtpSection ? "hidden" : "visible"}>
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-12">
                    <label>Name:</label>
                    <input
                      required
                      name="username"
                      type="text"
                      placeholder="Enter Name"
                      className="form-control name_valid"
                    />
                  </div>
                  <div className="col-md-12">
                    <label>Phone Number:</label>
                    <input
                      required
                      name="usermobile"
                      type="tel"
                      placeholder="Enter Phone Number"
                      maxLength="10"
                      pattern="[5-9][0-9]{9}"
                      className="form-control mobile_valid"
                    />
                  </div>
                  <div className="col-md-12">
                    <label>Message:</label>
                    <textarea
                      name="usermsg"
                      className="form-control"
                      rows="3"
                      placeholder="Message"
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <button type="submit" id="contact_us" className="theme-btn">
                      Send
                    </button>
                    <div
                      className="alert con_error_display alert-danger hidden"
                      role="alert"
                    >
                      <span className="con_error_text"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="secondcon" className={showOtpSection ? "visible" : "hidden"}>
              <div className="row">
                <div className="col-md-12">
                  <div className="alert alert-success error_class_con" role="alert">
                    <b className="error_con">OTP sent to your mobile number</b>
                  </div>
                  <div>
                    <input
                      name="enterotp"
                      className="form-control user_otp_brochure"
                      type="text"
                      placeholder="Enter OTP"
                      autoComplete="one-time-code"
                    />
                    <button id="contact_otp" className="theme-btn">
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    
  );
};

export default MailSection;
