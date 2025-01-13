import React, { useState } from "react";
import "../styles/css/contact.css";
import { checkPhoneNumberExists, submitLead } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

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
        const errorMessage =
          result.message || "Something went wrong. Please try again.";
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
    <>
       <Helmet>
<title>Contact Us</title> 
<meta name="description" content="For more details on On-Site Visits, Locations, Developers' Information, Property Age, Documentation, Bank Assistance, and many more feel free to connect." />
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
</div>
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
                <div className="col-md-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14013.06956917024!2d77.3845057!3d28.5917541!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068cc0b5fd%3A0xdda5c5e0379288b2!2sInvest%20mango!5e0!3m2!1sen!2sin!4v1689407045260!5m2!1sen!2sin"
                    width="100%"
                    height="400"
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
