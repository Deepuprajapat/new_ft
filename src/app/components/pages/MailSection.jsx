import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";
import { checkPhoneNumberExists, submitLead } from "../../apis/api";

const MailSection = () => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    usermsg: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow alphabets for Name and numbers for Phone
    if (name === "username" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "usermobile" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
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
      // Check if phone exists
      const phoneExists = await checkPhoneNumberExists(formData.usermobile);
      if (phoneExists) {
        setError("This phone number is already registered.");
        return;
      }

      // Submit lead if phone doesn't exist
      const result = await submitLead(formData);
      navigate("/thankYou");  // Navigate to Thank You page
    } catch (error) {
      console.error("Submission Error:", error.message);
      setError("Failed to submit form. Please try again later.");
    }
  };

  return (
    <div className="container mail-background">
      <div className="headline">
        <h3 className="h3">Still Confused?</h3>
        <p className="sub-headline">We are Here to Assist!</p>
        <form id="contactpage" onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="col-md-12">
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
              </div>

              <div className="col-md-12">
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
              </div>

              <div className="col-md-12">
                <label>Message:</label>
                <textarea
                  name="usermsg"
                  className="form-control"
                  rows="3"
                  placeholder="Message"
                  value={formData.usermsg}
                  onChange={handleChange}
                ></textarea>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="col-md-12">
                <button type="submit" className="theme-btn">
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailSection;