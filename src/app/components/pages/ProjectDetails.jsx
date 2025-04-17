import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrochurePopupDialog from "./BrochurePopup";
import PopupDialog from "./CommanPopup";
import { useOutletContext } from "react-router-dom";
import {
  getAllProjectsByUrlName,
  getDeveloperById,
  getAllProject,
  sendOTP,
  verifyOTP,
  resendOTP,
  getReraInfoByProjectId,
  // getLeadByPhone,
  // saveLead,
} from "../../apis/api";
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
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Helmet } from "react-helmet";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import Header from "../Header";

const BASE_URL = "https://image.investmango.com/images/";
const FALLBACK_IMAGE = "/images/For-Website.jpg"; // Local path to banner
// const FALLBACK_Floor_IMAGE = "/images/coming_soon_floor.jpg";

const ProjectDetails = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [projectData, setProjectData] = useState(null);
  const [allSimilarProjects, setAllSimilarProjects] = useState(null);
  const [developerId, setDeveloperId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [developerDetails, setDeveloperDetails] = useState(null);
  const [reraDetails, setReraDetails] = useState(null);
  const { urlName } = useParams();
  const [expandedIndex, setExpandedIndex] = useState(null); // To track which FAQ is expanded
  const [showReraDetails, setShowReraDetails] = useState(false);
  const [isReraDetailHovered, setIsReraDetailHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navInitialPosition, setNavInitialPosition] = useState(null);
  const [schemas, setSchemas] = useState([]); // Initialize schemas as an empty array

  const navigate = useNavigate();

  // Store initial nav position on mount
  useEffect(() => {
    const navElement = document.getElementById("navigation-section");
    if (navElement) {
      // Set fixed trigger height to 800px
      setNavInitialPosition(500);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (urlName) {
        try {
          const data = await getAllProjectsByUrlName(urlName, navigate);
          if (data) {
            setProjectData(data);
            // console.log(data,"gfghjhhfgdfh");
            setDeveloperId(data.developerId); // Update developer ID
            setProjectId(data.id); // Update developer ID
            // Extract and parse schema JSON
            // Extract and parse multiple schema JSONs
            if (Array.isArray(data.schema) && data.schema.length > 0) {
              const parsedSchemas = data.schema
                .map((schemaStr) => {
                  try {
                    const scriptContent = schemaStr
                      .replace(/<script[^>]*>/, "") // Remove opening <script> tag
                      .replace(/<\/script>/, "") // Remove closing </script> tag
                      .trim();

                    return JSON.parse(scriptContent);
                  } catch (error) {
                    console.error("Error parsing schema JSON:", error);
                    return null; // Skip invalid schema
                  }
                })
                .filter(Boolean); // Remove null values if parsing fails

              setSchemas(parsedSchemas);
            }
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };
    fetchData();
  }, [urlName, navigate]);

  useEffect(() => {
    if (projectData) {
      const fetchAllProject = async () => {
        try {
          const data = await getAllProject(projectData?.locality?.city?.id);

          if (data?.content) {
            // Filter projects based on locality ID
            const filteredProjects = data.content.filter(
              (project) =>
                project?.locality?.city?.id === projectData?.locality?.city?.id
            );

            // Limit the projects to max 15
            setAllSimilarProjects(filteredProjects.slice(0, 15));
          }
        } catch (error) {
          console.error("Error fetching similar projects:", error);
        }
      };

      fetchAllProject();
    }
  }, [projectData]);

  // Fetch developer details when DeveloperId changes
  useEffect(() => {
    const fetchDeveloper = async () => {
      if (developerId) {
        try {
          const data = await getDeveloperById(developerId);
          if (data) {
            setDeveloperDetails(data);
          }
        } catch (error) {
          console.error("Error fetching developer data:", error);
        }
      }
    };
    fetchDeveloper();
  }, [developerId]);

  useEffect(() => {
    const fetchReraInfo = async () => {
      if (!projectId) return;

      try {
        const data = await getReraInfoByProjectId(projectId);
        setReraDetails(data || []); // Ensures state is always an array
      } catch (error) {
        console.error("Error fetching RERA data:", error);
        setReraDetails([]); // Resets state on error
      }
    };

    fetchReraInfo();
  }, [projectId]);

  const formatPrice = (price) => {
    if (!price) return "Prices On Request";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Check if the price is 1, then return "Sold Out"
    if (numPrice === 1) {
      return "Prices On Request";
    }
    // Check if the price is 1.5, then return "Sold Out"
    if (numPrice === 1.5) {
      return "Sold Out";
    }
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

  // Process amenities to match the format of amenities.json
  const processAmenities = () => {
    if (!projectData?.projectAmenities) return [];

    const groupedAmenities = projectData.projectAmenities.reduce(
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

  const getLeastPriceOfFloorPlan = (floorPlan) => {
    if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
      return 0;
    }

    // Filter out prices that are exactly 1.5
    const validFloorPlans = floorPlan.filter((plan) => plan.price !== 1.5);

    if (validFloorPlans.length === 0) return 0; // If all prices were 1.5, return 0

    const sortedFloorPlan = [...validFloorPlans].sort(
      (a, b) => a.price - b.price
    );
    return sortedFloorPlan[0].price;
  };

  const getHighestPriceOfFloorPlan = (floorPlan) => {
    if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
      return 0;
    }

    // Filter out prices that are exactly 1.5
    const validFloorPlans = floorPlan.filter((plan) => plan.price !== 1.5);

    if (validFloorPlans.length === 0) return 0; // If all prices were 1.5, return 0

    const sortedFloorPlan = [...validFloorPlans].sort(
      (a, b) => b.price - a.price
    );
    return sortedFloorPlan[0].price;
  };

  // Function to toggle the expanded question
  const toggleFAQ = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userType: "",
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

  // Handle input change
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
        projectData?.name || "",
        "ORGAINc",
        formData.username,
        formData.usermsg,
        formData.useremail,
        formData.userType
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

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Check if lead exists
  //     const existingLead = await getLeadByPhone(`${formData.usermobile}`);

  //     // Only create new lead if getLeadByPhone fails with bad request
  //     console.log("Existing lead:", existingLead);
  //     if (existingLead.length == 0) {
  //       // Lead doesn't exist, create new lead
  //       const newLead = {
  //         name: formData.username,
  //         phone: `${formData.dial_code}${formData.usermobile}`,
  //         email: formData.useremail,
  //         projectName: projectData?.name,
  //         source: "ORGANIC",
  //       };
  //       await saveLead(newLead);
  //       alert(
  //         "Thank you! We have already created a query for you. We will connect with you shortly."
  //       );
  //     } else {
  //       alert("Thank you! We will connect with you shortly.");
  //     }

  //     setOtpSent(false);
  //     setOtpVerified(false);
  //   } catch (error) {
  //     console.error("Error handling form submission:", error);
  //     alert("Something went wrong. Please try again.");
  //   }
  // };

  // Update active section based on scroll position and handle nav fixing
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "about",
        "floor",
        "price",
        "payment plan",
        "amenities",
        "video",
        "location",
        "siteplan",
        "developer",
        "FAQs",
        "similar projects",
      ];

      // Only check for fixing nav if we have the initial position
      if (navInitialPosition !== null) {
        const scrollPosition = window.scrollY;
        // Only fix nav after scrolling past 800px
        setIsNavFixed(scrollPosition >= navInitialPosition);
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navInitialPosition]);

  const [showPopup, setShowPopup] = useState(false);
  const handleDownloadBrochure = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
    setShowBrochurePopup(false);
  };

  const [showBrochurePopup, setShowBrochurePopup] = useState(false);
  const closeBrochurePopup = () => setShowBrochurePopup(false);
  const handleDownloadBrochuree = () => setShowBrochurePopup(true);

  const [isMobileView, setIsMobileView] = useState(false); // To track if mobile/tablet view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768); // Assuming 768px is your mobile/tablet breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => window.removeEventListener("resize", handleResize); // Clean up listener
  }, []);

  const [showFloorPlanPopup, setShowFloorPlanPopup] = useState(false);
  // const [modalType, setModalType] = useState("");
  const handleDownloadFloorPlan = () => setShowFloorPlanPopup(true);
  const closeFloorPlanPopup = () => setShowFloorPlanPopup(false);

  const [showSitePopup, setShowSitePopup] = useState(false);
  const handleSitePopup = () => setShowSitePopup(true);
  const closeSitePopup = () => setShowSitePopup(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const [showFloorPlanPopup, setShowFloorPlanPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false); // State for image popup
  const [selectedImage, setSelectedImage] = useState(""); // State to hold selected image URL

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true); // Open the popup with the clicked image
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(""); // Clear selected image
  };

  // Function to clean and extract numbers for sorting
  const cleanQuestion = (question) => {
    const match = question.match(/^(\d+)[.\s\t]+(.*)/); // Extracts number and question
    return match
      ? { number: parseInt(match[1]), text: match[2] }
      : { number: null, text: question.trim() };
  };

  // Sort FAQs based on extracted number
  const sortedFaqs = projectData?.faqs
    ?.map((faq) => ({ ...faq, ...cleanQuestion(faq.question) })) // Add cleaned data
    ?.sort((a, b) => (a.number ?? Infinity) - (b.number ?? Infinity)); // Sort numerically if a number exists

  const imageSrc =
    projectData?.siteplanImg && projectData.siteplanImg.trim() !== ""
      ? projectData.siteplanImg.startsWith("http")
        ? projectData.siteplanImg
        : `${BASE_URL}${projectData.siteplanImg}`
      : FALLBACK_IMAGE;
  const { setShortAddress } = useOutletContext();

  useEffect(() => {
    if (projectData?.shortAddress) {
      setShortAddress(projectData.shortAddress); // 🔹 Update shortAddress in AppLayout
    }
  }, [projectData, setShortAddress]);

  const defaultFaqs = [
    {
      question: "Why choose Invest Mango?",
      answer:
        "Invest Mango works as one team with a common purpose to provide best-in-class services, thoroughly understands the changing needs of its clients. We are client-centric as client is the focal point of Invest Mango. We provide advice and recommendations that are in the client’s best interest. We strive to understand the client’s requirement by entering into his shoes and offer advice which have far reaching impact. A happy client is what makes us happy and we are proud to serve our client’s.",
    },
    {
      question: "How much is the total size of {{projectData.name}}?",
      answer: "{{projectData.area}}.",
    },
    {
      question: "What is the project location?",
      answer: "{{projectData.shortAddress}}.",
    },
  ];

  const injectProjectData = (template, data) => {
    return template
      .replace(/{{projectData\.name}}/g, data?.name || "")
      .replace(/{{projectData\.shortAddress}}/g, data?.shortAddress || "")
      .replace(/{{projectData\.area}}/g, data?.area || "");
  };

  const displayedFaqs =
    Array.isArray(sortedFaqs) && sortedFaqs.length > 0
      ? sortedFaqs
      : defaultFaqs.map((faq) => ({
          question: injectProjectData(faq.question, projectData),
          answer: injectProjectData(faq.answer, projectData),
        }));

  return (
    <>
      {projectData && (
        <Helmet>
          <title>{projectData.metaTitle || "Default Title"}</title>
          <meta
            name="description"
            content={projectData.metaDesciption || "Default Description"}
          />
          <meta
            name="metaKeywords"
            content={
              projectData.metaKeywords
                ?.filter((k) => k.trim() !== "")
                .join(", ") || "default, keywords"
            }
          />
          <link rel="canonical" href={window.location.href} />
          {/* Inject Multiple Schema Scripts */}
          {schemas.length > 0 &&
            schemas.map((schema, index) => (
              <script key={index} type="application/ld+json">
                {JSON.stringify(schema)}
              </script>
            ))}
        </Helmet>
      )}
      {/* {projectData && (
      <div >
      <Header shortAddress={projectData?.shortAddress} />
      </div>
    )} */}
      {/* {projectData && (
      <div className="container-fluid p-0">
      <h1>Helo</h1>
      {projectData?.shortAddress}
      </div> */}

      <div className="w-100">
        <div className="container-fluid p-0 mb-0 w-100">
          {/* Gallery Section */}
          <div className="row mx-0 g-0" style={{ padding: "0.5px" }}>
            {projectData &&
              projectData.images &&
              projectData.images.length > 0 && (
                <>
                  {/* Main Image - Full width on mobile, half width on desktop */}
                  <div className="col-12 col-md-6 p-0 pe-0 pe-md-0 pb-md-0">
                    {projectData?.images[0] && (
                      <div
                        className="h-100 d-flex align-items-center justify-content-center"
                        style={{
                          minHeight: "184px",
                          maxHeight: "700px",
                          padding: ".5px",
                        }}
                      >
                        <a
                          href={projectData?.images[0]?.imageUrl}
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
                            alt={projectData?.images[0]?.caption || "Image"}
                            src={projectData?.images[0]?.imageUrl}
                            loading="lazy"
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
                          projectData?.images[index] && (
                            <div
                              key={index}
                              className="col-3 col-md-6"
                              style={{ height: "270px" }}
                            >
                              <a
                                href={projectData?.images[index]?.imageUrl}
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
                                  alt={
                                    projectData?.images[index]?.caption ||
                                    "Image"
                                  }
                                  src={projectData?.images[index]?.imageUrl}
                                  loading="lazy"
                                  className="w-100 h-100 rounded-0"
                                  style={{
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    padding: ".5px",
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
          {showFullScreen && projectData?.images && (
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
                  src={projectData?.images[currentImageIndex]?.imageUrl}
                  alt={
                    projectData?.images[currentImageIndex]?.caption ||
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
                      prev === 0 ? projectData?.images?.length - 1 : prev - 1
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
                      prev === projectData?.images?.length - 1 ? 0 : prev + 1
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
                "price",
                "payment_plan",
                "amenities",
                "video",
                "location",
                "siteplan",
                "developer",
                "FAQs",
                "similar_projects",
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
                      if (!element) return; // ✅ Prevent error if element doesn't exist
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
                    "price",
                    "payment_plan",
                    "amenities",
                    "video",
                    "location",
                    "siteplan",
                    "developer",
                    "FAQs",
                    "similar_projects",
                  ].map((item) => (
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
                  <div
                    className="mb-2 mb-md-0 me-md-3 text-center text-md-start"
                    style={{
                      maxWidth: "90px",
                      border: "1px solid grey",
                      height: "66px",
                    }}
                  >
                    <img
                      src={projectData?.projectLogo || "defaultLogo.jpg"}
                      alt={projectData?.projectLogo || "Project Logo"}
                      loading="lazy"
                      className="img-fluid"
                      style={{
                        maxWidth: "80px",
                        height: "64px",
                      }}
                    />
                  </div>
                  <div className="text-center text-md-start">
                    <h1
                      className="h3 mb-0 text-center text-md-start"
                      style={{ fontSize: "20px" }}
                    >
                      {projectData?.name || "Project Name"}
                    </h1>
                    <p className="mb-0" style={{ fontSize: "11px" }}>
                      {projectData?.shortAddress || "Project Address"}
                    </p>
                    <span style={{ fontSize: "13px" }}>
                      By{" "}
                      <a
                        href={projectData?.developerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {projectData?.developerName || "Developer Name"}
                      </a>
                    </span>
                  </div>
                </div>

                {/* Lower Section - Buttons */}
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start position-relative">
                  {/* RERA Badge */}
                  <span
                    className="badge bg-primary"
                    style={{
                      padding: "6px 10px",
                      fontSize: "12px",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                      backgroundColor: "#2067d1",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setShowReraDetails(true)}
                    // onMouseLeave={() => setShowReraDetails(false)}
                  >
                    Rera
                  </span>

                  {/* RERA Details Popup */}
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
                        padding: "15px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        borderRadius: "6px",
                        minWidth: "350px",
                        maxWidth: "90vw",
                        overflowX: "auto",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-0">
                        <h6
                          className="m-0"
                          style={{ fontWeight: 700, fontSize: "14px" }}
                        >
                          RERA Details
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
                        <span style={{ fontSize: "10px", color: "black" }}>
                          Website Link
                          <a
                            href={projectData?.reraLink || "N/A"}
                            target="_blank"
                          >
                            {" "}
                            {projectData?.reraLink || "N/A"}
                          </a>
                        </span>
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: "40%",
                                  textAlign: "left",
                                  fontSize: "12px",
                                  color: "black",
                                  fontWeight: 500,
                                  border: "none",
                                  backgroundColor: "white",
                                  padding: "8px",
                                }}
                              >
                                Phase
                              </th>
                              <th
                                style={{
                                  width: "30%",
                                  textAlign: "left",
                                  fontSize: "12px",
                                  padding: "8px",
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
                                  width: "30%",
                                  textAlign: "left",
                                  fontSize: "12px",
                                  padding: "8px",
                                  color: "black",
                                  fontWeight: 500,
                                  border: "none",
                                  backgroundColor: "white",
                                }}
                              >
                                RERA Number
                              </th>
                              <th
                                style={{
                                  width: "30%",
                                  textAlign: "left",
                                  fontSize: "12px",
                                  padding: "8px",
                                  color: "black",
                                  fontWeight: 500,
                                  border: "none",
                                  backgroundColor: "white",
                                }}
                              >
                                RERA QR
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reraDetails.length > 0 ? (
                              reraDetails.map((item, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      padding: "10px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {item.phase?.join(", ") || "-"}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      padding: "10px",
                                    }}
                                  >
                                    {item.status || "-"}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      padding: "10px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item.reraNumber || "-"}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      padding: "10px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item.qrImages?.length > 0 ? (
                                      <img
                                        src={item.qrImages || "-"}
                                        alt="qrImage"
                                        style={{
                                          height: "200",
                                          width: "200%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <span>N/A</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="3"
                                  style={{
                                    textAlign: "center",
                                    padding: "10px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "gray",
                                  }}
                                >
                                  No RERA data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Additional Badges */}
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
                  style={{ fontSize: "16px" }}
                >
                  Project Price
                </p>
                <h2
                  className="h2 mb-0 fw-bold text-center text-md-end"
                  style={{ fontSize: "25px", fontWeight: "800" }}
                >
                  ₹{" "}
                  {formatPrice(
                    getLeastPriceOfFloorPlan(
                      projectData?.floorplans?.filter((plan) => plan.price > 1)
                    )
                  )}{" "}
                  - ₹{" "}
                  {formatPrice(
                    getHighestPriceOfFloorPlan(projectData?.floorplans)
                  )}
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
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    Project Details
                  </h2>
                  <div className="px-3">
                    <p
                      className="mb-2 mb-md-4"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      }}
                    >
                      {projectData?.overviewPara && (
                        <div
                          className="project-description"
                          dangerouslySetInnerHTML={{
                            __html: projectData.overviewPara,
                          }}
                        />
                      )}
                    </p>

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
                              Project Area
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
                              {projectData?.area}
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
                              {projectData?.floorplans &&
                              projectData.floorplans.length > 0
                                ? `${Math.min(
                                    ...projectData.floorplans.map(
                                      (fp) => fp.size
                                    )
                                  )} - ${Math.max(
                                    ...projectData.floorplans.map(
                                      (fp) => fp.size
                                    )
                                  )} Sq. Ft.`
                                : "Size not available"}
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
                              Project Units
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
                              {projectData?.units}
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
                              Launch Date
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
                              {projectData?.launchDate
                                ?.toLowerCase()
                                .includes("coming")
                                ? "Coming Soon"
                                : projectData?.launchDate
                                ? new Date(
                                    isNaN(projectData.launchDate)
                                      ? projectData.launchDate
                                      : Number(projectData.launchDate)
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                  })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-4 mt-2 mt-md-4">
                        <div className="d-flex align-items-center flex-column flex-md-row">
                          <FontAwesomeIcon
                            icon={faGavel}
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
                              Possession Date
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
                              {projectData?.possessionDate
                                ?.toLowerCase()
                                .includes("coming")
                                ? "Coming Soon"
                                : projectData?.possessionDate
                                ? new Date(
                                    isNaN(projectData.possessionDate)
                                      ? projectData.possessionDate
                                      : Number(projectData.possessionDate)
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                  })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {projectData?.totalTowers && (
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
                                Total Towers
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
                                {projectData?.totalTowers || ""} Towers
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {projectData?.totalFloor && (
                        <div className="col-6 col-md-4 mt-2 mt-md-4">
                          <div className="d-flex align-items-center flex-column flex-md-row">
                            <FontAwesomeIcon
                              icon={faBars}
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
                                Total Floors
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
                                {projectData?.totalFloor} Floors
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

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
                              Project Status
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
                              {projectData?.status
                                ?.toLowerCase() // Convert to lowercase
                                ?.replace(/_/g, " ") // Replace underscores with spaces
                                ?.replace(/\b\w/g, (char) =>
                                  char.toUpperCase()
                                )}
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
                              Property Type
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
                              {projectData?.configurationsType?.propertyType &&
                                projectData.configurationsType.propertyType
                                  .toLowerCase()
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-4 mt-2 mt-md-4">
                        <div className="d-flex align-items-center flex-column flex-md-row">
                          <FontAwesomeIcon
                            icon={faHouseUser}
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
                              className="mb-0 fw-normal fw-md-bolder text-break"
                              style={{
                                color: "#000",
                                fontSize:
                                  window.innerWidth <= 768 ? "12px" : "13px",
                                marginTop: "2px",
                              }}
                            >
                              {projectData?.configurations
                                ?.map((item) => item.toUpperCase()) // Ensure consistent casing
                                ?.filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                ) // Remove duplicates
                                ?.sort((a, b) => parseFloat(a) - parseFloat(b)) // Sort numerically based on the number
                                ?.join(", ")}
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
                              RERA Number
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
                              {projectData?.rera}
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
                    <p
                      className="mb-3 py-2 fw-bold text-white ps-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                        backgroundColor: "#2067d1",
                        borderRadius: "4px 4px 0 0",
                      }}
                    >
                      Connect to Our Expert
                    </p>
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
                          <select
                            name="userType"
                            className="form-select"
                            // style={{ maxWidth: "150px" }}
                            value={formData.userType} // Ensure this is in your state
                            onChange={handleChange}
                          >
                            <option value="">Select Role</option>
                            <option value="Associate">Associate</option>
                            <option value="Builder">Builder</option>
                            <option value="Broker">Broker</option>
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>
                          </select>
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
                            {projectData?.configurations
                              ?.slice()
                              .sort((a, b) => {
                                const numA = parseFloat(a) || 0; // Extract numeric part
                                const numB = parseFloat(b) || 0;

                                return numA - numB; // Sort numerically
                              })
                              .map((config, index) => (
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
                      projectName={projectData?.name || "Invest Mango"}
                      brochure={projectData?.brochure}
                    />
                  </div>
                </div>
              )}
              {/* Why to choose */}
              <div
                className="mb-4"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                id="why-choose"
              >
                <div className="">
                  <div className="">
                    <div className="">
                      <h2
                        className="mb-0  py-2 fw-bold text-white ps-3"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                          backgroundColor: "#2067d1",
                          borderRadius: "4px 4px 0 0",
                        }}
                      >
                        Why to choose {projectData?.name}?
                      </h2>
                      <div
                        className="px-3"
                        style={{
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          borderRadius: "4px",
                          padding: "20px",
                        }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row g-1">
                              {/* First row with single image */}
                              {projectData?.images &&
                                projectData?.images[0] && (
                                  <div className="col-12 mb-1">
                                    {/* <a
                                      href={projectData?.images[0].imageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="d-block"
                                    > */}
                                    <img
                                      alt={
                                        projectData?.images[0].caption ||
                                        "Project Image 1"
                                      }
                                      src={projectData?.images[0].imageUrl}
                                      loading="lazy"
                                      className="img-fluid rounded w-100"
                                      style={{
                                        height:
                                          window.innerWidth <= 768
                                            ? "200px"
                                            : "185px",
                                        objectFit: "cover",
                                        borderRadius: "16px",
                                      }}
                                      fetchpriority="high"
                                    />
                                    {/* </a> */}
                                  </div>
                                )}

                              {/* Second row with two images */}
                              <div className="col-12">
                                <div className="row g-2">
                                  {projectData?.images &&
                                    projectData?.images
                                      ?.slice(1, 3)
                                      .map((image, index) => (
                                        <div className="col-6" key={index + 1}>
                                          <a
                                            href={image.imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-block"
                                          >
                                            <img
                                              alt={
                                                image.caption ||
                                                `Project Image ${index + 2}`
                                              }
                                              src={image.imageUrl}
                                              loading="lazy"
                                              className="img-fluid rounded w-100"
                                              style={{
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "16px",
                                              }}
                                              fetchpriority="high"
                                            />
                                          </a>
                                        </div>
                                      ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div
                              className="row g-4"
                              style={{
                                marginTop:
                                  window.innerWidth <= 768 ? "5px" : "0",
                              }}
                            >
                              {projectData?.usps &&
                                projectData?.usps?.map((usp, idx) => (
                                  <div className="col-6" key={idx}>
                                    <div className="d-flex align-items-start">
                                      <img
                                        className="me-2"
                                        src="/images/usp-icon.svg"
                                        loading="lazy"
                                        style={{
                                          height:
                                            window.innerWidth <= 768
                                              ? "24px"
                                              : "30px",
                                          marginTop:
                                            window.innerWidth <= 768
                                              ? "2px"
                                              : "0",
                                        }}
                                        fetchpriority="high"
                                        alt={`USP Icon ${idx + 1}`}
                                      />
                                      <span
                                        style={{
                                          fontSize:
                                            window.innerWidth <= 768
                                              ? "10px"
                                              : "14px",
                                          lineHeight:
                                            window.innerWidth <= 768
                                              ? "1.2"
                                              : "normal",
                                        }}
                                      >
                                        {usp}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div
                              className="row mt-4"
                              style={{
                                position:
                                  window.innerWidth <= 768
                                    ? "static"
                                    : "relative",
                                bottom: window.innerWidth <= 768 ? "auto" : 0,
                                left: 0,
                                right: 0,
                                margin: "0 12px",
                              }}
                            >
                              <div className="col-12">
                                <a
                                  // href="#form_side"
                                  className="btn w-100 py-1"
                                  style={{
                                    backgroundColor: "#2067d1",
                                    color: "#fff",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#1854b0";
                                    e.target.style.transition =
                                      "background-color 0.3s";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#2067d1";
                                  }}
                                  onClick={handleSitePopup} // Trigger popup on button click
                                >
                                  Book Your Site Visit
                                </a>
                              </div>

                              {/* Floor Plan Dialog Popup */}
                              <PopupDialog
                                open={showSitePopup} // Use state to control visibility
                                onClose={closeSitePopup} // Close popup when necessary
                                projectName={
                                  projectData?.name || "Invest Mango"
                                } // Set project name or default
                              />
                              <div className="col-12 mt-2">
                                <a
                                  href={`tel:+91${
                                    projectData?.locality?.city
                                      ?.phoneNumber?.[0] || "8595189189"
                                  }`}
                                  className="btn w-100 py-1"
                                  style={{
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    border: "1px solid #000",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#2067d1";
                                    e.target.style.color = "#fff";
                                    e.target.style.transition = "all 0.3s";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#fff";
                                    e.target.style.color = "#000";
                                  }}
                                >
                                  Connect to Our Expert
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    Know About {projectData?.name}
                  </h2>
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
                          letterSpacing: "0.5px", // Slight letter spacing for better clarity
                        }}
                      >
                        {projectData?.about && (
                          <div
                            className="project-description"
                            dangerouslySetInnerHTML={{
                              __html: projectData.about,
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
                          onClick={
                            isMobileView
                              ? handleDownloadBrochuree
                              : handleDownloadBrochure
                          } // Use the correct handler based on screen size
                          // onClick={handleDownloadBrochure} // Trigger for brochure popup
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
                          {projectData?.name} brochure
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
              {/* Floor Plan */}
              <div
                className="mb-4"
                id="floor"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <div className="p-0 pb-2">
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {projectData?.name} Floor Plan
                  </h2>
                  <div className="px-3">
                    <p
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(projectData?.floorPara),
                      }}
                    >
                      {/* {projectData?.floorPara} */}
                    </p>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`btn ${
                          activeFilter === "all" ? "btn-primary" : ""
                        }`}
                        style={{
                          border: "2px solid #000",
                          borderRadius: "15px",
                          padding:
                            window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                          fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                          fontWeight: "600",
                          backgroundColor:
                            activeFilter === "all" ? "rgb(32, 103, 209)" : "",
                        }}
                      >
                        All
                      </button>
                      {projectData?.configurations
                        ?.slice()
                        .sort((a, b) => {
                          const numA = parseFloat(a) || 0; // Extract numeric part
                          const numB = parseFloat(b) || 0;
                          return numA - numB; // Sort in ascending order
                        })
                        .map((config, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveFilter(config)}
                            className={`btn ${
                              activeFilter === config ? "btn-primary" : ""
                            }`}
                            style={{
                              border: "2px solid #000",
                              borderRadius: "15px",
                              padding:
                                window.innerWidth <= 768
                                  ? "2px 5px"
                                  : "5px 15px",
                              fontSize:
                                window.innerWidth <= 768 ? "10px" : "14px",
                              fontWeight: "600",
                              backgroundColor:
                                activeFilter === config
                                  ? "rgb(32, 103, 209)"
                                  : "",
                            }}
                          >
                            {config}
                          </button>
                        ))}
                    </div>
                    <Carousel
                      responsive={{
                        superLargeDesktop: {
                          breakpoint: { max: 4000, min: 3000 },
                          items: 3,
                          slidesToSlide: 1,
                        },
                        desktop: {
                          breakpoint: { max: 3000, min: 1024 },
                          items: 2,
                          slidesToSlide: 1,
                        },
                        tablet: {
                          breakpoint: { max: 1024, min: 464 },
                          items: 1,
                          slidesToSlide: 1,
                        },
                        mobile: {
                          breakpoint: { max: 464, min: 0 },
                          items: 1,
                          slidesToSlide: 1,
                        },
                      }}
                      infinite={false}
                      containerClass="carousel-container"
                      itemClass="carousel-item-padding-40-px"
                      style={{ width: "60%", margin: "0 auto" }}
                    >
                      {(() => {
                        const filteredPlans = projectData?.floorplans || [];
                        const filtered = filteredPlans.filter(
                          (plan) =>
                            activeFilter === "all" ||
                            plan.projectConfigurationName === activeFilter
                        );

                        // Sort based on numeric BHK values (e.g., 2 BHK, 3 BHK, etc.)
                        const sortedPlans = filtered.sort((a, b) => {
                          const sizeA = parseFloat(a.size);
                          const sizeB = parseFloat(b.size);
                          return sizeA - sizeB;
                        });

                        return sortedPlans.map((plan, index) => (
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
                              <div className="card-body p-3">
                                <p
                                  className="mb-3"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 768
                                        ? "14px"
                                        : "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {plan.title}
                                </p>
                                <img
                                  src={
                                    plan.imageUrl &&
                                    plan.imageUrl !== BASE_URL &&
                                    plan.imageUrl !== ""
                                      ? plan.imageUrl
                                      : "/images/Floor.png" // Fallback image in other cases
                                  }
                                  alt={`${plan.type} Floor Plan`}
                                  loading="lazy"
                                  className="img-fluid mb-3"
                                  style={{ width: "100%" }}
                                  onClick={() =>
                                    handleImageClick(plan.imageUrl)
                                  } // Add click handler to open the popup
                                />
                                <div className="row mb-3">
                                  <div className="col-6">
                                    <small
                                      className="text-muted"
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "11px"
                                            : "12px",
                                      }}
                                    >
                                      Builtup Area
                                    </small>
                                    <p
                                      className="mb-0"
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "13px"
                                            : "14px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {plan.size} sq.ft
                                    </p>
                                  </div>
                                  <div className="col-6">
                                    <small
                                      className="text-muted"
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "11px"
                                            : "12px",
                                      }}
                                    >
                                      Price
                                    </small>
                                    <p
                                      className="mb-0"
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "13px"
                                            : "14px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {formatPrice(plan.price)}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex flex-column gap-2 align-items-center">
                                  <a
                                    href={`tel:+91${
                                      projectData?.locality?.city
                                        ?.phoneNumber?.[0] || "8595189189"
                                    }`}
                                    className="btn btn-primary w-100"
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 768
                                          ? "12px"
                                          : "14px",
                                      backgroundColor: "rgb(32, 103, 209)",
                                    }}
                                  >
                                    Talk to our Expert
                                  </a>
                                  <button
                                    onClick={handleDownloadFloorPlan}
                                    className="btn btn-outline-primary w-100"
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 768
                                          ? "12px"
                                          : "14px",
                                      margin: "0px",
                                    }}
                                  >
                                    Download Floor Plan
                                  </button>

                                  {/* Floor Plan Dialog Popup */}

                                  <BrochurePopupDialog
                                    open={showFloorPlanPopup}
                                    onClose={closeFloorPlanPopup}
                                    projectName={
                                      projectData?.name || "Invest Mango"
                                    }
                                    brochure={projectData?.brochure}
                                  />
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
                            // maxHeight: '40%',
                          }}
                        >
                          <img
                            src={
                              selectedImage &&
                              selectedImage !== BASE_URL &&
                              selectedImage !== ""
                                ? selectedImage
                                : "/images/Floor.png" // Fallback image when no image is available
                            }
                            alt="Floor Plan"
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "8px",
                            }}
                          />
                          <button
                            onClick={closeImagePopup}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              // backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    <style>
                      {`
              .carousel-container {
                  position: relative;
              }
              .react-multiple-carousel__arrow {
                  background-color: #2067d1;
                  height: 35px;
                  width: 35px;
                  min-width: 35px;
                  min-height: 35px;
                  border-radius: 50%;
                  padding-right: 15px;
                  padding-left: 15px;
              }
              .react-multiple-carousel__arrow--left {
                  left: -10px;
              }
              .react-multiple-carousel__arrow--right {
                  right: -10px;
              }
            `}
                    </style>
                  </div>
                </div>
              </div>
              {/* Price List */}
              <div
                className="mb-4"
                id="price"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <div className="p-0 pb-2">
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {projectData?.name} Price List
                  </h2>
                  <div className="px-3">
                    <p
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                      }}
                    >
                      {/* {projectData?.priceListPara} */}
                      <div className="px-3">
                        <p
                          className="mb-3"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "12px" : "16px",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              projectData?.priceListPara
                            ),
                          }}
                        />
                      </div>
                    </p>
                    <div
                      style={{
                        // overflowX: "auto",
                        // maxHeight: "400px",
                        // overflowY: "auto",
                        width: "100%",
                        overflowX: "auto", // Horizontal scroll if needed
                        overflowY: "hidden", // No vertical scroll
                      }}
                    >
                      <table
                        className="table table-striped"
                        style={{
                          minWidth: window.innerWidth <= 768 ? "100%" : "auto",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                                padding:
                                  window.innerWidth <= 768 ? "8px 4px" : "8px",
                                fontWeight: "bold",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#fff",
                                zIndex: 1,
                              }}
                            >
                              Configuration
                            </th>
                            <th
                              scope="col"
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                                padding:
                                  window.innerWidth <= 768 ? "8px 4px" : "8px",
                                fontWeight: "bold",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#fff",
                                zIndex: 1,
                              }}
                            >
                              Size
                            </th>
                            <th
                              scope="col"
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                                padding:
                                  window.innerWidth <= 768 ? "8px 4px" : "8px",
                                fontWeight: "bold",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#fff",
                                zIndex: 1,
                              }}
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectData?.floorplans &&
                            projectData.floorplans
                              .slice() // Create a copy to avoid mutating the original array
                              .sort((a, b) => a.size - b.size) // Sort in ascending order based on size
                              .map((plan, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 768
                                          ? "11px"
                                          : "14px",
                                      padding:
                                        window.innerWidth <= 768
                                          ? "8px 4px"
                                          : "8px",
                                    }}
                                  >
                                    {plan.title}
                                  </td>
                                  <td
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 768
                                          ? "11px"
                                          : "14px",
                                      padding:
                                        window.innerWidth <= 768
                                          ? "8px 4px"
                                          : "8px",
                                    }}
                                  >
                                    {plan.size} sq ft
                                  </td>
                                  <td
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 768
                                          ? "11px"
                                          : "14px",
                                      padding:
                                        window.innerWidth <= 768
                                          ? "8px 4px"
                                          : "8px",
                                    }}
                                  >
                                    {!plan.isSoldOut
                                      ? formatPrice(plan.price)
                                      : "Sold Out"}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Get Free Consultation */}
              <div
                className="py-3 px-3 mb-4"
                role="alert"
                style={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  backgroundColor: "#40433e",
                  color: "#ffffff",
                  borderTop: "1px solid #686060",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                Get Free Consultation for this property. Call us at:{" "}
                <a
                  href={`tel:+91${
                    projectData?.locality?.city?.phoneNumber?.[0] ||
                    "8595189189"
                  }`}
                  style={{ color: "#ffffff", textDecoration: "underline" }}
                >
                  {`+91-${
                    projectData?.locality?.city?.phoneNumber?.[0] ||
                    "8595-189-189"
                  }`}
                </a>
              </div>
              {/* Payment Plan */}
              {projectData?.paymentPlans?.length > 0 && (
                <div
                  className="mb-4"
                  id="payment_plan"
                  style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                >
                  <div className="p-0 pb-2">
                    <h2
                      className="mb-3 py-2 fw-bold text-white ps-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                        backgroundColor: "#2067d1",
                        borderRadius: "4px 4px 0 0",
                      }}
                    >
                      {projectData?.name} Payment Plan
                    </h2>
                    <div className="p-3">
                      <p
                        className="mb-3"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                        }}
                      >
                        {/* {projectData?.paymentPara} */}
                        {projectData?.paymentPara && (
                          <p
                            className="mb-3"
                            style={{
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "16px",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                projectData?.paymentPara
                              ),
                            }}
                          />
                        )}
                      </p>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <tbody>
                            {projectData?.paymentPlans &&
                              [...projectData?.paymentPlans]
                                .sort((a, b) => a.id - b.id) // Sort by id in ascending order
                                .map((plan, index) => (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "11px"
                                            : "14px",
                                        padding:
                                          window.innerWidth <= 768
                                            ? "8px 4px"
                                            : "8px",
                                      }}
                                    >
                                      {plan?.planName}
                                    </td>
                                    <td
                                      style={{
                                        fontSize:
                                          window.innerWidth <= 768
                                            ? "11px"
                                            : "14px",
                                        padding:
                                          window.innerWidth <= 768
                                            ? "8px 4px"
                                            : "8px",
                                      }}
                                    >
                                      {plan?.details}
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* )} */}
              {/* Amenities */}
              <div
                className="mb-4"
                id="amenities"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <div className="p-0 pb-2">
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {projectData?.name} Amenities
                  </h2>
                  <div className="px-3">
                    {projectData?.amenitiesPara && (
                      <p
                        className="mb-3"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: projectData.amenitiesPara,
                        }}
                      />
                    )}

                    <div
                      className="inner-item"
                      style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      {processAmenities().map((category, categoryIndex) => (
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
                            {category.assets.map((amenity, index) => (
                              <div key={index} className="col-6 col-md-3">
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 768
                                        ? "11px"
                                        : "14px",
                                    marginBottom: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <img
                                    src={amenity.icon}
                                    alt={amenity.name}
                                    loading="lazy"
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
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    Video Presentation of {projectData && projectData?.name}
                  </h2>
                  <div className="px-3">
                    {projectData?.videoPara && (
                      <p
                        className="mb-3 mb-md-5"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: projectData.videoPara,
                        }}
                      />
                    )}

                    <div className="d-flex flex-column">
                      {projectData?.videos &&
                      projectData.videos.length > 0 &&
                      projectData.videos.some(
                        (videoUrl) => videoUrl.trim() !== ""
                      ) ? (
                        projectData.videos.map(
                          (videoUrl, index) =>
                            videoUrl.trim() !== "" && ( // Ignore empty strings
                              <div
                                key={index}
                                className="ratio ratio-16x9 mb-3"
                              >
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1&origin=${window.location.origin}`}
                                  title={`${
                                    projectData?.name
                                  } Video Presentation ${index + 1}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  style={{
                                    border: "none",
                                    borderRadius: "8px",
                                  }}
                                ></iframe>
                              </div>
                            )
                        )
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
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Advantage */}
              {/* <div
                className="mb-4"
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
                    {projectData?.name} Location Advantage
                  </h4>
                  <div className="px-3">
                    <div className="inner-item">
                      <div
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                        }}
                      >
                        {projectData?.locationPara ? (
                          <div
                            style={{ padding: "0px 10px" }}
                            dangerouslySetInnerHTML={{
                              __html: projectData.locationPara,
                            }}
                          />
                        ) : (
                          <p style={{ padding: "0px 10px", color: "gray" }}>
                            {projectData?.name} Location Advantage Not Available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
                  {projectData?.name} Location Map
                </h2>
                <div className="row">
                  <div className="col-12">
                    <div
                      className="mb-4 px-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}
                    >
                      {projectData?.locationMap && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: projectData.locationMap,
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
                        src={projectData?.locationUrl}
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
              {/* Site Plan */}
              <div className="bg-white rounded-3 mb-4" id="siteplan">
                <h2
                  className="mb-4"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                    color: "#ffffff",
                    fontWeight: "bold",
                    textAlign: "left",
                    backgroundColor: "#2067d1",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                >
                  {projectData?.name} Site Plan
                </h2>
                <div className="row">
                  <div className="col-12">
                    <p
                      className="mb-4 px-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                      }}
                    >
                      {projectData?.siteplanPara && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: projectData.siteplanPara,
                          }}
                        />
                      )}
                    </p>

                    <div className="position-relative px-3">
                      <div
                        className="position-relative"
                        style={{
                          overflow: "hidden",
                          height: window.innerWidth <= 768 ? "200px" : "400px",
                        }}
                      >
                        <div
                          id="image-container"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            className="img-fluid"
                            id="zoom-image"
                            alt={`${projectData?.name} Site Plan`}
                            src={imageSrc}
                            loading="lazy"
                            fetchpriority="high"
                            style={{
                              transform: "scale(1) translate(0px, 0px)",
                              transition: "transform 0.3s ease-in-out",
                              position: "absolute",
                              maxWidth: "100%",
                              cursor: "grab",
                            }}
                            onClick={openModal} // Open modal on image click
                            onMouseDown={(e) => {
                              const img = e.target;
                              img.style.cursor = "grabbing";
                              let lastX = e.clientX;
                              let lastY = e.clientY;

                              const onMouseMove = (moveEvent) => {
                                const deltaX = moveEvent.clientX - lastX;
                                const deltaY = moveEvent.clientY - lastY;
                                lastX = moveEvent.clientX;
                                lastY = moveEvent.clientY;

                                const transform = img.style.transform;
                                const scale = parseFloat(
                                  transform.match(/scale\((.*?)\)/)[1]
                                );
                                const [translateX, translateY] = transform
                                  .match(/translate\((.*?), (.*?)\)/)
                                  ?.slice(1)
                                  .map(parseFloat) || [0, 0];

                                // Only allow movement if zoomed in
                                if (scale > 1) {
                                  img.style.transform = `scale(${scale}) translate(${
                                    translateX + deltaX
                                  }px, ${translateY + deltaY}px)`;
                                }
                              };

                              const onMouseUp = () => {
                                img.style.cursor = "grab";
                                document.removeEventListener(
                                  "mousemove",
                                  onMouseMove
                                );
                                document.removeEventListener(
                                  "mouseup",
                                  onMouseUp
                                );
                              };

                              document.addEventListener(
                                "mousemove",
                                onMouseMove
                              );
                              document.addEventListener("mouseup", onMouseUp);
                            }}
                          />
                        </div>
                      </div>
                      <div className="position-absolute top-0 end-0">
                        <button
                          className="d-block border-0 mb-1"
                          id="zoom-in"
                          aria-label="Zoom In"
                          style={{
                            background: "#dddd",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            color: "#000",
                          }}
                          onClick={() => {
                            const img = document.getElementById("zoom-image");
                            const currentScale = parseFloat(
                              img.style.transform.match(/scale\((.*?)\)/)[1]
                            );
                            const [translateX, translateY] = img.style.transform
                              .match(/translate\((.*?), (.*?)\)/)
                              ?.slice(1)
                              .map(parseFloat) || [0, 0];
                            img.style.transform = `scale(${Math.min(
                              3,
                              currentScale * 1.2
                            )}) translate(${translateX}px, ${translateY}px)`;
                          }}
                        >
                          +
                        </button>
                        <button
                          className="d-block border-0"
                          id="zoom-out"
                          aria-label="Zoom Out"
                          style={{
                            background: "#dddd",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            color: "#000",
                          }}
                          onClick={() => {
                            const img = document.getElementById("zoom-image");
                            const currentScale = parseFloat(
                              img.style.transform.match(/scale\((.*?)\)/)[1]
                            );
                            const [translateX, translateY] = img.style.transform
                              .match(/translate\((.*?), (.*?)\)/)
                              ?.slice(1)
                              .map(parseFloat) || [0, 0];
                            img.style.transform = `scale(${Math.max(
                              1,
                              currentScale / 1.2
                            )}) translate(${translateX}px, ${translateY}px)`;
                          }}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal for displaying the image in full view */}
                {isModalOpen && (
                  <div
                    className="modal d-block"
                    id="siteplan-modal"
                    style={{
                      display: "block",
                      position: "fixed",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      zIndex: "1000",
                      overflow: "auto",
                      paddingTop: "60px",
                    }}
                    onClick={closeModal} // Close modal when clicking outside the image
                  >
                    <div
                      className="modal-content"
                      style={{
                        margin: "auto",
                        padding: "20px",
                        backgroundColor: "#fff",
                        maxWidth: "60%",
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside it
                    >
                      <img
                        src={
                          imageSrc
                          // projectData?.siteplanImg
                          //   ? projectData.siteplanImg === BASE_URL
                          //     ? FALLBACK_IMAGE
                          //     : projectData.siteplanImg
                          //   : FALLBACK_IMAGE
                        }
                        alt={`${projectData?.name} Site Plan`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                      <button
                        className="btn btn-close"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#000",
                          color: "#fff",
                          border: "none",
                          borderRadius: "70%",
                          padding: "10px 10px",
                        }}
                        onClick={closeModal} // Close modal on button click
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* about group */}
              <div
                className="mb-4"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                id="developer"
              >
                <div className="p-0 pb-2">
                  <h2
                    className="mb-3 py-2 fw-bold text-white ps-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                      backgroundColor: "#2067d1",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    About {developerDetails?.name}
                  </h2>
                  <div className="row px-3">
                    <div className="col-12">
                      <div className="d-flex align-items-center px-3">
                        <img
                          src={developerDetails?.logo}
                          className="img-fluid me-3"
                          alt={developerDetails?.altLogo}
                          loading="lazy"
                          style={{ maxWidth: "90px", border: "1px solid grey" }}
                          fetchpriority="high"
                        />
                        <p
                          className="mb-0"
                          style={{
                            fontSize:
                              window.innerWidth <= 768 ? "12px" : "14px",
                          }}
                        >
                          ESTABLISHED IN -{" "}
                          <b>{developerDetails?.establishedYear}</b>
                          <br />
                          TOTAL PROJECTS -{" "}
                          <b>{developerDetails?.totalProjects}+</b>
                        </p>
                      </div>

                      <div
                        className="mb-4"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                        }}
                      >
                        {developerDetails?.about && (
                          <>
                            <div
                              className="project-description"
                              dangerouslySetInnerHTML={{
                                __html:
                                  expandedIndex === "about"
                                    ? developerDetails.about
                                        .replace(
                                          /<ul>/g,
                                          '<ul style="padding-left: 20px; margin-top: 10px;">'
                                        )
                                        .replace(
                                          /<li>/g,
                                          '<li style="font-size: 1em; color: #666;">'
                                        ) // Adds inline styles to <li>
                                    : developerDetails.about.substring(0, 150) +
                                      "...",
                              }}
                            />
                            <button
                              onClick={() =>
                                setExpandedIndex(
                                  expandedIndex === "about" ? null : "about"
                                )
                              }
                              className="btn btn-link p-0 read-more-btn"
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "12px" : "14px",
                                color: "#2067d1", // Set the text color
                                textDecoration: "none", // Remove underline
                                fontWeight: "bold", // Make the text bold
                                transition: "color 0.3s ease", // Smooth color transition on hover
                              }}
                            >
                              {expandedIndex === "about"
                                ? "Show Less"
                                : "Read More"}
                            </button>
                          </>
                        )}
                      </div>
                      <h4
                        className="fw-bold mb-3"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "14px" : "18px",
                        }}
                      >
                        Contact Details
                      </h4>

                      <p
                        className="mb-0"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                        }}
                      >
                        <b>{projectData?.name}</b>
                        <br />
                        <b>Address:</b> {projectData?.address}
                        <br />
                        <b>Phone:</b>{" "}
                        <a
                          href={`tel:+91${
                            projectData?.locality?.city?.phoneNumber?.[0] ||
                            "8595189189"
                          }`}
                          style={{
                            textDecoration: "none",
                            color: "#2067d1",
                            fontWeight: "bold",
                          }}
                        >
                          {projectData?.locality?.city?.phoneNumber?.[0] ||
                            "8595-189-189"}
                        </a>
                        <br />
                        <b>Book Your Site Visit</b>{" "}
                        <span
                          style={{
                            cursor: "pointer",
                            color: "#2067d1",
                            fontWeight: 700,
                          }}
                          id="BookBtn3"
                          onClick={
                            isMobileView
                              ? handleDownloadBrochuree
                              : handleDownloadBrochure
                          } // Use the correct handler based on screen size
                          // onClick={handleDownloadBrochure}
                        >
                          Click Here
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Frequently Asked Questions */}
              <div
                className="mb-4"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                id="FAQs"
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
                  <div className="px-3">
                    {displayedFaqs?.map((faq, index) => (
                      <div key={index} className="mb-3">
                        <div
                          className="d-flex justify-content-between align-items-center p-2"
                          style={{
                            backgroundColor:
                              expandedIndex === index ? "#f8f9fa" : "white",
                            cursor: "pointer",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            fontSize:
                              window.innerWidth <= 768 ? "12px" : "13px",
                          }}
                          onClick={() =>
                            setExpandedIndex(
                              expandedIndex === index ? null : index
                            )
                          }
                        >
                          <span className="fw-bold">
                            {faq.text || faq.question}
                          </span>

                          {/* Display cleaned question */}
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
                                __html: DOMPurify.sanitize(faq?.answer),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Similar Projects */}
              <div
                className="mb-4"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                id="similar_projects"
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
                    Similar Projects
                  </h4>
                  <div className="row">
                    <div className="col-md-12">
                      <div style={{ position: "relative" }}>
                        <Carousel
                          containerClass="carousel-container"
                          itemClass="carousel-item-padding-40-px"
                          style={{ width: "100%", margin: "0 auto" }}
                          focusOnSelect={false}
                          responsive={{
                            desktop: {
                              breakpoint: { max: 3000, min: 1024 },
                              items: 4,
                              slidesToSlide: 1,
                            },
                            tablet: {
                              breakpoint: { max: 1024, min: 464 },
                              items: 2,
                              slidesToSlide: 1,
                            },
                            mobile: {
                              breakpoint: { max: 464, min: 0 },
                              items: 1,
                              slidesToSlide: 1,
                            },
                          }}
                        >
                          {allSimilarProjects &&
                          allSimilarProjects.length > 0 ? (
                            allSimilarProjects.map((project, index) => (
                              <div key={index} className="px-2">
                                <div className="similar_projects_item">
                                  <div style={{ color: "#000" }}>
                                    <a
                                      href={project?.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "#000",
                                        textDecoration: "none",
                                      }}
                                    >
                                      <img
                                        src={project?.images[0]?.imageUrl}
                                        alt={project?.name}
                                        loading="lazy"
                                        style={{
                                          height: "150px",
                                          width: "100%",
                                          objectFit: "cover",
                                          borderRadius: "10px",
                                        }}
                                      />
                                      <p
                                        style={{
                                          color: "#2067d1",
                                          fontWeight: 600,
                                          margin: "10px 0",
                                          fontSize:
                                            window.innerWidth <= 768
                                              ? "14px"
                                              : "16px",
                                          lineHeight: "20px",
                                          minHeight: "45px",
                                        }}
                                      >
                                        {project.name}
                                      </p>
                                    </a>
                                    <div className="project-details">
                                      <p
                                        className="mb-1"
                                        style={{
                                          fontSize:
                                            window.innerWidth <= 768
                                              ? "12px"
                                              : "13px",
                                          color: "#000",
                                        }}
                                      >
                                        <i
                                          className="fas fa-map-marker-alt me-2"
                                          style={{ color: "#2067d1" }}
                                        ></i>
                                        {project?.shortAddress}
                                      </p>
                                      {project?.area && (
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize:
                                              window.innerWidth <= 768
                                                ? "12px"
                                                : "13px",
                                            color: "#000", // Dark color for "Size Info"
                                          }}
                                        >
                                          <i
                                            className="fa fa-bed me-2"
                                            style={{ color: "#2067d1" }}
                                          ></i>
                                          Size Info:{" "}
                                          {project?.configurations &&
                                          project.configurations.length > 0
                                            ? `${
                                                Math.min(
                                                  ...project.configurations.map(
                                                    (config) => parseInt(config)
                                                  )
                                                ) + "BHK"
                                              }`
                                            : ""}
                                        </p>
                                      )}
                                      {project?.floorplans && (
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize:
                                              window.innerWidth <= 768
                                                ? "12px"
                                                : "13px",
                                            color: "#000",
                                          }}
                                        >
                                          Starting ₹
                                          {/* <i className="fas fa-rupee-sign" style={{ color: "#2067d1" }}></i> */}
                                          <b>
                                            {formatPrice(
                                              getLeastPriceOfFloorPlan(
                                                project?.floorplans
                                              )
                                            )}
                                          </b>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div>No similar projects available</div>
                          )}
                        </Carousel>
                        <style>
                          {`
                                    .carousel-container {
                                        position: relative;
                                    }
                                    .react-multiple-carousel__arrow {
                                        background-color: #2067d1;
                                        height: 35px;
                                        width: 35px;
                                        min-width: 35px;
                                        min-height: 35px;
                                        border-radius: 50%;
                                        padding-right: 15px;
                                        padding-left: 15px;
                                    }
                                    @media (max-width: 768px) {
                                        .react-multiple-carousel__arrow {
                                            height: 25px;
                                            width: 25px;
                                            min-width: 25px;
                                            min-height: 25px;
                                            padding-right: 10px;
                                            padding-left: 10px;
                                        }
                                    }
                                    .react-multiple-carousel__arrow--left {
                                        left: -10px;
                                    }
                                    .react-multiple-carousel__arrow--right {
                                        right: -10px;
                                    }
                                    .react-multi-carousel-item  carousel-item-padding-40-px{
                                        padding: 0px 20px;
                                    }
                                    `}
                        </style>
                      </div>
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
                  }}
                >
                  <div className="bg-white rounded-3 mb-4 p-4 pb-0">
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
                          <select
                            name="userType"
                            className="form-select"
                            // style={{ maxWidth: "100px" }}
                            value={formData.userType} // Ensure this is in your state
                            onChange={handleChange}
                          >
                            <option value="">Select Role</option>
                            <option value="Associate">Associate</option>
                            <option value="Builder">Builder</option>
                            <option value="Broker">Broker</option>
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>
                          </select>
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

                            {projectData?.configurations
                              ?.slice()
                              .sort((a, b) => {
                                const numA = parseFloat(a) || 0; // Extract numeric part
                                const numB = parseFloat(b) || 0;

                                return numA - numB; // Sort numerically
                              })
                              .map((config, index) => (
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
                            style={{ resize: "none", overflowY: "auto" }}
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
                  <div
                    className=" rounded-3 p-3 pt-3 text-center d-flex justify-content-center"
                    style={{
                      backgroundColor: "#2067d1",
                      backgroundSize: "160px",
                    }}
                  >
                    <button
                      className="btn bg-white w-100"
                      style={{ fontSize: "16px", color: "#2067d1" }}
                      onClick={handleDownloadBrochure}
                    >
                      <i className="fas fa-download me-2"></i>
                      DOWNLOAD BROCHURE
                    </button>

                    {/* Dialog Popup Trigger */}
                    <BrochurePopupDialog
                      open={showPopup}
                      onClose={closePopup}
                      projectName={projectData?.name || "Invest Mango"}
                      brochure={projectData?.brochure}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetails;
