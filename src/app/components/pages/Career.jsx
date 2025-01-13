import React, { useState, useEffect } from "react";
import { fetchAllVacancies, submitHiringForm } from "../../apis/api";
import "../styles/css/career.css";
import Accordion from "./Accordion";
import jobOpenings from "../../../utils/jobOpenings";
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
   const navigate = useNavigate();

  // Fetch positions on component mount
  useEffect(() => {
    const loadPositions = async () => {
      const positionsData = await fetchAllVacancies();
      const validPositions = positionsData.filter(
        (pos) => pos.id && pos.designation
      );
      console.log("Valid Positions:", validPositions);
      setPositions(validPositions);
    };
    loadPositions();
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

  // Handle form submission
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

  console.log("Payload Sent:", hiringRequestJson);

  data.append("hiringRequestJson", hiringRequestJson);
  if (formData.fileToUpload) {
    data.append("file", formData.fileToUpload);
  }

  try {
    const response = await submitHiringForm(data);
    console.log("Server Response:", response);
    
    // Show SweetAlert after successful submission
    swal("Success", "Your application has been submitted successfully!", "success").then(() => {
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
<meta name="description" content="Invest Mango offers a dynamic culture that is all about winning and innovating oneself. Unleash your true potential much more than you have ever imagined. " /> 
<link rel="canonical" href="https://www.investmango.com/careers" /> 
</Helmet>
   
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Career</h1>
          <p>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="styled-link"
            >
              Home
            </a>{" "}
            / Career
          </p>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="content" style={{ padding: "20px 0px 60px" }}>
              <div className="row padding_im_about align-self-center">
                <div className="col-md-4">
                  <h2 style={{ fontWeight: 700, textAlign: "left" }}>
                    We want you
                  </h2>
                  <h5
                    style={{
                      fontSize: "65px",
                      fontWeight: 800,
                      lineHeight: "60px",
                    }}
                  >
                    Come and Join Us
                  </h5>
                  <p id="topform">
                    Don’t Hesitate to Contact with us for any kind of
                    information
                  </p>
                  <form
                    id="contactForm"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    <div className="form-group">
                      <select
                        className="form-control"
                        name="userposition"
                        style={{appearance:'auto'}}
                        value={formData.userposition}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Position</option>
                        {positions
                          .filter((pos) => pos?.designation) // Only include positions with a designation
                          .map((pos) => (
                            <option key={pos.designation} value={pos.id}>
                              {" "}
                              {/* Ensure `pos.id` is valid */}
                              {pos.designation}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name :"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone No. :"
                        name="usermobile"
                        value={formData.usermobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email :"
                        name="useremail"
                        value={formData.useremail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        onFocus={(e) => (e.target.type = 'date')} 
                        className="form-control"
                        placeholder="Date of Birth:"
                        name="userdob"
                        value={formData.userdob}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Work Experience :"
                        name="userexp"
                        value={formData.userexp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Current CTC :"
                        name="current_ctc"
                        value={formData.current_ctc}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Expected CTC :"
                        name="expected_ctc"
                        value={formData.expected_ctc}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Notice Period :"
                        name="notice_period"
                        value={formData.notice_period}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="file"
                        name="fileToUpload"
                        id="CustomFile"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="theme-btn">
                        SEND
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-6">
                  <img
                    style={{ width: "100%" }}
                    src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/a88e788f-a24a-498c-b72d-0e9913e3b300/public"
                    alt="career"
                    className="img-fluid"
                    loading="eager"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div>
                    <div className="theme_sec">
                      <p>Current Openings</p>
                    </div>
                    <Accordion
                      data={jobOpenings}
                      allowMultipleExpanded={true}
                    />
                  </div>
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

export default Career;
