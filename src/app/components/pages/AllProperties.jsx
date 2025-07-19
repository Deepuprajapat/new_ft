import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import {
  getAllFloor,
  getAllLocations,
  getAllProperties,
  getAllProjectsByType,
  saveProperty,
} from "../../apis/api";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import AddProject from "./ProjectDetailsParts/AddProject/AddProject";

const PropertyListing = () => {
  const [propertyTypes, setPropertyTypes] = useState([
    "RESIDENTIAL",
    "COMMERCIAL",
  ]);
  const [configurations, setConfigurations] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedConfiguration, setSelectedConfiguration] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const navigate = useNavigate();

  // Form fields state
  const [propertyType, setPropertyType] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [facing, setFacing] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [balconyCount, setBalconyCount] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [coveredParking, setCoveredParking] = useState("");
  const [propertyUrl, setPropertyUrl] = useState("");

  const pageSize = 10;
  const [projectId, setProjectId] = useState("");
  const [allConfigurations, setAllConfigurations] = useState([]);

  const HARDCODED_CONFIGURATIONS = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "5 BHK",
    "Studio",
    "Shop",
    "Office",
    "Villa",
    "Plot"
  ];

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Fetch properties when filters or page changes
  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, selectedPropertyType, selectedConfiguration, selectedLocality]);

  // Initialize data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch locations
        const locations = await getAllLocations();
        if (locations && Array.isArray(locations)) {
          setLocalities(locations);
        }

        // Fetch all properties to get configurations from API
        const allPropsResponse = await getAllProperties(0, 1000, "", "", "");
        let allConfigs = [];
        if (allPropsResponse?.data?.data && Array.isArray(allPropsResponse.data.data)) {
          allConfigs = Array.from(
            new Set(
              allPropsResponse.data.data
                .map(p => p.configurations)
                .filter(Boolean)
                .map(config => config.trim())
                .filter(config => config !== "")
            )
          );
        }
        // If API gives nothing, use hardcoded fallback
        if (!allConfigs.length) {
          allConfigs = HARDCODED_CONFIGURATIONS;
        }
        setAllConfigurations(allConfigs);
      } catch (error) {
        // On error, use hardcoded fallback
        setAllConfigurations(HARDCODED_CONFIGURATIONS);
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchProperties = async (page) => {
    try {
      setLoading(true);
      
      // Clean up parameters
      const configParam = selectedConfiguration 
        ? selectedConfiguration.replace(/\s+/g, '') 
        : "";
      
      let cityParam = selectedLocality || "";
      // Convert BANGALORE to Bangalore
      if (cityParam === "BANGALORE") {
        cityParam = "Bangalore";
      }

      const response = await getAllProperties(
        page,
        pageSize,
        selectedPropertyType || "",
        configParam,
        cityParam
      );

      console.log("Properties response:", response);

      if (response?.data) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
        }
        
        // Set pagination info
        const pagination = response.pagination || response.data?.pagination || {};
        setTotalPages(pagination.total_pages || Math.ceil((pagination.total || 0) / pageSize) || 1);
      } else {
        setProperties([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
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

  const handleFilterChange = (filterType, value) => {
    // Reset to first page when filters change
    setCurrentPage(0);
    
    switch (filterType) {
      case 'propertyType':
        setSelectedPropertyType(value);
        break;
      case 'configuration':
        setSelectedConfiguration(value);
        break;
      case 'locality':
        setSelectedLocality(value);
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setSelectedPropertyType("");
    setSelectedConfiguration("");
    setSelectedLocality("");
    setCurrentPage(0);
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "N/A";
    
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  const handleMoreDetail = (id, slug) => {
    console.log(id ,"uuuuuuuuuuuuuuuuu")
    const url = `/propertyforsale/${slug}`;
      localStorage.setItem('propertyState', JSON.stringify({ id }))
    window.open(url, "_blank", "noopener,noreferrer");
  };



  const handleTypeSelect = async (type) => {
    setSelectedType(type);
    setShowAddModal(false);
    try {
      const projectsList = await getAllProjectsByType(type);
      setProjects(Array.isArray(projectsList) ? projectsList : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProject("");
    // Reset form fields
    setPropertyType("");
    setAgeOfProperty("");
    setFloorNo("");
    setConfiguration("");
    setFacing("");
    setFurnishing("");
    setBalconyCount("");
    setBedroomCount("");
    setCoveredParking("");
    setPropertyUrl("");
  };

  const handleConfirm = async () => {
    // Validation
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }
    if (!propertyUrl.trim()) {
      alert("Please enter a property URL");
      return;
    }

    const selectedProjectObj = projects.find(
      (proj) => proj.project_id === selectedProject
    );
    const projectName = selectedProjectObj ? selectedProjectObj.project_name : "";

    const propertyData = {
      project_id: selectedProject,
      name: projectName,
      property_type: "COMMERCIAL",
      slug: propertyUrl.trim(),
      // age_of_property: ageOfProperty,
      // floor_number: floorNo,
      // facing: facing,
      // furnishing: furnishing,
      // balcony_count: balconyCount,
      // bedrooms_count: bedroomCount,
      // covered_parking: coveredParking,
    };

    try {
      const response = await saveProperty(propertyData);
      setShowDetailsModal(false);
      const propertyId = response?.data?.property_id;
      setProjectId(selectedProject);
      navigate(`/propertyforsale/${propertyId}`, {
        state: { ...propertyData, projectId: selectedProject },
      });
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property: " + (error.message || "Unknown error"));
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
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
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
                      onChange={(e) => handleFilterChange('configuration', e.target.value)}
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
                      {allConfigurations.map((config) => (
                        <option key={config} value={config}>
                          {config}
                        </option>
                      ))}
                    </select>

                    <select
                      name="locality"
                      value={selectedLocality}
                      onChange={(e) => handleFilterChange('locality', e.target.value)}
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
                      {Array.from(
                        new Set(
                          localities
                            .map((loc) => loc.city ? loc.city.toUpperCase() : "")
                            .filter(Boolean)
                        )
                      ).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleResetFilters}
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
                      Reset
                    </button>

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
                  className="col-12 col-lg-8 sticky-scroll"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : !Array.isArray(properties) || properties.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      No properties found. Try adjusting your filters.
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
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
                              <div className="col-12 col-sm-4">
                                <a href={`/propertyforsale/${property?.id}`}>
                                  <img
                                    className="img-fluid"
                                    alt={property.name || "Property"}
                                    src={
                                      property.images && property.images.length > 0
                                        ? property.images[0]
                                        : "/default-image.jpg"
                                    }
                                    loading="lazy"
                                    style={{
                                      maxWidth: "100%",
                                      borderRadius: "10px",
                                      height: "220px",
                                      objectFit: "cover",
                                      padding: "5px",
                                    }}
                                    className="d-none d-sm-block img-fluid"
                                  />
                                  <img
                                    className="d-block d-sm-none img-fluid"
                                    alt={property.name || "Property"}
                                    src={
                                      property.images && property.images.length > 0
                                        ? property.images[0]
                                        : "/default-image.jpg"
                                    }
                                    loading="lazy"
                                    style={{
                                      maxWidth: "100%",
                                      borderRadius: "10px",
                                      height: "150px",
                                      objectFit: "cover",
                                      padding: "5px",
                                    }}
                                  />
                                </a>
                              </div>
                              <div className="col-12 col-sm-8">
                                <div
                                  className="card-body"
                                  style={{ fontSize: "smaller" }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-title">
                                      <b>{property.name || "Property Name"}</b>
                                    </p>
                                  </div>

                                  <h6 className="card-text">
                                    {property.name || "Property Name"}
                                    <br />
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#a1a1a1",
                                      }}
                                    >
                                      BY {property.developer_name || "Developer"}
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
                                      <strong>{property.built_up_area || "N/A"}</strong>
                                    </div>
                                    <div style={{ flex: "1 1 30%" }}>
                                      <i className="far fa-calendar-alt"></i> Possession Status
                                      <br />
                                      <strong>{property.possession_status || "N/A"}</strong>
                                    </div>
                                    <div style={{ flex: "1 1 30%" }}>
                                      <i className="fas fa-compass"></i> Facing
                                      <br />
                                      <strong>{property.facing || "N/A"}</strong>
                                      <div style={{ marginTop: 4 }}>
                                        <i className="fas fa-map-marker-alt"></i> Location
                                        <br />
                                        <strong>{property.location || "N/A"}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleMoreDetail(
                                        property?.id,
                                        property?.slug
                                      )
                                    }
                                    className="theme-btn btn btn-primary btn-sm d-block d-sm-inline-block"
                                    style={{ 
                                      fontSize: "12px",
                                      padding: "8px 12px",
                                      width: "100%",
                                      maxWidth: "200px"
                                    }}
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
                  )}
                </div>

                {/* Carousel Section */}
                <div className="col-12 col-lg-4 d-none d-lg-block" id="carousel">
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div
                  className="pagination-controls"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    gap: "10px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={handlePrevious}
                    disabled={currentPage === 0 || loading}
                    style={{
                      opacity: currentPage === 0 || loading ? 0.5 : 1,
                      cursor: currentPage === 0 || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <span className="page-info" style={{ margin: "0 15px", fontWeight: "bold" }}>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1 || loading}
                    style={{
                      opacity: currentPage >= totalPages - 1 || loading ? 0.5 : 1,
                      cursor: currentPage >= totalPages - 1 || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Property Type Selection Modal */}
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
              width: "900px",
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

      {/* Property Details Modal */}
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
              options={projects.map((proj) => ({
                value: proj.project_id,
                label: proj.project_name,
              }))}
              value={
                selectedProject
                  ? projects.find((proj) => proj.project_id === selectedProject)
                    ? {
                        value: selectedProject,
                         label: projects.find(
                          (proj) => proj.project_id === selectedProject
                        ).project_name,
                      }
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
            {/* Property URL input */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="property-url" style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>
                Property URL (slug)
              </label>
              <input
                id="property-url"
                type="text"
                value={propertyUrl}
                onChange={e => setPropertyUrl(e.target.value)}
                placeholder="Enter property URL (slug)"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{display: "flex", gap: 16, marginBottom: 24, justifyContent: "flex-end"}}>
              {/* <div style={{ flex: 1 }}>
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
              </div> */}
              <button
                onClick={handleConfirm}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 8,
                  background: "#2067d1",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  height: "40px",
                  boxShadow: "0 2px 8px rgba(32,103,209,0.10)",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AddProject Modal - Moved outside details modal */}
      {showAddProjectModal && (
        <AddProject
          show={showAddProjectModal}
          handleClose={() => setShowAddProjectModal(false)}
        />
      )}
    </>
  );
};

export default PropertyListing;
