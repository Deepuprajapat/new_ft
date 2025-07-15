import React, { useState, useEffect } from 'react';
import { getAllLeadsAdmin, getLeadsDuplicates } from '../../../../apis/api';
import './LeadsDashboard.css';

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    project_id: '',
    property_id: '',
    phone: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchLeads();
    fetchDuplicates();
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Filter out empty values
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await getAllLeadsAdmin(currentPage, 20, activeFilters);
      setLeads(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      setError('Failed to fetch leads. Please check your permissions.');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDuplicates = async () => {
    try {
      const duplicatesData = await getLeadsDuplicates();
      setDuplicates(duplicatesData || []);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    }
  };

  const isDuplicate = (lead) => {
    return duplicates.some(dup => dup.phone === lead.phone || dup.email === lead.email);
  };


  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      project_id: '',
      property_id: '',
      phone: '',
      start_date: '',
      end_date: ''
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="leads-dashboard">
        <div className="loading-spinner">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="leads-dashboard">
      <div className="dashboard-header">
        <h1>Leads Management</h1>
        <p>Manage and track customer leads with duplicate detection</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="dashboard-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="stats">
          <div className="stat-card">
            <h3>{leads.length}</h3>
            <p>Total Leads</p>
          </div>
          <div className="stat-card duplicate">
            <h3>{duplicates.length}</h3>
            <p>Duplicates Found</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <h4>Filters</h4>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Project ID</label>
            <input
              type="text"
              placeholder="Enter project ID..."
              value={filters.project_id}
              onChange={(e) => handleFilterChange('project_id', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Property ID</label>
            <input
              type="text"
              placeholder="Enter property ID..."
              value={filters.property_id}
              onChange={(e) => handleFilterChange('property_id', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter phone number..."
              value={filters.phone}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-actions">
            <button 
              onClick={clearFilters}
              className="btn btn-outline-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Source</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const duplicate = isDuplicate(lead);
              
              return (
                <tr key={lead.id} className={duplicate ? 'duplicate-row' : ''}>
                  <td>
                    <div className="lead-name">
                      {lead.name}
                      {duplicate && (
                        <span className="duplicate-badge" title="Duplicate detected">
                          🔗
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td className="message-cell">
                    <div className="message-preview">
                      {lead.message?.substring(0, 50)}
                      {lead.message?.length > 50 && '...'}
                    </div>
                  </td>
                  <td>
                    <span className="source-badge">
                      {lead.project_id ? 'Project' : lead.property_id ? 'Property' : 'General'}
                    </span>
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${duplicate ? 'duplicate' : 'active'}`}>
                      {duplicate ? 'Duplicate' : 'Active'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredLeads.length === 0 && !loading && (
          <div className="no-leads">
            <p>No leads found matching your search criteria.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="btn btn-outline-primary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsDashboard;