import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BrochurePopupDialog from "./BrochurePopup";
import PopupDialog from "./CommanPopup";
import { useOutletContext } from "react-router-dom";
import {
  getAllProjectsByUrlName,
  getAllProject,
  sendOTP,
  verifyOTP,
  resendOTP,
  patchProjectById,
  patchProjectByTestUrl
  // getLeadByPhone,
  // saveLead,
} from "../../apis/api";
import "react-multi-carousel/lib/styles.css";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import WhyChooseSection from "./ProjectDetailsParts/WhyChooseSection";
import KnowAboutSection from "./ProjectDetailsParts/KnowAboutSection";
import FloorPlanSection from "./ProjectDetailsParts/FloorPlanSection";
import PriceListSection from "./ProjectDetailsParts/PriceListSection";
import PaymentPlanSection from "./ProjectDetailsParts/PaymentPlanSection";
import AmenitiesSection from "./ProjectDetailsParts/AmenitiesSection";
import VideoPresentationSection from "./ProjectDetailsParts/VideoPresentationSection";
import LocationMapSection from "./ProjectDetailsParts/LocationMapSection";
import SitePlanSection from "./ProjectDetailsParts/SitePlanSection";
import FAQSection from "./ProjectDetailsParts/FAQSection";
import SimilarProjectsSection from "./ProjectDetailsParts/SimilarProjectsSection";
import ConnectExpertSection from "./ProjectDetailsParts/ConnectExpertSection";
import ProjectHeaderSection from "./ProjectDetailsParts/ProjectHeaderSection";
import ProjectDetailsSection from "./ProjectDetailsParts/ProjectDetailsSection";
import MetaFormSection from "./ProjectDetailsParts/MetaForm";
import ProjectGallerySection from "./ProjectDetailsParts/ProjectGallerySection";
import AboutDeveloperSection from "./ProjectDetailsParts/AboutDeveloperSection";
import { DataArray } from "@mui/icons-material";
const BASE_URL = "https://image.investmango.com/images/";
const FALLBACK_IMAGE = "/images/For-Website.jpg";

// Helper function to parse flexible date formats (cross-browser compatible)
const parseFlexibleDate = (dateStr) => {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  // Handle timestamps
  if (!isNaN(trimmed)) {
    return new Date(Number(trimmed));
  }
  // Handle "Month Year" or "Month,Year" or "Month, Year" format (Safari/iPhone friendly)
  const monthYearMatch = trimmed.match(/^([a-zA-Z]+),?\s*(\d{4})$/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = monthYearMatch[2];
    // Use a fixed day to avoid Safari issues
    return new Date(`${monthName} 1, ${year}`);
  }
  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed.replace(/-/g, "/") + "T00:00:00");
  }
  // Handle other formats by converting dashes to slashes (Safari-friendly)
  const safariDate = trimmed.replace(/-/g, "/");
  return new Date(safariDate);
};

const ProjectDetails = () => {
  // Check if user is authenticated by looking for token in cookie or localStorage
  // const getAuthToken = () => {
  //   // Try to get token from cookie first
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; authToken=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();

  //   // Fallback to localStorage
  //   return localStorage.getItem("authToken");
  // };

  const [activeSection, setActiveSection] = useState("overview");
  const [projectData, setProjectData] = useState(null);
  const [allSimilarProjects, setAllSimilarProjects] = useState(null);
  const [developerId, setDeveloperId] = useState("");
  const [projectId, setProjectId] = useState("");
  const { urlName } = useParams();
  const location = useLocation();

  const getProjectIdFromSession = () => {
    const projectState = sessionStorage.getItem("projectState");
    if (projectState) {
        try {
            // Only parse if it looks like JSON
            const data = /^[{\[]/.test(projectState) ? JSON.parse(projectState) : projectState;
            return data.projectId || data;
        } catch (err) {
            sessionStorage.removeItem("projectState");
        }
    }
    return null;
};

  const projectIdFromNav = getProjectIdFromSession();
  console.log(projectIdFromNav, "project id from nav")

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navInitialPosition, setNavInitialPosition] = useState(null);
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState([]); // Initialize schemas as an empty array
  const [isEditing, setIsEditing] = useState(false);
  const [AddProjectButton, setAddProjectButton] = useState(false);
  const [isPaymentEditing, setIsPaymentEditing] = useState(false);
  const [paymentPara, setPaymentPara] = useState(
    projectData?.paymentPara || ""
  );
  const [paymentPlans, setPaymentPlans] = useState(
    projectData?.paymentPlans || []
  );
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editableAmenities, setEditableAmenities] = useState([]);
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [editableVideos, setEditableVideos] = useState([]);
  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [locationMapHtml, setLocationMapHtml] = useState(
    projectData?.locationMap || ""
  );
  const [isSitePlanEditing, setIsSitePlanEditing] = useState(false);
  const [siteplanParaHtml, setSiteplanParaHtml] = useState(
    projectData?.web_cards?.site_plan?.html_content || ""
  );
  const [siteplanImgUrl, setSiteplanImgUrl] = useState(
    projectData?.web_cards?.site_plan?.image || ""
  );
 
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handleSave = async (updatedData) => {
    console.log("Updated data received from child:", updatedData);
    let newData = projectData;
    if (updatedData) {
      newData = {
        ...projectData,
        ...updatedData,
      };
      setProjectData(newData);
      console.log("New project data after update:", newData);
    }

  // Call PATCH API with the updated data
  try {
    const projectId = projectIdFromNav || projectDataFromState?.project_id;
    const response = await patchProjectByTestUrl(projectId,newData);
    console.log("Patch API response:", response);
  } catch (error) {
    console.error("Error saving project data:", error);
  }
  setIsEditing(false);
};
 


  const handleInputChange = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //  site plan popup
  useEffect(() => {
    setSiteplanParaHtml(projectData?.web_cards?.site_plan?.html_content || "");
    setSiteplanImgUrl(projectData?.web_cards?.site_plan?.image || "");
  }, [projectData]);

  useEffect(() => {
    setLocationMapHtml(projectData?.locationMap || "");
  }, [projectData]);

  useEffect(() => {
    if (isAmenitiesEditing && projectData?.amenities) {
      setEditableAmenities(JSON.parse(JSON.stringify(processAmenities())));
    }
  }, [isAmenitiesEditing]);

  const updatePaymentPlan = (index, field, value) => {
    const updated = [...paymentPlans];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentPlans(updated);
  };

  const removePaymentPlan = (index) => {
    const updated = paymentPlans.filter((_, i) => i !== index);
    setPaymentPlans(updated);
  };

  const savePaymentChanges = () => {
    // Save logic here - update projectData or call API
    setIsPaymentEditing(false);
  };

  const projectDataFromState = location.state?.projectData;
  // console.log(projectDataFromState,"projectDataFromState")

  // Store initial nav position on mount
  useEffect(() => {
    const navElement = document.getElementById("navigation-section");
    if (navElement) {
      setNavInitialPosition(500);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (projectDataFromState) {
        // Use data from navigation state
        setProjectData(projectDataFromState);
        setDeveloperId(projectDataFromState.developerId);
        setProjectId(projectDataFromState.id);

        if (
          Array.isArray(projectDataFromState.schema) &&
          projectDataFromState.schema.length > 0
        ) {
          const parsedSchemas = projectDataFromState.schema
            .map((schemaStr) => {
              try {
                const scriptContent = schemaStr
                  .replace(/<script[^>]*>/, "")
                  .replace(/<\/script>/, "")
                  .trim();
                return JSON.parse(scriptContent);
              } catch (error) {
                console.error("Error parsing schema JSON:", error);
                return null;
              }
            })
            .filter(Boolean);

          setSchemas(parsedSchemas);
        }
      } else if (urlName) {
        try {
          const data = await getAllProjectsByUrlName(projectIdFromNav, navigate);
          if (data) {
            setProjectData(data);
            setDeveloperId(data.developerId);
            setProjectId(data.id);
            if (Array.isArray(data.schema) && data.schema.length > 0) {
              const parsedSchemas = data.schema
                .map((schemaStr) => {
                  try {
                    const scriptContent = schemaStr
                      .replace(/<script[^>]*>/, "")
                      .replace(/<\/script>/, "")
                      .trim();
                    return JSON.parse(scriptContent);
                  } catch (error) {
                    console.error("Error parsing schema JSON:", error);
                    return null;
                  }
                })
                .filter(Boolean);

              setSchemas(parsedSchemas);
            }
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      } else {
        console.error("No project data or URL name provided");
      }
    };

    fetchData();
  }, [urlName, navigate]);
  
  useEffect(() => {
    const Pid = projectDataFromState?.project_id;
  
    // If both are missing, navigate to 404
    if (!Pid && !projectIdFromNav) {
      navigate("/404", { replace: true });
    }
  }, [projectIdFromNav, projectDataFromState, navigate]);
  
  

  
  useEffect(() => {
    if (projectData) {
      const fetchAllProject = async () => {
        try {
          const data = await getAllProject(projectData?.city);
          console.log(data ,"daya")
          if (data) {
            // Filter projects based on locality ID
            const filteredProjects = data.filter(
              (project) =>
                project?.city === projectData?.city
            );
        console.log(filteredProjects,"filter")
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

  useEffect(() => {
    if (isVideoEditing) {
      const videos = projectData?.videos || [""];
      // Ensure at least one empty field for new video
      const videosWithEmpty = videos.length === 0 ? [""] : [...videos];
      setEditableVideos(videosWithEmpty);
    }
  }, [isVideoEditing, projectData?.videos]);

  // Functions
  const updateVideoUrl = (index, value) => {
    const updated = [...editableVideos];
    updated[index] = value;
    setEditableVideos(updated);
  };

  const removeVideo = (index) => {
    const updated = editableVideos.filter((_, i) => i !== index);
    if (updated.length === 0) {
      updated.push("");
    }
    setEditableVideos(updated);
  };

  const addNewVideo = () => {
    setEditableVideos([...editableVideos, ""]);
  };

  // Helper function to extract YouTube video ID from various URL formats
  // const extractYouTubeId = (url) => {
  //   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  //   const match = url.match(regExp);
  //   return (match && match[2].length === 11) ? match[2] : url;
  // };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "")
      return "Prices On Request";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Check if the price is 1, then return "Prices On Request"
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

  // API se amenities data map karo
  const apiAmenities =
    projectData?.web_cards?.amenities?.categories_with_amenities || {};
  const amenities = Object.entries(apiAmenities).map(([category, assets]) => ({
    name: category.charAt(0) + category.slice(1).toLowerCase(),
    assets: assets.map((item) => ({
      name: item.value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      icon: item.icon,
    })),
  }));
  const amenitiesPara = projectData?.web_cards?.amenities?.description || "";

  function getLeastPriceOfFloorPlan(floorPlan) {
    if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
      return 0;
    }
    // Filter out prices that are exactly 1.5
    const validFloorPlans = floorPlan.filter((plan) => plan.price !== 1.5);
    if (validFloorPlans.length === 0) return 0;
    const sortedFloorPlan = [...validFloorPlans].sort(
      (a, b) => a.price - b.price
    );
    return sortedFloorPlan[0].price;
  }
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

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userType: "",
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
    if (!formData.username || formData.username.trim() === "") {
      setError("Please enter your name.");
      return;
    }

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
        formData.userType,
        "",
        projectData?.project_id || ""
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
      console.log("OTP Verification Response:", response);

      // Check the response structure and adjust based on the API response
      if (response && response.data.message === "OTP Validated Successfully") {
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
        console.log("Unexpected response format:", response);
        setError(response?.message || "OTP verification failed. Please try again.");
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Check if it's a network error vs API error
      if (error.response && error.response.status === 200) {
        // API returned 200 but axios treated it as error
        console.log("API returned 200, treating as success");
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
        setError(error.response?.data?.message || "Failed to verify OTP. Please try again.");
        setOtpVerified(false);
      }
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

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    // Delay scrolling slightly to allow DOM to render
    setTimeout(scrollToHash, 300);
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleDownloadBrochure = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowBrochurePopup(false);
  };

  const [showBrochurePopup, setShowBrochurePopup] = useState(false);

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
  // const [showImagePopup, setShowImagePopup] = useState(false); // State for image popup
  // const [selectedImage, setSelectedImage] = useState(""); // State to hold selected image URL

  // Function to clean and extract numbers for sorting
  const cleanQuestion = (question) => {
    const match = question.match(/^(\d+)[.\s\t]+(.*)/); 
    return match
      ? { number: parseInt(match[1]), text: match[2] }
      : { number: null, text: question.trim() };
  };


  const sortedFaqs = projectData?.web_cards?.faqs
    ?.map((faq) => ({ ...faq, ...cleanQuestion(faq.question) }))
    ?.sort((a, b) => (a.number ?? Infinity) - (b.number ?? Infinity)); 

  const imageSrc =
    projectData?.siteplanImg && projectData.siteplanImg.trim() !== ""
      ? projectData.siteplanImg.startsWith("http")
        ? projectData.siteplanImg
        : `${BASE_URL}${projectData.siteplanImg}`
      : FALLBACK_IMAGE;
  const { setShortAddress ,setprojectPhoneNumber} = useOutletContext();

  useEffect(() => {
    if (projectData?.developer_info?.phone) {
      setprojectPhoneNumber(projectData?.developer_info?.phone);
    }
  }, [projectData, setprojectPhoneNumber]);

  const defaultFaqs = [
    {
      question: "Why choose Invest Mango?",
      answer:
        "Invest Mango works as one team with a common purpose to provide best-in-class services, thoroughly understands the changing needs of its clients. We are client-centric as client is the focal point of Invest Mango. We provide advice and recommendations that are in the client's best interest. We strive to understand the client's requirement by entering into his shoes and offer advice which have far reaching impact. A happy client is what makes us happy and we are proud to serve our client's.",
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

  const isValidFaq = (faq) =>
    faq?.question?.trim() !== "" || faq?.answer?.trim() !== "";

  // const displayedFaqs =
  //   Array.isArray(sortedFaqs) && sortedFaqs.some(isValidFaq)
  //     ? sortedFaqs
  //     : defaultFaqs.map((faq) => ({
  //         question: injectProjectData(faq.question, projectData),
  //         answer: injectProjectData(faq.answer, projectData),
  //       }));

  const validPaymentPlans = projectData?.paymentPlans?.filter(
    (plan) => plan?.planName?.trim() !== "" || plan?.details?.trim() !== ""
  );


  const showEdit = localStorage.getItem('auth-token');
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
            name="keywords"
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
          <ProjectGallerySection
            projectData={projectData}
            setProjectData={setProjectData}
            setShowFullScreen={setShowFullScreen}
            setCurrentImageIndex={setCurrentImageIndex}
            showEdit={showEdit}
            handleSave={handleSave}
          />

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
                      // e.preventDefault();
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
                        // e.preventDefault();
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
        {/* meta form */}
        {showEdit && (
          <div className="d-flex gap-3">
            <MetaFormSection 
             projectData={projectData}
             handleSave={handleSave}/>
          </div>
        )}
        <ProjectHeaderSection
          projectData={projectData}
          formatPrice={formatPrice}
          getLeastPriceOfFloorPlan={getLeastPriceOfFloorPlan}
          getHighestPriceOfFloorPlan={getHighestPriceOfFloorPlan}
          handleInputChange={handleInputChange}
          showEdit={showEdit}
          handleSave={handleSave}
        />

        {/* Project Details */}
        <section
          className="container-fluid"
          style={{
            width: window.innerWidth <= 768 ? "90%" : "95%",
            margin: "0 auto",
          }}
        >
          <div className="row">
            <section className="col-md-8">
              <ProjectDetailsSection
                projectData={projectData}
                isEditing={isEditing}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleInputChange={handleInputChange}
                AddProjectButton={AddProjectButton}
                formatPrice={formatPrice}
                showEdit={showEdit}
              />

              {/* Why to choose */}
              <WhyChooseSection
                projectData={projectData}
                setProjectData={setProjectData}
                handleSitePopup={handleSitePopup}
                showSitePopup={showSitePopup}
                closeSitePopup={closeSitePopup}
                showEdit={showEdit}
                handleSave={handleSave}
              />
              {/* Know About */}
              {projectData && (
                <KnowAboutSection
                  projectData={projectData}
                  isMobileView={isMobileView}
                  handleDownloadBrochure={handleDownloadBrochure}
                  handleDownloadBrochuree={handleDownloadBrochuree}
                  showEdit={showEdit}
                  handleSave={handleSave}
                />
              )}
              {/* Floor Plan */}
              <FloorPlanSection
                projectData={projectData}
                formatPrice={formatPrice}
                showEdit={showEdit}
                handleSave={handleSave}
              />
              {/* Price List */}
              <PriceListSection
                projectData={projectData}
                formatPrice={formatPrice}
                showEdit={showEdit}
                handleSave={handleSave}
              />

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
              <PaymentPlanSection
                projectData={{
                  ...projectData,
                  paymentPlans:
                    projectData?.web_cards?.payment_plans?.plans?.map(
                      (plan) => ({
                        planName: plan.name,
                        details: plan.details,
                      })
                    ) || [],
                  paymentPara:
                    projectData?.web_cards?.payment_plans?.description || "",
                }}
                isPaymentEditing={isPaymentEditing}
                setIsPaymentEditing={setIsPaymentEditing}
                showEdit={showEdit}
                handleSave={handleSave}
              />

              {/* )} */}
              {/* Amenities */}
              <AmenitiesSection
                amenities={amenities}
                amenitiesPara={amenitiesPara}
                name={projectData?.name || ""}
                showEdit={showEdit}
                handleSave={handleSave}
              />
              {/* video presentation */}
              <VideoPresentationSection
                projectData={projectData}
                isVideoEditing={isVideoEditing}
                setIsVideoEditing={setIsVideoEditing}
                editableVideos={editableVideos}
                updateVideoUrl={updateVideoUrl}
                removeVideo={removeVideo}
                addNewVideo={addNewVideo}
                showEdit={showEdit}
                handleSave={handleSave}
              />
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
              <LocationMapSection
                projectData={projectData}
                isLocationEditing={isLocationEditing}
                setIsLocationEditing={setIsLocationEditing}
                locationMapHtml={locationMapHtml}
                setLocationMapHtml={setLocationMapHtml}
                showEdit={showEdit}
                handleSave={handleSave}
              />
              <SitePlanSection
                projectData={projectData}
                imageSrc={imageSrc}
                isSitePlanEditing={isSitePlanEditing}
                setIsSitePlanEditing={setIsSitePlanEditing}
                siteplanParaHtml={siteplanParaHtml}
                setSiteplanParaHtml={setSiteplanParaHtml}
                siteplanImgUrl={siteplanImgUrl}
                setSiteplanImgUrl={setSiteplanImgUrl}
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
                showEdit={showEdit}
                handleSave={handleSave}
              />

              {/* About Developer Section */}
              <AboutDeveloperSection
                developerDetails={{
                  logo: projectData?.developer_info?.logo || "",
                  altLogo:
                    projectData?.developer_info?.alt_logo|| "",
                  establishedYear:
                    projectData?.developer_info.established_year || "",
                  totalProjects:
                    projectData?.developer_info?.total_projects || "",
                  about: projectData?.web_cards?.about?.description || "",
                  address:
                    projectData?.developer_info?.address|| "",
                  name:
                    projectData?.developer_info?.developer_name|| "",
                  phone:
                    projectData?.developer_info?.phone || "",
                  bookingLink:
                    projectData?.web_cards?.about?.contact_details
                      ?.booking_link || "",
                }}
                expandedIndex={expandedIndex}
                setExpandedIndex={setExpandedIndex}
                projectData={projectData}
                isMobileView={window.innerWidth <= 768}
                handleDownloadBrochure={handleDownloadBrochure}
                handleDownloadBrochuree={handleDownloadBrochuree}
                showEdit={showEdit}
                handleSave={handleSave}
              />
              {/* Frequently Asked Questions */}
              <FAQSection
                projectData={{
                  ...projectData,
                  faqs:
                    Array.isArray(projectData?.web_cards?.faqs) && projectData.web_cards.faqs.some(isValidFaq)
                      ? projectData.web_cards.faqs
                      : defaultFaqs.map((faq) => ({
                          question: injectProjectData(faq.question, projectData),
                          answer: injectProjectData(faq.answer, projectData),
                        })),
                  name: projectData?.basic_info?.project_name || "",
                  area:
                    projectData?.web_cards?.project_details?.area?.value || "",
                  shortAddress: projectData?.location_info?.short_address || "",
                }}
                showEdit={true}
                handleSave={handleSave}
              />
              {/* Similar Projects */}
              <SimilarProjectsSection
                allSimilarProjects={allSimilarProjects}
                formatPrice={formatPrice}
                getLeastPriceOfFloorPlan={getLeastPriceOfFloorPlan}
              />
            </section>

            <section className="col-md-4 mb-4">
              {/*Connect to Our Expert */}

              {window.innerWidth > 768 && (
                <ConnectExpertSection
                  formData={formData}
                  handleChange={handleChange}
                  otpSent={otpSent}
                  otpVerified={otpVerified}
                  error={error}
                  sendOtp={sendOtp}
                  handleOtpChange={handleOtpChange}
                  otp={otp}
                  resendOtp={resendOtp}
                  timer={timer}
                  verifyOtp={verifyOtp}
                  setOtpSent={setOtpSent}
                  showPopup={showPopup}
                  handleDownloadBrochure={handleDownloadBrochure}
                  closePopup={closePopup}
                  BrochurePopupDialog={BrochurePopupDialog}
                  projectData={projectData}
                />
              )}
            </section>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetails;
