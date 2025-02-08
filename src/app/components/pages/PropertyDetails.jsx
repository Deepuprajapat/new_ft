import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BrochurePopupDialog from "./BrochurePopup";
import {
  getPropertyByUrlName,
  sendOTP,
  verifyOTP,
  resendOTP,
} from "../../apis/api"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faParking,
  faBed,
  faCouch,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";

const BASE_URL = "https://myimwebsite.s3.ap-south-1.amazonaws.com/images/";

const PropertyDetails = () => {
  const { urlName } = useParams(); // Get urlName from route params
  const [property, setProperty] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null); // To track which FAQ is expanded
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [showReraDetails, setShowReraDetails] = useState(false);
  const [isReraDetailHovered, setIsReraDetailHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [navInitialPosition, setNavInitialPosition] = useState(null);

  // Store initial nav position on mount
  useEffect(() => {
    const navElement = document.getElementById("navigation-section");
    if (navElement) {
      // Set fixed trigger height to 800px
      setNavInitialPosition(500);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const [showBrochurePopup, setShowBrochurePopup] = useState(false);
  const closeBrochurePopup = () => setShowBrochurePopup(false);
  const handleDownloadBrochuree = () => setShowBrochurePopup(true);

  const [showSitePopup, setShowSitePopup] = useState(false);
  const closeSitePopup = () => setShowSitePopup(false);
  const handleSitePopup = () => setShowSitePopup(true);

  const [showImagePopup, setShowImagePopup] = useState(false); // State for image popup
  const [selectedImage, setSelectedImage] = useState(""); // State to hold selected image URL

  const [showFloorPlanPopup, setShowFloorPlanPopup] = useState(false);
  const handleDownloadFloorPlan = () => setShowFloorPlanPopup(true);
  const closeFloorPlanPopup = () => setShowFloorPlanPopup(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true); // Open the popup with the clicked image
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(""); // Clear selected image
  };

  const [showPopup, setShowPopup] = useState(false);
  const handleDownloadBrochure = () => {
    setShowPopup(true);
  };

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    // dial_code: "91",
    usermobile: "",
    intersted_in: "",
    usermsg: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60); // Countdown timer for resend OTP

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle OTP input change
  const handleOtpChange = (e) => setOtp(e.target.value);

  // Simulate sending OTP API
  const sendOtp = async () => {
    if (!formData.usermobile || formData.usermobile.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setTimer(60);
    // console.log("OTP sent to:", `${formData.dial_code}${formData.usermobile}`);
    try {
      const response = await sendOTP(
        formData.usermobile,
        property?.name || "",
        "Website",
        "ORGAINc",
        formData.username,
        formData.useremail
      );
      if (response) {
        setOtpSent(true);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Simulate OTP verification API
  const verifyOtp = async () => {
    try {
      const response = await verifyOTP(formData.usermobile, otp);

      // Check the response structure and adjust based on the API response
      if (response && response.message === "OTP Validated Successfully") {
        Swal.fire({
          title: "Success",
          text: "OTP verified successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/thankYou"; // Redirect to Thank You page
        });
        setOtpVerified(true);
        setError("");
      } else {
        setError("OTP verification failed. Please try again.");
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
      setOtpVerified(false);
    }
  };

  // Resend OTP logic
  const resendOtp = async () => {
    try {
      const response = await resendOTP(formData.usermobile);
      if (response) {
        setTimer(60);
        setError("");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (timer > 0 && otpSent) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, otpSent]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (urlName) {
        const data = await getPropertyByUrlName(urlName);
        setProperty(data);
      }
    };

    fetchProperty();
  }, [urlName]);

  if (!property) return <div>Loading...</div>; // Show a loading message while fetching

  // Process amenities to match the format of amenities.json
  const processAmenities = () => {
    if (!property?.propertyAmenities) return [];

    const groupedAmenities = property.propertyAmenities.reduce(
      (acc, amenity) => {
        const category = amenity.category.toLowerCase();
        if (!acc[category]) {
          acc[category] = {
            name: category,
            assets: [],
          };
        }
        acc[category].assets.push({
          name: amenity.name
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          icon: amenity.url,
        });
        return acc;
      },
      {}
    );

    return Object.values(groupedAmenities);
  };

  const formatPrice = (price) => {
    if (!price) return "";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 100 && numPrice > 0) {
      return `${numPrice} Cr`;
    }

    if (numPrice >= 10000000) {
      const crores = (numPrice / 10000000).toFixed(2);
      return `${crores} Cr`;
    }

    if (numPrice >= 100000) {
      const lakhs = (numPrice / 100000).toFixed(2);
      return `${lakhs} L`;
    }

    return numPrice.toLocaleString("en-IN");
  };

  // Function to toggle the expanded question
  const toggleFAQ = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  // const getLeastPriceOfFloorPlan = (floorPlan) => {
  //   if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
  //     return 0;
  //   }
  //   const sortedFloorPlan = [...floorPlan].sort((a, b) => a.price - b.price);
  //   return sortedFloorPlan[0].price;
  // };

  // const getHighestPriceOfFloorPlan = (floorPlan) => {
  //   if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
  //     return 0;
  //   }
  //   const sortedFloorPlan = [...floorPlan].sort((a, b) => b.price - a.price);
  //   return sortedFloorPlan[0].price;
  // };

  return (
    <div className="w-100 S">
      <div className="container-fluid p-0 mb-0 w-100">
        {/* Gallery Section */}
        <div className="row mx-0 g-0" style={{ padding: "0.5px" }}>
          {property && property.images && property.images.length > 0 && (
            <>
              {/* Main Image - Full width on mobile, half width on desktop */}
              <div className="col-12 col-md-6 p-0 pe-0 pe-md-0 pb-md-0">
                {property?.images[0] && (
                  <div
                    className="h-100 d-flex align-items-center justify-content-center"
                    style={{ minHeight: "184px", maxHeight: "700px" }}
                  >
                    <a
                      href={property?.images[0]}
                      data-toggle="lightbox"
                      data-gallery="gallery"
                      className="d-flex align-items-center justify-content-center w-100 h-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowFullScreen(true);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <img
                        alt={property?.images[0]?.category || "Image"}
                        src={property?.images[0]}
                        className="img-fluid w-100 h-100 rounded-0 m-0 p-0"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        fetchpriority="high"
                      />
                    </a>
                  </div>
                )}
              </div>

              {/* Additional Images Grid */}
              <div className="col-12 col-md-6 p-0">
                <div className="row g-0 h-100">
                  {[1, 2, 3, 4].map(
                    (index) =>
                      property?.images[index] && (
                        <div
                          key={index}
                          className="col-3 col-md-6"
                          style={{ height: "270px" }}
                        >
                          <a
                            href={property?.images[index]}
                            data-toggle="lightbox"
                            data-gallery="gallery"
                            className="d-block h-100"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowFullScreen(true);
                              setCurrentImageIndex(index);
                            }}
                          >
                            <img
                              alt={property?.images[index]?.category || "Image"}
                              src={property?.images[index]}
                              className="w-100 h-100 rounded-0"
                              style={{
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              fetchpriority="high"
                            />
                          </a>
                        </div>
                      )
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fullscreen Image Modal */}
        {showFullScreen && property?.images && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 9999,
            }}
            onClick={() => setShowFullScreen(false)}
          >
            <div
              className="position-relative w-75"
              style={{ height: window.innerWidth <= 768 ? "50%" : "75%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={property?.images[currentImageIndex]}
                alt={
                  property?.images[currentImageIndex]?.category ||
                  "Full Screen Image"
                }
                className="img-fluid w-100 h-100"
                style={{ objectFit: "contain" }}
              />
              <button
                className="position-absolute top-50 start-0 translate-middle-y rounded-circle"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? property?.images?.length - 1 : prev - 1
                  )
                }
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.3)",
                  border: "none",
                  color: "white",
                }}
              >
                &lt;
              </button>
              <button
                className="position-absolute top-50 end-0 translate-middle-y rounded-circle"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === property?.images?.length - 1 ? 0 : prev + 1
                  )
                }
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.3)",
                  border: "none",
                  color: "white",
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div
        id="navigation-section"
        className="w-full"
        style={{
          backgroundColor: showMobileNav ? "white" : "#2067d1",
          transition: "all 0.3s ease",
          position: isNavFixed ? "fixed" : "relative",
          top: isNavFixed ? 0 : "auto",
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: isNavFixed ? "0" : "auto",
        }}
      >
        <div
          className="container"
          style={{ width: window.innerWidth <= 768 ? "90%" : "80%" }}
        >
          {/* Desktop Navigation */}
          <ul
            className="content-index d-none d-md-flex flex-wrap justify-content-between align-items-center list-unstyled mb-0 py-1"
            id="links"
          >
            {[
              "overview",
              "about",
              "floor",
              //  "price",
              // "payment_plan",
              "amenities",
              "video",
              "location",
              // "siteplan",
              //  "developer",
             // "faqs",
              //  "similar_projects",
            ].map((item) => (
              <li key={item} className="mx-1">
                <a
                  href={`#${item}`}
                  className={`text-white text-decoration-none ${
                    activeSection === item ? "fw-bold" : ""
                  }`}
                  style={{
                    fontWeight: activeSection === item ? "bold" : "400",
                    textDecoration:
                      activeSection === item ? "underline" : "none",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(`#${item}`);
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }}
                >
                  {item.replace("_", " ").charAt(0).toUpperCase() +
                    item.replace("_", " ").slice(1)}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          <div className="d-md-none">
            <div
              className="position-relative"
              style={{ backgroundColor: "#2067d1", width: "100%" }}
            >
              {/* Left scroll button */}
              <div
                id="scrollLeftArrow"
                className="position-absolute start-0 top-50 translate-middle-y"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  padding: "4px",
                  marginLeft: "-30px",
                  borderRadius: "0 50% 50% 0",
                  color: "white",
                  fontSize: "14px",
                  display: "none",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onClick={() => {
                  const nav = document.getElementById("scrollableNav");
                  nav.scrollTo({
                    left: nav.scrollLeft - 100,
                    behavior: "smooth",
                  });
                }}
              >
                &lt;
              </div>

              <div
                className="d-flex overflow-auto"
                id="scrollableNav"
                onScroll={(e) => {
                  const element = e.target;
                  const showRightArrow =
                    element.scrollLeft <
                    element.scrollWidth - element.clientWidth - 10;
                  const showLeftArrow = element.scrollLeft > 10;
                  const rightArrow =
                    document.getElementById("scrollRightArrow");
                  const leftArrow = document.getElementById("scrollLeftArrow");
                  if (rightArrow) {
                    rightArrow.style.display = showRightArrow
                      ? "block"
                      : "none";
                  }
                  if (leftArrow) {
                    leftArrow.style.display = showLeftArrow ? "block" : "none";
                  }
                }}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {[
                  "overview",
                  "about",
                  "floor",
                  //  "price",
                  // "payment_plan",
                  "amenities",
                  "video",
                  "location",
                  // "siteplan",
                  //  "developer",
                 // "fAQs",
                  //  "similar_projects",
                ]?.map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="text-decoration-none py-2 px-3 flex-shrink-0"
                    style={{
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                      backgroundColor:
                        activeSection === item ? "#ffffff" : "transparent",
                      color: activeSection === item ? "#2067d1" : "#ffffff",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(`#${item}`);
                      const headerOffset = 100;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                      setActiveSection(item);
                    }}
                  >
                    {item.replace("_", " ").charAt(0).toUpperCase() +
                      item.replace("_", " ").slice(1)}
                  </a>
                ))}
              </div>
              {/* Right scroll button */}
              <div
                id="scrollRightArrow"
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  padding: "4px",
                  marginRight: "-30px",
                  borderRadius: "50% 0 0 50%",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const nav = document.getElementById("scrollableNav");
                  nav.scrollTo({
                    left: nav.scrollLeft + 100,
                    behavior: "smooth",
                  });
                }}
              >
                &gt;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <section
        className="container-fluid"
        style={{
          width: window.innerWidth <= 768 ? "90%" : "95%",
          margin: "0 auto",
        }}
      >
        <div>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            {/* Left Section */}
            <div className="col-12 col-md-6 p-0 p-md-0">
              {/* Upper Section */}
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-2 mt-2 mt-md-3">
                <div className="mb-2 mb-md-0 me-md-3 text-center text-md-start">
                  <img
                    src={property?.projectLogo || "defaultLogo.jpg"}
                    alt={property?.projectLogo || "Project Logo"}
                    className="img-fluid"
                    style={{
                      maxWidth: "80px",
                    }}
                  />
                </div>
                <div className="text-center text-md-start">
                  <h1
                    className="h3 mb-0 text-center text-md-start"
                    style={{ fontSize: "20px" }}
                  >
                    {property?.propertyName || "Property Name"}
                  </h1>
                  <p className="mb-0" style={{ fontSize: "11px" }}>
                    {property?.propertyAddress || "Property Address"}
                  </p>
                  <span style={{ fontSize: "13px" }}>
                    By{" "}
                    <a
                      // href={property?.developerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {property?.developerName || "Developer Name"}
                    </a>
                  </span>
                </div>
              </div>

              {/* Lower Section - Buttons */}
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start position-relative">
                <span
                  className="badge bg-primary"
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    marginRight: "3px",
                    marginBottom: "3px",
                    borderRadius: "0",
                    backgroundColor: "#2067d1",
                  }}
                  onMouseEnter={() => setShowReraDetails(true)}
                >
                  Rera
                </span>
                {showReraDetails && (
                  <div
                    onMouseEnter={() => setIsReraDetailHovered(true)}
                    onMouseLeave={() => {
                      setIsReraDetailHovered(false);
                      setShowReraDetails(false);
                    }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      padding: "10px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      minWidth: "300px",
                      maxWidth: "90vw",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-0">
                      <h6
                        className="m-0"
                        style={{ fontWeight: 700, fontSize: "14px" }}
                      >
                        Rera Detail
                      </h6>
                      <i
                        className="fa fa-close"
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        onClick={() => {
                          setShowReraDetails(false);
                          setIsReraDetailHovered(false);
                        }}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th
                              style={{
                                width: "45%",
                                textAlign: "left",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "11px",
                                color: "black",
                                fontWeight: 500,
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              Phase
                            </th>
                            <th
                              style={{
                                width: "34%",
                                textAlign: "left",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "11px",
                                color: "black",
                                fontWeight: 500,
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              Status
                            </th>
                            <th
                              style={{
                                width: "40%",
                                textAlign: "left",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "11px",
                                color: "black",
                                fontWeight: 500,
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              Rera Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{ fontSize: "11px", padding: "8px 0" }}
                            ></td>
                            <td style={{ fontSize: "11px", padding: "8px 0" }}>
                              {property?.status}
                            </td>
                            <td style={{ fontSize: "11px", padding: "8px 0" }}>
                              {property?.reraLink}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <span
                  className="badge text-dark"
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    marginRight: "3px",
                    marginBottom: "3px",
                    borderRadius: "0",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "300",
                  }}
                >
                  No Brokerage
                </span>
                <span
                  className="badge text-dark"
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    marginRight: "3px",
                    marginBottom: "3px",
                    borderRadius: "0",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "300",
                  }}
                >
                  Floor Plans Available
                </span>
                <span
                  className="badge text-dark"
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    marginRight: "3px",
                    marginBottom: "3px",
                    borderRadius: "0",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "300",
                  }}
                >
                  Top Amenities
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div
              className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end mt-2 mt-md-2 p-0 p-md-0"
              style={{ boxShadow: "none", border: "none" }}
            >
              <p
                className="mb-1 fw-bold text-black text-center text-md-end mt-2 mt-md-4"
                style={{ fontSize: "20px" }}
              >
                Starting from
              </p>
              <h2
                className="h2 mb-0 fw-bold text-center text-md-end"
                style={{ fontSize: "25px", fontWeight: "800" }}
              >
                ₹{formatPrice(property?.price || "0")}
              </h2>
            </div>
          </div>
        </div>
        <div className="">
          <hr />
        </div>
      </section>

      {/* Section 2 */}
      <section
        className="container-fluid "
        style={{
          width: window.innerWidth <= 768 ? "90%" : "95%",
          margin: "0 auto",
        }}
      >
        <div className="row">
          <section className="col-md-8">
            {/* Project Details */}
            <div
              className="mb-4"
              id="overview"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  Project Details
                </h4>
                <div className="px-3">
                  <div className="row g-3 mb-0 mb-md-4">
                    <div className="col-6 col-md-4 mt-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faExpandArrowsAlt}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Built Up Area
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                              fontWeight:
                                window.innerWidth <= 768 ? "400" : "800",
                            }}
                          >
                            {property?.builtupArea}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faRulerCombined}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Sizes
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                              fontWeight:
                                window.innerWidth <= 768 ? "400" : "800",
                            }}
                          >
                            {property?.size}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faBuilding}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Floor No
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.floors}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Configurations
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {
                              property?.configuration.configurationType
                                .configurationTypeName
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Possession Status
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.possessionStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faBuilding}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Balcony
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.balcony || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faParking}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Covered Parking
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.coveredParking}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faBed}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Bedrooms
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.bedrooms}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faCity}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Type
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {
                              property?.configuration?.configurationType
                                ?.configurationTypeName
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Age of Property
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder text-break"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.ageOfProperty}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faCouch}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Furnishing
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.furnishingType}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faFlag}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            Facing
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.facing}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="mb-2 mb-md-0 me-md-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "20px",
                            color: "#2067d1",
                          }}
                        />
                        <div className="text-center text-md-start">
                          <small
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "15px",
                              fontWeight: "600",
                            }}
                          >
                            RERA Number.
                          </small>
                          <p
                            className="mb-0 fw-normal fw-md-bolder"
                            style={{
                              color: "#000",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "13px",
                              marginTop: "2px",
                            }}
                          >
                            {property?.rera}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* connect to out expert for mobile view*/}
            {window.innerWidth <= 768 && (
              <div
                className="position-sticky mb-4"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-white rounded-3 mb-4 p-4 pb-0">
                  <h4
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    Connect to Our Expert
                  </h4>
                  {!otpSent && !otpVerified && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="mb-3">
                        <input
                          name="username"
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="useremail"
                          className="form-control"
                          type="email"
                          placeholder="Email"
                          value={formData.useremail}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="input-group">
                          <select
                            name="dial_code"
                            className="form-select"
                            style={{ maxWidth: "100px" }}
                            // value={formData.dial_code}
                            onChange={handleChange}
                          >
                            <option value="91">+91</option>
                            <option value="61">+61</option>
                            <option value="852">+852</option>
                            <option value="1">+1</option>
                          </select>
                          <input
                            name="usermobile"
                            className="form-control"
                            type="tel"
                            maxLength="10"
                            placeholder="Phone"
                            value={formData.usermobile}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          I am interested in
                        </label>
                        <select
                          className="form-select"
                          name="intersted_in"
                          value={formData.intersted_in}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="2bhk">2 BHK</option>
                          <option value="3bhk">3 BHK</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <textarea
                          name="usermsg"
                          className="form-control"
                          placeholder="Message"
                          rows="3"
                          value={formData.usermsg}
                          onChange={handleChange}
                          style={{
                            resize: "vertical", // Only allows vertical resizing
                            width: "100%", // Ensures it fills the container's width
                          }}
                        ></textarea>
                      </div>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="text-center d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          style={{ backgroundColor: "#2067d1" }}
                          onClick={sendOtp}
                        >
                          Get a Call back
                        </button>
                      </div>
                    </form>
                  )}

                  {otpSent && !otpVerified && (
                    <div>
                      <div className="alert alert-success">
                        <span className="fw-bold">
                          OTP sent to your mobile number{" "}
                          <a
                            href="#"
                            onClick={() => setOtpSent(false)}
                            className="text-decoration-none"
                          >
                            Edit
                          </a>
                        </span>
                      </div>
                      <div className="mb-3">
                        <input
                          name="enterotp"
                          className="form-control"
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={handleOtpChange}
                        />
                      </div>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary"
                          onClick={resendOtp}
                          disabled={timer > 0}
                        >
                          Resend {timer > 0 && `(${timer}s)`}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            if (!otp || otp.trim() === "") {
                              setError("Please enter OTP");
                              return;
                            }
                            verifyOtp();
                          }}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <form onSubmit={sendOtp}>
                      <div className="alert alert-success">
                        OTP verified! We will connect with you shortly.
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Submit
                      </button>
                    </form>
                  )}
                </div>

                <div className="bg-white rounded-3 p-3 pt-0 text-center d-flex justify-content-center">
                  <button
                    className="btn btn-primary w-100"
                    style={{ fontSize: "16px", backgroundColor: "#2067d1" }}
                    onClick={handleDownloadBrochuree}
                  >
                    <i className="fas fa-download me-2"></i>
                    DOWNLOAD BROCHURE
                  </button>

                  {/* Dialog Popup Trigger */}
                  <BrochurePopupDialog
                    open={showBrochurePopup}
                    onClose={closeBrochurePopup}
                    projectName={property?.propertyName || "Invest Mango"}
                    brochure={property?.brochure}
                  />
                </div>
              </div>
            )}

            {/* Floor Plan */}
            <div
              className="mb-4"
              id="floor"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  {property?.propertyName} Floor Plan
                </h4>
                <div className="px-3">
                  {/* Toggle Buttons for 2D & 3D Floor Plans */}
                  <div className="d-flex gap-2 mb-3">
                    <button
                      onClick={() => setActiveFilter("2D")}
                      className={`btn ${
                        activeFilter === "2D" ? "btn-primary" : ""
                      }`}
                      style={{
                        border: "2px solid #000",
                        borderRadius: "15px",
                        padding:
                          window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                        fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                        fontWeight: "600",
                        backgroundColor:
                          activeFilter === "2D" ? "rgb(32, 103, 209)" : "",
                      }}
                    >
                      2D Floor Plan
                    </button>
                    <button
                      onClick={() => setActiveFilter("3D")}
                      className={`btn ${
                        activeFilter === "3D" ? "btn-primary" : ""
                      }`}
                      style={{
                        border: "2px solid #000",
                        borderRadius: "15px",
                        padding:
                          window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                        fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                        fontWeight: "600",
                        backgroundColor:
                          activeFilter === "3D" ? "rgb(32, 103, 209)" : "",
                      }}
                    >
                      3D Floor Plan
                    </button>
                  </div>

                  {/* Floor Plan Carousel */}
                  <Carousel
                    responsive={{
                      superLargeDesktop: {
                        breakpoint: { max: 4000, min: 3000 },
                        items: 3,
                      },
                      desktop: {
                        breakpoint: { max: 3000, min: 1024 },
                        items: 2,
                      },
                      tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
                      mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
                    }}
                    // infinite={true}
                    containerClass="carousel-container"
                    itemClass="carousel-item-padding-40-px"
                    style={{ width: "60%", margin: "0 auto" }}
                  >
                    {(() => {
                      const defaultImage =
                        process.env.PUBLIC_URL +
                        "/images/coming_soon_floor.jpg";

                      const isValidImage = (imageUrl) =>
                        imageUrl?.includes("/images/img/")
                          ? imageUrl
                          : defaultImage;

                      const images = [
                        {
                          title: "2D Floor Plan",
                          imageUrl: isValidImage(property?.floorImage2D),
                        },
                        {
                          title: "3D Floor Plan",
                          imageUrl: isValidImage(property?.floorImage3D),
                        },
                      ];

                      return images.map((plan, index) => (
                        <div
                          key={index}
                          className="px-2 d-flex justify-content-center"
                        >
                          <div
                            className="card border-0"
                            style={{
                              width: "80%",
                              maxWidth:
                                window.innerWidth <= 768 ? "80%" : "auto",
                            }}
                          >
                            <div className="card-body p-3 text-center">
                              <p
                                className="mb-3"
                                style={{
                                  fontSize:
                                    window.innerWidth <= 768 ? "14px" : "16px",
                                  fontWeight: "600",
                                }}
                              >
                                {plan.title}
                              </p>
                              <img
                                src={plan.imageUrl}
                                alt={plan.title}
                                className="img-fluid mb-3"
                                style={{
                                  width: "100%",
                                  maxHeight: "300px",
                                  objectFit: "contain",
                                  borderRadius: "5px",
                                }}
                                onClick={() => handleImageClick(plan.imageUrl)}
                              />
                              <div className="d-flex flex-column gap-2 align-items-center">
                                <a
                                  href="tel:+918595189189"
                                  className="btn btn-primary w-100"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 768
                                        ? "12px"
                                        : "14px",
                                    backgroundColor: "#2067d1",
                                  }}
                                >
                                  Talk to our Expert
                                </a>
                                <button
                                  onClick={handleDownloadFloorPlan}
                                  className="btn btn-outline-primary w-100"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 768? "12px" : "14px",
                                      margin:"0px",
                                  }}
                                >
                                  Download Floor Plan
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </Carousel>

                  {/* Image Popup Modal */}
                  {showImagePopup && (
                    <div
                      className="image-popup-modal"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        className="image-popup-content"
                        style={{
                          position: "relative",
                          maxWidth: "50%",
                        }}
                      >
                        <img
                          src={selectedImage}
                          alt="Floor Plan"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          onClick={closeImagePopup}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            padding: "10px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Know About */}
            <div
              className="mb-4"
              id="about"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  Know About {property?.propertyName}
                </h4>
                <div className="px-3">
                  <div
                    className="position-relative overflow-hidden"
                    style={{
                      maxHeight: showFullDescription ? "none" : "100px",
                    }}
                  >
                    <div
                      className={
                        !showFullDescription
                          ? "position-absolute w-100 h-100"
                          : ""
                      }
                      style={{
                        background: !showFullDescription
                          ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)"
                          : "none",
                        top: 0,
                        left: 0,
                      }}
                    ></div>
                    <div
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "15px", // Adjust font size for smaller screens
                        fontFamily: "'Roboto', sans-serif", // Use imported Google font here
                        lineHeight: "1.5", // Improve readability with line-height adjustment
                        letterSpacing: "0.4px", // Slight letter spacing for better clarity
                      }}
                    >
                      {property?.about && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: property.about,
                          }}
                        />
                      )}
                    </div>

                    <p
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      }}
                    >
                      {/* <span className="text-primary fw-bold">
                          Coming Soon
                        </span> */}
                    </p>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      }}
                    >
                      Click on the{" "}
                      <span
                        className="fw-bold"
                        style={{
                          cursor: "pointer",
                          color: "#2067d1",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          transition: "background-color 0.3s ease",
                        }}
                        id="download-btn2"
                        onClick={handleDownloadBrochure} // Trigger for brochure popup
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#e6f0fc")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "transparent")
                        }
                      >
                        "Download"
                      </span>
                      button to download{" "}
                      <span className="fw-bold">
                        {property?.propertyName} brochure
                      </span>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0 mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFullDescription(!showFullDescription);
                    }}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      color: "black", // Default color is black
                      display: "block", // Makes the button a block element
                      margin: "0 auto", // Centers the button horizontally
                      textAlign: "center", // Center-aligns text inside the button
                      cursor: "pointer", // Changes cursor on hover
                      padding: "0", // Removes any default padding
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#2067d1")} // Changes color on hover
                    onMouseLeave={(e) => (e.target.style.color = "black")} // Resets color after hover
                  >
                    {showFullDescription ? "Show Less" : "Read More"}
                  </button>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div
              className="mb-4"
              id="amenities"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  {property?.propertyName} Amenities
                </h4>
                <div className="px-3">
                  <p
                    className="mb-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                    }}
                  >
                    {property?.amenitiesPara ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: property.amenitiesPara,
                        }}
                      />
                    ) : (
                      <p>
                        World class amenities are there in{" "}
                        {property?.propertyName} for the residents to enjoy a
                        luxurious lifestyle. Know in detail about the amenities
                        in the list below.
                      </p>
                    )}
                  </p>

                  <div
                    className="inner-item"
                    style={{
                      height: "400px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {processAmenities()?.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <p
                          className="fw-bolder mb-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "14px" : "16px",
                            color: "#2067d1",
                            fontWeight: "1000",
                          }}
                        >
                          {category.name.charAt(0).toUpperCase() +
                            category.name.slice(1)}
                        </p>
                        <div className="row g-4 mb-5">
                          {category.assets?.map((amenity, index) => (
                            <div key={index} className="col-6 col-md-3">
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  fontSize:
                                    window.innerWidth <= 768 ? "11px" : "14px",
                                  marginBottom: "16px",
                                  fontWeight: "600",
                                }}
                              >
                                <img
                                  src={amenity.icon}
                                  alt={amenity.name}
                                  style={{
                                    width: "35px",
                                    height: "35px",
                                    marginRight: "16px",
                                  }}
                                />
                                {amenity.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* video presentation */}
            <div
              className="mb-4"
              id="video"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  Video Presentation of {property && property?.propertyName}
                </h4>
                <div className="px-3">
                  {/* <p
                    className="mb-3 mb-md-5"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                    }}
                  >
                    {property?.videoPara ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: property.videoPara,
                        }}
                      />
                    ) : (
                      `VIDEO PRESENTATION OF ${property?.propertyName}`
                    )}
                  </p> */}

                  <div className="d-flex flex-column">
                    {property?.propertyVideo &&
                    property.propertyVideo.length > 0 ? (
                      property.propertyVideo?.map((videoUrl, index) => (
                        <div key={index} className="ratio ratio-16x9 mb-3">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1&origin=${window.location.origin}`}
                            title={`${
                              property?.propertyName
                            } Video Presentation ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              border: "none",
                              borderRadius: "8px",
                            }}
                          ></iframe>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "160px",
                          backgroundImage:
                            "url('/images/investmango-youtube-banner.webp')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "center",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {/* No Videos Available */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-3 mb-4" id="location">
              <h2
                className="mb-4"
                style={{
                  fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                  color: "#000000",
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#2067d1",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  color: "#ffffff",
                }}
              >
                {property?.name} Location Map
              </h2>
              <div className="row">
                <div className="col-12">
                  <div
                    className="mb-4 px-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}
                  >
                    {property?.locationPara && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: property.locationPara,
                        }}
                      />
                    )}
                  </div>
                  <div className="position-relative">
                    <div
                      style={{
                        position: "absolute",
                        width: "80%",
                        height: "100%",
                        background: "#f22a2a00",
                        zIndex: 1,
                      }}
                    ></div>
                    <iframe
                      title="Location"
                      src={property?.locationMap}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            {/* <div
              className="mb-4"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              id="fAQs"
            >
              <div className="p-0 pb-2">
                <h4
                  className="mb-3 py-2 fw-bold text-white ps-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                    backgroundColor: "#2067d1",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  Frequently Asked Questions (FAQs)
                </h4>
                <div className="px-3"> */}
            {/* <script type="application/ld+json">
                  </script> */}

            {/* {property?.faqs?.map((faq, index) => (
                    <div key={index} className="mb-3">
                      <div
                        className="d-flex justify-content-between align-items-center p-3"
                        style={{
                          backgroundColor:
                            expandedIndex === index ? "#f8f9fa" : "white",
                          cursor: "pointer",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                        }}
                        onClick={() =>
                          setExpandedIndex(
                            expandedIndex === index ? null : index
                          )
                        }
                      >
                        <span className="fw-bold">{faq.question}</span>
                        <span>{expandedIndex === index ? "−" : "+"}</span>
                      </div>
                      {expandedIndex === index && (
                        <div
                          className="p-3"
                          style={{
                            border: "1px solid #dee2e6",
                            borderTop: "none",
                            borderRadius: "0 0 4px 4px",
                            fontSize:
                              window.innerWidth <= 768 ? "12px" : "13px",
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                faq.answer || "<p>Answer not available.</p>"
                              ),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </section>

          <section className="col-md-4 mb-4">
            {/*Connect to Our Expert */}
            {window.innerWidth > 768 && (
              <div
                className="position-sticky"
                style={{
                  top: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  padding: "20px"
                }}
              >
                <div
                  className="bg-white rounded-3 mb-4 p-4 pb-4"
                  style={{
                    top: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginTop: "20px",
                  }}
                >
                  <h4 className="mb-4 text-center">Connect to Our Expert</h4>

                  {/* Form for sending OTP */}
                  {!otpSent && !otpVerified && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="mb-3">
                        <input
                          name="username"
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="useremail"
                          className="form-control"
                          type="email"
                          placeholder="Email"
                          value={formData.useremail}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="input-group">
                          <select
                            name="dial_code"
                            className="form-select"
                            style={{ maxWidth: "100px" }}
                            // value={formData.dial_code}
                            onChange={handleChange}
                          >
                            <option value="91">+91</option>
                            <option value="61">+61</option>
                            <option value="852">+852</option>
                            <option value="1">+1</option>
                          </select>
                          <input
                            name="usermobile"
                            className="form-control"
                            type="tel"
                            maxLength="10"
                            placeholder="Phone"
                            value={formData.usermobile}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          I am interested in
                        </label>
                        <select
                          className="form-select"
                          name="intersted_in"
                          value={formData.intersted_in}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="2bhk">2 BHK</option>
                          <option value="3bhk">3 BHK</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <textarea
                          name="usermsg"
                          className="form-control"
                          placeholder="Message"
                          rows="3"
                          value={formData.usermsg}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="text-center d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          style={{ backgroundColor: "#2067d1" }}
                          onClick={sendOtp}
                        >
                          Get a Call back
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Form for OTP verification */}
                  {otpSent && !otpVerified && (
                    <div>
                      <div className="alert alert-success">
                        <span className="fw-bold">
                          OTP sent to your {formData.usermobile}{" "}
                          <a
                            href="#"
                            onClick={() => setOtpSent(false)}
                            className="text-decoration-none"
                          >
                            Edit
                          </a>
                        </span>
                      </div>
                      <div className="mb-3">
                        <input
                          name="enterotp"
                          className="form-control"
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={handleOtpChange}
                        />
                      </div>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary"
                          onClick={resendOtp}
                          disabled={timer > 0}
                        >
                          Resend {timer > 0 && `(${timer}s)`}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            if (!otp || otp.trim() === "") {
                              setError("Please enter OTP");
                              return;
                            }
                            verifyOtp();
                          }}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {/* After OTP is verified */}
                  {otpVerified && (
                    <form onSubmit={sendOtp}>
                      <div className="alert alert-success">
                        OTP verified! We will connect with you shortly.
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
                <section id="developer" style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px'}}>
                  <div className="box overview">
                    <h2
                      className="headline"
                      style={{
                        borderBottom: "solid 1px #e8e8e8",
                        padding: "12px 16px",
                        fontSize: "15px",
                        backgroundColor: "#2067d1",
                        textTransform: "uppercase",
                        letterSpacing: "0.2px",
                        fontWeight: "700",
                        color: "#fff",
                        borderRadius: "6px 6px 0 0",
                      }}
                    >
                      About {property?.propertyName}
                    </h2>

                    <div
                      className="row"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "calc(-1 * var(--bs-gutter-y))",
                        marginRight: "calc(-0.5 * var(--bs-gutter-x))",
                        marginLeft: "calc(-0.5 * var(--bs-gutter-x))",
                        "--bs-gutter-x": "1.5rem",
                        "--bs-gutter-y": "0",
                      }}
                    >
                      <div className="col-md-12" style={{padding:'18px'}}>
                        <div
                          className="inner-item"
                      
                        >
                          <div
                            className="over_head"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                            }}
                          >
                            <img
                              src={
                                property?.developerLogo ||
                                "/img/developer-img/ace-group.webp"
                              }
                              className="img-fluid"
                              alt="Developer Logo"
                              fetchPriority="high"
                              style={{
                                maxWidth: "80px",
                                height: "auto",
                                borderRadius: "4px",
                                border: "1px solid #b5a9a9"
                              }}
                            />
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              ESTABLISHED IN -{" "}
                              <b style={{ fontSize: "15px", color: "#2067d1" }}>
                                {property?.developerEstiblishedYear || "N/A"}
                              </b>
                              <br />
                              TOTAL PROJECTS -{" "}
                              <b style={{ fontSize: "15px", color: "#2067d1" }}>
                                {property?.totlprojects || "N/A"}
                              </b>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
