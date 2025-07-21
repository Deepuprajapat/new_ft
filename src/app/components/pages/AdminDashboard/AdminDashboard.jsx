import React, { useState, useEffect } from 'react';
import { getAdminProperties, getAllProjectsByType, saveProperty } from '../../../apis/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import AddProject from '../ProjectDetailsParts/AddProject/AddProject';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    configuration: '',
    property_type: '',
    city: ''
  });
  
  // Add Property Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyslug , setPropertyslug] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const fetchAdminProperties = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminProperties(page, pageSize, currentFilters);
      
      console.log('API Response:', response); // Debug logging
      
      // Handle different possible response structures with robust array validation
      if (response && response.data && response.data.data) {
        // Ensure we always get an array for properties
        let propertiesData = [];
        if (Array.isArray(response.data.data)) {
          propertiesData = response.data.data;
        }
        
        setProperties(propertiesData);
        setTotalPages(response.data.totalPages || response.data.total_pages || Math.ceil((response.data.total || propertiesData.length) / pageSize) || 1);
        setTotalProperties(response.data.totalElements || response.data.total_elements || response.data.total || propertiesData.length);
      } else {
        console.warn('Unexpected API response structure:', response);
        setProperties([]);
        setTotalPages(0);
        setTotalProperties(0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(`Failed to fetch properties: ${err.message || 'Unknown error'}`);
      console.error('Error fetching admin properties:', err);
      setProperties([]);
      setTotalPages(0);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProperties(1, filters);
  }, []);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    fetchAdminProperties(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchAdminProperties(page, filters);
  };

  const clearFilters = () => {
    const clearedFilters = { configuration: '', property_type: '', city: '' };
    setFilters(clearedFilters);
    fetchAdminProperties(1, clearedFilters);
  };

  // Property Creation Handlers
  const handleAddProperty = () => {
    setShowAddModal(true);
  };

  const handlePropertyTypeSelect = async (type) => {
    setSelectedPropertyType(type);
    setShowAddModal(false);
    setLoadingProjects(true);
    
    try {
      const projectsList = await getAllProjectsByType(type);
      setProjects(Array.isArray(projectsList) ? projectsList : []);
      setShowPropertyDetailsModal(true);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handlePropertySave = async () => {
    // Validation
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }

    if (!propertyName || propertyName.trim() === '') {
      alert('Please enter a property name');
      return;
    }

    const propertyData = {
      project_id: selectedProject,
      name: propertyName.trim(),
      property_type: selectedPropertyType,
    };
    
    try {
      const response = await saveProperty(propertyData);
      console.log(response?.data?.property_id,"yehg")
      setShowPropertyDetailsModal(false);
      await fetchAdminProperties(currentPage, filters);
   
      if (response?.data?.property_id) {
        navigate(`/propertyforsale/${response.data.slug}`, {
          state: { ...propertyData, propertyid: response.data.property_id },
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setError('Failed to save property: ' + (error.message || 'Unknown error'));
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowPropertyDetailsModal(false);
    setShowAddProjectModal(false);
    setSelectedPropertyType('');
    setSelectedProject('');
    setPropertyName('');
    setProjects([]);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage your properties</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary add-property-btn"
              onClick={handleAddProperty}
            >
              <i className="fas fa-plus"></i>
              Add New Property
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filter Properties</h3>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="configuration">Configuration</label>
            <select
              id="configuration"
              className="form-select"
              value={filters.configuration}
              onChange={(e) => handleFilterChange('configuration', e.target.value)}
            >
              <option value="">All Configurations</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
              <option value="4BHK">4 BHK</option>
              <option value="5BHK">5 BHK</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              className="form-select"
              value={filters.property_type}
              onChange={(e) => handleFilterChange('property_type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              className="form-control"
              placeholder="Enter city name"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="properties-section">
        <div className="section-header">
          <h2>Your Properties ({totalProperties})</h2>
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({totalProperties} total)
          </div>
        </div>
        
        {!Array.isArray(properties) || properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-home"></i>
            </div>
            <h3>No Properties Found</h3>
            <p>You haven't created any properties yet.</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      onError={(e) => {
                        e.target.src = '/default-property.jpg';
                      }}
                    />
                  ) : (
                    <div className="no-image">
                      <i className="fas fa-image"></i>
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="property-details">
                  <h3 className="property-title">{property.name || property.title || 'Unnamed Property'}</h3>
                  <p className="property-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {property.location}
                  </p>
                  <p className="property-price">
                    <i className="fas fa-rupee-sign"></i>
                    {property.price ? property.price.toLocaleString() : 'Price on request'}
                  </p>
                  
                  <div className="property-stats">
                    <span className="stat">
                      <i className="fas fa-bed"></i>
                      {property.bedrooms || 'N/A'} BHK
                    </span>
                    <span className="stat">
                      <i className="fas fa-ruler-combined"></i>
                      {property.area || 'N/A'} sq ft
                    </span>
                  </div>
                  
                  <div className="property-status">
                    <span className={`status-badge ${property.status?.toLowerCase()}`}>
                      {property.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="property-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/propertyforsale/${property.slug}`, { state: { editMode: true } })}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate(`/propertyforsale/${property.slug}`)}
                    >
                      <i className="fas fa-eye"></i>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-section">
            <nav aria-label="Properties pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                </li>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <li key={page} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

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
              width: "500px",
              maxWidth: "90vw",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={closeModals}
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
            <h2 style={{ fontWeight: 700, fontSize: 24, margin: "0 0 24px 0" }}>
              Select Property Type
            </h2>
            <p style={{ color: "#666", marginBottom: 30 }}>
              Choose the type of property you want to add
            </p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
              <button
                className="btn btn-outline-primary"
                style={{ padding: "12px 24px", fontSize: 16 }}
                onClick={() => handlePropertyTypeSelect('COMMERCIAL')}
              >
                Commercial Property
              </button>
              <button
                className="btn btn-outline-primary"
                style={{ padding: "12px 24px", fontSize: 16 }}
                onClick={() => handlePropertyTypeSelect('RESIDENTIAL')}
              >
                Residential Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyDetailsModal && (
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
              onClick={closeModals}
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
              Add {selectedPropertyType} Property
            </h2>
            
            {loadingProjects ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading projects...</span>
                </div>
              </div>
            ) : (
              <div>
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
                      setShowPropertyDetailsModal(false);
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
                
                {projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <p style={{ color: "#e74c3c", marginBottom: 20 }}>
                      No {selectedPropertyType.toLowerCase()} projects available. 
                      Please create a project first.
                    </p>
                  </div>
                ) : (
                  <>
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
                    
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 500, marginBottom: 8, textAlign: "left" }}>
                        Property Name
                      </div>
                      <input
                        type="text"
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        placeholder="Enter property name (e.g., Premium 3BHK Apartment)"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#007bff";
                          e.target.style.outline = "none";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                        }}
                      />
                    </div>
                    {/* <div style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 500, marginBottom: 8, textAlign: "left" }}>
                        Property Slug
                      </div>
                      <input
                        type="text"
                        value={propertyslug}
                        onChange={(e) => setPropertyslug(e.target.value)}
                        placeholder="Enter property name (e.g., Premium 3BHK Apartment)"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#007bff";
                          e.target.style.outline = "none";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                        }}
                      />
                    </div> */}
                  </>
                )}
                
                <div style={{ display: "flex", gap: 16, marginBottom: 24, justifyContent: "flex-end" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={closeModals}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 16,
                      height: "40px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePropertySave}
                    disabled={!selectedProject || !propertyName.trim()}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: 8,
                      background: (selectedProject && propertyName.trim()) ? "#2067d1" : "#ccc",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: (selectedProject && propertyName.trim()) ? "pointer" : "not-allowed",
                      height: "40px",
                      boxShadow: (selectedProject && propertyName.trim()) ? "0 2px 8px rgba(32,103,209,0.10)" : "none",
                    }}
                  >
                    Create Property
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AddProject Modal */}
      {showAddProjectModal && (
        <AddProject
          show={showAddProjectModal}
          handleClose={() => setShowAddProjectModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;