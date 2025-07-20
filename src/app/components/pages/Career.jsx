import React, { useState, useEffect, useRef } from "react";
import { fetchAllVacancies, submitHiringForm } from "../../apis/api";
import "../styles/css/career.css";
import Accordion from "./Accordion";
// import jobOpenings from "../../../utils/jobOpenings";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

const Career = () => {
  const [formData, setFormData] = useState({
    userposition: "",
    username: "",
    usermobile: "",
    useremail: "",
    userdob: "",
    userexp: "",
    current_ctc: "",
    expected_ctc: "",
    notice_period: "",
    fileToUpload: null,
  });

  const [positions, setPositions] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Fetch positions on component mount
  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const positionsData = await fetchAllVacancies();
        const validPositions = positionsData.filter(
          (pos) => pos.id && pos.designation
        );
        setPositions(validPositions);

        // Prepare jobOpenings data for the Accordion
        const openings = validPositions.map((pos) => ({
          heading: pos.designation,
          detail: pos.jd || "<p>Job description not available.</p>", // Allow HTML
        }));
        setJobOpenings(openings);

        // Scroll to top after setting positions and job openings
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      }
    };
    loadVacancies();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileToUpload") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Scroll to the form
  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const hiringRequestJson = JSON.stringify({
      name: formData.username,
      phone: formData.usermobile,
      email: formData.useremail,
      dob: formData.userdob,
      experience: formData.userexp,
      currentCTC: formData.current_ctc,
      expectedCTC: formData.expected_ctc,
      noticePeriod: formData.notice_period,
      vacancyId: formData.userposition,
    });
    data.append("hiringRequestJson", hiringRequestJson);
    if (formData.fileToUpload) {
      data.append("file", formData.fileToUpload);
    }

    try {
      const response = await submitHiringForm(data);

      // Show SweetAlert after successful submission
      swal(
        "Success",
        "Your application has been submitted successfully!",
        "success"
      ).then(() => {
        // Redirect to the Thank You page after clicking "OK"
        navigate("/thankYou");
      });
    } catch (error) {
      console.error("Submission Error:", error);
      swal("Error", "There was an error submitting your application.", "error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers | Invest Mango</title>
        <meta
          name="description"
          content="Invest Mango offers a dynamic culture that is all about winning and innovating oneself. Unleash your true potential much more than you have ever imagined. "
        />
        <link rel="canonical" href="https://www.investmango.com/career" />
      </Helmet>

      <div
        style={{
          background: "#f5f8fd",
          minHeight: "100vh",
          padding: window.innerWidth <= 480 ? "10px 0" : window.innerWidth <= 768 ? "20px 0" : "40px 0",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 32px rgba(32,103,209,0.10)",
            padding: window.innerWidth <= 480 ? "10px" : window.innerWidth <= 768 ? "18px" : "40px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: window.innerWidth <= 480 ? "0 8px" : "0 16px" }}>
            <h1
              style={{
                fontSize: window.innerWidth <= 480 ? 22 : 32,
                fontWeight: 700,
                // textAlign: "center",
                marginBottom: 8,
                color: "#000",
              }}
            >
              Career
            </h1>
            <p style={{color: "#888", fontSize: window.innerWidth <= 480 ? 13 : 16, marginBottom: 24 }}>
              <a
                href="https://www.investmango.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2067d1", textDecoration: "underline" }}
              >
                Home
              </a>{" "}/ Career
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 991 ? "column" : "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: window.innerWidth <= 480 ? 16 : 32,
              width: "100%",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {/* Form Section */}
            <div
              style={{
                flex: 1,
                minWidth: window.innerWidth <= 991 ? "100%" : 340,
                maxWidth: window.innerWidth <= 991 ? "100%" : 400,
                background: "#f8fafd",
                borderRadius: 14,
                boxShadow: "0 2px 16px rgba(32,103,209,0.07)",
                padding: window.innerWidth <= 480 ? 12 : 24,
                marginBottom: window.innerWidth <= 991 ? 24 : 0,
              }}
            >
              <h2 style={{ fontWeight: 700, textAlign: "left", fontSize: window.innerWidth <= 480 ? 18 : 24, color: "#222" }}>
                We want you
              </h2>
              <h5
                style={{
                  fontSize: window.innerWidth <= 480 ? 32 : 48,
                  fontWeight: 800,
                  lineHeight: window.innerWidth <= 480 ? "36px" : "60px",
                  color: "#2067d1",
                  margin: "8px 0 12px 0",
                }}
              >
                Come and Join Us
              </h5>
              <p id="topform" style={{ fontSize: window.innerWidth <= 480 ? 13 : 15, color: "#444", marginBottom: 16 }}>
                Don’t Hesitate to Contact with us for any kind of information
              </p>
              <form
                id="contactForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                ref={formRef}
              >
                <div style={{ marginBottom: 12 }}>
                  <select
                    name="userposition"
                    style={{
                      width: "100%",
                      padding: window.innerWidth <= 480 ? "8px" : "12px",
                      borderRadius: 8,
                      border: "1px solid #d6e0ef",
                      fontSize: window.innerWidth <= 480 ? 13 : 15,
                      background: "#fff",
                      marginBottom: 8,
                      appearance: "auto",
                    }}
                    value={formData.userposition}
                    onChange={handleChange}
                  >
                    <option value="">Select Position</option>
                    {positions
                      .filter((pos) => pos?.designation)
                      .map((pos) => (
                        <option key={pos.designation} value={pos.id}>
                          {pos.designation}
                        </option>
                      ))}
                  </select>
                </div>
                {[{
                  type: "text",
                  placeholder: "Name :",
                  name: "username",
                  required: true,
                }, {
                  type: "text",
                  placeholder: "Phone No. :",
                  name: "usermobile",
                  required: true,
                }, {
                  type: "email",
                  placeholder: "Email :",
                  name: "useremail",
                  required: true,
                }, {
                  type: "text",
                  placeholder: "Date of Birth:",
                  name: "userdob",
                  onFocus: (e) => (e.target.type = "date"),
                }, {
                  type: "text",
                  placeholder: "Work Experience :",
                  name: "userexp",
                  required: true,
                }, {
                  type: "text",
                  placeholder: "Current CTC :",
                  name: "current_ctc",
                }, {
                  type: "text",
                  placeholder: "Expected CTC :",
                  name: "expected_ctc",
                }, {
                  type: "text",
                  placeholder: "Notice Period :",
                  name: "notice_period",
                }].map((field, idx) => (
                  <div key={field.name} style={{ marginBottom: 12 }}>
                    <input
                      type={field.type}
                      className="form-control"
                      placeholder={field.placeholder}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      onFocus={field.onFocus}
                      style={{
                        width: "100%",
                        padding: window.innerWidth <= 480 ? "8px" : "12px",
                        borderRadius: 8,
                        border: "1px solid #d6e0ef",
                        fontSize: window.innerWidth <= 480 ? 13 : 15,
                        background: "#fff",
                        marginBottom: 4,
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="file"
                    name="fileToUpload"
                    id="CustomFile"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: window.innerWidth <= 480 ? "8px" : "12px",
                      borderRadius: 8,
                      border: "1px solid #d6e0ef",
                      fontSize: window.innerWidth <= 480 ? 13 : 15,
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <button
                    type="submit"
                    style={{
                      width: window.innerWidth <= 480 ? "100%" : window.innerWidth <= 991 ? "80%" : "auto",
                      background: "#2067d1",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      // padding: window.innerWidth <= 480 ? "14px 0" : window.innerWidth <= 991 ? "12px 0" : "14px 0",
                      fontWeight: 700,
                      fontSize: window.innerWidth <= 480 ? 17 : window.innerWidth <= 991 ? 16 : 17,
                      boxShadow: window.innerWidth <= 480 ? "0 2px 8px rgba(32,103,209,0.07)" : undefined,
                      transition: "background 0.2s",
                      cursor: "pointer",
                      display: "block",
                      margin: window.innerWidth <= 480 ? "0 auto" : undefined,
                    }}
                  >
                    SEND
                  </button>
                </div>
              </form>
            </div>
            {/* Spacer for desktop */}
            <div style={{ flex: 0.1, minWidth: 8, display: window.innerWidth <= 991 ? "none" : "block" }}></div>
            {/* Image Section */}
            <div
              style={{
                flex: 1.5,
                minWidth: window.innerWidth <= 991 ? "100%" : 400,
                maxWidth: window.innerWidth <= 991 ? "100%" : 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: window.innerWidth <= 991 ? 24 : 0,
              }}
            >
              <img
                style={{
                  width: "100%",
                  maxWidth: 500,
                  borderRadius: 14,
                  boxShadow: "0 2px 16px rgba(32,103,209,0.07)",
                  objectFit: "cover",
                }}
                src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/a88e788f-a24a-498c-b72d-0e9913e3b300/public"
                alt="career"
                loading="eager"
              />
            </div>
          </div>

          {/* Accordion Section */}
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              margin: "32px auto 0 auto",
              background: "#f8fafd",
              borderRadius: 14,
              boxShadow: "0 2px 16px rgba(32,103,209,0.07)",
              padding: window.innerWidth <= 480 ? 8 : 24,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#2067d1",
                  color: "#fff",
                  borderRadius: 8,
                  padding: window.innerWidth <= 480 ? "4px 12px" : "6px 24px",
                  fontWeight: 700,
                  fontSize: window.innerWidth <= 480 ? 15 : 18,
                  marginBottom: 8,
                }}
              >
                Current Openings
              </span>
            </div>
            <Accordion
              data={jobOpenings.map((opening) => ({
                ...opening,
                detail: `${opening.detail}`,
              }))}
              allowMultipleExpanded={true}
              scrollToForm={scrollToForm}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Career;
