import React from "react";

const LocationMapSection = ({
  projectData,
  isLocationEditing,
  setIsLocationEditing,
  locationMapHtml,
  setLocationMapHtml,
  locationUrl,
  setLocationUrl,
}) => (
  <div className="bg-white rounded-3 mb-4" id="location">
    <h2
      className="mb-4 d-flex justify-content-between align-items-center"
      style={{
        fontSize: window.innerWidth <= 768 ? "16px" : "18px",
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "left",
        backgroundColor: "#2067d1",
        padding: "8px 12px",
        borderRadius: "4px",
      }}
    >
      {projectData?.name} Location Map
      <span style={{ cursor: "pointer", marginLeft: "12px" }}>
        {isLocationEditing ? (
         <button
      className="btn btn-success btn-sm"
      style={{ backgroundColor: "white", color: "#2067d1", border: "1px solid #2067d1" ,fontWeight: "bold"}}
      onClick={() => {
        // Call your save handler here, e.g.:
        // onSave(locationMapHtml, locationUrl);
        setIsLocationEditing(false);
      }}
    >
      Save
    </button> 
        ) : (
          <img
            src="/images/edit-icon.svg"
            alt="Edit"
            style={{ width: "18px", height: "18px" }}
            onClick={() => setIsLocationEditing(true)}
          />
        )}
      </span>
    </h2>
    <div className="row">
      <div className="col-12">
        <div
          className="mb-4 px-3"
          style={{
            fontSize: window.innerWidth <= 768 ? "12px" : "14px",
            outline: isLocationEditing ? "1px solid #2067d1" : "none",
            background: isLocationEditing ? "#f8faff" : "transparent",
            borderRadius: "4px",
            padding: isLocationEditing ? "8px" : "0",
            minHeight: "40px",
          }}
          contentEditable={isLocationEditing}
          suppressContentEditableWarning={true}
          onInput={e => setLocationMapHtml(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{
            __html: isLocationEditing ? locationMapHtml : (projectData?.locationMap || "")
          }}
        />
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
          <iframe
            title="Location"
            src={isLocationEditing ? locationUrl : projectData?.locationUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
);

export default LocationMapSection;