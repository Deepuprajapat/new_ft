import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllProjectsByUrlName, getDeveloperById } from '../../apis/api';
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
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import sampleFloorplan from './sampleFloorplan.json';
import amenities from './ameties.json';
import similarProjects from './similarProjects.json';
const ProjectDetails = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [projectData, setProjectData] = useState(null);
    const [developerId, setDeveloperId] = useState("");
    const [developerDetails, setDeveloperDetails] = useState(null);
    const { urlName } = useParams();
    const [expandedIndex, setExpandedIndex] = useState(null); // To track which FAQ is expanded
    const [showReraDetails, setShowReraDetails] = useState(false);
    const [isReraDetailHovered, setIsReraDetailHovered] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [isNavFixed, setIsNavFixed] = useState(false);
    const [navInitialPosition, setNavInitialPosition] = useState(null);
    const imageUrl = "https://www.investmango.com/img/ace-divino/ace-divino-greater-noida-west.webp";
    const projectLogo = "https://www.investmango.com/img/all-logo/ace-divino-logo.webp"

    // Store initial nav position on mount
    useEffect(() => {
        const navElement = document.getElementById('navigation-section');
        if (navElement) {
            // Set fixed trigger height to 800px
            setNavInitialPosition(500);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (urlName) {
                try {
                    const data = await getAllProjectsByUrlName(urlName);
                    console.log("Fetched project data:", data);
                    if (data) {
                        setProjectData(data);
                        setDeveloperId(data.developerId); // Update developer ID
                    }
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
                    if (data) {
                        setDeveloperDetails(data);
                    }
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

    // Update active section based on scroll position and handle nav fixing
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                'overview', 'about', 'floor', 'price', 'payment plan',
                'amenities', 'video', 'location', 'siteplan', 'developer',
                'faqs', 'similar projects'
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

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navInitialPosition]);

    return <div className="w-100">
        <div className="container-fluid p-0 mb-0 w-100">
            {/* Gallery Section */}
            <div className="row mx-0 g-0 " style={{ padding: '0.5px' }}>
                {/* Main Image - Full width on mobile, half width on desktop */}
                <div className="col-12 col-md-6 p-0 pe-0 pe-md-0 pb-md-0">
                    {projectData && projectData.images && imageUrl && (
                        <div className="h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '184px', maxHeight: '700px' }}>
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center w-100 h-100">
                                <img
                                    src={imageUrl}
                                    alt="Project Image"
                                    className="img-fluid w-100 h-100 rounded-0 m-0 p-0"
                                    style={{ objectFit: 'cover' }}
                                    fetchpriority="high"
                                />
                            </a>
                        </div>
                    )}
                </div>

                {/* Additional Images Grid */}
                <div className="col-12 col-md-6 p-0 d-flex align-items-center justify-content-center">
                    <div className="row g-0">
                        {/* Show all 4 images in one row on mobile and in 2x2 grid on desktop */}
                        {[1, 2, 3, 4].map((index) => (
                            projectData?.images?.[index] && (
                                <div key={index} className="col-3 col-md-6" style={{ padding: '1px' }}>
                                    <div className="h-100" style={{ minHeight: '92px', maxHeight: '350px' }}>
                                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="w-100 h-100">
                                            <img
                                                src={imageUrl}
                                                alt={imageUrl.category || "Project Image"}
                                                className="img-fluid w-100 h-100 rounded-0 m-0 p-0"
                                                style={{ objectFit: 'cover' }}
                                                fetchpriority="high"
                                            />
                                        </a>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Section */}
        <div
            id="navigation-section"
            className="w-full"
            style={{
                backgroundColor: showMobileNav ? 'white' : '#2067d1',
                transition: 'all 0.3s ease',
                position: isNavFixed ? 'fixed' : 'relative',
                top: isNavFixed ? 0 : 'auto',
                left: 0,
                right: 0,
                zIndex: 1000,
                marginTop: isNavFixed ? '0' : 'auto'
            }}
        >
            <div className="container" style={{ width: '80%' }}>
                {/* Desktop Navigation */}
                <ul className="content-index d-none d-md-flex flex-wrap justify-content-between align-items-center list-unstyled mb-0 py-1" id="links">
                    {[
                        'overview', 'about', 'floor', 'price', 'payment plan',
                        'amenities', 'video', 'location', 'siteplan', 'developer',
                        'faqs', 'similar projects'
                    ].map((item) => (
                        <li key={item} className="mx-1">
                            <a
                                href={`#${item}`}
                                className={`text-white text-decoration-none ${activeSection === item ? 'fw-bolder' : ''}`}
                                style={{
                                    fontWeight: activeSection === item ? '900' : '400',
                                    textDecoration: activeSection === item ? 'underline' : 'none'
                                }}
                                onClick={(e) => {
                                    if (item === 'overview') {
                                        e.preventDefault();
                                        const element = document.querySelector('#project-details');
                                        const headerOffset = 100;
                                        const elementPosition = element.getBoundingClientRect().top;
                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile Navigation */}
                <div className="d-md-none">
                    <button
                        className={`btn w-100 text-center py-1 border-0 ${showMobileNav ? 'bg-white text-primary' : 'bg-transparent text-white'}`}
                        onClick={() => setShowMobileNav(!showMobileNav)}
                        style={{ height: '30px', fontSize: '12px' }}
                    >
                        {activeSection} <FontAwesomeIcon icon={faBars} className="ms-2" />
                    </button>

                    <div className={`collapse ${showMobileNav ? 'show' : ''} transition-height`}
                        style={{ transition: 'height 300ms ease-in-out' }}>
                        <div className="bg-white mt-1">
                            {[
                                'overview', 'about', 'floor', 'price', 'payment plan',
                                'amenities', 'video', 'location', 'siteplan', 'developer',
                                'faqs', 'similar projects'
                            ].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    className={`d-block text-decoration-none py-1 px-3 border-bottom ${activeSection === item
                                        ? 'bg-light text-primary'
                                        : 'text-secondary bg-transparent'
                                        }`}
                                    style={{ fontSize: '11px' }}
                                    onClick={(e) => {
                                        if (item === 'overview') {
                                            e.preventDefault();
                                            const element = document.querySelector('#project-details');
                                            const headerOffset = 380;
                                            const elementPosition = element.getBoundingClientRect().top;
                                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: 'smooth'
                                            });
                                        }
                                        setActiveSection(item);
                                        setShowMobileNav(false);
                                    }}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 1 */}
        <section className="container-fluid" style={{ width: window.innerWidth <= 768 ? '90%' : '80%', margin: '0 auto' }}>
            <div>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    {/* Left Section */}
                    <div className="col-12 col-md-6 p-0 p-md-0">
                        {/* Upper Section */}
                        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-2 mt-2 mt-md-3">
                            <div className="mb-2 mb-md-0 me-md-3 text-center text-md-start">
                                <img
                                    src={projectLogo || "defaultLogo.jpg"}
                                    alt={projectLogo || "Project Logo"}
                                    className="img-fluid"
                                    style={{ maxWidth: '80px' }}
                                />
                            </div>
                            <div className="text-center text-md-start">
                                <h1 className="h3 mb-0 text-center text-md-start" style={{ fontSize: '20px' }}>{projectData?.name || "Project Name"}</h1>
                                <p className="mb-0" style={{ fontSize: '11px' }}>{projectData?.address || "Project Address"}</p>
                                <span style={{ fontSize: '13px' }}>By <a href={projectData?.developerLink} target="_blank" rel="noopener noreferrer">{projectData?.developerName || "Developer Name"}</a></span>
                            </div>
                        </div>

                        {/* Lower Section - Buttons */}
                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start position-relative">
                            <span
                                className="badge bg-primary"
                                style={{ padding: '4px 8px', fontSize: '10px', marginRight: '3px', marginBottom: '3px', borderRadius: '0', backgroundColor: '#2067d1' }}
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
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        zIndex: 1000,
                                        backgroundColor: 'white',
                                        padding: '10px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        minWidth: '300px',
                                        maxWidth: '90vw'
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-0">
                                        <h6 className="m-0" style={{ fontWeight: 700, fontSize: '14px' }}>Rera Detail</h6>
                                        <i
                                            className="fa fa-close"
                                            style={{ fontSize: '15px', cursor: 'pointer' }}
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
                                                    <th style={{ width: '45%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11px', color: 'black', fontWeight: 500, border: 'none', backgroundColor: 'white' }}>Phase</th>
                                                    <th style={{ width: '34%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11px', color: 'black', fontWeight: 500, border: 'none', backgroundColor: 'white' }}>Status</th>
                                                    <th style={{ width: '40%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11px', color: 'black', fontWeight: 500, border: 'none', backgroundColor: 'white' }}>Rera Number</th>
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
                                </div>
                            )}
                            <span className="badge text-dark" style={{ padding: '4px 8px', fontSize: '10px', marginRight: '3px', marginBottom: '3px', borderRadius: '0', backgroundColor: '#f0f0f0', fontWeight: '300' }}>
                                No Brokerage
                            </span>
                            <span className="badge text-dark" style={{ padding: '4px 8px', fontSize: '10px', marginRight: '3px', marginBottom: '3px', borderRadius: '0', backgroundColor: '#f0f0f0', fontWeight: '300' }}>
                                Floor Plans Available
                            </span>
                            <span className="badge text-dark" style={{ padding: '4px 8px', fontSize: '10px', marginRight: '3px', marginBottom: '3px', borderRadius: '0', backgroundColor: '#f0f0f0', fontWeight: '300' }}>
                                Top Amenities
                            </span>
                        </div>

                    </div>

                    {/* Right Section */}
                    <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end mt-2 mt-md-2 p-0 p-md-0" style={{ boxShadow: 'none', border: 'none', }}>
                        <p className="mb-1 fw-bold text-black text-center text-md-end mt-2 mt-md-4" style={{ fontSize: '16px' }}>Project Price</p>
                        <h2 className="h2 mb-0 fw-bold text-center text-md-end" style={{ fontSize: '25px', fontWeight: '800' }}>
                            ₹{projectData?.minPrice || "0"} - ₹{projectData?.maxPrice || "0"}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="">
                <hr />
            </div>
        </section>

        {/* Section 2 */}
        <section className="container-fluid " style={{ width: window.innerWidth <= 768 ? '90%' : '80%', margin: '0 auto' }}>
            <div className="row">
                <section className="col-md-8">
                    {/* Project Details */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} id="project-details">
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>Project Details</h4>
                            <div className="px-3">
                                <p className="mb-2 mb-md-4" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                    This is a brief overview of the project that gives essential information about its features and amenities.
                                </p>

                                <div className="row g-3 mb-0 mb-md-4">
                                    <div className="col-6 col-md-4 mt-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faExpandArrowsAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Project Area</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px', fontWeight: window.innerWidth <= 768 ? '400' : '800' }}>{projectData?.area}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faRulerCombined} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Sizes</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px', fontWeight: window.innerWidth <= 768 ? '400' : '800' }}>{projectData?.sizes?.join(' - ') || '800 sq ft - 1500 sq ft'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Project Units</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.units}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Launch Date</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>
                                                    {projectData?.launchDate ? new Date(projectData.launchDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                    }) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faGavel} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Possession Date</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>
                                                    {projectData?.possessionDate ? new Date(projectData.possessionDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                    }) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Total Towers</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.totalTowers || '5'} Towers</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faBars} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Total Floors</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.totalFloor}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faFlag} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Project Status</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faCity} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Property Type</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.configurationsType?.propertyType}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faHouseUser} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>Configurations</small>
                                                <p className="mb-0 fw-normal fw-md-bolder text-break" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.configurationsType?.configurations}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4 mt-2 mt-md-4">
                                        <div className="d-flex align-items-center flex-column flex-md-row">
                                            <FontAwesomeIcon icon={faKey} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '20px', color: '#2067d1' }} />
                                            <div className="text-center text-md-start">
                                                <small style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '11px' : '15px', fontWeight: '600' }}>RERA Number</small>
                                                <p className="mb-0 fw-normal fw-md-bolder" style={{ color: '#000', fontSize: window.innerWidth <= 768 ? '12px' : '13px', marginTop: '2px' }}>{projectData?.rera}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Why to choose */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} id="why-choose">
                        <div className="">
                            <div className="">
                                <div className="">
                                    <h4 className="mb-0  py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>Why to choose {projectData?.name}?</h4>
                                    <div className="px-3" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '4px', padding: '20px' }}>
                                        <p className="text-muted mb-4" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                            This is the reason why you should choose this project. It offers excellent amenities and prime location.
                                        </p>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="row g-1">
                                                    {/* First row with single image */}
                                                    {projectData?.images && imageUrl && (
                                                        <div className="col-12 mb-1">
                                                            <a
                                                                href={imageUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="d-block"
                                                            >
                                                                <img
                                                                    alt={imageUrl.caption || "Project Image 1"}
                                                                    src={imageUrl}
                                                                    className="img-fluid rounded w-100"
                                                                    style={{
                                                                        height: window.innerWidth <= 768 ? "200px" : "300px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "16px"
                                                                    }}
                                                                    fetchpriority="high"
                                                                />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Second row with two images */}
                                                    <div className="col-12">
                                                        <div className="row g-2">
                                                            {projectData?.images?.slice(1, 3).map((image, index) => (
                                                                <div className="col-6" key={index + 1}>
                                                                    <a
                                                                        href={image.imageUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="d-block"
                                                                    >
                                                                        <img
                                                                            alt={image.caption || `Project Image ${index + 2}`}
                                                                            src={imageUrl}
                                                                            className="img-fluid rounded w-100"
                                                                            style={{ height: "150px", objectFit: "cover", borderRadius: "16px" }}
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
                                                <div className="row g-4" style={{ marginTop: window.innerWidth <= 768 ? '5px' : '0' }}>
                                                    {projectData?.usps?.map((usp, idx) => (
                                                        <div className="col-6" key={idx}>
                                                            <div className="d-flex align-items-start">
                                                                <img
                                                                    className="me-2"
                                                                    src="https://www.investmango.com/img/icon/interior-icon4.svg"
                                                                    style={{
                                                                        height: window.innerWidth <= 768 ? "24px" : "30px",
                                                                        marginTop: window.innerWidth <= 768 ? "2px" : "0"
                                                                    }}
                                                                    fetchpriority="high"
                                                                    alt={`USP Icon ${idx + 1}`}
                                                                />
                                                                <span style={{
                                                                    fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                                                                    lineHeight: window.innerWidth <= 768 ? '1.2' : 'normal'
                                                                }}>
                                                                    {usp}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="row mt-4" style={{
                                                    position: window.innerWidth <= 768 ? 'static' : 'absolute',
                                                    bottom: window.innerWidth <= 768 ? 'auto' : 0,
                                                    left: 0,
                                                    right: 0,
                                                    margin: '0 12px'
                                                }}>
                                                    <div className="col-12">
                                                        <a
                                                            href="#form_side"
                                                            className="btn w-100 py-1"
                                                            style={{ backgroundColor: '#2067d1', color: '#fff' }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#1854b0';
                                                                e.target.style.transition = 'background-color 0.3s';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = '#2067d1';
                                                            }}
                                                        >
                                                            Book Your Site Visit
                                                        </a>
                                                    </div>
                                                    <div className="col-12 mt-2">
                                                        <a
                                                            href="tel:911234567890"
                                                            className="btn w-100 py-1"
                                                            style={{
                                                                backgroundColor: '#fff',
                                                                color: '#000',
                                                                border: '1px solid #000'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#2067d1';
                                                                e.target.style.color = '#fff';
                                                                e.target.style.transition = 'all 0.3s';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = '#fff';
                                                                e.target.style.color = '#000';
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
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>Know About {projectData?.name}</h4>
                            <div className="px-3">
                                <div className="position-relative overflow-hidden" style={{ maxHeight: showReraDetails ? 'none' : '100px' }}>
                                    <div className={!showReraDetails ? 'position-absolute w-100 h-100' : ''}
                                        style={{
                                            background: !showReraDetails ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)' : 'none',
                                            top: 0,
                                            left: 0
                                        }}>
                                    </div>
                                    <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                        {projectData?.name} is a premium residential project offering a blend of modern living and serene surroundings.
                                        It provides a variety of amenities and spacious apartments designed for comfort and convenience.
                                    </p>
                                    <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                        <span className="text-primary fw-bold">Coming Soon</span>
                                    </p>
                                    <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                        Click on the <button className="border-0 bg-transparent text-primary p-0" id="download-btn2">
                                            <span className="fw-bold">"Download"</span>
                                        </button> button to download <span className="fw-bold">{projectData?.name} brochure</span>.
                                    </p>
                                </div>
                                <button
                                    className="btn btn-link text-decoration-none p-0 mt-2"
                                    onClick={() => setShowReraDetails(!showReraDetails)}
                                    style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}
                                >
                                    {showReraDetails ? 'Show Less' : 'Read More'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Floor Plan */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>{projectData?.name} Floor Plan</h4>
                            <div className="px-3">
                                <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                    This is a brief description of the floor plan for the project.
                                </p>
                                <div className="d-flex gap-2 mb-3">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`btn ${activeFilter === 'all' ? 'btn-primary' : ''}`}
                                        style={{
                                            border: "2px solid #000",
                                            borderRadius: "15px",
                                            padding: window.innerWidth <= 768 ? '2px 5px' : '5px 15px',
                                            fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                                            fontWeight: "600",
                                            backgroundColor: activeFilter === 'all' ? 'rgb(32, 103, 209)' : ''
                                        }}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('2BHK')}
                                        className={`btn ${activeFilter === '2BHK' ? 'btn-primary' : ''}`}
                                        style={{
                                            border: "2px solid #000",
                                            borderRadius: "15px",
                                            padding: window.innerWidth <= 768 ? '2px 5px' : '5px 15px',
                                            fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                                            fontWeight: "600",
                                            backgroundColor: activeFilter === '2BHK' ? 'rgb(32, 103, 209)' : ''
                                        }}
                                    >
                                        2 BHK
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('3BHK')}
                                        className={`btn ${activeFilter === '3BHK' ? 'btn-primary' : ''}`}
                                        style={{
                                            border: "2px solid #000",
                                            borderRadius: "15px",
                                            padding: window.innerWidth <= 768 ? '2px 5px' : '5px 15px',
                                            fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                                            fontWeight: "600",
                                            backgroundColor: activeFilter === '3BHK' ? 'rgb(32, 103, 209)' : ''
                                        }}
                                    >
                                        3 BHK
                                    </button>
                                </div>
                                <Carousel
                                    responsive={{
                                        desktop: {
                                            breakpoint: { max: 3000, min: 1024 },
                                            items: 3,
                                            slidesToSlide: 1
                                        },
                                        tablet: {
                                            breakpoint: { max: 1024, min: 464 },
                                            items: 1,
                                            slidesToSlide: 1
                                        },
                                        mobile: {
                                            breakpoint: { max: 464, min: 0 },
                                            items: 1,
                                            slidesToSlide: 1
                                        }
                                    }}
                                    infinite={true}
                                    containerClass="carousel-container"
                                    itemClass="carousel-item-padding-40-px"
                                    style={{ width: '60%', margin: '0 auto' }}
                                >
                                    {(() => {
                                        const filteredPlans = sampleFloorplan.floorPlans
                                            ?.filter(plan => activeFilter === 'all' || plan.type === activeFilter);

                                        return filteredPlans.map((plan, index) => (
                                            <div key={index} className="px-2 d-flex justify-content-center">
                                                <div className="card border-0" style={{ width: '80%', maxWidth: window.innerWidth <= 768 ? '80%' : 'auto' }}> {/* Reduced width to 80% */}
                                                    <div className="card-body p-3">
                                                        <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', fontWeight: '600' }}>{plan.heading}</p>
                                                        <img
                                                            src={plan.imageUrl}
                                                            alt={`${plan.type} Floor Plan`}
                                                            className="img-fluid mb-3"
                                                            style={{ width: '100%' }}
                                                        />
                                                        <div className="row mb-3">
                                                            <div className="col-6">
                                                                <small className="text-muted" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '12px' }}>Builtup Area</small>
                                                                <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? '13px' : '14px', fontWeight: '600' }}>{plan.buildUpArea}</p>
                                                            </div>
                                                            <div className="col-6">
                                                                <small className="text-muted" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '12px' }}>Price</small>
                                                                <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? '13px' : '14px', fontWeight: '600' }}>₹{plan.price || 'On Request'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column gap-2 align-items-center">
                                                            <a href="tel:+911234567890" className="btn btn-primary w-100" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px', backgroundColor: 'rgb(32, 103, 209)' }}>
                                                                Talk to our Expert
                                                            </a>
                                                            <button onClick={() => console.log("Download Floor Plan")} className="btn btn-outline-primary w-100" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                                                Download Floor Plan
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ));
                                    })()}
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
                    {/* Price List */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>{projectData?.name} Price List</h4>
                            <div className="px-3">
                                <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                    This is a brief description of the price list for the project.
                                </p>
                                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                    <table className="table table-striped" style={{ minWidth: window.innerWidth <= 768 ? '100%' : 'auto' }}>
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Config</th>
                                                <th scope="col" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Size</th>
                                                <th scope="col" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Price</th>
                                                <th scope="col" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Best Buy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>2 BHK</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>1000 sq ft</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>₹75L</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>₹70L</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>3 BHK</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>1500 sq ft</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>₹1Cr</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>₹95L</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>4 BHK</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>2000 sq ft</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>On Request</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>₹1.85Cr</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>5 BHK</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>2500 sq ft</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Sold Out</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Get Free Consultation */}
                    <div className="py-3 px-3 mb-4" role="alert" style={{
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        backgroundColor: '#40433e',
                        color: '#ffffff',
                        borderTop: '1px solid #686060',
                        borderRadius: '8px'
                    }}>
                        Get Free Consultation for this property. Call us at:{" "}
                        <a href="tel:+918595-189-189" style={{ color: '#2067d1', textDecoration: 'underline' }}>8595-189-189</a>
                    </div>
                    {/* Payment Plan */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>{projectData?.name} Payment Plan</h4>
                            <div className="px-3">
                                <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                    This is a brief description of the payment plan for the project.
                                </p>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <tbody>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Booking Amount</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>10% of Total Price</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>On Agreement</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>20% of Total Price</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>On Foundation</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>15% of Total Price</td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>On Completion</td>
                                                <td style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', padding: window.innerWidth <= 768 ? '8px 4px' : '8px' }}>Remaining Balance</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Amenities */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>{projectData?.name} Amenities</h4>
                            <div className="px-3">
                                <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '16px' }}>
                                    World class amenities are there in {projectData?.name} for the residents to enjoy a luxurious lifestyle. Know in detail about the amenities in the list below.
                                </p>

                                <div className="inner-item" style={{ height: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
                                    {amenities.amenities.map((category, categoryIndex) => (
                                        <div key={categoryIndex}>
                                            <p className="fw-bolder mb-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#2067d1', fontWeight: '1000' }}>
                                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                            </p>
                                            <div className="row g-4 mb-5">
                                                {category.assets.map((amenity, index) => (
                                                    <div key={index} className="col-6 col-md-3">
                                                        <div className="d-flex align-items-center" style={{ fontSize: window.innerWidth <= 768 ? '11px' : '14px', marginBottom: '16px', fontWeight: '600' }}>
                                                            <img src={amenity.icon} alt={amenity.name} style={{ width: '35px', height: '35px', marginRight: '16px' }} />
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
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>
                                VIDEO PRESENTATION OF {projectData?.name}
                            </h4>
                            <div className="px-3">
                                <p className="mb-3 mb-md-5" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px' }}>
                                    Click for the video of {projectData?.name} and understand every perspective of 'quality living' that they are offering. And for more property videos visit our YouTube channel.
                                </p>
                                <div className="d-flex flex-column">
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src="https://www.youtube.com/embed/OmvpphgerjI"
                                            title={`${projectData?.name} Video Presentation`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                border: 'none',
                                                borderRadius: '8px'
                                            }}
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Location Advantage */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>
                                {projectData?.name} Location Advantage
                            </h4>
                            <div className="px-3">
                                <div className="inner-item">
                                    <p className='mb-3 mb-md-4' style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px' }}>
                                        The residential development of <b>{projectData?.name}</b> has been strategically located in Sector-1 Greater Noida West. <b>{projectData?.name} location</b> places you near top schools, colleges, sports complexes, entertainment centers, and much more.
                                    </p>

                                    <div style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>SPORTS FACILITIES</p>
                                        <ul className="mb-4">
                                            <li>Skyjumper trampoline park - 23-minute drive</li>
                                            <li>Golf Course Noida - 25-minute drive</li>
                                            <li>Play All Sports Complex - 19-minute drive</li>
                                        </ul>

                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>ROAD CONNECTIVITY</p>
                                        <ul className="mb-4">
                                            <li>Ek Murti Gol Chakkar - 20-minute drive</li>
                                            <li>Indira Gandhi International Airport - 1 hr 12 minutes drive</li>
                                            <li>Pari Chowk - 25-minute drive</li>
                                        </ul>

                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>PUBLIC TRANSPORT</p>
                                        <ul className="mb-4">
                                            <li>Blue Line Metro Station 52 - 25-minute drive</li>
                                            <li>Sector 101 Metro Station Road Sector 78 - 16-minute drive</li>
                                        </ul>

                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>MEDICAL FACILITIES</p>
                                        <ul className="mb-4">
                                            <li>Saini Hospital - 13-minute drive</li>
                                            <li>Yatharth Hospital - 25-minute drive</li>
                                            <li>Kailash Hospital - 32-minute drive</li>
                                            <li>Nix Multi Speciality Hospital - 10-minute drive</li>
                                        </ul>

                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>ENTERTAINMENT HUB</p>
                                        <ul className="mb-4">
                                            <li>Bhangel Market - 25-minute drive</li>
                                            <li>Gaur City Mall - 19-minute drive</li>
                                            <li>Ace City Square Mall - 13-minute drive</li>
                                        </ul>

                                        <p className="fw-bolder mb-2" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: '#000000' }}>EDUCATIONAL INSTITUTIONS</p>
                                        <ul className="mb-4">
                                            <li>K C International School - 10-minute drive</li>
                                            <li>G D Goenka International School - 17-minute drive</li>
                                            <li>Amity University - 31-minute drive</li>
                                            <li>D.S International School - 7-minute drive</li>
                                            <li>J M International School Greater Noida West - 15-minute drive</li>
                                            <li>Maharishi University Of IT, Noida - 25-minute drive</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Location Map */}
                    <div className="bg-white rounded-3 mb-4">
                        <h2 className="mb-4" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', color: '#000000', fontWeight: 'bold', textAlign: 'left', backgroundColor: '#2067d1', padding: '8px 12px', borderRadius: '4px', color: '#ffffff' }}>
                            ACE Divino Location Map
                        </h2>
                        <div className="row">
                            <div className="col-12">
                                <p className="mb-4 px-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                    Ace Divino is located in <b>Sector-1, Greater Noida west,</b> Uttar Pradesh 201306. The location is easily accessible from all major highways and has good connectivity to nearby areas.
                                </p>
                                <div className="position-relative">
                                    <div style={{ position: 'absolute', width: '80%', height: '100%', background: '#f22a2a00', zIndex: 1 }}></div>
                                    <iframe
                                        title="Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2857262980438!2d77.43616551440543!3d28.56118159405898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef9c39e91025%3A0x7a015a36f37ecdee!2sAce%20Divino!5e0!3m2!1sen!2sin!4v1663676267893!5m2!1sen!2sin"
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
                    <div className="bg-white rounded-3 mb-4">
                        <h2 className="mb-4" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', color: '#ffffff', fontWeight: 'bold', textAlign: 'left', backgroundColor: '#2067d1', padding: '8px 12px', borderRadius: '4px' }}>
                            ACE Divino Site Plan
                        </h2>
                        <div className="row">
                            <div className="col-12">
                                <p className="mb-4 px-3" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                    If we talk about the ACE Divino site plan, it spreads over 10.41 acres of area. In fact, it has 70% Green landscape and its rest 30% will be used for Construction according to sustainable lifestyle living.
                                </p>
                                <div className="position-relative px-3">
                                    <div className="position-relative" style={{ overflow: 'hidden', height: window.innerWidth <= 768 ? '200px' : '400px' }}>
                                        <div
                                            id="image-container"
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img
                                                className="img-fluid"
                                                id="zoom-image"
                                                alt="ACE Divino Site Plan"
                                                src="https://www.investmango.com/img/ace-divino/ace-divino-site-plan.webp"
                                                fetchpriority="high"
                                                style={{
                                                    transform: 'scale(1) translate(0px, 0px)',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    position: 'absolute',
                                                    maxWidth: '100%',
                                                    cursor: 'grab'
                                                }}
                                                onMouseDown={(e) => {
                                                    const img = e.target;
                                                    img.style.cursor = 'grabbing';
                                                    let lastX = e.clientX;
                                                    let lastY = e.clientY;

                                                    const onMouseMove = (moveEvent) => {
                                                        const deltaX = moveEvent.clientX - lastX;
                                                        const deltaY = moveEvent.clientY - lastY;
                                                        lastX = moveEvent.clientX;
                                                        lastY = moveEvent.clientY;

                                                        const transform = img.style.transform;
                                                        const scale = parseFloat(transform.match(/scale\((.*?)\)/)[1]);
                                                        const [translateX, translateY] = transform.match(/translate\((.*?), (.*?)\)/)?.slice(1).map(parseFloat) || [0, 0];

                                                        // Only allow movement if zoomed in
                                                        if (scale > 1) {
                                                            img.style.transform = `scale(${scale}) translate(${translateX + deltaX}px, ${translateY + deltaY}px)`;
                                                        }
                                                    };

                                                    const onMouseUp = () => {
                                                        img.style.cursor = 'grab';
                                                        document.removeEventListener('mousemove', onMouseMove);
                                                        document.removeEventListener('mouseup', onMouseUp);
                                                    };

                                                    document.addEventListener('mousemove', onMouseMove);
                                                    document.addEventListener('mouseup', onMouseUp);
                                                }}
                                            />
                                        </div>
                                        <div className="position-absolute top-0 end-0">
                                            <button
                                                className="d-block border-0 mb-1"
                                                id="zoom-in"
                                                aria-label="Zoom In"
                                                style={{
                                                    background: '#dddd',
                                                    width: '40px',
                                                    height: '40px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    const img = document.getElementById('zoom-image');
                                                    const currentScale = parseFloat(img.style.transform.match(/scale\((.*?)\)/)[1]);
                                                    const [translateX, translateY] = img.style.transform.match(/translate\((.*?), (.*?)\)/)?.slice(1).map(parseFloat) || [0, 0];
                                                    img.style.transform = `scale(${Math.min(3, currentScale * 1.2)}) translate(${translateX}px, ${translateY}px)`;
                                                }}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="d-block border-0"
                                                id="zoom-out"
                                                aria-label="Zoom Out"
                                                style={{
                                                    background: '#dddd',
                                                    width: '40px',
                                                    height: '40px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    const img = document.getElementById('zoom-image');
                                                    const currentScale = parseFloat(img.style.transform.match(/scale\((.*?)\)/)[1]);
                                                    const [translateX, translateY] = img.style.transform.match(/translate\((.*?), (.*?)\)/)?.slice(1).map(parseFloat) || [0, 0];
                                                    img.style.transform = `scale(${Math.max(1, currentScale / 1.2)}) translate(${translateX}px, ${translateY}px)`;
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* about group */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '16px' : '18px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>About ACE Group</h4>
                            <div className="row px-3">
                                <div className="col-12">
                                    <div className="d-flex align-items-center mb-4 px-3">
                                        <img
                                            src="https://www.investmango.com/img/developer-img/ace-group.webp"
                                            className="img-fluid me-3"
                                            alt="ACE Group logo"
                                            style={{ maxWidth: '120px' }}
                                            fetchpriority="high"
                                        />
                                        <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                            ESTABLISHED IN - <b>2010</b><br />
                                            TOTAL PROJECTS - <b>10+</b>
                                        </p>
                                    </div>

                                    <p className="mb-4" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                        <b>Ace Group of India</b> wants to deliver your 'dream home' - where you can enjoy the luxury in your personal space. Under the leadership of Mr.Ajay Ch . . .
                                    </p>

                                    <a href="developer.php/2/ace-group" className="btn btn-primary mb-4" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>Read More</a>

                                    <h4 className="fw-bold mb-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '18px' }}>Contact Details</h4>

                                    <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
                                        <b>ACE Divino</b><br />
                                        <b>Address:</b> GH-14A, Sector-1, Greater Noida West,
                                        Uttar Pradesh 201306<br />
                                        <b>Phone:</b> <a href="tel:+918595-189-189" style={{ textDecoration: 'none' }}>+91-8595-189-189</a><br />
                                        <b>Book Your Site Visit</b> <span style={{ cursor: 'pointer', color: '#2067d1', fontWeight: 700 }} id="BookBtn3">Click Here</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Frequently Asked Questions */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>
                                Frequently Asked Questions (FAQs)
                            </h4>
                            <div className="px-3">
                                <script type="application/ld+json">
                                    {/* JSON-LD content */}
                                </script>

                                {[
                                    {
                                        question: "Why to choose ACE Divino for investment?",
                                        answer: <>
                                            <p style={{ fontSize: '12px' }}>There are countless reasons to choose ACE Divino in Sector-1, Greater Noida West, some of the prominent reasons to choose ACE Divino are as follows -</p>
                                            <ul style={{ fontSize: '12px' }}>
                                                <li>Only 3 Apartments on a Single Floor for Privacy</li>
                                                <li>A Skywalk is developed for the Inter-Walking Tower</li>
                                                <li>One main clubhouse with 2 Mini Clubhouses</li>
                                            </ul>
                                        </>
                                    },
                                    {
                                        question: "What is the location of the project?",
                                        answer: "The ace divino address is Plot no GH-14A, Sector-1, Greater Noida West, Uttar Pradesh 201306."
                                    },
                                    {
                                        question: "What is the RERA Number of ACE Divino?",
                                        answer: "ACE Divino RERA Number is UPRERAPRJ6734."
                                    },
                                    {
                                        question: "What is the project area of ACE Divino?",
                                        answer: "The ACE Divino project is spread over a total land area of 10.41 acres."
                                    },
                                    {
                                        question: "On which date it was launched?",
                                        answer: "ACE Divino was launched in May 2017."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="mb-3">
                                        <div
                                            className="d-flex justify-content-between align-items-center p-3"
                                            style={{
                                                backgroundColor: expandedIndex === index ? '#f8f9fa' : 'white',
                                                cursor: 'pointer',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '4px',
                                                fontSize: window.innerWidth <= 768 ? '12px' : '13px'
                                            }}
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                        >
                                            <span className="fw-bold">{faq.question}</span>
                                            <span>{expandedIndex === index ? '−' : '+'}</span>
                                        </div>
                                        {expandedIndex === index && (
                                            <div className="p-3" style={{ border: '1px solid #dee2e6', borderTop: 'none', borderRadius: '0 0 4px 4px', fontSize: window.innerWidth <= 768 ? '12px' : '13px' }}>
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Similar Projects */}
                    <div className="mb-4" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="p-0 pb-2">
                            <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', backgroundColor: '#2067d1', borderRadius: '4px 4px 0 0' }}>Similar Projects</h4>
                            <div className="row">
                                <div className="col-md-12">
                                    <div style={{ position: 'relative' }}>
                                        <Carousel
                                            containerClass="carousel-container"
                                            itemClass="carousel-item-padding-40-px"
                                            style={{ width: '60%', margin: '0 auto' }}
                                            focusOnSelect={false}
                                            responsive={{
                                                desktop: {
                                                    breakpoint: { max: 3000, min: 1024 },
                                                    items: 4,
                                                    slidesToSlide: 1
                                                },
                                                tablet: {
                                                    breakpoint: { max: 1024, min: 464 },
                                                    items: 2,
                                                    slidesToSlide: 1
                                                },
                                                mobile: {
                                                    breakpoint: { max: 464, min: 0 },
                                                    items: 1,
                                                    slidesToSlide: 1
                                                }
                                            }}
                                        >
                                            {similarProjects.map((project, index) => (
                                                <div key={index} className="px-2">
                                                    <div className="similar_projects_item">
                                                        <div style={{ color: '#000' }}>
                                                            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none' }}>
                                                                <img
                                                                    src={project.imageUrl}
                                                                    alt={project.name}
                                                                    style={{ height: '150px', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                                                />
                                                                <p style={{ color: '#2067d1', fontWeight: 600, margin: '10px 0', fontSize: window.innerWidth <= 768 ? '14px' : '16px', lineHeight: '20px', minHeight: '45px' }}>
                                                                    {project.name}
                                                                </p>
                                                            </a>
                                                            <div className="project-details">
                                                                <p className="mb-1" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '13px' }}><i className="fas fa-map-marker-alt me-2"></i>{project.location}</p>
                                                                {project.sizeInfo && <p className="mb-1" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '13px' }}><i className="fa fa-bed me-2"></i>Size Info: {project.sizeInfo}</p>}
                                                                {project.startingPrice && (
                                                                    <p className="mb-1" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '13px' }}>
                                                                        Starting <i className="fas fa-rupee-sign me-1"></i>
                                                                        <b>{project.startingPrice}</b>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
                    <div className="position-sticky" style={{ top: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="bg-white rounded-3 mb-4 p-4 pb-0">
                            <h4 className="mb-4 text-center">Connect to Our Expert</h4>
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
                                                style={{ maxWidth: '100px' }}
                                                value={formData.dial_code}
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
                                        <label className="form-label fw-bold">I am interested in</label>
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
                                            onClick={verifyOtp}
                                        >
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
                                    <button type="submit" className="btn btn-primary w-100">
                                        Submit
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="bg-white rounded-3 p-3 pt-0 text-center d-flex justify-content-center">
                            <button 
                                className="btn btn-primary w-100"
                                style={{ fontSize: '16px' }}
                            >
                                <i className="fas fa-download me-2"></i>
                                DOWNLOAD BROCHURE
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </section>

    </div>;
};

export default ProjectDetails;
