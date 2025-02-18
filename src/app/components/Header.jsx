import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/header.css";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getAllProject } from "../apis/api";
// import { getAllProject } from "../../apis/api";
import logo from "../assets/img/logo.jpg";
import { Button } from "@mui/material";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Container, Navbar } from "react-bootstrap";
import navItems from "../../utils/navbar";
import Form from "react-bootstrap/Form";
import { FaSearch, FaPhoneAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // Import useLocation

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


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
        navigate(`/project/${matchedProject.url}`);
        return;
      }
      queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    }

    if (queryParams.length > 0) {
      navigate(`/allProjects?${queryParams.join("&")}`);
    }
    setShowSearch(false); // Hide search input after navigation
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse) {
        navbarCollapse.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Search Visibility
  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    setShowSearch(false); // Hide search input when route changes
    setSearchQuery(""); // Clear search input
  }, [location.pathname]);
  
  return (
    <Navbar bg="light" expand="lg" className={`custom-navbar ${isSticky ? "sticky" : ""}`}>
      <Container>
        <Navbar.Brand href="https://propertymarvels.in">
          <img
            src={logo}
            alt="Invest Mango"
            title="Invest Mango"
            className="logo-img"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" >
            {navItems.map((item, index) =>
              item.dropdown ? (
                <NavDropdown
                  title={item.label}
                  id={`nav-dropdown-${index}`}
                  key={index}
                >
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavDropdown.Item
                      href={subItem.path}
                      key={subIndex}
                      target="_blank"
                      style={{ paddingLeft: 2, paddingRight: 4 }}
                    >
                      {subItem.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <Nav.Link href={item.path} key={index}   style={{ paddingLeft: 2, paddingRight: 4 }}>
                  {item.label}
                </Nav.Link>
              )
            )}
            <Nav>
              {/* Search Button */}
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

              {/* Phone Buttons */}
              <button className="phoneButton" style={{ marginLeft: "50px",marginLeft: '169px', display: window.innerWidth <= 1250 ? "none" : "block" ,background: '#2067d1'}}>

                <a href="tel:+918595189189">
                  <FaPhoneAlt /> 8595-189-189
                </a>
              </button>
              <button className="phoneButton" style={{display: window.innerWidth <= 991 ? "none" : "block"  ,background: '#2067d1'}}>
                <a href="tel:+917428189189">
                  <FaPhoneAlt /> 7428-189-189
                </a>
              </button>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
