import React, { useState, useEffect } from "react";
import "../styles/css/projectDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { getAllProjectsByUrlName, getDeveloperById } from "../../apis/api";

import {
  faExpandArrowsAlt,
  faRulerCombined,
  faBuilding,
  faCalendarAlt,
  faGavel,
  faBars,
  faFlag,
  faCity,
  faHouseUser,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const ProjectDetails = ({}) => {
  const [projectData, setProjectData] = useState(null);
  const [developerId, setDeveloperId] = useState("");
  const [developerDetails, setDeveloperDetails] = useState(null);
  const { urlName } = useParams();
  const [expandedIndex, setExpandedIndex] = useState(null); // To track which FAQ is expanded

  useEffect(() => {
    const fetchData = async () => {
      if (urlName) {
        try {
          const data = await getAllProjectsByUrlName(urlName);
          console.log("Fetched project data:", data);
          setProjectData(data);
          setDeveloperId(data.developerId); // Update developer ID
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };
    fetchData();
  }, [urlName]); // Dependency on urlName

  // Fetch developer details when DeveloperId changes
  useEffect(() => {
    const fetchDeveloper = async () => {
      if (developerId) {
        try {
          const data = await getDeveloperById(developerId);
          console.log("Fetched developer data:", data);
          setDeveloperDetails(data);
        } catch (error) {
          console.error("Error fetching developer data:", error);
        }
      }
    };
    fetchDeveloper();
  }, [developerId]); // Dependency on developerId";

  // Function to toggle the expanded question
  const toggleFAQ = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    dial_code: "91",
    usermobile: "",
    intersted_in: "",
    usermsg: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60); // Countdown timer for resend OTP

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle OTP input change
  const handleOtpChange = (e) => setOtp(e.target.value);

  // Simulate sending OTP API
  const sendOtp = () => {
    if (!formData.usermobile || formData.usermobile.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setOtpSent(true);
    setTimer(60);
    console.log("OTP sent to:", `${formData.dial_code}${formData.usermobile}`);
  };

  // Simulate OTP verification API
  const verifyOtp = () => {
    if (otp !== "1234") {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setError("");
    setOtpVerified(true);
  };

  // Resend OTP logic
  const resendOtp = () => {
    sendOtp();
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (timer > 0 && otpSent) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, otpSent]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setOtpSent(false);
    setOtpVerified(false);
    alert("Thank you! We will connect with you shortly.");
  };

  const [isReraPopupOpen, setIsReraPopupOpen] = useState(false);

  const toggleReraPopup = () => setIsReraPopupOpen(!isReraPopupOpen);

  return (
    <>
      <div className="details-gallery">
        <div className="container-fluid">
          {projectData &&
            projectData.images &&
            projectData.images.length > 0 && (
              <div className="row">
                {/* Main large image */}
                {projectData.images[0] && (
                  <div className="col-md-6">
                    <a
                      href={projectData.images[0].imageUrl}
                      data-toggle="lightbox"
                      data-gallery="gallery"
                      className="main-image-link"
                    >
                      <img
                        alt={projectData.images[0].category || "Image"}
                        src={projectData.images[0].imageUrl}
                        className="img-fluid main-image"
                        fetchpriority="high"
                      />
                    </a>
                    {/* <div className="artistic-label">Artistic</div> */}
                  </div>
                )}

                {/* Next two images in smaller size */}
                <div className="col-md-3">
                  {projectData.images[1] && (
                    <div className="img-container">
                      <a
                        href={projectData.images[1].imageUrl}
                        data-toggle="lightbox"
                        data-gallery="gallery"
                        className="secondary-image-link"
                      >
                        <img
                          alt={projectData.images[1].category || "Image"}
                          src={projectData.images[1].imageUrl}
                          className="img-fluid secondary-image"
                          fetchpriority="high"
                        />
                      </a>
                      {/* <div className="artistic-label">Artistic</div> */}
                    </div>
                  )}
                  {projectData.images[2] && (
                    <div className="img-container">
                      <a
                        href={projectData.images[2].imageUrl}
                        data-toggle="lightbox"
                        data-gallery="gallery"
                        className="secondary-image-link"
                      >
                        <img
                          alt={projectData.images[2].category || "Image"}
                          src={projectData.images[2].imageUrl}
                          className="img-fluid secondary-image"
                          fetchpriority="high"
                        />
                      </a>
                      {/* <div className="artistic-label">Artistic</div> */}
                    </div>
                  )}
                </div>

                {/* Final two images in smaller size */}
                <div className="col-md-3">
                  {projectData.images[3] && (
                    <div className="img-container">
                      <a
                        href={projectData.images[3].imageUrl}
                        data-toggle="lightbox"
                        data-gallery="gallery"
                        className="secondary-image-link"
                      >
                        <img
                          alt={projectData.images[3].category || "Image"}
                          src={projectData.images[3].imageUrl}
                          className="img-fluid secondary-image"
                          fetchpriority="high"
                        />
                      </a>
                      {/* <div className="artistic-label">Artistic</div> */}
                    </div>
                  )}
                  {projectData.images[4] && (
                    <div className="img-container">
                      <a
                        href={projectData.images[4].imageUrl}
                        data-toggle="lightbox"
                        data-gallery="gallery"
                        className="secondary-image-link"
                      >
                        <img
                          alt={projectData.images[4].category || "Image"}
                          src={projectData.images[4].imageUrl}
                          className="img-fluid secondary-image"
                          fetchpriority="high"
                        />
                      </a>
                      {/* <div className="artistic-label">Artistic</div> */}
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="content-index-bg">
        <div className="container">
          <ul className="content-index" id="links">
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#floor">Floor</a>
            </li>
            <li>
              <a href="#price">Price</a>
            </li>
            <li>
              <a href="#payment_plan">Payment Plan</a>
            </li>
            <li>
              <a href="#amenities">Amenities</a>
            </li>
            <li>
              <a href="#video">Video</a>
            </li>
            <li>
              <a href="#location">Location</a>
            </li>
            <li>
              <a href="#siteplan">Site Plan</a>
            </li>
            <li>
              <a href="#developer">Developer</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
            <li>
              <a href="#similar_projects">Similar Projects</a>
            </li>
          </ul>
        </div>
      </div>

      {/*  */}

      <section className="main-body-section">
        <div className="details-header-section">
          <div className="container">
            <div className="row">
              {/* Left Section */}
              <div className="col-md-8">
                <img
                  id="developer-logo"
                  className="developer-logo img-fluid"
                  src={projectData?.developerLogo || "defaultLogo.jpg"}
                  alt={projectData?.developerLogo || "Project Logo"}
                />
                <div className="project-name-container">
                  <h1 className="project-name">
                    {projectData?.name || "Project Name"}
                  </h1>
                </div>

                <div className="project-developer">
                  <p className="developer-info">
                    <a
                      href={projectData?.developerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      By {projectData?.developerName || "Developer"}
                    </a>
                  </p>
                </div>
                <div
                  className="project-actions"
                  style={{ position: "relative" }}
                >
                  {/* Rera Button with Popup */}
                  <button className="rera-btn" onClick={toggleReraPopup}>
                    Rera
                  </button>
                  {isReraPopupOpen && (
                    <div className="rera-popup">
                      <div className="rera-popup-header">
                        <h6>Rera Details</h6>
                        <i
                          className="close-icon fas fa-times"
                          onClick={toggleReraPopup}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </div>
                      <table className="rera-table">
                        <thead>
                          <tr>
                            <th>Phase</th>
                            <th>Status</th>
                            <th>Rera Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectData?.projectReraData?.map((row, index) => (
                            <tr key={index}>
                              <td>{row.phase}</td>
                              <td>{row.status}</td>
                              <td>
                                <a
                                  href={row.reraLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.reraNumber}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Other Buttons */}
                  <button className="no-brokerage-btn">No Brokerage</button>
                  <button className="floor-plans-btn">
                    Floor Plans Available
                  </button>
                  <button className="top-amenities-btn">Top Amenities</button>
                </div>
              </div>

              {/* Right Section */}
              <div className="col-md-4 text-right">
                <p className="project-price-label">Project Price</p>
                <p className="project-price">
                  <i className="fas fa-rupee-sign"></i>
                  {projectData &&
                    `${projectData?.minPrice} - ${projectData?.maxPrice}`}
                </p>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </section>
      <div className="details-content">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <section id="overview">
                <div className="box overview">
                  <h2 className="headline">Project Details</h2>
                  <p className="para_two_line">
                    This is a brief overview of the project that gives essential
                    information about its features and amenities.
                  </p>
                  <div className="row">
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faExpandArrowsAlt} />
                        </p>
                        <p className="amenities">
                          Project Area
                          <br />
                          <b>{projectData?.area}</b>{" "}
                          {/* Set the area from JSON data */}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faRulerCombined} />
                        </p>
                        <p className="amenities">
                          Sizes <br />
                          <b>800 sq ft - 1500 sq ft</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Units
                          <br />
                          <b>{projectData?.units}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </p>
                        <p className="amenities">
                          Launch Date
                          <br />
                          <b>
                            {new Date(
                              projectData?.launchDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faGavel} />
                        </p>
                        <p className="amenities">
                          Possession Date
                          <br />
                          <b>
                            {new Date(
                              projectData?.possessionDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Towers
                          <br />
                          <b>5 Towers</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBars} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Floors
                          <br />
                          <b>{projectData?.totalFloor}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faFlag}
                            style={{ fontSize: "24px" }}
                          />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Status
                          <br />
                          <b>{projectData?.status}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCity} />
                        </p>
                        <p className="amenities">
                          Property Type
                          <br />
                          <b>{projectData?.configurationsType?.propertyType}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faHouseUser}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          Configurations
                          <br />
                          <b>{projectData?.configurations.join(", ")}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faKey}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          RERA Number.
                          <br />
                          <b>{projectData?.rera}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="overview1">
                <div id="why" className="box overview">
                  <h2 className="headline">
                    Why to choose {projectData?.name}?
                  </h2>
                  <div className="Why_action">
                    <p className="para_two_line">
                      This is the reason why you should choose this project. It
                      offers excellent amenities and prime location.
                    </p>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="project-gallery">
                          {projectData?.images?.map((image, index) => (
                            <div className="item" key={index}>
                              <a
                                href={image.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  alt={
                                    image.caption ||
                                    `Project Image ${index + 1}`
                                  }
                                  src={image.imageUrl}
                                  className="img-fluid lazy"
                                  fetchpriority="high"
                                />
                              </a>
                              {/* <div
                                className="artistic-label"
                                style={{
                                  top: index === 0 ? "59%" : "95%",
                                  right: index === 2 ? "19px" : "auto",
                                  left: index === 1 ? "150px" : "auto",
                                }}
                              >
                                {image.caption || "Artistic"}
                              </div> */}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row right_section">
                          {projectData?.usps?.map((usp, idx) => (
                            <div className="col-md-6 col-6" key={idx}>
                              <span>
                                <img
                                  className="lazy height"
                                  src="img/icon/interior-icon4.svg"
                                  fetchpriority="high"
                                  alt={`USP Icon ${idx + 1}`}
                                />
                              </span>
                              <span>{usp}</span>
                            </div>
                          ))}
                          <div className="col-md-12">
                            <a
                              href="#form_side"
                              id="BookBtn2"
                              className="theme-btn"
                            >
                              Book Your Site Visit
                            </a>
                          </div>
                          <div className="col-md-12">
                            <a
                              href="tel:911234567890"
                              className="theme-btn white-btn"
                            >
                              <p className="icon">Connect to Our Expert</p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="about" className="main-body">
                <div className="box overview">
                  <h2 className="headline">Know About {projectData?.name}</h2>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="inner-item limitcon">
                        <p>
                          ACE Forest is a premium residential project offering a
                          blend of modern living and serene surroundings. It
                          provides a variety of amenities and spacious
                          apartments designed for comfort and convenience.
                        </p>
                        <p>
                          <span style={{ color: "#2067d1", fontWeight: 600 }}>
                            {" "}
                            Coming Soon{" "}
                          </span>
                        </p>
                        <p>
                          Click on the{" "}
                          <button
                            id="download-btn2"
                            style={{
                              border: "none",
                              backgroundColor: "white",
                              color: "#2067d1",
                            }}
                            aria-label="Download brochure"
                          >
                            <b>"Download"</b>
                          </button>{" "}
                          button to download <b>ACE Forest brochure</b>.
                        </p>

                        <a className="readmore">Read More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="floor">
                <div className="box overview">
                  <h2 className="headline">{projectData?.name} Floor Plan</h2>
                  <div className="row">
                    <div className="col-md-12" style={{ padding: "0px 30px" }}>
                      <p className="para_two_line">
                        This is a brief description of the floor plan for the
                        project.
                      </p>
                      <div className="floorplan_btn">
                        <button
                          id="allshow"
                          style={{
                            border: "2px solid #000",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            fontWeight: "600",
                          }}
                          className="btn activebtn"
                        >
                          All
                        </button>
                        <button
                          id="2BHK"
                          style={{
                            border: "2px solid #000",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            fontWeight: "600",
                          }}
                          className="btn"
                        >
                          2 BHK
                        </button>
                        <button
                          id="3BHK"
                          style={{
                            border: "2px solid #000",
                            borderRadius: "15px",
                            padding: "5px 15px",
                            fontWeight: "600",
                          }}
                          className="btn"
                        >
                          3 BHK
                        </button>
                      </div>
                      <button
                        className="slide_left_btn"
                        style={{ zIndex: 99 }}
                        aria-label="Slide left to view similar items"
                      >
                        <i
                          className="fa fa-chevron-right"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <button
                        className="slide_right_btn"
                        style={{ zIndex: 99 }}
                        aria-label="Slide right to view similar items"
                      >
                        <i
                          className="fa fa-chevron-left"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <div
                        id="gallery_owl"
                        className="inner-item owl-carousel owl-theme"
                      >
                        <div className="floor_item 2BHK">
                          <div className="row">
                            <div className="col-md-12">
                              <small>&nbsp;</small>
                              <p>2 BHK Floor Plan</p>
                            </div>
                            <div className="col-md-12">
                              <a
                                href="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                                data-toggle="lightbox"
                                data-gallery="gallery"
                              >
                                <img
                                  alt="Project Name Floor Plan"
                                  src="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                                  className="img-fluid lazy"
                                  style={{ width: "100%" }}
                                  fetchpriority="high"
                                />
                              </a>
                            </div>
                            <div className="col-md-6">
                              <small>Builtup Area</small>
                              <p>1000 sq ft</p>
                            </div>
                            <div className="col-md-6">
                              <small>Price</small>
                              <p>₹75,00,000</p>
                            </div>
                            <div className="col-md-12">
                              <a
                                className="btn btn-primary"
                                href="tel:+911234567890"
                              >
                                Talk to our Expert
                              </a>
                              <button
                                style={{ float: "right" }}
                                onClick={() => console.log("Download Brochure")}
                                className="btn btn-outline"
                              >
                                Download Floor Plan
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="floor_item 3BHK">
                          <div className="row">
                            <div className="col-md-12">
                              <small>&nbsp;</small>
                              <p>3 BHK Floor Plan</p>
                            </div>
                            <div className="col-md-12">
                              <a
                                href="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                                data-toggle="lightbox"
                                data-gallery="gallery"
                              >
                                <img
                                  alt="Project Name Floor Plan"
                                  src="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                                  className="img-fluid lazy"
                                  style={{ width: "100%" }}
                                  fetchpriority="high"
                                />
                              </a>
                            </div>
                            <div className="col-md-6">
                              <small>Builtup Area</small>
                              <p>1500 sq ft</p>
                            </div>
                            <div className="col-md-6">
                              <small>Price</small>
                              <p>₹1,00,00,000</p>
                            </div>
                            <div className="col-md-12">
                              <a
                                className="btn btn-primary"
                                href="tel:+911234567890"
                              >
                                Talk to our Expert
                              </a>
                              <button
                                style={{ float: "right" }}
                                onClick={() => console.log("Download Brochure")}
                                className="btn btn-outline"
                              >
                                Download Floor Plan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="price">
                <div className="box overview">
                  <h2 className="headline">{projectData?.name} Price List</h2>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="para_two_line">
                        This is a brief description of the price list for the
                        project.
                      </p>
                      <div className="inner-item">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th scope="col">Configurations</th>
                                <th scope="col">Size</th>
                                <th scope="col">Price</th>
                                <th scope="col">BEST BUY</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>2 BHK</td>
                                <td>1000 sq ft</td>
                                <td>₹75,00,000</td>
                                <td>₹70,00,000</td>
                              </tr>
                              <tr>
                                <td>3 BHK</td>
                                <td>1500 sq ft</td>
                                <td>₹1,00,00,000</td>
                                <td>₹95,00,000</td>
                              </tr>
                              <tr>
                                <td>4 BHK</td>
                                <td>2000 sq ft</td>
                                <td>Prices On Request</td>
                                <td>₹1,85,00,000</td>
                              </tr>
                              <tr>
                                <td>5 BHK</td>
                                <td>2500 sq ft</td>
                                <td>Sold Out</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="alert alert-warning calltoactionbtn" role="alert">
                Get Free Consultation for this property. Call us at:{" "}
                <a href="tel:+918595-189-189">8595-189-189</a>
              </div>

              {/* Payment Plan Section */}
              <section id="payment_plan">
                <div className="box overview">
                  <h2 className="headline">{projectData?.name} Payment Plan</h2>
                  <div className="row">
                    <div className="col-md-12">
                      <p
                        className="para_two_line"
                        style={{ paddingLeft: "20px" }}
                      >
                        This is a brief description of the payment plan for the
                        project.
                      </p>
                      <div className="inner-item">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <tbody>
                              <tr>
                                <td>Booking Amount</td>
                                <td>10% of Total Price</td>
                              </tr>
                              <tr>
                                <td>On Agreement</td>
                                <td>20% of Total Price</td>
                              </tr>
                              <tr>
                                <td>On Foundation</td>
                                <td>15% of Total Price</td>
                              </tr>
                              <tr>
                                <td>On Completion</td>
                                <td>Remaining Balance</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="amenities">
                <div className="box overview">
                  <h2 className="headline">Project Amenities</h2>
                  <p className="para_two_line">
                    This is a brief overview of the project that gives essential
                    information about its features and amenities.
                  </p>
                  <div className="row">
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faExpandArrowsAlt} />
                        </p>
                        <p className="amenities">
                          Project Area
                          <br />
                          <b>{projectData?.area}</b>{" "}
                          {/* Set the area from JSON data */}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faRulerCombined} />
                        </p>
                        <p className="amenities">
                          Sizes <br />
                          <b>800 sq ft - 1500 sq ft</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Units
                          <br />
                          <b>{projectData?.units}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </p>
                        <p className="amenities">
                          Launch Date
                          <br />
                          <b>
                            {new Date(
                              projectData?.launchDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faGavel} />
                        </p>
                        <p className="amenities">
                          Possession Date
                          <br />
                          <b>
                            {new Date(
                              projectData?.possessionDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Towers
                          <br />
                          <b>5 Towers</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBars} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Floors
                          <br />
                          <b>{projectData?.totalFloor}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faFlag}
                            style={{ fontSize: "24px" }}
                          />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Status
                          <br />
                          <b>{projectData?.status}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCity} />
                        </p>
                        <p className="amenities">
                          Property Type
                          <br />
                          <b>{projectData?.configurationsType?.propertyType}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faHouseUser}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          Configurations
                          <br />
                          <b>{projectData?.configurations.join(", ")}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faKey}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          RERA Number.
                          <br />
                          <b>{projectData?.rera}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="video">
                <div className="box overview">
                  <h2 className="headline">
                    VIDEO PRESENTATION OF {projectData?.name}
                  </h2>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="para_two_line">
                        Click for the video of ACE Divino Sector 1 Greater Noida
                        West and understand every perspective of 'quality
                        living' that they are offering. And for more property
                        videos visit our YouTube channel.
                      </p>
                      <div className="inner-item">
                        {/* If there is a video ID, display the video player */}
                        <div className="youtube" data-embed="VIDEO_ID_HERE">
                          <div
                            className="play-button"
                            style={{ background: "red" }}
                          ></div>
                        </div>

                        {/* If no video ID, display the YouTube link banner */}
                        <a
                          href="https://youtu.be/OmvpphgerjI?si=0ZMNitpsk55EGcUG"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={projectData?.videos}
                            alt="Example Project video"
                            className="img-fluid"
                            style={{
                              width: "100%",
                              cursor: "pointer",
                              height: "auto",
                            }}
                            fetchpriority="high"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="box overview">
                  <h2 className="headline">
                    {projectData?.name} Location Advantage
                  </h2>
                  <div className="row">
                    <div className="col-md-12" style={{ padding: "0px 35px" }}>
                      <div className="inner-item">
                        <p>
                          The residential development of{" "}
                          <b>{projectData?.name}</b> has been strategically
                          located in Sector-1 Greater Noida West.
                          <b>ACE Divino location</b> places you near top
                          schools, colleges, sports complexes, entertainment
                          centers, and much more.
                        </p>

                        <b>SPORTS FACILITIES</b>
                        <ul>
                          <li>Skyjumper trampoline park - 23-minute drive</li>
                          <li>Golf Course Noida - 25-minute drive</li>
                          <li>Play All Sports Complex - 19-minute drive</li>
                        </ul>

                        <b>ROAD CONNECTIVITY</b>
                        <ul>
                          <li>Ek Murti Gol Chakkar - 20-minute drive</li>
                          <li>
                            Indira Gandhi International Airport - 1 hr 12
                            minutes drive
                          </li>
                          <li>Pari Chowk - 25-minute drive</li>
                        </ul>

                        <b>PUBLIC TRANSPORT</b>
                        <ul>
                          <li>Blue Line Metro Station 52 - 25-minute drive</li>
                          <li>
                            Sector 101 Metro Station Road Sector 78 - 16-minute
                            drive
                          </li>
                        </ul>

                        <b>MEDICAL FACILITIES</b>
                        <ul>
                          <li>Saini Hospital - 13-minute drive</li>
                          <li>Yatharth Hospital - 25-minute drive</li>
                          <li>Kailash Hospital - 32-minute drive</li>
                          <li>
                            Nix Multi Speciality Hospital - 10-minute drive
                          </li>
                        </ul>

                        <b>ENTERTAINMENT HUB</b>
                        <ul>
                          <li>Bhangel Market - 25-minute drive</li>
                          <li>Gaur City Mall - 19-minute drive</li>
                          <li>Ace City Square Mall - 13-minute drive</li>
                        </ul>

                        <b>EDUCATIONAL INSTITUTIONS</b>
                        <ul>
                          <li>K C International School - 10-minute drive</li>
                          <li>
                            G D Goenka International School - 17-minute drive
                          </li>
                          <li>Amity University - 31-minute drive</li>
                          <li>D.S International School - 7-minute drive</li>
                          <li>
                            J M International School Greater Noida West -
                            15-minute drive
                          </li>
                          <li>
                            Maharishi University Of IT, Noida - 25-minute drive
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="location">
                <div className="box overview">
                  <h2 className="headline">{projectData?.name} Location Map</h2>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="para_two_line">
                        Ace Divino is located in{" "}
                        <b>Sector-1, Greater Noida West,</b> Uttar Pradesh
                        201306. The location is easily accessible from all major
                        highways and has good connectivity to nearby areas.
                      </p>
                      <div className="inner-item">
                        <div
                          className="over"
                          style={{
                            background: "#f22a2a00",
                            position: "absolute",
                            width: "80%",
                            height: "100%",
                          }}
                        ></div>
                        <iframe
                          title="Location"
                          src={projectData?.locationMap}
                          width="100%"
                          height="300px"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="siteplan">
                <div className="box overview">
                  <h2 className="headline">{projectData?.name} Site Plan</h2>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="para_two_line">
                        If we talk about the ACE Divino site plan, it spreads
                        over 10.41 acres of area. In fact, it has 70% green
                        landscape and its rest 30% will be used for construction
                        according to sustainable lifestyle living.
                      </p>
                      <div className="inner-item">
                        <div className="image-container">
                          <div className="zoom-image-container">
                            <a
                              href="https://www.investmango.com/img/ace-divino/ace-divino-site-plan.webp"
                              data-toggle="lightbox"
                              data-gallery="gallery"
                            >
                              <img
                                className="lazy img-fluid"
                                id="zoom-image"
                                style={{ width: "100%" }}
                                alt="ACE Divino Site Plan"
                                src="https://www.investmango.com/img/ace-divino/ace-divino-site-plan.webp"
                                fetchpriority="high"
                              />
                            </a>
                            <div className="zoom-buttons">
                              <button
                                id="zoom-in"
                                style={{
                                  background: "#dddd",
                                  display: "block",
                                  border: 0,
                                  margin: 0,
                                  padding: 0,
                                  textTransform: "none",
                                  appearance: "none",
                                  position: "relative",
                                  cursor: "pointer",
                                  userSelect: "none",
                                  overflow: "hidden",
                                  width: "40px",
                                  height: "40px",
                                  top: 0,
                                  left: 0,
                                }}
                                aria-label="Zoom In"
                              >
                                +
                              </button>
                              <button
                                id="zoom-out"
                                style={{
                                  background: "#dddd",
                                  display: "block",
                                  border: 0,
                                  margin: 0,
                                  padding: 0,
                                  textTransform: "none",
                                  appearance: "none",
                                  position: "relative",
                                  cursor: "pointer",
                                  userSelect: "none",
                                  overflow: "hidden",
                                  width: "40px",
                                  height: "40px",
                                  top: 0,
                                  left: 0,
                                }}
                                aria-label="Zoom Out"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {developerDetails && (
                <section id="developer">
                  <div className="box overview">
                    <h2 className="headline">About {developerDetails?.name}</h2>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="inner-item">
                          <div className="over_head">
                            <img
                              src={projectData?.developerLogo}
                              className="img-fluid lazy"
                              alt="ACE Group logo"
                              fetchpriority="high"
                              style={{ width: "50px" }}
                            />
                            <p>
                              ESTABLISHED IN -{" "}
                              <b>{developerDetails?.establishedYear}</b>
                              <br />
                              TOTAL PROJECTS -{" "}
                              <b>{developerDetails?.totalProjects}</b>
                            </p>
                          </div>
                          <p className="des">
                            <br />
                            <b>Ace Group of India</b> wants to deliver your
                            'dream home' - where you can enjoy the luxury in
                            your personal space. Under the leadership of Mr.Ajay
                            Ch . . .
                          </p>
                          <a
                            href="developer.php/2/ace-group"
                            className="theme-btn"
                          >
                            read more
                          </a>
                          <br />
                          <br />
                          <h4 style={{ fontSize: "18px" }}>
                            <b>Contact Details</b>
                            <br />
                          </h4>
                          <p>
                            <b>{developerDetails?.name}</b>
                            <br />
                            <b>Address:</b>
                            {developerDetails?.address}
                            <br />
                            <b>Phone:</b>
                            <a
                              className="remove_under"
                              href="tel:+918595-189-189"
                            >
                              {" "}
                              +91- 8595-189-189
                            </a>
                            <br />
                            <b>Book Your Site Visit</b>{" "}
                            <span
                              id="BookBtn3"
                              style={{
                                cursor: "pointer",
                                color: "#2067d1",
                                fontWeight: 700,
                              }}
                            >
                              Click Here
                            </span>
                            <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              <section id="faqs">
                <div className="box overview">
                  <h5 className="headline">
                    Frequently Asked Questions (FAQs)
                  </h5>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="inner-item">
                        {projectData?.faqs?.length > 0 ? (
                          projectData.faqs.map((faq, index) => (
                            <div className="item-fq" key={index}>
                              <button
                                className={`faq-question ${
                                  expandedIndex === index ? "active" : ""
                                }`}
                                onClick={() => toggleFAQ(index)}
                              >
                                {faq.question}
                              </button>
                              {expandedIndex === index && (
                                <div className="panel">
                                  <p>{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No FAQs available for this project.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="col-md-4" id="from-top">
              <div className="right-sti">
                <div className="details-form" id="form_side">
                  <p className="form-headline">Connect to Our Expert</p>
                  {!otpSent && !otpVerified && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        name="username"
                        className="form-control"
                        type="text"
                        placeholder="Name : "
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <input
                        name="useremail"
                        className="form-control"
                        type="text"
                        placeholder="Email : "
                        value={formData.useremail}
                        onChange={handleChange}
                      />
                      <div className="d-flex phone_num">
                        <select
                          name="dial_code"
                          className="form-control"
                          value={formData.dial_code}
                          onChange={handleChange}
                        >
                          <option value="91">+91</option>
                          <option value="61">+61</option>
                          <option value="852">+852</option>
                          <option value="1">+1</option>
                          {/* Add more options as needed */}
                        </select>
                        <input
                          name="usermobile"
                          maxLength="10"
                          className="form-control"
                          type="text"
                          placeholder="Phone : "
                          value={formData.usermobile}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <b>I am interested in</b>
                        </label>
                        <select
                          className="form-control"
                          name="intersted_in"
                          value={formData.intersted_in}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="2bhk">2 BHK</option>
                          <option value="3bhk">3 BHK</option>
                        </select>
                      </div>
                      <textarea
                        name="usermsg"
                        className="form-control"
                        placeholder="Message :"
                        rows="3"
                        value={formData.usermsg}
                        onChange={handleChange}
                      ></textarea>
                      {error && (
                        <div className="alert alert-danger error_display_side">
                          {error}
                        </div>
                      )}
                      <button
                        type="button"
                        className="theme-btn"
                        onClick={sendOtp}
                      >
                        Get a Call back
                      </button>
                    </form>
                  )}
                  {otpSent && !otpVerified && (
                    <div id="secondForm">
                      <div className="alert alert-success error_display_verify">
                        <b>
                          OTP sent to your mobile number{" "}
                          <a
                            href="#"
                            onClick={() => setOtpSent(false)}
                            id="back_otp"
                          >
                            Edit
                          </a>
                        </b>
                      </div>
                      <input
                        name="enterotp"
                        className="form-control"
                        type="text"
                        placeholder="Enter OTP : "
                        value={otp}
                        onChange={handleOtpChange}
                      />
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="d-flex justify-content-between">
                        <button
                          className="theme-btn"
                          onClick={resendOtp}
                          disabled={timer > 0}
                        >
                          Resend {timer > 0 && `(${timer}s)`}
                        </button>
                        <button className="theme-btn" onClick={verifyOtp}>
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}
                  {otpVerified && (
                    <form onSubmit={handleSubmit}>
                      <div className="alert alert-success">
                        OTP verified! We will connect with you shortly.
                      </div>
                      <button type="submit" className="theme-btn">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
                <div className="brochure">
                  <main id="btnmain">
                    <section className="btnsection">
                      <button className="btnbutton" style={{ width: "315px" }}>
                        <i className="fas fa-download fa-lg"></i> DOWNLOAD
                        BROCHURE
                      </button>
                    </section>
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
