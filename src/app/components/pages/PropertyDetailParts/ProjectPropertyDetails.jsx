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

  return (
    <div
      className="mb-4"
      id="overview"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Property Details
          {!editMode && (
            <FontAwesomeIcon
              icon={faEdit}
              className="ms-2"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => setEditMode(true)}
              title="Edit"
            />
          )}
        </h4>
        <div className="px-3">
          <div className="row g-3 mb-0 mb-md-4">
            {/* Built Up Area */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faExpandArrowsAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Built Up Area</small>
                  {editMode ? (
                    <input type="text" name="builtupArea" value={editableProperty.builtupArea || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px", fontWeight: window.innerWidth <= 768 ? "400" : "800" }}>{property?.builtupArea}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Sizes */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faRulerCombined} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Sizes</small>
                  {editMode ? (
                    <input type="text" name="size" value={editableProperty.size || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px", fontWeight: window.innerWidth <= 768 ? "400" : "800" }}>{property?.size}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Floor No */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Floor No</small>
                  {editMode ? (
                    <input type="text" name="floors" value={editableProperty.floors || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.floors}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Configurations */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCalendarAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Configurations</small>
                  {editMode ? (
                    <input
                      type="text"
                      name="configurationTypeName"
                      value={editableProperty?.configuration?.configurationType?.configurationTypeName || ""}
                      onChange={handleConfigTypeChange}
                      className="form-control"
                    />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.configuration?.configurationType?.configurationTypeName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Possession Status */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faKey} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Possession Status</small>
                  {editMode ? (
                    <input type="text" name="possessionStatus" value={editableProperty.possessionStatus || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.possessionStatus}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Balcony */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Balcony</small>
                  {editMode ? (
                    <input type="text" name="balcony" value={editableProperty.balcony || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.balcony || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Covered Parking */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faParking} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Covered Parking</small>
                  {editMode ? (
                    <input type="text" name="coveredParking" value={editableProperty.coveredParking || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.coveredParking}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Bedrooms */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBed} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Bedrooms</small>
                  {editMode ? (
                    <input type="text" name="bedrooms" value={editableProperty.bedrooms || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.bedrooms}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Type */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCity} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Type</small>
                  {editMode ? (
                    <input
                      type="text"
                      name="configurationTypeName"
                      value={editableProperty?.configuration?.configurationType?.configurationTypeName || ""}
                      onChange={handleConfigTypeChange}
                      className="form-control"
                    />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.configuration?.configurationType?.configurationTypeName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Age of Property */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCalendarAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Age of Property</small>
                  {editMode ? (
                    <input type="text" name="ageOfProperty" value={editableProperty.ageOfProperty || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder text-break" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.ageOfProperty}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Furnishing */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCouch} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Furnishing</small>
                  {editMode ? (
                    <input type="text" name="furnishingType" value={editableProperty.furnishingType || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.furnishingType
                        ?.toLowerCase()
                        ?.replace(/_/g, " ")
                        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Facing */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faFlag} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Facing</small>
                  {editMode ? (
                    <input type="text" name="facing" value={editableProperty.facing || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.facing}</p>
                  )}
                </div>
              </div>
            </div>
            {/* RERA Number */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faKey} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>RERA Number.</small>
                  {editMode ? (
                    <input type="text" name="rera" value={editableProperty.rera || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.rera}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {editMode && (
            <div className="mt-3">
              <button className="btn btn-primary me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPropertyDetails;