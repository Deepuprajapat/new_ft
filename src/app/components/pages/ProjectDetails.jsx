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
  faSave,
  faEdit,
  faCamera
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Helmet } from "react-helmet";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import Header from "../Header";

// Import modular sections
import ProjectGallery from "./ProjectDetailsParts/ProjectGallery";
import NavigationSection from "./ProjectDetailsParts/NavigationSection";
import WhyChooseSection from "./ProjectDetailsParts/WhyChooseSection";
import KnowAboutSection from "./ProjectDetailsParts/KnowAboutSection";
import FloorPlanSection from "./ProjectDetailsParts/FloorPlanSection";
import PriceListSection from "./ProjectDetailsParts/PriceListSection";
import PaymentPlanSection from "./ProjectDetailsParts/PaymentPlanSection";
import AmenitiesSection from "./ProjectDetailsParts/AmenitiesSection";
import VideoPresentationSection from "./ProjectDetailsParts/VideoPresentationSection";
import LocationMapSection from "./ProjectDetailsParts/LocationMapSection";
import SitePlanSection from "./ProjectDetailsParts/SitePlanSection";
import AboutDeveloperSection from "./ProjectDetailsParts/AboutDeveloperSection";
import FaqSection from "./ProjectDetailsParts/FAQSection";
import SimilarProjectsSection from "./ProjectDetailsParts/SimilarProjectsSection";
import ConnectExpertSection from "./ProjectDetailsParts/ConnectExpertSection";
import ProjectHeaderSection from "./ProjectDetailsParts/ProjectHeaderSection";
import ProjectDetailsSection from "./ProjectDetailsParts/ProjectDetailsSection";
import MetaFormSection from "./ProjectDetailsParts/MetaForm";
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
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [isGalleryEditing, setIsGalleryEditing] = useState(false);



  // price list
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [priceListPara, setPriceListPara] = useState(projectData?.priceListPara || "");
  const [floorplans, setFloorplans] = useState(projectData?.floorplans || []);

  const updateFloorplan = (index, key, value) => {
    setFloorplans(prev =>
      prev.map((plan, i) => i === index ? { ...plan, [key]: value } : plan)
    );
  };


  const navigate = useNavigate();

  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [aboutHtml, setAboutHtml] = useState(projectData?.about || "");

  //anushaka
  const [isEditing, setIsEditing] = useState(false);
  const [AddProjectButton, setAddProjectButton] = useState(false);
  // State variables pament
  const [isPaymentEditing, setIsPaymentEditing] = useState(false);
  const [paymentPara, setPaymentPara] = useState(projectData?.paymentPara || '');
  const [paymentPlans, setPaymentPlans] = useState(projectData?.paymentPlans || []);

  //project header
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);

  // State variables  amenthis
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [amenitiesPara, setAmenitiesPara] = useState(projectData?.amenitiesPara || '');
  const [editableAmenities, setEditableAmenities] = useState([]);

  // State variables  youtube
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [videoPara, setVideoPara] = useState(projectData?.videoPara || '');
  const [editableVideos, setEditableVideos] = useState([]);


  // ...existing code... location map

  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [locationMapHtml, setLocationMapHtml] = useState(projectData?.locationMap || "");
  const [locationUrl, setLocationUrl] = useState(projectData?.locationUrl || "");

  //  state variable for site plan
  const [isSitePlanEditing, setIsSitePlanEditing] = useState(false);
  const [siteplanParaHtml, setSiteplanParaHtml] = useState(projectData?.siteplanPara || "");
  const [siteplanImgUrl, setSiteplanImgUrl] = useState(projectData?.siteplanImg || "");
  //state variabe for ace group
  const [isDeveloperEditing, setIsDeveloperEditing] = useState(false);
  const [developerForm, setDeveloperForm] = useState({
    logo: developerDetails?.logo || "",
    altLogo: developerDetails?.altLogo || "",
    establishedYear: developerDetails?.establishedYear || "",
    totalProjects: developerDetails?.totalProjects || "",
    about: developerDetails?.about || "",
  });


  //anushaka
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log('Saving project data:', projectData);
  };



  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  //whychoose section
  const [isWhyChooseEditing, setIsWhyChooseEditing] = useState(false);

  const handleArrayInputChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim());
    setProjectData(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };
  // ace group
  useEffect(() => {
    setDeveloperForm({
      logo: developerDetails?.logo || "",
      altLogo: developerDetails?.altLogo || "",
      establishedYear: developerDetails?.establishedYear || "",
      totalProjects: developerDetails?.totalProjects || "",
      about: developerDetails?.about || "",
    });
  }, [developerDetails]);

  //  site plan popup
  useEffect(() => {
    setSiteplanParaHtml(projectData?.siteplanPara || "");
    setSiteplanImgUrl(projectData?.siteplanImg || "");
  }, [projectData]);


  // Keep state in sync with projectData location map and URL
  useEffect(() => {
    setLocationMapHtml(projectData?.locationMap || "");
    setLocationUrl(projectData?.locationUrl || "");
  }, [projectData]);


  // Initialize editable amenities when editing starts
  useEffect(() => {
    if (isAmenitiesEditing && projectData?.amenities) {
      setEditableAmenities(JSON.parse(JSON.stringify(processAmenities())));
    }
  }, [isAmenitiesEditing]);

  // Functions
  const processEditableAmenities = () => {
    return editableAmenities;
  };

  const updateCategoryName = (categoryIndex, newName) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].name = newName;
    setEditableAmenities(updated);
  };

  const updateAmenity = (categoryIndex, amenityIndex, field, value) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets[amenityIndex][field] = value;
    setEditableAmenities(updated);
  };

  const removeAmenity = (categoryIndex, amenityIndex) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets.splice(amenityIndex, 1);
    setEditableAmenities(updated);
  };

  const addNewAmenity = (categoryIndex) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets.push({
      name: 'New Amenity',
      icon: '/images/default-icon.svg'
    });
    setEditableAmenities(updated);
  };

  const removeCategoryAmenities = (categoryIndex) => {
    const updated = editableAmenities.filter((_, index) => index !== categoryIndex);
    setEditableAmenities(updated);
  };

  const addNewCategory = () => {
    const newCategory = {
      name: 'New Category',
      assets: [
        {
          name: 'Sample Amenity',
          icon: '/images/default-icon.svg'
        }
      ]
    };
    setEditableAmenities([...editableAmenities, newCategory]);
  };

  const saveAmenitiesChanges = () => {
    // Save logic here - update projectData or call API
    // You'll need to convert editableAmenities back to your original format
    setIsAmenitiesEditing(false);
  };
  // Functions
  const updatePaymentPlan = (index, field, value) => {
    const updated = [...paymentPlans];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentPlans(updated);
  };

  const removePaymentPlan = (index) => {
    const updated = paymentPlans.filter((_, i) => i !== index);
    setPaymentPlans(updated);
  };

  const addNewPaymentPlan = () => {
    setPaymentPlans(prev => [
      ...prev,
      { planName: "", details: "" }
    ]);
  };

  const savePaymentChanges = () => {
    // Save logic here - update projectData or call API
    setIsPaymentEditing(false);
  };

  // Update aboutHtml when projectData changes
  useEffect(() => {
    setAboutHtml(projectData?.about || "");
  }, [projectData]);

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


  // Update your existing useEffect
  useEffect(() => {
    setAboutHtml(projectData?.about || "");
    setPriceListPara(projectData?.priceListPara || "");
    setFloorplans(projectData?.floorplans ? [...projectData.floorplans] : []);
  }, [projectData]);

  // Add these functions
  const savePriceChanges = () => {
    setProjectData(prev => ({
      ...prev,
      priceListPara: priceListPara,
      floorplans: floorplans
    }));
    setIsPriceEditing(false);
  };





  // Initialize editable videos when editing starts
  useEffect(() => {
    if (isVideoEditing) {
      const videos = projectData?.videos || [''];
      // Ensure at least one empty field for new video
      const videosWithEmpty = videos.length === 0 ? [''] : [...videos];
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
    // Ensure at least one empty field remains
    if (updated.length === 0) {
      updated.push('');
    }
    setEditableVideos(updated);
  };

  const addNewVideo = () => {
    setEditableVideos([...editableVideos, '']);
  };

  const saveVideoChanges = () => {
    // Filter out empty video URLs before saving
    const validVideos = editableVideos.filter(url => url.trim() !== '');

    // Save logic here - update projectData or call API
    // projectData.videos = validVideos;
    // projectData.videoPara = videoPara;

    setIsVideoEditing(false);
  };

  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

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

  function getLeastPriceOfFloorPlan(floorPlan) {
    if (!floorPlan || !Array.isArray(floorPlan) || floorPlan.length === 0) {
      return 0;
    }
    // Filter out prices that are exactly 1.5
    const validFloorPlans = floorPlan.filter((plan) => plan.price !== 1.5);
    if (validFloorPlans.length === 0) return 0;
    const sortedFloorPlan = [...validFloorPlans].sort((a, b) => a.price - b.price);
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

     // Function to handle image upload
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...projectData.images];
        newImages[index] = {
          ...newImages[index],
          imageUrl: e.target.result,
          caption: file.name,
        };
        setProjectData({
          ...projectData,
          images: newImages,
        });
      };
      reader.readAsDataURL(file);
    }
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

  const displayedFaqs =
    Array.isArray(sortedFaqs) && sortedFaqs.some(isValidFaq)
      ? sortedFaqs
      : defaultFaqs.map((faq) => ({
        question: injectProjectData(faq.question, projectData),
        answer: injectProjectData(faq.answer, projectData),
      }));


  const validPaymentPlans = projectData?.paymentPlans?.filter(
    (plan) => plan?.planName?.trim() !== "" || plan?.details?.trim() !== ""
  );


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
          <div className="row mx-0 g-0" style={{ padding: "0.5px" }}>
                {projectData && projectData.images && projectData.images.length > 0 && (
                  <>
                    {/* Main Image - Left Side */}
                    <div className="col-12 col-md-6 p-0 pe-0 pe-md-1">
                      {projectData?.images[0] && (
                        <div
                          className="position-relative"
                          style={{ height: "540px" }}
                          onMouseEnter={() => setHoveredImageIndex(0)}
                          onMouseLeave={() => setHoveredImageIndex(null)}
                        >
                          <a
                            href={projectData?.images[0]?.imageUrl}
                            data-toggle="lightbox"
                            data-gallery="gallery"
                            className="d-block h-100"
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
                              className="w-100 h-100"
                              style={{ 
                                objectFit: "cover", 
                                cursor: "pointer",
                                filter: hoveredImageIndex === 0 ? "blur(5px)" : "none",
                                transition: "filter 0.3s ease"
                              }}
                              fetchpriority="high"
                            />
                          </a>
                          {hoveredImageIndex === 0 && (
                            <div 
                              className="position-absolute d-flex align-items-center justify-content-center"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: '50%',
                                padding: '15px',
                                cursor: 'pointer',
                                zIndex: 2
                              }}
                            >
                              <label htmlFor={`image-upload-0`} style={{ margin: 0, cursor: 'pointer' }}>
                                <FontAwesomeIcon 
                                  icon={faCamera} 
                                  style={{ 
                                    color: 'white', 
                                    fontSize: '25px',
                                    transition: 'transform 0.3s ease',
                                    transform: 'scale(1.2)'
                                  }}
                                />
                              </label>
                              <input
                                type="file"
                                id={`image-upload-0`}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageUpload(0, e)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Grid Images - Right Side */}
                    <div className="col-12 col-md-6 p-0">
                      <div className="row g-0">
                        {[1, 2, 3, 4].map((index) =>
                          projectData?.images[index] && (
                            <div
                              key={index}
                              className="col-6"
                              style={{ height: "270px", padding: "0 0 0.5px 0.5px" }}
                              onMouseEnter={() => setHoveredImageIndex(index)}
                              onMouseLeave={() => setHoveredImageIndex(null)}
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
                                  alt={projectData?.images[index]?.caption || "Image"}
                                  src={projectData?.images[index]?.imageUrl}
                                  loading="lazy"
                                  className="w-100 h-100"
                                  style={{
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    filter: hoveredImageIndex === index ? "blur(4px)" : "none",
                                    transition: "filter 0.3s ease"
                                  }}
                                  fetchpriority="high"
                                />
                              </a>
                              {hoveredImageIndex === index && (
                                <div 
                                  className="position-absolute d-flex align-items-center justify-content-center"
                                  style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    borderRadius: '50%',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    zIndex: 2
                                  }}
                                >
                                  <label htmlFor={`image-upload-${index}`} style={{ margin: 0, cursor: 'pointer' }}>
                                    <FontAwesomeIcon 
                                      icon={faCamera} 
                                      style={{ 
                                        color: 'white', 
                                        fontSize: '25px',
                                        transition: 'transform 0.3s ease',
                                        transform: 'scale(1.2)'
                                      }}
                                    />
                                  </label>
                                  <input
                                    type="file"
                                    id={`image-upload-${index}`}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(index, e)}
                                  />
                                </div>
                              )}
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
                    className={`text-white text-decoration-none ${activeSection === item ? "fw-bold" : ""
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
        <MetaFormSection />
        {/* Section 1 */}

        <ProjectHeaderSection
          projectData={projectData}
          reraDetails={reraDetails}
          showReraDetails={showReraDetails}
          setShowReraDetails={setShowReraDetails}
          setIsReraDetailHovered={setIsReraDetailHovered}
          isReraDetailHovered={isReraDetailHovered}
          formatPrice={formatPrice}
          getLeastPriceOfFloorPlan={getLeastPriceOfFloorPlan}
          getHighestPriceOfFloorPlan={getHighestPriceOfFloorPlan}
          isEditing={isHeaderEditing}
          handleEdit={() => setIsHeaderEditing(true)}
          handleSave={() => setIsHeaderEditing(false)}
          handleInputChange={handleInputChange}
        />

        {/* Project Details */}
        <section className="container-fluid" style={{ width: window.innerWidth <= 768 ? "90%" : "95%", margin: "0 auto" }}>
          <div className="row">
            <section className="col-md-8">
              <ProjectDetailsSection 
                projectData={projectData}
                isEditing={isEditing}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleInputChange={handleInputChange}
                handleArrayInputChange={handleArrayInputChange}
                AddProjectButton={AddProjectButton}
                formatPrice={formatPrice}
              />

              {/* Why to choose */}
              <WhyChooseSection
                projectData={projectData}
                isEditing={isWhyChooseEditing}
                handleEdit={() => setIsWhyChooseEditing(true)}
                handleSave={() => setIsWhyChooseEditing(false)}
                setProjectData={setProjectData}
                handleSitePopup={handleSitePopup}
                showSitePopup={showSitePopup}
                closeSitePopup={closeSitePopup}
              />
              {/* Know About */}
              {projectData && (
                <KnowAboutSection
                  projectData={projectData}
                  isAboutEditing={isAboutEditing}
                  setIsAboutEditing={setIsAboutEditing}
                  aboutHtml={aboutHtml}
                  setAboutHtml={setAboutHtml}
                  showFullDescription={showFullDescription}
                  setShowFullDescription={setShowFullDescription}
                  isMobileView={isMobileView}
                  handleDownloadBrochure={handleDownloadBrochure}
                  handleDownloadBrochuree={handleDownloadBrochuree}
                />
              )}
              {/* Floor Plan */}
              <FloorPlanSection
                projectData={projectData}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                formatPrice={formatPrice}
              />
              {/* Price List */}
              <PriceListSection
                projectData={projectData}
                isPriceEditing={isPriceEditing}
                setIsPriceEditing={setIsPriceEditing}
                priceListPara={priceListPara}
                setPriceListPara={setPriceListPara}
                floorplans={floorplans}
                updateFloorplan={updateFloorplan}
                savePriceChanges={savePriceChanges}
                formatPrice={formatPrice}
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
                  href={`tel:+91${projectData?.locality?.city?.phoneNumber?.[0] ||
                    "8595189189"
                    }`}
                  style={{ color: "#ffffff", textDecoration: "underline" }}
                >
                  {`+91-${projectData?.locality?.city?.phoneNumber?.[0] ||
                    "8595-189-189"
                    }`}
                </a>
              </div>
              {/* Payment Plan */}
              <PaymentPlanSection
                projectData={projectData}
                isPaymentEditing={isPaymentEditing}
                setIsPaymentEditing={setIsPaymentEditing}
                paymentPara={paymentPara}
                setPaymentPara={setPaymentPara}
                paymentPlans={paymentPlans}
                updatePaymentPlan={updatePaymentPlan}
                removePaymentPlan={removePaymentPlan}
                addNewPaymentPlan={addNewPaymentPlan}
                savePaymentChanges={savePaymentChanges}
              />

              {/* )} */}
              {/* Amenities */}
              <AmenitiesSection
                amenities={projectData?.projectAmenities || []}
                amenitiesPara={projectData?.amenitiesPara || ""}
                name={projectData?.name || ""}
              // onSave={yourSaveHandler} // optional
              />
              {/* video presentation */}
              <VideoPresentationSection
                projectData={projectData}
                isVideoEditing={isVideoEditing}
                setIsVideoEditing={setIsVideoEditing}
                videoPara={videoPara}
                setVideoPara={setVideoPara}
                editableVideos={editableVideos}
                updateVideoUrl={updateVideoUrl}
                removeVideo={removeVideo}
                addNewVideo={addNewVideo}
                saveVideoChanges={saveVideoChanges}
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
                locationUrl={locationUrl}
                setLocationUrl={setLocationUrl}
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
              />
              {/* Frequently Asked Questions */}
              <FaqSection
                displayedFaqs={displayedFaqs}
                expandedIndex={expandedIndex}

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
