import React from "react";
import { useState } from "react";


const LocationMapSection = ({
  projectData,
  isLocationEditing,
  setIsLocationEditing,
  locationMapHtml,
  setLocationMapHtml,
  showEdit,
  handleSave,
}) => {
  // Use location_info from projectData if available
  const locationInfo = projectData?.location_info || {};
  const [locationUrl, setLocationUrl] = useState(locationInfo.google_map_link || projectData?.locationUrl || "");
  const handleCancel = () => {
    setLocationMapHtml(projectData?.locationMap || "");
    setIsLocationEditing(false);
    setLocationUrl(locationInfo.google_map_link || projectData?.locationUrl || "");
  };

  const handleSaveChanges = () => {
    const updatedData = {
      ...projectData,
      locationMap: locationMapHtml,
      locationUrl: locationUrl,
      web_cards: {
        ...projectData.web_cards,
        location_map: {
          ...projectData.web_cards?.location_map,
          description: locationMapHtml,
          google_map_link: locationUrl
        }
      }
    };
    handleSave(updatedData);
    setIsLocationEditing(false);
  };

  return (
    <div className="bg-white rounded-3 mb-4" id="location" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div className="p-0 pb-2">
        <h2 className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}>
          {projectData?.name} Location Map
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isLocationEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{
                      backgroundColor: "white",
                      color: "#2067d1",
                      border: "1px solid #2067d1",
                      fontWeight: "bold"
                    }}
                    onClick={handleSaveChanges}
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
                      width:"auto"
                    }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <img
                  src="/images/edit-icon.svg"
                  alt="Edit"
                  style={{ width: "18px", height: "18px" }}
                  onClick={() => setIsLocationEditing(true)}
                />
              )}
            </span>
          )}
        </h2>
        <div className="row">
          <div className="col-12">
            {/* Show short address if available */}
            {locationInfo.short_address && (
              <div className="mb-2 px-3 text-muted" style={{ fontSize: "14px" }}>
                <strong>Address:</strong> {locationInfo.short_address}
              </div>
            )}
            {/* Show locationMapHtml only if it has content or editing is on */}
            {(isLocationEditing || (projectData?.locationMap && projectData.locationMap.trim() !== "")) && !isLocationEditing && (
              <div
                className="mb-4 px-3"
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                  outline: "none",
                  background: "transparent",
                  borderRadius: "4px",
                  padding: "0",
                  minHeight: "40px",
                }}
                dangerouslySetInnerHTML={{
                  __html: projectData?.locationMap || ""
                }}
              />
            )}
            {/* Only show the editable div if editing is on */}
            {isLocationEditing && (
              <></>
            )}
            <div className="position-relative mt-3">
              <div
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "100%",
                  background: "#f22a2a00",
                  zIndex: 1,
                }}
              ></div>
              {isLocationEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={locationUrl}
                  onChange={e => setLocationUrl(e.target.value)}
                  placeholder="Enter Google Maps embed URL"
                  style={{ marginBottom: "10px" }}
                />
              ) : null}
              {isLocationEditing && !locationUrl ? (
                <img
                  src="https://via.placeholder.com/600x300?text=Map+Preview"
                  alt="Map Preview"
                  width="100%"
                  height="300"
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
              ) : (
                // Only show iframe if link exists
                (locationInfo.google_map_link || projectData?.locationUrl) && (
                  <iframe
                    title="Location"
                    src={isLocationEditing ? locationUrl : (locationInfo.google_map_link || projectData?.locationUrl)}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LocationMapSection;