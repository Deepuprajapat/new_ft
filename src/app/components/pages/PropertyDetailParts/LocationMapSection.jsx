import React, { useState, useEffect, useRef } from "react";

const LocationMapSection = ({ property, onSave }) => {
  // Prefer web_cards.location_info.google_map_link if present
  const locationInfo = property?.web_cards?.location_info || property?.location_info || {};
  const initialMapSrc = locationInfo.google_map_link || property?.locationMap || "";
  const [editMode, setEditMode] = useState(false);
  const [editableMapSrc, setEditableMapSrc] = useState(initialMapSrc);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditableMapSrc(initialMapSrc);
  }, [initialMapSrc]);

  const handleSave = () => {
    setEditMode(false);
    if (onSave) {
      // Save to web_cards.location_info.google_map_link if possible
      onSave({
        ...property,
        web_cards: {
          ...property.web_cards,
          location_info: {
            ...locationInfo,
            google_map_link: editableMapSrc
          }
        }
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableMapSrc(initialMapSrc);
  };

  return (
    <div className="bg-white rounded-3 mb-4" id="location">
      <h2
        className="mb-4 d-flex align-items-center justify-content-between"
        style={{
          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
          color: "#000000",
          fontWeight: "bold",
          textAlign: "left",
          backgroundColor: "#2067d1",
          padding: "8px 12px",
          borderRadius: "4px",
          color: "#ffffff",
        }}
      >
        <span>Location Map</span>
        <span>
          {!editMode ? (
            <img
              src="/images/edit-icon.svg"
              alt="Edit"
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              onClick={() => setEditMode(true)}
            />
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm me-2"
                style={{ minWidth: "60px", padding: "2px 12px", marginRight: "6px" }}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ minWidth: "60px", padding: "2px 12px" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </span>
      </h2>
      <div className="row">
        <div className="col-12">
          <div className="position-relative">
            <div
              style={{
                position: "absolute",
                width: "80%",
                height: "100%",
                background: "#f22a2a00",
                zIndex: 1,
              }}
            ></div>
            {editMode ? (
              <div className="mb-3">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  value={editableMapSrc}
                  onChange={e => setEditableMapSrc(e.target.value)}
                  placeholder="Enter Google Map embed link..."
                  style={{ fontSize: window.innerWidth <= 768 ? "12px" : "15px" }}
                />
                <div className="mt-2">
                  <iframe
                    title="Location Preview"
                    src={editableMapSrc}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ) : (
              <iframe
                title="Location"
                src={editableMapSrc}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMapSection;
