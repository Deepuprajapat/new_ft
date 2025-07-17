import React, { useState, useEffect } from 'react';
import { Select, Button, DatePicker, Space, Table, Tag, Badge, Typography, Tooltip } from 'antd';
import { ExpandAltOutlined, ShrinkOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAllLeadsAdmin, getProjectNames } from '../../../../apis/api';
import LeadModal from './LeadModal';
import './LeadsDashboard.css';

const { Text } = Typography;

const LeadsDashboard = () => {
  const [uniqueLeads, setUniqueLeads] = useState([]);
  const [duplicateLeads, setDuplicateLeads] = useState({});
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [dateFilterType, setDateFilterType] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [selectedDate, selectedSource, selectedProject, startDate, endDate]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        } else {
          setExpandedRows(new Set());
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

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

  const fetchProjects = async () => {
    try {
      const response = await getProjectNames();
      const projectData = response?.data || [];
      setProjects(projectData);
      
      // Format projects for Select dropdown
      const formattedOptions = projectData.map(project => ({
        value: project.project_id,
        label: project.project_name
      }));
      setProjectOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching project names:', error);
      setProjects([]);
      setProjectOptions([]);
    }
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
      
      if (selectedProject) {
        if (selectedProject === 'empty') {
          filters.project_name = '';
        } else {
          filters.project_id = selectedProject;
        }
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

  const handleSourceChange = (source) => {
    setSelectedSource(source);
  };

  const handleProjectChange = (project) => {
    setSelectedProject(project);
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
  };

  const handleCustomSingleDate = (date) => {
    setSelectedDate(date);
    setStartDate('');
    setEndDate('');
    setSelectedPreset('');
  };

  const handleCustomDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedDate('');
    setSelectedPreset('');
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedSource('');
    setSelectedProject('');
    setDateFilterType('preset');
    setSelectedPreset('');
    setStartDate('');
    setEndDate('');
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

  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Column definitions for Ant Design Table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text strong style={{ fontSize: '14px' }}>
            {text}
          </Text>
          {record.isDuplicate && (
            <Badge count="D" style={{ backgroundColor: '#ff9800', fontSize: '10px' }} />
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          <Text style={{ fontSize: '13px' }}>{email}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone) => (
        <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>{phone}</Text>
      ),
    },
    {
      title: 'OTP Status',
      dataIndex: 'otp_verified',
      key: 'otp_verified',
      width: 120,
      align: 'center',
      filters: [
        { text: 'Verified', value: true },
        { text: 'Unverified', value: false },
      ],
      onFilter: (value, record) => record.otp_verified === value,
      render: (verified) => (
        <Tag
          icon={verified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={verified ? 'success' : 'error'}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Sync Status',
      dataIndex: 'sync_status',
      key: 'sync_status',
      width: 120,
      align: 'center',
      filters: [
        { text: 'Synced', value: 'synced' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Fresh', value: 'fresh' },
      ],
      onFilter: (value, record) => record.sync_status === value,
      render: (status) => {
        const statusConfig = {
          synced: { color: 'success', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', icon: <CloseCircleOutlined /> },
          fresh: { color: 'processing', icon: <ClockCircleOutlined /> },
        };
        const config = statusConfig[status] || { color: 'default', icon: <SyncOutlined /> };
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            style={{ fontSize: '12px', fontWeight: '500', textTransform: 'capitalize' }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      align: 'center',
      filters: [
        { text: 'Organic', value: 'Organic' },
        { text: 'Meta', value: 'meta' },
      ],
      onFilter: (value, record) => record.source === value,
      render: (source) => (
        <Tag color={source === 'Organic' ? 'green' : 'blue'} style={{ fontSize: '11px', fontWeight: '500' }}>
          {source}
        </Tag>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'project_name',
      key: 'project_name',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (project) => (
        project ? (
          <Tooltip placement="topLeft" title={project}>
            <Tag color="geekblue" style={{ fontSize: '11px', fontWeight: '500' }}>
              {project}
            </Tag>
          </Tooltip>
        ) : (
          <Text type="secondary" style={{ fontSize: '12px' }}>-</Text>
        )
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
      render: (date) => (
        <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          {formatDate(date)}
        </Text>
      ),
    },
  ];

  // Prepare data for Ant Design Table
  const prepareTableData = () => {
    const tableData = [];
    
    // Add unique leads
    uniqueLeads.forEach(lead => {
      tableData.push({
        ...lead,
        key: `unique-${lead.id}`,
        isDuplicate: false,
      });
    });
    
    // Add duplicate leads
    Object.entries(duplicateLeads).forEach(([leadId, duplicateData]) => {
      const lastLead = duplicateData.last;
      const history = duplicateData.history || [];
      
      tableData.push({
        ...lastLead,
        key: `duplicate-${lastLead.id}`,
        isDuplicate: true,
        duplicateHistory: history,
      });
    });
    
    return tableData;
  };
  
  const expandedRowRender = (record) => {
    if (!record.isDuplicate || !record.duplicateHistory?.length) {
      return null;
    }
    
    const historyColumns = columns.map(col => ({
      ...col,
      render: col.key === 'created_at' ? (date) => (
        <Tag color="orange" style={{ fontSize: '11px' }}>
          {formatDate(date)}
        </Tag>
      ) : col.render,
    }));
    
    return (
      <Table
        columns={historyColumns}
        dataSource={record.duplicateHistory.map((item, index) => ({
          ...item,
          key: `history-${record.id}-${index}`,
        }))}
        pagination={false}
        size="small"
        style={{ margin: '0 0 0 40px' }}
        showHeader={false}
      />
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
        {(selectedPreset || selectedDate || (startDate && endDate) || selectedSource || selectedProject) && (
          <div className="filter-status">
            {selectedPreset && `${getDatePresets()[selectedPreset].label}`}
            {selectedDate && `Date: ${selectedDate}`}
            {startDate && endDate && `Range: ${startDate} to ${endDate}`}
            {selectedSource && ` • Source: ${selectedSource}`}
            {selectedProject && ` • Project: ${selectedProject === 'empty' ? 'No Project' : projects.find(p => p.project_id === selectedProject)?.project_name || selectedProject}`}
          </div>
        )}
        
        {/* Date Filter Section */}
        <div className="date-filter-section">
          <label className="filter-label">Date Filter</label>
          
          {/* Preset Date Buttons */}
          <Space wrap>
            {Object.entries(getDatePresets()).map(([key, preset]) => (
              <Button
                key={key}
                type={selectedPreset === key ? 'primary' : 'default'}
                onClick={() => handlePresetSelect(key)}
                size="middle"
              >
                {preset.label}
              </Button>
            ))}
          </Space>

          {/* Custom Date Selection */}
          <div style={{ marginTop: '16px' }}>
            <Button
              type={dateFilterType === 'custom' ? 'primary' : 'default'}
              onClick={handleCustomDateMode}
              style={{ marginBottom: '12px' }}
            >
              Custom Date Range
            </Button>
            
            {dateFilterType === 'custom' && (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Select Date Range:
                  </label>
                  <DatePicker.RangePicker
                    value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null}
                    onChange={(dates) => {
                      if (dates && dates.length === 2) {
                        const startDateStr = dates[0].format('YYYY-MM-DD');
                        const endDateStr = dates[1].format('YYYY-MM-DD');
                        handleCustomDateRange(startDateStr, endDateStr);
                      } else {
                        handleCustomDateRange('', '');
                      }
                    }}
                    style={{ width: '300px' }}
                    placeholder={['Start Date', 'End Date']}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Or select single date:
                  </label>
                  <DatePicker
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const dateStr = date.format('YYYY-MM-DD');
                        handleCustomSingleDate(dateStr);
                      } else {
                        handleCustomSingleDate('');
                      }
                    }}
                    style={{ width: '200px' }}
                    placeholder="Select Date"
                  />
                </div>
              </Space>
            )}
          </div>
        </div>

        {/* Other Filters */}
        <div className="other-filters">
          <div className="filter-group">
            <label>Lead Source</label>
            <Select
              showSearch
              placeholder="Search sources..."
              value={selectedSource || undefined}
              onChange={handleSourceChange}
              options={[
                { value: '', label: 'All Sources' },
                { value: 'Organic', label: 'Organic' },
                { value: 'meta', label: 'Meta' }
              ]}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
              allowClear
            />
          </div>
          
          <div className="filter-group">
            <label>Project</label>
            <Select
              showSearch
              placeholder="Search projects..."
              value={selectedProject || undefined}
              onChange={handleProjectChange}
              options={[
                { value: '', label: 'All Projects' },
                { value: 'empty', label: 'No Project' },
                ...projectOptions
              ]}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
              allowClear
            />
          </div>
          
          <div className="filter-actions">
            <Button 
              onClick={clearFilters}
              type="default"
              danger
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <Table
          columns={columns}
          dataSource={prepareTableData()}
          loading={loading}
          pagination={{
            total: uniqueLeads.length + Object.keys(duplicateLeads).length,
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>
                Showing {range[0]}-{range[1]} of {total} leads
              </Text>
            ),
            pageSizeOptions: ['25', '50', '100', '200'],
          }}
          scroll={{ x: 'max-content', y: 600 }}
          size="middle"
          rowClassName={(record) => {
            if (record.isDuplicate) {
              return 'duplicate-row';
            }
            return 'clickable-row';
          }}
          onRow={(record) => ({
            onClick: () => openModal(record),
            style: { cursor: 'pointer' },
          })}
          expandable={{
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) => {
              if (!record.isDuplicate || !record.duplicateHistory?.length) {
                return null;
              }
              return (
                <Button
                  type="text"
                  size="small"
                  icon={expanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                  title={expanded ? 'Collapse history' : 'Show duplicate history'}
                />
              );
            },
            rowExpandable: (record) => record.isDuplicate && record.duplicateHistory?.length > 0,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <Text type="secondary">No leads found for the selected filters.</Text>
              </div>
            ),
          }}
          summary={(data) => {
            const duplicateCount = data.filter(item => item.isDuplicate).length;
            const uniqueCount = data.filter(item => !item.isDuplicate).length;
            
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={9}>
                    <div style={{ textAlign: 'center', padding: '8px' }}>
                      <Text strong>Total: {data.length} leads</Text>
                      <Text type="secondary" style={{ marginLeft: '16px' }}>
                        ({uniqueCount} unique, {duplicateCount} duplicates)
                      </Text>
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        lead={selectedLead} 
      />
    </div>
  );
};

export default LeadsDashboard;