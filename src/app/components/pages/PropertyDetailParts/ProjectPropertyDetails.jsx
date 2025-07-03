import React, { useState } from "react";
import {
  faExpandArrowsAlt,
  faRulerCombined,
  faBuilding,
  faCalendarAlt,
  faKey,
  faParking,
  faBed,
  faCity,
  faCouch,
  faFlag,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProjectPropertyDetails = ({ property, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editableProperty, setEditableProperty] = useState({ ...property });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For nested configurationTypeName
  const handleConfigTypeChange = (e) => {
    setEditableProperty((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        configurationType: {
          ...prev.configuration?.configurationType,
          configurationTypeName: e.target.value,
        },
      },
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    if (onSave) onSave(editableProperty);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableProperty({ ...property });
  };

  // Use editable state for property details
  const propertyDetails = editableProperty?.web_cards?.property_details || {};

  // Handle change for dynamic property details
  const handleDetailChange = (e, key) => {
    const { value } = e.target;
    setEditableProperty((prev) => ({
      ...prev,
      web_cards: {
        ...prev.web_cards,
        property_details: {
          ...prev.web_cards?.property_details,
          [key]: {
            ...prev.web_cards?.property_details?.[key],
            value,
          },
        },
      },
    }));
  };

  return (
    <div className="mb-4" id="overview" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div className="p-0 pb-2">
        <h4 className="mb-3 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between" style={{
          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
          backgroundColor: "#2067d1",
          borderRadius: "4px 4px 0 0",
          paddingRight: '16px',
          marginBottom: '18px',
        }}>
          <span>Property Details</span>
          <span className="d-flex align-items-center" style={{gap: '8px'}}>
            {!editMode ? (
              <FontAwesomeIcon
                icon={faEdit}
                className="ms-2"
                style={{ cursor: "pointer", color: "#fff", fontSize: '18px', padding: '2px 6px' }}
                onClick={() => setEditMode(true)}
                title="Edit"
              />
            ) : (
              <>
                <button className="btn btn-primary btn-sm me-2" style={{minWidth: '60px', padding: '2px 12px', marginRight: '6px'}} onClick={handleSave}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" style={{minWidth: '60px', padding: '2px 12px'}} onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </span>
        </h4>
        <div className="px-3">
          <div className="row g-3 mb-0 mb-md-4">
            {Object.entries(propertyDetails).map(([key, detail]) => (
              <div className="col-6 col-md-4 mt-2" key={key}>
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <div className="text-center text-md-start w-100">
                    <small style={{ color: "#000", fontWeight: "600" }}>
                      {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </small>
                    {editMode ? (
                      <input
                        type="text"
                        className="form-control mt-1"
                        value={detail.value || ''}
                        onChange={(e) => handleDetailChange(e, key)}
                      />
                    ) : (
                      <p className="mb-0 fw-normal" style={{ color: "#000" }}>
                        {detail.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPropertyDetails;