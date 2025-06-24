import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";

const PropertyDetailsSection = ({ property, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...property });

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(editData);
  };

  const handleCancel = () => {
    setEditData({ ...property });
    setIsEditing(false);
  };

  return (
    <div
      className="mb-4"
      id="overview"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Property Details
          {!isEditing ? (
            <button
              className="btn btn-light btn-sm ms-3"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button className="btn btn-success btn-sm ms-3" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary btn-sm ms-2" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </h4>
        <div className="px-3">
          <div className="row g-3 mb-0 mb-md-4">
            {/* Built Up Area */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon
                  icon={faExpandArrowsAlt}
                  className="mb-2 mb-md-0 me-md-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                    color: "#2067d1",
                  }}
                />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>
                    Built Up Area
                  </small>
                  {isEditing ? (
                    <input
                      type="text"
                      name="builtupArea"
                      value={editData.builtupArea || ""}
                      onChange={handleChange}
                      className="form-control form-control-sm mt-1"
                    />
                  ) : (
                    <p
                      className="mb-0 fw-normal fw-md-bolder"
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                        marginTop: "2px",
                        fontWeight: window.innerWidth <= 768 ? "400" : "800",
                      }}
                    >
                      {property?.builtupArea}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Repeat this pattern for each field below */}
            {/* Example: Size */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon
                  icon={faRulerCombined}
                  className="mb-2 mb-md-0 me-md-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                    color: "#2067d1",
                  }}
                />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>
                    Sizes
                  </small>
                  {isEditing ? (
                    <input
                      type="text"
                      name="size"
                      value={editData.size || ""}
                      onChange={handleChange}
                      className="form-control form-control-sm mt-1"
                    />
                  ) : (
                    <p
                      className="mb-0 fw-normal fw-md-bolder"
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                        marginTop: "2px",
                        fontWeight: window.innerWidth <= 768 ? "400" : "800",
                      }}
                    >
                      {property?.size}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Repeat for all other fields as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;