import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/header.css";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getAllProject, getAllLocalities } from "../apis/api";
import logo from "../assets/img/Untitled-1.png";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Container, Navbar } from "react-bootstrap";
import navItems from "../../utils/navbar";
import Form from "react-bootstrap/Form";
import { FaSearch, FaPhoneAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import AddProject from "./pages/ProjectDetailsParts/AddProject/AddProject";
import LogoutModal from "./LogoutModal";

const Header = ({ projectPhoneNumber }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
   
  // Check if user is authenticated by looking for token in cookie or localStorage
  const getAuthToken = () => {
    // Try to get token from cookie first
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();

    // Fallback to localStorage
    return localStorage.getItem("auth-token");
  };

  // Check authentication status on component mount and route changes
  useEffect(() => {
    setIsAuthenticated(getAuthToken());
  }, [location]);

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    // Clear authentication tokens from both localStorage and cookies
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userName");
        
    setShowLogoutModal(false);
    navigate('/')
    window.location.reload();
  };

  // Sticky Navbar on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced API call for searching projects
  const debouncedSearch = debounce(async (query) => {
    if (query.trim() === "") {
      setProjectSuggestions([]);
      return;
    }
    const response = await getAllProject({ name: query });
    setProjectSuggestions(response.content || []);
    setShowSuggestions(true);
  }, 500);

  // Handle Search Change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];

    if (searchQuery) {
      const matchedProject = projectSuggestions.find(
        (project) => project.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (matchedProject) {
        navigate(`/${matchedProject.url}`);
        return;
      }
      queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    }

    if (queryParams.length > 0) {
      navigate(`/allProjects?${queryParams.join("&")}`);
    }
    setShowSearch(false); // Hide search input after navigation
  };



  // Toggle Search Visibility
  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    setShowSearch(false); // Hide search input when route changes
    setSearchQuery(""); // Clear search input
    setExpanded(false); // Close mobile menu when route changes
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle nav link clicks
  const handleNavLinkClick = (path) => {
    setExpanded(false);
    window.location.href = path;
  };

  return (
     <Navbar
     bg="light"
     expand="lg"
     expanded={expanded}
     onToggle={setExpanded}
     className={`custom-navbar ${isSticky ? "sticky" : ""}`}
   >
     <Container>
       <Navbar.Brand href="https://www.investmango.com/">
         <img
           src={logo}
           loading="lazy"
           alt="Invest Mango"
           title="Invest Mango"
           className="logo-img"
         />
       </Navbar.Brand>
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
       <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <NavDropdown
                title={item.label}
                id={`nav-dropdown-${index}`}
                key={index}
                style={{ paddingBottom: "0px" }}
              >
                {item.dropdown.map((subItem, subIndex) => (
                  <NavDropdown.Item
                    key={subIndex}
                    onClick={(e) => {
                      e.preventDefault();
                      if (subItem.label === 'Add Project') {
                        setExpanded(false);
                        setShowAddProjectModal(true);
                      } else {
                        handleNavLinkClick(subItem.path);
                      }
                    }}
                    style={{ paddingLeft: 2, paddingRight: 4, borderBottom:"1px solid #d4cfcf", textAlign: 'center'}}
                  >
                    {subItem.label}
                  </NavDropdown.Item>
                ))}
                {isAuthenticated && (
                  <AddProject 
                    show={showAddProjectModal} 
                    handleClose={() => {
                      setShowAddProjectModal(false);
                      setExpanded(false);
                    }} 
                  />
                )}
              </NavDropdown>
            ) : (
              <Nav.Link
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick(item.path);
                }}
                style={{ paddingLeft: 2, paddingRight: 4, cursor: 'pointer' }}
              >
                {item.label}
              </Nav.Link>
            )
          )}
        </Nav>
        <Nav className="align-items-center">
          {/* Search Button */}
          {isDesktop && (
            <div className="search-form-container">
              <button onClick={handleSearchClick} className="search-button">
                <FaSearch />
              </button>

              {/* Search Input */}
              {showSearch && (
                <div className="search-overlay">
                  <Form className="d-flex" onSubmit={handleSearchSubmit}>
                    <Form.Control
                      type="search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search"
                      className="search-input"
                      aria-label="Search"
                    />
                  </Form>
                </div>
              )}
            </div>
          )}
          
          {/* Phone Buttons Container */}
          <div className="phone-buttons-container">
            {projectPhoneNumber ? (
              <button className="phoneButton">
                <a href={`tel:${projectPhoneNumber}`}>
                  <FaPhoneAlt /> {projectPhoneNumber}
                </a>
              </button>
            ) : (
              <>
                <button className="phoneButton">
                  <a href="tel:+918595189189">
                    <FaPhoneAlt /> 8595-189-189
                  </a>
                </button>
                <button className="phoneButton">
                  <a href="tel:+917428189189">
                    <FaPhoneAlt /> 7428-189-189
                  </a>
                </button>
              </>
            )}
            {/* Logout Button - Only visible when authenticated */}
            {isAuthenticated && (
              <button
                className="phoneButton"
                style={{ background: "#dc3545" }}
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            )}
          </div>
        </Nav>
      </Navbar.Collapse>
    </Container>
    {/* Logout Confirmation Modal */}
    <LogoutModal
      show={showLogoutModal}
      handleClose={() => setShowLogoutModal(false)}
      handleConfirm={handleLogoutConfirm}
    />
  </Navbar>
);
};

export default Header;
