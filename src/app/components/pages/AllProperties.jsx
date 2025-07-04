import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import {
  getAllFloor,
  getAllLocalities,
  getAllProperties,
  getAllProjectsByUrlName,
  getAllProjectsByType,
  saveProperty,
} from "../../apis/api";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import AddProject from "./ProjectDetailsParts/AddProject/AddProject"; // <-- import your modal

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState(""); // "COMMERCIAL" or "RESIDENTIAL"
  const [projects, setProjects] = useState([]); // Start with empty, only fill from API
  const [selectedProject, setSelectedProject] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const navigate = useNavigate();

  // Add state for all form fields
  const [propertyType, setPropertyType] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [facing, setFacing] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [balconyCount, setBalconyCount] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [coveredParking, setCoveredParking] = useState("");

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
    setProperties(data.data?.data || []);
    setTotalPages(data.data?.pagination?.total_pages || 1);
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
    window.open(
      `/propertyforsale/${url.toLowerCase().replace(/\s+/g, "-")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const BASE_URL = "https://myimwebsite.s3.ap-south-1.amazonaws.com/images";

  // Handler for property type selection
  const handleTypeSelect = async (type) => {
    setSelectedType(type);
    setShowAddModal(false);
    try {
      const projectsList = await getAllProjectsByType(type);
      setProjects(projectsList);
    } catch (e) {
      setProjects([]);
    }
    setShowDetailsModal(true);
  };

  // Handler for closing details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProject("");
    // Optionally reset all fields here
  };

  // Handler for confirm
  const handleConfirm = async () => {
    // Find the selected project name
    const selectedProjectObj = projects.find((proj) => proj.project_id === selectedProject);
    const projectName = selectedProjectObj ? selectedProjectObj.project_name : '';
    // Gather all modal field values as per required API JSON
    const propertyData = {
      project_id: selectedProject, // project_id
      name: projectName, // name
      property_type: propertyType, // property_type
      age_of_property: ageOfProperty, // age_of_property
      floor_number: floorNo, // floor_number
      facing: facing, // facing
      furnishing: furnishing, // furnishing
      balcony_count: balconyCount, // balcony_count
      bedrooms_count: bedroomCount, // bedrooms_count
      covered_parking: coveredParking, // covered_parking
    };

    try {
      await saveProperty(propertyData);
      setShowDetailsModal(false);
      // Pass data to PropertyDetails page via state
      navigate(`/propertyforsale/`, { state: propertyData });
    } catch (error) {
      alert('Error saving property: ' + error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Top Property in Noida</title>
        <meta
          content="Invest mango have a lot of projects in Noida, Greater Noida, or Noida Extension. All projects are affordable or luxury."
          name="description"
        />
        <link rel="canonical" href="https://www.investmango.com/allProperties" />
        <link
          rel="shortcut icon"
          type="image/icon"
          href="https://www.investmango.com/favicon.ico"
        />
      </Helmet>

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
                        marginRight: "160px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSyncAlt}
                        style={{ marginRight: "5px" }}
                      />
                    </button>

                    {/* Add Property Button */}
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        fontWeight: "bold",
                        height: "38px",
                        minWidth: "120px",
                        backgroundColor: "#2067d1",
                      }}
                      onClick={() => setShowAddModal(true)}
                    >
                      Add Property
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
                  {Array.isArray(properties) && properties.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      No properties found.
                    </div>
                  ) : (
                    Array.isArray(properties) && properties.length > 0 && (
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
                                  <a href={`/propertyforsale/${property?.id}`}>
                                    <img
                                      className="img-fluid"
                                      alt={property.name}
                                      src={
                                        property.images && property.images.length > 0
                                          ? property.images[0]
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
                                        <b>{property.name}</b>
                                      </p>
                                    </div>

                                    <h6 className="card-text">
                                      {property.name}
                                      <br />
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#a1a1a1",
                                        }}
                                      >
                                        BY {property.developer_name}
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
                                        <i className="fas fa-home"></i> Built-up Area
                                        <br />
                                        <strong>{property.built_up_area}</strong>
                                      </div>
                                      <div style={{ flex: "1 1 30%" }}>
                                        <i className="far fa-calendar-alt"></i> Possession Status
                                        <br />
                                        <strong>{property.possession_status}</strong>
                                      </div>
                                      <div style={{ flex: "1 1 30%" }}>
                                        <i className="fas fa-compass"></i> Facing
                                        <br />
                                        <strong>{property.facing}</strong>
                                        <div style={{ marginTop: 4 }}>
                                          <i className="fas fa-map-marker-alt"></i> Location
                                          <br />
                                          <strong>{property.location}</strong>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleMoreDetail(property?.id)}
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
                      </>
                    )
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
                        src="images/Image-01.jpg"
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
                                  src="images/Image-02.jpg"
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
                                  src="images/Image-03.jpg"
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

      {/* Modal for Add Property */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="add-property-modal"
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              width: "900px", // Increased width for desktop
              maxWidth: "98vw",
              minWidth: "0",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              textAlign: "center",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 24,
                background: "transparent",
                border: "none",
                fontSize: 32,
                color: "#e74c3c",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2
              style={{
                textAlign: "left",
                fontWeight: 700,
                fontSize: 24,
                margin: "0 0 32px 0",
                paddingLeft: 4,
              }}
            >
              Select Property Type
            </h2>
            <div
              style={{
                display: "flex",
                gap: 32,
                justifyContent: "center",
              }}
            >
              {/* Commercial Property Card */}
              <div
                style={{
                  background: "#eaf6ff",
                  borderRadius: "10px",
                  width: 340,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "32px 24px 0 24px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(32,103,209,0.10)",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => handleTypeSelect("COMMERCIAL")}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                    color: "#222",
                    marginBottom: 0,
                    marginTop: 0,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Commercial Property
                </div>
                <img
                  src="/images/commercial-property.png"
                  alt="Commercial Property"
                  style={{
                    width: "90%",
                    height: "auto",
                    objectFit: "contain",
                    alignSelf: "flex-end",
                    marginTop: "auto",
                    marginBottom: "0",
                  }}
                />
              </div>
              {/* Residential Property Card */}
              <div
                style={{
                  background: "#ffeaf2",
                  borderRadius: "20px",
                  width: 340,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "32px 24px 0 24px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(209,32,103,0.10)",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => handleTypeSelect("RESIDENTIAL")}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                    color: "#222",
                    marginBottom: 0,
                    marginTop: 0,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Residential Property
                </div>
                <img
                  src="/images/residential-property.png"
                  alt="Residential Property"
                  style={{
                    width: "90%",
                    height: "auto",
                    objectFit: "contain",
                    alignSelf: "flex-end",
                    marginTop: "auto",
                    marginBottom: "0",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Modal: Project Select + Property Details */}
      {showDetailsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px 32px",
              width: "90vw",
              maxWidth: "600px",
              minWidth: "0",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={handleCloseDetailsModal}
              style={{
                position: "absolute",
                top: 18,
                right: 24,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#e74c3c",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2
              style={{
                fontWeight: 700,
                fontSize: 22,
                margin: "0 0 24px 0",
                textAlign: "left",
              }}
            >
              Add a Property
            </h2>
            <div
              style={{
                marginBottom: 18,
                textAlign: "left",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Select Project</span>
              <span
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowAddProjectModal(true);
                }}
                style={{
                  fontSize: 13,
                  color: "#2067d1",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Not in List? Add New
              </span>
            </div>
            <Select
              options={projects.map((proj) => ({ value: proj.project_id, label: proj.project_name }))}
              value={
                selectedProject
                  ? projects.find((proj) => proj.project_id === selectedProject)
                    ? { value: selectedProject, label: (projects.find((proj) => proj.project_id === selectedProject).project_name) }
                    : null
                  : null
              }
              onChange={(option) => setSelectedProject(option ? option.value : "")}
              placeholder="Select Project"
              isClearable
              styles={{
                container: (base) => ({ ...base, marginBottom: 18 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Property Type
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select</option>
                  <option value="Apartments">Apartments</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Age of Property
                </div>
                <input
                  type="text"
                  value={ageOfProperty}
                  onChange={(e) => setAgeOfProperty(e.target.value)}
                  placeholder="2 Years"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Floor No.
                </div>
                <input
                  type="text"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                  placeholder="14"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Configuration
                </div>
                <select
                  value={configuration}
                  onChange={(e) => setConfiguration(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Facing</div>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select</option>
                  <option value="North - East">North - East</option>
                  <option value="South - West">South - West</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Furnishing</div>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Balcony Count
                </div>
                <input
                  type="text"
                  value={balconyCount}
                  onChange={(e) => setBalconyCount(e.target.value)}
                  placeholder="2"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Bedroom Count
                </div>
                <input
                  type="text"
                  value={bedroomCount}
                  onChange={(e) => setBedroomCount(e.target.value)}
                  placeholder="2"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  Covered Parking
                </div>
                <input
                  type="text"
                  value={coveredParking}
                  onChange={(e) => setCoveredParking(e.target.value)}
                  placeholder="2"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  borderRadius: 8,
                  background: "#2067d1",
                  marginTop:"29px",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 0,
                  maxWidth: "100%",
                  height: "40px",
                  boxShadow: "0 2px 8px rgba(32,103,209,0.10)",
                  marginLeft: 12
                }}
              >
                Confirm
              </button>
            </div>

            {/* AddProject Modal */}
            {showAddProjectModal && (
              <AddProject
                show={showAddProjectModal}
                handleClose={() => setShowAddProjectModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyListing;
