import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/header.css"; // Make sure to link to the updated CSS file
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.jpg";

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (window.scrollY > 0) {
        navbarCollapse.classList.remove("show");
      } else {
        navbarCollapse.classList.add("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light py-2">
        <div className="container">
          {/* Logo and Brand */}
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Invest Mango" title="Invest Mango" className="logo-img" />
          </NavLink>

          {/* Toggler for Mobile */}
          <button
            type="button"
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbar"
            aria-controls="navbar"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">Home</NavLink>
              </li>

              {/* About Us Dropdown */}
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="aboutDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  About Us
                </Link>
                <ul className="dropdown-menu" aria-labelledby="aboutDropdown">
                  <li><Link className="dropdown-item" to="/about">About</Link></li>
                  <li><Link className="dropdown-item" to="/faq">FAQ</Link></li>
                  <li><Link className="dropdown-item" to="/video">Our Videos</Link></li>
                </ul>
              </li>

              {/* Our Projects Dropdown */}
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="projectsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Our Projects
                </Link>
                <ul className="dropdown-menu" aria-labelledby="projectsDropdown">
                  <li><Link className="dropdown-item" to="/allProjects">All Projects</Link></li>
                  <li><Link className="dropdown-item" to="/allProperties">Properties</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink to="/mango-insights" className="nav-link">Mango Insights</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/career" className="nav-link">Career</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
              </li>

              {/* Search Icon */}
              <li className="nav-item">
                <button onClick={toggleSearch} className="btn btn-link p-0">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </li>
            </ul>

            {/* Search Input */}
            {isSearchVisible && (
              <form action="/search" method="GET" autoComplete="off" className="header_search_form">
                <input
                  type="search"
                  name="search"
                  className="header_search"
                  placeholder="Search using Project Name"
                />
              </form>
            )}
          </div>

          {/* Call-to-Action Buttons */}
          <div className="call-btn d-none d-lg-flex">
            <a href="tel:+919595-189-189" className="btn btn-primary btn-sm">
              <i className="fas fa-phone-alt"></i> 8595-189-189
            </a>
            <a href="tel:+917428-189-189" className="btn btn-primary btn-sm ml-2">
              <i className="fas fa-phone-alt"></i> 7428-189-189
            </a>
          </div>

          {/* Call-to-Action for Mobile */}
          <div className="call-btn d-lg-none">
            <a href="tel:+919595-189-189" className="btn btn-primary btn-sm">
              <i className="fas fa-phone-alt"></i>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
