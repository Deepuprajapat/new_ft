import React, { useState, useEffect, Fragment } from 'react';
import { getAllLeadsAdmin } from '../../../../apis/api';
import './LeadsDashboard.css';

const LeadsDashboard = () => {
  const [uniqueLeads, setUniqueLeads] = useState([]);
  const [duplicateLeads, setDuplicateLeads] = useState({});
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [dateFilterType, setDateFilterType] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customDateMode, setCustomDateMode] = useState('range'); // 'single' or 'range'

  useEffect(() => {
    fetchLeads();
  }, [selectedDate, selectedSource, startDate, endDate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpandedRows(new Set());
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Date utility functions
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD format using local date
  };

  const getDatePresets = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get Monday of this week
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    thisWeekStart.setDate(today.getDate() + daysToMonday);
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    
    // Get Monday of last week
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

    return {
      today: { start: today, end: today, label: 'Today' },
      yesterday: { start: yesterday, end: yesterday, label: 'Yesterday' },
      thisWeek: { start: thisWeekStart, end: thisWeekEnd, label: 'This Week' },
      lastWeek: { start: lastWeekStart, end: lastWeekEnd, label: 'Last Week' }
    };
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {};
      
      // Handle date filtering based on type
      if (startDate && endDate) {
        // Date range (preset or custom range)
        filters.start_date = startDate;
        filters.end_date = endDate;
      } else if (selectedDate) {
        // Single date (custom single date)
        filters.date = selectedDate;
      }
      
      if (selectedSource) {
        filters.source = selectedSource;
      }
      
      const response = await getAllLeadsAdmin(filters);
      console.log('API Response:', response);
      
      // Parse the API response structure
      setUniqueLeads(response?.data?.unique_leads || []);
      setDuplicateLeads(response?.data?.duplicate_leads || {});
    } catch (error) {
      setError('Failed to fetch leads. Please check your permissions.');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
  };

  const handlePresetSelect = (presetKey) => {
    const presets = getDatePresets();
    const preset = presets[presetKey];
    
    setSelectedPreset(presetKey);
    setDateFilterType('preset');
    setStartDate(formatDateForAPI(preset.start));
    setEndDate(formatDateForAPI(preset.end));
    setSelectedDate(''); // Clear single date when using preset
  };

  const handleCustomDateMode = () => {
    setDateFilterType('custom');
    setSelectedPreset('');
    setStartDate('');
    setEndDate('');
    setSelectedDate('');
    setCustomDateMode('range'); // Default to range mode
  };

  const handleCustomModeChange = (mode) => {
    setCustomDateMode(mode);
    setSelectedDate('');
    setStartDate('');
    setEndDate('');
    setSelectedPreset('');
  };

  const handleCustomSingleDate = (date) => {
    setSelectedDate(date);
    setStartDate('');
    setEndDate('');
    setSelectedPreset('');
    setCustomDateMode('single');
  };

  const handleCustomDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedDate('');
    setSelectedPreset('');
    setCustomDateMode('range');
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedSource('');
    setDateFilterType('preset');
    setSelectedPreset('');
    setStartDate('');
    setEndDate('');
    setCustomDateMode('range');
  };

  const toggleRowExpansion = (leadId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(leadId)) {
      newExpandedRows.delete(leadId);
    } else {
      newExpandedRows.add(leadId);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderLeadRow = (lead, isDuplicate = false, isHistory = false) => {
    return (
      <tr key={`${lead.id}-${isHistory ? 'history' : 'main'}`} className={isDuplicate && !isHistory ? 'duplicate-row' : ''}>
        <td>
          <span style={{ marginLeft: isHistory ? '2rem' : '0' }}>{lead.id}</span>
        </td>
        <td>
          {isDuplicate && !isHistory ? (
            <div className="lead-name">
              <button 
                className="expand-btn"
                onClick={() => toggleRowExpansion(lead.id)}
                title={expandedRows.has(lead.id) ? 'Collapse history' : 'Show history'}
              >
                {expandedRows.has(lead.id) ? '▼' : '▶'}
              </button>
              {lead.name}
              <span className="duplicate-badge">D</span>
            </div>
          ) : (
            <span style={{ marginLeft: isHistory ? '2rem' : '0' }}>{lead.name}</span>
          )}
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
            {lead.source}
          </span>
        </td>
        <td>
          <span className={isHistory ? 'date-highlight' : ''}>
            {formatDate(lead.created_at)}
          </span>
        </td>
      </tr>
    );
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
        <h1>Leads Dashboard</h1>
        <p>View and manage customer leads</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="dashboard-controls">
        <div className="stats">
          <div className="stat-card">
            <h3>{uniqueLeads.length}</h3>
            <p>Unique Leads</p>
          </div>
          <div className="stat-card duplicate">
            <h3>{Object.keys(duplicateLeads).length}</h3>
            <p>Duplicate Leads</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <h4>Filters</h4>
        {(selectedPreset || selectedDate || (startDate && endDate) || selectedSource) && (
          <div className="filter-status">
            {selectedPreset && `${getDatePresets()[selectedPreset].label}`}
            {selectedDate && `Date: ${selectedDate}`}
            {startDate && endDate && `Range: ${startDate} to ${endDate}`}
            {selectedSource && ` • Source: ${selectedSource}`}
          </div>
        )}
        
        {/* Date Filter Section */}
        <div className="date-filter-section">
          <label className="filter-label">Date Filter</label>
          
          {/* Preset Date Buttons */}
          <div className="date-presets">
            {Object.entries(getDatePresets()).map(([key, preset]) => (
              <button
                key={key}
                className={`preset-btn ${selectedPreset === key ? 'active' : ''}`}
                onClick={() => handlePresetSelect(key)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Options */}
          <div className="custom-date-section">
            <div className="custom-date-toggle">
              <button
                className={`toggle-btn ${dateFilterType === 'custom' ? 'active' : ''}`}
                onClick={handleCustomDateMode}
              >
                Custom Date
              </button>
            </div>

            {dateFilterType === 'custom' && (
              <div className="custom-date-controls">
                <div className="custom-date-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="customDateType"
                      value="single"
                      checked={customDateMode === 'single'}
                      onChange={() => handleCustomModeChange('single')}
                    />
                    <span>Single Date</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="customDateType"
                      value="range"
                      checked={customDateMode === 'range'}
                      onChange={() => handleCustomModeChange('range')}
                    />
                    <span>Date Range</span>
                  </label>
                </div>

                <div className="custom-date-inputs">
                  {/* Single Date Input */}
                  {customDateMode === 'single' && (
                    <div className="single-date-input">
                      <label>Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleCustomSingleDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  )}

                  {/* Date Range Inputs */}
                  {customDateMode === 'range' && (
                    <div className="date-range-inputs">
                      <div className="date-input-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => handleCustomDateRange(e.target.value, endDate)}
                          className="form-control"
                        />
                      </div>
                      <div className="date-input-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => handleCustomDateRange(startDate, e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Filters */}
        <div className="other-filters">
          <div className="filter-group">
            <label>Lead Source</label>
            <select
              value={selectedSource}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="form-control"
            >
              <option value="">All Sources</option>
              <option value="Organic">Organic</option>
              <option value="meta">Meta</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button 
              onClick={clearFilters}
              className="btn btn-outline-secondary"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Render unique leads first */}
            {uniqueLeads.map((lead) => renderLeadRow(lead, false))}
            
            {/* Render duplicate leads */}
            {Object.entries(duplicateLeads).map(([leadId, duplicateData]) => {
              const lastLead = duplicateData.last;
              const history = duplicateData.history || [];
              
              return (
                <React.Fragment key={leadId}>
                  {/* Main duplicate lead row */}
                  {renderLeadRow(lastLead, true)}
                  
                  {/* Expanded history rows */}
                  {expandedRows.has(lastLead.id) && history.map((historyLead, index) => 
                    renderLeadRow(historyLead, true, true)
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {uniqueLeads.length === 0 && Object.keys(duplicateLeads).length === 0 && !loading && (
          <div className="no-leads">
            <p>No leads found for the selected date and source.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default LeadsDashboard;