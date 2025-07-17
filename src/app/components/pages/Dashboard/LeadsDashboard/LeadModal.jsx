import React, { useEffect } from 'react';
import './LeadModal.css';

const LeadModal = ({ isOpen, onClose, lead }) => {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset'; // Restore body scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lead) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lead-modal-overlay" onClick={handleBackdropClick}>
      <div className="lead-modal-content">
        <div className="lead-modal-header">
          <h2>Lead Details</h2>
          <button className="lead-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="lead-modal-body">
          <div className="lead-info-grid">
            <div className="lead-info-row">
              <span className="lead-label">ID:</span>
              <span className="lead-value">{lead.id}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Name:</span>
              <span className="lead-value">{lead.name}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Email:</span>
              <span className="lead-value">{lead.email}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Phone:</span>
              <span className="lead-value">{lead.phone}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">OTP Verified:</span>
              <span className="lead-value">
                <span className={`otp-badge ${lead.otp_verified ? 'verified' : 'unverified'}`}>
                  {lead.otp_verified ? '✓ Verified' : '✗ Unverified'}
                </span>
              </span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Sync Status:</span>
              <span className="lead-value">
                <span className={`sync-status-badge ${lead.sync_status}`}>
                  {lead.sync_status}
                </span>
              </span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Source:</span>
              <span className="lead-value">
                <span className="source-badge">
                  {lead.source}
                </span>
              </span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Project:</span>
              <span className="lead-value">
                <span className="project-name">
                  {lead.project_name || 'No Project'}
                </span>
              </span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Property ID:</span>
              <span className="lead-value">{lead.property_id || 'N/A'}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Project ID:</span>
              <span className="lead-value">{lead.project_id || 'N/A'}</span>
            </div>
            
            <div className="lead-info-row">
              <span className="lead-label">Created At:</span>
              <span className="lead-value">{formatDate(lead.created_at)}</span>
            </div>
            
            <div className="lead-info-row full-width">
              <span className="lead-label">Message:</span>
              <div className="lead-message">
                {lead.message || 'No message provided'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lead-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;