import React, { useState } from "react";
// ...other imports...

const ProjectPropertyDetails = ({ property, onSave, showEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableProperty, setEditableProperty] = useState({ ...property });

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditableProperty({ ...property });
  };
  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(editableProperty);
  };

  // ...handleChange and handleConfigTypeChange as before...

  return (
    <div
      className="mb-4"
      id="overview"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <div
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          <span>Property Details</span>
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{
                      backgroundColor: "white",
                      color: "#2067d1",
                      fontWeight: "bold",
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      marginLeft: 8,
                      backgroundColor: "#6c757d",
                      color: "white",
                      fontWeight: "bold",
                      width: "auto",
                    }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <span
                  onClick={handleEdit}
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/edit-icon.svg"
                    alt="Edit"
                    fill="true"
                    style={{ width: "18px", height: "18px" }}
                  />
                </span>
              )}
            </span>
          )}
        </div>
        {/* ...rest of your component... */}
      </div>
    </div>
  );
};

export default ProjectPropertyDetails;