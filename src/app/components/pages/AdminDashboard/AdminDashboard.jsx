import React, { useState, useEffect } from 'react';
import { getAdminProperties } from '../../../apis/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
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

  const fetchAdminProperties = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminProperties(page, pageSize, currentFilters);
      
      // Handle different possible response structures
      if (response && response.data) {
        setProperties(response.data.content || response.data || []);
        setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / pageSize));
        setTotalProperties(response.data.totalElements || response.data.total || 0);
      } else {
        setProperties([]);
        setTotalPages(0);
        setTotalProperties(0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching admin properties:', err);
      setProperties([]);
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
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage your properties</p>
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
        
        {properties.length === 0 ? (
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
                  <h3 className="property-title">{property.title}</h3>
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
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
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
    </div>
  );
};

export default AdminDashboard;