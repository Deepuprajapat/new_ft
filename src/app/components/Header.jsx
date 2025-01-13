import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/header.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.jpg";
// import Login from "./pages/Login/Login";
import { Button } from "@mui/material";
import { currentUser } from "../apis/api";
// import { currentUser } from "apis/api";/
import Nav from "react-bootstrap/Nav";
// import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from "react-bootstrap/NavDropdown";
import { Container, Navbar, NavbarBrand } from "react-bootstrap";
// import navItems from "../../utils/navbar";
import navItems from "../../utils/navbar";
import Form from "react-bootstrap/Form";
import { FaSearch, FaPhoneAlt } from "react-icons/fa";

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [username, setUserName] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const openModal = () => {
    setModal(true); // Open the modal
  };

  const closeModal = () => {
    setModal(false); // Close the modal
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // console.log("token::::", token);
    if (token) {
      currentUser(token)
        .then((response) => {
          // console.log("responce check neeshu",JSON.stringify(response.data.firstName));
          if (response?.data?.firstName && response?.data?.lastName) {
            const fullName = `${response.data.firstName} ${response.data.lastName}`;
            setUserName(fullName);
            localStorage.setItem("username", fullName);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
        });
    }
  }, []);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value;
    if (searchTerm) {
      window.location.href = `/allProjects?search=${encodeURIComponent(
        searchTerm
      )}`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (window.scrollY > 0) {
        navbarCollapse.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="http://localhost:3000">
          {" "}
          <img
            src={logo}
            alt="Invest Mango"
            title="Invest Mango"
            className="logo-img"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
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
                    >
                      {subItem.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <Nav.Link href={item.path} key={index} target="_blank">
                  {item.label}
                </Nav.Link>
              )
            )}
            <Nav>
              <div className="search-form-container">
                {/* Search button */}
                <button
                  onClick={handleSearchClick}
                  variant="light"
                  className="search-button"
                >
                  <FaSearch />
                </button>

                {/* Conditionally render the search input */}
                {showSearch && (
                  <div className="search-overlay">
                    <Form className="d-flex" onSubmit={handleSearchSubmit}>
                      <Form.Control
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="search-input"
                        aria-label="Search"
                      />
                      <Button type="submit" variant="primary">
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
              <button className="phoneButton">
                <a href="tel:+918595-189-189">
                  <FaPhoneAlt /> 8595-189-189
                </a>
              </button>
              <button className="phoneButton">
                <a href="tel:+918595-189-189">
                  <FaPhoneAlt /> 7428-189-189
                </a>
              </button>
              {/* <Login isOpen={modal} onClose={closeModal} /> */}
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
