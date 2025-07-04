import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  faFlag,
  faCity,
  faKey,
  faParking,
  faBed,
  faCouch,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import ProjectPropertyDetails from "./PropertyDetailParts/ProjectPropertyDetails";
import PropertyHeaderSection from "./PropertyHeaderSection";
import WhyToChooseSection from "./PropertyDetailParts/WhyToChooseSection";
import FloorPlanSection from "./PropertyDetailParts/FloorPlanSection";
import AboutDeveloperSection from "./PropertyDetailParts/AboutDeveloperSection";
import AmenitiesSection from "./PropertyDetailParts/AmenitiesSection";
import VideoSection from "./PropertyDetailParts/VideoSection";
import KnowAboutSection from "./PropertyDetailParts/KnowAboutSection";
import PropertyListSection from "./PropertyDetailParts/PropertyListSection";
const BASE_URL = "https://myimwebsite.s3.ap-south-1.amazonaws.com/images/";

const PropertyDetails = () => {
  const location = useLocation();
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
  const closePopup = () => {
    setShowPopup(false);
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
    try {
      const response = await sendOTP(
        formData.usermobile,
        property?.propertyName || "",
        "ORGAINc",
        formData.username,
        formData.usermsg,
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
    // If propertyData is passed from navigation, use it to set property state
    if (location.state && Object.keys(location.state).length > 0) {
      // Map the incoming propertyData to the property state format
      const propertyData = location.state;
      setProperty({
        property_name: propertyData.projectName || '',
        name: propertyData.projectName || '',
        projectId: propertyData.projectId || '',
        propertyType: propertyData.propertyType || '',
        ageOfProperty: propertyData.ageOfProperty || '',
        floorNo: propertyData.floorNo || '',
        configuration: propertyData.configuration || '',
        facing: propertyData.facing || '',
        furnishing: propertyData.furnishing || '',
        balconyCount: propertyData.balconyCount || '',
        bedroomCount: propertyData.bedroomCount || '',
        coveredParking: propertyData.coveredParking || '',
        // You can add more fields here as needed
      });
       console.log("propertyDatadsj", propertyData)
    } else if (urlName) {
      const fetchProperty = async () => {
        const data = await getPropertyByUrlName(urlName);
        setProperty(data.data);
        console.log("datayhdsj", data.data);
      };
      fetchProperty();
    }
  }, [location.state, urlName]);

  // if (!property) return <div>Loading...</div>; // Show a loading message while fetching

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
// useEffect(() => {
//   const handleScroll = () => {
//     const sections = [
//       "overview",
//       "about",
//       "floor",
//       "amenities",
//       "video",
//       "location"
//     ];

//     if (navInitialPosition !== null) {
//       const scrollPosition = window.scrollY;
//       setIsNavFixed(scrollPosition >= navInitialPosition);
//     }

//     for (const section of sections) {
//       const element = document.getElementById(section);
//       if (element) {
//         const rect = element.getBoundingClientRect();
//         if (rect.top <= 100 && rect.bottom >= 100) {
//           setActiveSection(section);
//           break;
//         }
//       }
//     }
//   };

//   window.addEventListener("scroll", handleScroll);
  
//   return () => {
//     window.removeEventListener("scroll", handleScroll);
//   };
// }, [navInitialPosition]); // Ensure dependencies are correctly set

// PATCH handlers for each section (like ProjectPropertyDetails handleSave)
const onSaveProjectDetails = (changedData) => {
  setProperty(prev => ({ ...prev, ...changedData }));
  // TODO: Call patchPropertyDetails API here if needed
};

const onSaveWhyToChoose = (changedData) => {
  setProperty(prev => ({ ...prev, ...changedData }));
  // TODO: Call patchPropertyDetails API here if needed
};

// const onSaveFloorPlan = (changedData) => {
//   setProperty(prev => ({ ...prev, ...changedData }));
//   // TODO: Call patchPropertyDetails API here if needed
// };

const onSaveAboutDeveloper = (changedData) => {
  setProperty(prev => ({ ...prev, ...changedData }));
  // TODO: Call patchPropertyDetails API here if needed
};

const onSaveKnowAbout = (aboutHtml) => {
  setProperty(prev => ({ ...prev, about: aboutHtml }));
  // TODO: Call patchPropertyDetails API here if needed
};

const onSaveAmenities = (newPropertyAmenities, newAmenitiesPara) => {
  setProperty(prev => ({
    ...prev,
    propertyAmenities: newPropertyAmenities,
    amenitiesPara: newAmenitiesPara,
  }));
  // TODO: Call patchPropertyDetails API here if needed
};

const onSaveVideo = ({ videoPara, propertyVideo }) => {
  setProperty(prev => ({
    ...prev,
    videoPara,
    propertyVideo,
  }));
  // TODO: Call patchPropertyDetails API here if needed
};

  return (
    <>
      {/* {property && (
        <Helmet>
          <title>{property.metaTitle || "Default Title"}</title>
          <meta
            name="description"
            content={property.metaDescription || "Default Description"}
          />
          <meta
            name="keywords"
            content={
              property.keywords?.filter((k) => k.trim() !== "").join(", ") ||
              "default, keywords"
            }
          />
          <link rel="canonical" href={window.location.href} />
          {property.productSchema &&
            property.productSchema.map((schemaItem, index) => (
              <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
              />
            ))}
        </Helmet>
      )} */}

      <div className="w-100">
        <div className="container-fluid p-0 mb-0 w-100">
          {/* Gallery Section */}
          <div className="row mx-0 g-0" style={{ padding: "0.5px" }}>
            {property && property.property_images && property.property_images.length > 0 && (
              <>
                {/* Main Image - Full width on mobile, half width on desktop */}
                <div className="col-12 col-md-6 p-0 pe-0 pe-md-0 pb-md-0">
                  <div
                    className="h-100 d-flex align-items-center justify-content-center"
                    style={{ minHeight: "184px", maxHeight: "700px" }}
                  >
                    <a
                      href={property.property_images[0]}
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
                        alt={`Gallery Image 1`}
                        src={property.property_images[0]}
                        loading="lazy"
                        className="img-fluid w-100 h-100 rounded-0 m-0 p-0"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        fetchpriority="high"
                      />
                    </a>
                  </div>
                </div>

                {/* Additional Images Grid */}
                <div className="col-12 col-md-6 p-0">
                  <div className="row g-0 h-100">
                    {property.property_images.slice(1, 5).map((img, index) => (
                      <div
                        key={index + 1}
                        className="col-3 col-md-6"
                        style={{ height: "270px" }}
                      >
                        <a
                          href={img}
                          data-toggle="lightbox"
                          data-gallery="gallery"
                          className="d-block h-100"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowFullScreen(true);
                            setCurrentImageIndex(index + 1);
                          }}
                        >
                          <img
                            alt={`Gallery Image ${index + 2}`}
                            src={img}
                            loading="lazy"
                            className="w-100 h-100 rounded-0"
                            style={{
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            fetchpriority="high"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Fullscreen Image Modal */}
          {showFullScreen && property?.property_images && (
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
                  src={property?.property_images[currentImageIndex]}
                  alt={
                    property?.property_images[currentImageIndex]?.category ||
                    "Full Screen Image"
                  }
                  loading="lazy"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "contain" }}
                />
                <button
                  className="position-absolute top-50 start-0 translate-middle-y rounded-circle"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? property?.property_images?.length - 1 : prev - 1
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
                      prev === property?.property_images?.length - 1 ? 0 : prev + 1
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
            // backgroundColor: showMobileNav ? "white" : "#2067d1",
            // transition: "all 0.3s ease",
            // position: isNavFixed ? "fixed" : "relative",
            // top: isNavFixed ? '66px': "auto",
            // left: 0,
            // right: 0,
            // zIndex: 500,
            // marginTop: isNavFixed ? "0" : "auto",
            backgroundColor: showMobileNav ? "white" : "#2067d1",
            transition: "all 0.3s ease",
            position: isNavFixed ? "fixed" : "relative",
            top: isNavFixed ? 66 : "auto",
            left: 0,
            right: 0,
            zIndex: 500,
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
                "amenities",
                "video",
                "location"
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
                      const elementPosition =
                        element.getBoundingClientRect().top;
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
                    const leftArrow =
                      document.getElementById("scrollLeftArrow");
                    if (rightArrow) {
                      rightArrow.style.display = showRightArrow
                        ? "block"
                        : "none";
                    }
                    if (leftArrow) {
                      leftArrow.style.display = showLeftArrow
                        ? "block"
                        : "none";
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

        {/* Section 1 - Property Header */}
        <PropertyHeaderSection
          property={property}
          formatPrice={formatPrice}
          handleDownloadBrochure={handleDownloadBrochure}
          showPopup={showPopup}
          closePopup={closePopup}
          BrochurePopupDialog={BrochurePopupDialog}
        />

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
                <ProjectPropertyDetails 
                  property={property}
                  onSave={onSaveProjectDetails}
                  // Pass all relevant property fields as props for display
                  propertyType={property?.propertyType}
                  ageOfProperty={property?.ageOfProperty}
                  floorNo={property?.floorNo}
                  configuration={property?.configuration}
                  facing={property?.facing}
                  furnishing={property?.furnishing}
                  balconyCount={property?.balconyCount}
                  bedroomCount={property?.bedroomCount}
                  coveredParking={property?.coveredParking}
                />
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
                              <option value="968">+968</option>
                              <option value="974">+974</option>
                              <option value="65">+65</option>
                              <option value="971">+971</option>
                              <option value="44">+44</option>
                              <option value="1">+1</option>
                              <option value="27">+27</option>
                              <option value="60">+60</option>
                              <option value="64">+64</option>
                              <option value="66">+66</option>
                              <option value="966">+966</option>
                              <option value="31">+31</option>
                              <option value="973">+973</option>
                              <option value="54">+54</option>
                              <option value="43">+43</option>
                              <option value="880">+880</option>
                              <option value="32">+32</option>
                              <option value="55">+55</option>
                              <option value="86">+86</option>
                              <option value="385">+385</option>
                              <option value="42">+42</option>
                              <option value="45">+45</option>
                              <option value="1809">+1809</option>
                              <option value="20">+20</option>
                              <option value="358">+358</option>
                              <option value="679">+679</option>
                              <option value="33">+33</option>
                              <option value="49">+49</option>
                              <option value="30">+30</option>
                              <option value="592">+592</option>
                              <option value="36">+36</option>
                              <option value="62">+62</option>
                              <option value="353">+353</option>
                              <option value="972">+972</option>
                              <option value="39">+39</option>
                              <option value="81">+81</option>
                              <option value="962">+962</option>
                              <option value="82">+82</option>
                              <option value="965">+965</option>
                              <option value="853">+853</option>
                              <option value="52">+52</option>
                              <option value="212">+212</option>
                              <option value="47">+47</option>
                              <option value="48">+48</option>
                              <option value="351">+351</option>
                              <option value="40">+40</option>
                              <option value="7">+7</option>
                              <option value="34">+34</option>
                              <option value="46">+46</option>
                              <option value="41">+41</option>
                              <option value="1868">+1868</option>
                              <option value="216">+216</option>
                              <option value="90">+90</option>
                              <option value="84">+84</option>
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
                            {property?.configurations?.map((config, index) => (
                              <option key={index} value={config}>
                                      {config}
                                    </option>
                             ))}
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

                  <section
                    id="developer"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px" }}
                  >
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
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        <div className="col-md-12" style={{ padding: "18px" }}>
                          <div className="inner-item">
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
                                loading="lazy"
                                fetchPriority="high"
                                style={{
                                  maxWidth: "80px",
                                  height: "auto",
                                  borderRadius: "4px",
                                  border: "1px solid #b5a9a9",
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
                                <b
                                  style={{ fontSize: "15px", color: "#2067d1" }}
                                >
                                  {property?.developerEstiblishedYear || "N/A"}
                                </b>
                                <br />
                                TOTAL PROJECTS -{" "}
                                <b
                                  style={{ fontSize: "15px", color: "#2067d1" }}
                                >
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

              {/* Why to choose */}
              <WhyToChooseSection property={property} onSave={onSaveWhyToChoose} />

              {/* Floor Plan */}
              <FloorPlanSection
                property={property}
                // activeFilter={activeFilter}
                // setActiveFilter={setActiveFilter}
                // handleImageClick={handleImageClick}
                // showImagePopup={showImagePopup}
                // selectedImage={selectedImage}
                // closeImagePopup={closeImagePopup}
                // handleDownloadFloorPlan={handleDownloadFloorPlan}
                // showFloorPlanPopup={showFloorPlanPopup}
                // closeFloorPlanPopup={closeFloorPlanPopup}
                // formatPrice={formatPrice}
                //onSave={onSaveFloorPlan}
              />

             
              {/* Know About */}
              <KnowAboutSection
                property={property}
                showFullDescription={showFullDescription}
                setShowFullDescription={setShowFullDescription}
                onSave={onSaveKnowAbout}
              />

              {/* Amenities */}
              <AmenitiesSection
                property={property}
                processAmenities={processAmenities}
                onSave={onSaveAmenities}
              />

              {/* video presentation */}
              <VideoSection property={property} onSave={onSaveVideo} />

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
            </section>

            <section className="col-md-4 mb-4">
              {/*Connect to Our Expert */}
              {window.innerWidth > 768 && (
                <div
                  className="position-sticky"
                  style={{
                    top: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    padding: "20px",
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
                  <section
                    id="developer"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px" }}
                  >
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
                        <div className="col-md-12" style={{ padding: "18px" }}>
                          <div className="inner-item">
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
                                loading="lazy"
                                fetchPriority="high"
                                style={{
                                  maxWidth: "80px",
                                  height: "auto",
                                  borderRadius: "4px",
                                  border: "1px solid #b5a9a9",
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
                                <b
                                  style={{ fontSize: "15px", color: "#2067d1" }}
                                >
                                  {property?.developerEstiblishedYear || "N/A"}
                                </b>
                                <br />
                                TOTAL PROJECTS -{" "}
                                <b
                                  style={{ fontSize: "15px", color: "#2067d1" }}
                                >
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
    </>
  );
};

export default PropertyDetails;
