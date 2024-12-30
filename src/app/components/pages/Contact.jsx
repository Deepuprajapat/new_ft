import React, { useState } from "react";
import "../styles/css/contact.css";
import { checkPhoneNumberExists, submitLead } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    username: "",
    usermobile: "",
    useremail: "",
    message: "",
    projectName: "", // Added projectName
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "usermobile" && !/^\d*$/.test(value)) return;

    if (name === "usermobile") {
      setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    try {
      const phonePattern = /^[5-9][0-9]{9}$/;
      if (!phonePattern.test(formData.usermobile)) {
        setError("Please enter a valid 10-digit phone number.");
        setIsSubmitting(false);
        return;
      }
  
      const phoneExists = await checkPhoneNumberExists(formData.usermobile);
      if (phoneExists) {
        setError("This phone number is already registered.");
        setIsSubmitting(false);
        return;
      }
  
      const result = await submitLead(formData);
  
      if (result && result.id) {
        setFormData({
          username: "",
          usermobile: "",
          useremail: "",
          message: "",
          // projectName: "",
        });
  
        // Show success alert
        swal({
          title: "Success!",
          text: "Your message has been sent successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/thankYou");
        });
      } else {
        const errorMessage = result.message || "Something went wrong. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            <a href="/" className="styled-link">Home</a> / Contact Us
          </p>
        </div>
        <div className="main-con contactUs">
          <div className="container">
            <div className="content contactUsinner">
              <div className="row">
                <div className="col-md-6">
                  <form id="contactpage" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="username">Name :</label>
                        <input
                          required
                          name="username"
                          type="text"
                          placeholder="Enter Name"
                          className="form-control"
                          value={formData.username}
                          onChange={handleChange}
                          disabled={isSubmitting}
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
                          className="form-control"
                          value={formData.usermobile}
                          onChange={handleChange}
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
                        />
                      </div>
                      {/* <div className="col-md-12">
                        <label htmlFor="projectName">Project Name :</label>
                        <input
                          name="projectName"
                          type="text"
                          placeholder="Enter Project Name"
                          className="form-control"
                          value={formData.projectName}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div> */}
                      <div className="col-md-12">
                        <label htmlFor="message">Message :</label>
                        <textarea
                          name="message"
                          className="form-control"
                          rows="3"
                          placeholder="Message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-12">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </div>
                  </form>
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
