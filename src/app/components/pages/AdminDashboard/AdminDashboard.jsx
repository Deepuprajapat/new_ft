import React, { useState, useEffect } from 'react';
import { getAdminProperties, getAllProjectsByType, saveProperty, getAllLeadsAdmin } from '../../../apis/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Tabs, Table, Tag, Badge, Tooltip, Button, DatePicker, Space } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddProject from '../ProjectDetailsParts/AddProject/AddProject';
import LeadModal from '../Dashboard/LeadsDashboard/LeadModal';
import './AdminDashboard.css';

const PropertyLeadsTable = ({ propertyId }) => {
  const [propertyLeads, setPropertyLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllLeadsAdmin({ property_id: propertyId });
        if (response && response.data) {
          setPropertyLeads(Array.isArray(response.data) ? response.data : []);
        } else {
          setPropertyLeads([]);
        }
      } catch (err) {
        setError(`Failed to fetch property leads: ${err.message || 'Unknown error'}`);
        console.error('Error fetching property leads:', err);
        setPropertyLeads([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyLeads();
    }
  }, [propertyId]);

  const propertyLeadsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'is_verified',
      key: 'is_verified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'orange'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text) => text || 'Website',
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading property leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const verifiedCount = propertyLeads.filter(lead => lead.is_verified).length;
  const unverifiedCount = propertyLeads.length - verifiedCount;

  return (
    <div>
      {/* Lead Statistics */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
        <div style={{ padding: '12px 16px', background: '#f0f2f5', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Leads</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>
            {propertyLeads.length}
          </div>
        </div>
        <div style={{ padding: '12px 16px', background: '#f6ffed', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Verified</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>
            {verifiedCount}
          </div>
        </div>
        <div style={{ padding: '12px 16px', background: '#fff7e6', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Unverified</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fa8c16' }}>
            {unverifiedCount}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {propertyLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }}>
            <UserOutlined />
          </div>
          <h3 style={{ color: '#666', marginBottom: 8 }}>No Leads Found</h3>
          <p style={{ color: '#999' }}>This property hasn't received any leads yet.</p>
        </div>
      ) : (
        <Table
          columns={propertyLeadsColumns}
          dataSource={propertyLeads}
          rowKey={(record) => record.id || record.lead_id}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leads`,
          }}
          scroll={{ x: 600 }}
          size="small"
        />
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('properties');
  
  // Properties state
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
  
  // Leads state
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
  const [leadsTotalPages, setLeadsTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsPageSize] = useState(20);
  const [leadsFilters, setLeadsFilters] = useState({
    startDate: '',
    endDate: '',
    property_id: ''
  });
  
  // Property Lead Modal state
  const [showPropertyLeadsModal, setShowPropertyLeadsModal] = useState(false);
  const [selectedPropertyForLeads, setSelectedPropertyForLeads] = useState(null);
  
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
  
  // Lead modal state
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

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

  // Fetch leads function
  const fetchLeads = async (page = 1, currentFilters = leadsFilters) => {
    try {
      setLeadsLoading(true);
      setLeadsError(null);
      
      const params = {
        page: page - 1,
        size: leadsPageSize,
      };
      
      if (currentFilters.startDate) params.start_date = currentFilters.startDate;
      if (currentFilters.endDate) params.end_date = currentFilters.endDate;
      
      // Handle property filtering
      if (currentFilters.property_id) {
        // Specific property selected
        params.property_id = currentFilters.property_id;
      } else if (!currentFilters.property_id && properties.length > 0) {
        // "All Properties" selected - send all property IDs
        const allPropertyIds = properties.map(property => property.id);
        params.property_ids = allPropertyIds;
      }
      
      const response = await getAllLeadsAdmin(params);
      
      if (response && response.data) {
        // Handle new API response structure with unique_leads and duplicate_leads
        let allLeads = [];
        if (response.data.unique_leads && Array.isArray(response.data.unique_leads)) {
          allLeads = [...response.data.unique_leads];
        }
        if (response.data.duplicate_leads && Array.isArray(response.data.duplicate_leads)) {
          allLeads = [...allLeads, ...response.data.duplicate_leads];
        }
        // Fallback to old structure if new structure is not available
        if (allLeads.length === 0 && Array.isArray(response.data)) {
          allLeads = response.data;
        }
        
        setLeads(allLeads);
        setTotalLeads(response.totalElements || response.total || allLeads.length);
        setLeadsTotalPages(Math.ceil((response.totalElements || response.total || allLeads.length) / leadsPageSize));
      } else {
        setLeads([]);
        setTotalLeads(0);
        setLeadsTotalPages(0);
      }
      setLeadsCurrentPage(page);
    } catch (err) {
      setLeadsError(`Failed to fetch leads: ${err.message || 'Unknown error'}`);
      console.error('Error fetching leads:', err);
      setLeads([]);
      setTotalLeads(0);
      setLeadsTotalPages(0);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProperties(1, filters);
  }, []);

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads(1, leadsFilters);
    }
  }, [activeTab]);

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

  // Leads filtering functions
  const handleLeadsFilterChange = (filterName, value) => {
    const newFilters = { ...leadsFilters, [filterName]: value };
    setLeadsFilters(newFilters);
    fetchLeads(1, newFilters);
  };

  const handleLeadsPageChange = (page) => {
    fetchLeads(page, leadsFilters);
  };

  const clearLeadsFilters = () => {
    const clearedFilters = { startDate: '', endDate: '', property_id: '' };
    setLeadsFilters(clearedFilters);
    fetchLeads(1, clearedFilters);
  };

  // Property leads modal handlers
  const handleViewPropertyLeads = (property) => {
    setSelectedPropertyForLeads(property);
    setShowPropertyLeadsModal(true);
  };

  const closePropertyLeadsModal = () => {
    setShowPropertyLeadsModal(false);
    setSelectedPropertyForLeads(null);
  };

  // Lead modal handlers
  const openLeadModal = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setIsLeadModalOpen(false);
    setSelectedLead(null);
  };

  // Leads table columns
  const leadsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Property',
      dataIndex: 'property_name',
      key: 'property_name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Project',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'otp_verified',
      key: 'otp_verified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'orange'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text) => text || 'Website',
    }
  ];

  // Render functions
  const renderPropertiesContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your properties...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    return (
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
                <div className="property-details">
                  <h3 className="property-title">{property.name || property.title || 'Unnamed Property'}</h3>
                  <p className="property-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {property.location}
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
    );
  };

  const renderLeadsContent = () => {
    if (leadsLoading) {
      return (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading leads...</p>
        </div>
      );
    }

    if (leadsError) {
      return (
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            {leadsError}
          </div>
        </div>
      );
    }

    return (
      <div className="leads-section">
        <div className="section-header">
          <h2>All Leads ({totalLeads})</h2>
          <div className="pagination-info">
            Page {leadsCurrentPage} of {leadsTotalPages} ({totalLeads} total)
          </div>
        </div>
        
        <Table
          columns={leadsColumns}
          dataSource={leads}
          rowKey={(record) => record.id || record.lead_id}
          onRow={(record) => ({
            onClick: () => openLeadModal(record),
            style: { cursor: 'pointer' },
          })}
          pagination={{
            current: leadsCurrentPage,
            total: totalLeads,
            pageSize: leadsPageSize,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leads`,
            onChange: handleLeadsPageChange,
          }}
          scroll={{ x: 800 }}
        />
      </div>
    );
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
    setShowPropertyLeadsModal(false);
    setSelectedPropertyType('');
    setSelectedProject('');
    setPropertyName('');
    setProjects([]);
    setSelectedPropertyForLeads(null);
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
            <p className="dashboard-subtitle">Manage your properties and leads</p>
          </div>
          <div className="header-actions">
            {activeTab === 'properties' && (
              <button 
                className="btn btn-primary add-property-btn"
                onClick={handleAddProperty}
              >
                <i className="fas fa-plus"></i>
                Add New Property
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="tabs-section">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: 'properties',
              label: (
                <span>
                  <i className="fas fa-home"></i>
                  Properties ({totalProperties})
                </span>
              ),
              children: (
                <div className="properties-tab-content">
                  {/* Properties Grid */}
                  {renderPropertiesContent()}
                </div>
              )
            },
            {
              key: 'leads',
              label: (
                <span>
                  <UserOutlined />
                  Leads ({totalLeads})
                </span>
              ),
              children: (
                <div className="leads-tab-content">
                  {/* Leads Filters */}
                  <div className="filters-section">
                    <div className="filters-header">
                      <h3>Filter Leads</h3>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={clearLeadsFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                    <div className="filters-row">
                      <div className="filter-group">
                        <label>Start Date</label>
                        <DatePicker
                          value={leadsFilters.startDate ? dayjs(leadsFilters.startDate) : null}
                          onChange={(date) => handleLeadsFilterChange('startDate', date ? date.format('YYYY-MM-DD') : '')}
                          format="DD/MM/YYYY"
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="filter-group">
                        <label>End Date</label>
                        <DatePicker
                          value={leadsFilters.endDate ? dayjs(leadsFilters.endDate) : null}
                          onChange={(date) => handleLeadsFilterChange('endDate', date ? date.format('YYYY-MM-DD') : '')}
                          format="DD/MM/YYYY"
                          placeholder="Select end date"
                        />
                      </div>
                      <div className="filter-group">
                        <label>Property</label>
                        <select
                          className="form-select"
                          value={leadsFilters.property_id}
                          onChange={(e) => handleLeadsFilterChange('property_id', e.target.value)}
                        >
                          <option value="">All Properties</option>
                          {properties.map(property => (
                            <option key={property.id} value={property.id}>
                              {property.name || property.title || 'Unnamed Property'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Leads Table */}
                  {renderLeadsContent()}
                </div>
              )
            }
          ]}
        />
      </div>

      {/* Property Leads Modal */}
      {showPropertyLeadsModal && selectedPropertyForLeads && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              width: "90vw",
              maxWidth: "1000px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <button
              onClick={closePropertyLeadsModal}
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#e74c3c",
                cursor: "pointer",
                zIndex: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                Leads for {selectedPropertyForLeads.name || selectedPropertyForLeads.title || 'Property'}
              </h2>
              <p style={{ color: "#666", margin: "8px 0 0 0" }}>
                {selectedPropertyForLeads.location}
              </p>
            </div>

            <PropertyLeadsTable propertyId={selectedPropertyForLeads.id} />
          </div>
        </div>
      )}

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

      {/* Lead Details Modal */}
      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={closeLeadModal} 
        lead={selectedLead} 
      />
    </div>
  );
};

export default AdminDashboard;