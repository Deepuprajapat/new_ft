import React, { useState, useEffect } from "react";
import {
  getAllFloor,
  getAllLocalities,
  getAllProperties,
} from "../../apis/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const PropertyListing = () => {
  const [propertyTypes, setPropertyTypes] = useState([
    "RESIDENTIAL",
    "COMMERCIAL",
  ]); // Default static values
  const [configurations, setConfigurations] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedConfiguration, setSelectedConfiguration] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of items per page

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [
    currentPage,
    selectedPropertyType,
    selectedConfiguration,
    selectedLocality,
  ]);

  const fetchProperties = async (page) => {
    const data = await getAllProperties(
      page,
      pageSize,
      selectedPropertyType || "",
      selectedConfiguration || "",
      selectedLocality || ""
    );
    setProperties(data.content);
    setTotalPages(data.totalPages);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all floor plans
        const floors = await getAllFloor();
        if (floors.length) {
          // Extract unique property types and configurations
          const uniquePropertyTypes = [
            ...new Set(floors.map((floor) => floor.propertyType.toUpperCase())),
          ];
          const uniqueConfigurations = [
            ...new Set(floors.map((floor) => floor.projectConfigurationName)),
          ];

          // Merge dynamic types with static values
          setPropertyTypes((prev) => [
            ...new Set([...prev, ...uniquePropertyTypes]),
          ]);
          setConfigurations(uniqueConfigurations);
        }

        const response = await getAllLocalities();
        setLocalities(response);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString(); // For smaller values, format with commas
  };

  const handleMoreDetail = (url) => {
    console.log(url);
    window.open(
      `/propertyforsale/${url.toLowerCase().replace(/\s+/g, "-")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const BASE_URL = "https://myimwebsite.s3.ap-south-1.amazonaws.com/images";

  return (
    <>

<title>Top Property in Noida</title>
    <meta content="Invest mango have a lot of projects in Noida, Greater Noida, or Noida Extension. All projects are affordable or luxury." name="description"/>
    <link rel="canonical" href="https://www.investmango.com/property.php"/>
   <link rel="shortcut icon" type="image/icon" href="https://www.investmango.com/favicon.ico" />
    <section className="main-body" style={{ marginTop: "5px" }}>
      <div className="main-con">
        <div className="container">
          <span>
            <Link to="/" style={{ color: "black" }}>
              Home
            </Link>{" "}
            / All Property
          </span>
          <h2 style={{ textAlign: "center" }}>Property For Sale</h2>

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="filters d-flex flex-wrap">
                  <select
                    name="propertyType"
                    value={selectedPropertyType}
                    onChange={(e) => setSelectedPropertyType(e.target.value)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">All Property Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <select
                    name="configuration"
                    value={selectedConfiguration}
                    onChange={(e) => setSelectedConfiguration(e.target.value)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">All Configurations</option>
                    {configurations.map((config) => (
                      <option key={config} value={config}>
                        {config}
                      </option>
                    ))}
                  </select>

                  <select
                    name="locality"
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">All Localities</option>
                    {localities.map((city) => (
                      <option key={city.id} value={city.id}>
                      {city.name.toUpperCase()} {/* Convert to uppercase */}
                      </option>
                    ))}
                  </select>

                  {/* Reset Button with Refresh Icon */}
                  <button
                    onClick={() => {
                      setSelectedPropertyType("");
                      setSelectedConfiguration("");
                      setSelectedLocality("");
                    }}
                    style={{
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: "10px",
                      backgroundColor: "#2067d1",
                      color: "#fff",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSyncAlt}
                      style={{ marginRight: "5px" }}
                    />
                   
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="listing-home listing-page">
            <div className="listing-slide row">
              <div
                className="col-md-8 sticky-scroll"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh", // Set a max height relative to the viewport
                  overflowY: "auto", // Enable vertical scrolling
                  paddingRight: "10px", // Avoid scrollbar overlapping content
                }}
              >
                {properties.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    No properties found.
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px", // Adds spacing between cards
                      }}
                    >
                      {properties.map((property) => (
                        <div
                          className="card mb-3"
                          style={{
                            maxWidth: "100%",
                            borderRadius: "10px",
                            padding: "10px",
                            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          }}
                          key={property.id}
                        >
                          <div className="row g-0">
                            <div className="col-md-4">
                              <a href={`/propertyforsale/${property?.url}`}>
                                <img
                                  className="img-fluid"
                                  alt={property.propertyName}
                                  src={
                                    property.images &&
                                    property.images.length > 0
                                      ? property.images[0].startsWith("http")
                                        ? property.images[0]
                                        : `${BASE_URL}/${property.images[0]}`
                                      : "default-image.jpg"
                                  }
                                  loading="lazy"
                                  style={{
                                    maxWidth: "100%",
                                    borderRadius: "10px",
                                    height: "220px",
                                    objectFit: "cover",
                                    padding: "5px",
                                  }}
                                />
                              </a>
                            </div>
                            <div className="col-md-8">
                              <div
                                className="card-body"
                                style={{ fontSize: "smaller" }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <p className="card-title">
                                    <b> ₹{formatPrice(property?.price)}</b>
                                  </p>
                                </div>

                                <h6 className="card-text">
                                  {property?.propertyName}
                                  <br />
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      color: "#a1a1a1",
                                    }}
                                  >
                                    BY {property?.developerName}
                                  </span>
                                </h6>
                                <div
                                  className="property-info"
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                  }}
                                >
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="fas fa-home"></i> Built-up
                                    Area
                                    <br />
                                    <strong>{property?.builtupArea}</strong>
                                  </div>
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="far fa-calendar-alt"></i>{" "}
                                    Possession Date
                                    <br />
                                    <strong>{property?.possessionDate}</strong>
                                  </div>
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="fas fa-tools"></i>{" "}
                                    Construction Status
                                    <br />
                                    <strong>
                                      {property?.possessionStatus}
                                    </strong>
                                  </div>
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="fas fa-layer-group"></i> Unit
                                    Available
                                    <br />
                                    <strong>{property?.floors}</strong>
                                  </div>
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="fas fa-compass"></i> Facing
                                    <br />
                                    <strong>{property?.facing}</strong>
                                  </div>
                                  <div style={{ flex: "1 1 30%" }}>
                                    <i className="fas fa-map-marker-alt"></i>{" "}
                                    Location
                                    <br />
                                    <strong>{property?.propertyAddress}</strong>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleMoreDetail(property?.url)
                                  }
                                  className="theme-btn"
                                >
                                  Contact Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Pagination Controls */}
                  </>
                )}
              </div>

              {/* Carousel Section */}
              <>
                <style>
                  {`
      @media (max-width: 767px) {
        #carousel {
          display: none !important;
        }
      }
    `}
                </style>

                <div className="col-md-4" id="carousel">
                  <div
                    className="bord"
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <img
                      src="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
                      className="d-block w-100"
                      alt="Top Image"
                      loading="lazy"
                      style={{
                        borderRadius: "10px",
                        height: "262px",
                        marginBottom: "31px",
                      }}
                    />
                    <div
                      id="carouselExampleIndicators"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <div className="row">
                            <div className="col-md-6">
                              <img
                                src="https://www.investmango.com/img/ace-divino/ace-divino-dinning-room.webp"
                                className="d-block w-100"
                                alt="First Slide"
                                loading="lazy"
                                style={{
                                  borderRadius: "10px",
                                  height: "131px",
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <img
                                src="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
                                className="d-block w-100"
                                alt="Second Slide"
                                loading="lazy"
                                style={{
                                  borderRadius: "10px",
                                  height: "131px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Add more carousel items as needed */}
                      </div>
                    </div>
                  </div>
                </div>
              </>

              {/* End of Carousel Section */}

              <div
                className="pagination-controls"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>{" "}
                  {/* Left arrow icon */}
                </button>
                <span className="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                >
                  <i className="fas fa-chevron-right"></i>{" "}
                  {/* Right arrow icon */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default PropertyListing;
