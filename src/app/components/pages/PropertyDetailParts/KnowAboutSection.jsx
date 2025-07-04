import React, { useState, useEffect, useRef } from "react";

const KnowAboutSection = ({ property, showFullDescription, setShowFullDescription, onSave }) => {
  const [isAboutEditing, setIsAboutEditing] = useState(false);
  // Prefer web_cards.know_about.description if present, else property.about
  const knowAbout = property?.web_cards?.know_about || property?.know_about || {};
  const aboutDescription = knowAbout.description || property?.about || "";
  const brochureLink = knowAbout.download_link || property?.brochure || "";
  const [aboutHtml, setAboutHtml] = useState(aboutDescription);
  const editableRef = useRef(null);

  useEffect(() => {
    setAboutHtml(aboutDescription);
  }, [aboutDescription]);

  const handleEditToggle = () => {
    if (isAboutEditing) {
      handleSave();
    } else {
      setIsAboutEditing(true);
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSave = () => {
    setIsAboutEditing(false);
    if (typeof onSave === 'function') {
      onSave(aboutHtml);
    }
  };

  const handleCancel = () => {
    setIsAboutEditing(false);
    setAboutHtml(property?.about || "");
  };

  return (
    <div
      className="mb-4"
      id="about"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Know About {property?.propertyName}
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isAboutEditing ? (
              <>
                <button
                  className="btn btn-success btn-sm"
                  style={{ backgroundColor: "white", color: "#2067d1", border: "1px solid #2067d1", fontWeight: "bold" }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: 8, backgroundColor: "#6c757d", color: "white", fontWeight: "bold", width: "auto" }}
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
                onClick={handleEditToggle}
              />
            )}
          </span>
        </h4>
        <div className="px-3">
          <div
            className="position-relative"
            style={{
              maxHeight: isAboutEditing || showFullDescription ? "none" : "100px",
              overflow: isAboutEditing || showFullDescription ? "visible" : "hidden",
            }}
          >
            {!isAboutEditing && !showFullDescription && (
              <div
                className="position-absolute w-100 h-100"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}
            {isAboutEditing ? (
              <textarea
                ref={editableRef}
                value={aboutHtml}
                onChange={e => setAboutHtml(e.target.value)}
                className="mb-3"
                style={{
                  width: "100%",
                  minHeight: window.innerWidth <= 768 ? "700px" : "600px",
                  height: window.innerWidth <= 768 ? "700px" : "600px",
                  fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                  fontFamily: "'Courier New', monospace",
                  lineHeight: "1.4",
                  padding: "12px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#f8faff",
                  resize: "vertical",
                  outline: "none",
                }}
                placeholder="Enter HTML content with tags..."
              />
            ) : (
              <div
                ref={editableRef}
                className="mb-3 project-description"
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "15px",
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "1.5",
                  letterSpacing: "0.4px",
                  minHeight: "40px",
                  cursor: "default",
                }}
                dangerouslySetInnerHTML={{ __html: aboutHtml }}
              />
            )}
          </div>
          {/* Download Brochure Link (styled as in Project Details section) */}
          {!isAboutEditing && brochureLink && (
            <div className="text-center mb-3">
              <a
                href={brochureLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-4 py-2 fw-bold"
                style={{
                  backgroundColor: "#2067d1",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: window.innerWidth <= 768 ? "13px" : "16px",
                  boxShadow: "0 2px 8px rgba(32,103,209,0.08)",
                  border: "none",
                  margin: "0 auto"
                }}
              >
                <img src="/images/download-icon.svg" alt="Download" style={{ width: 18, height: 18, marginRight: 8, verticalAlign: "middle" }} />
                Download Brochure
              </a>
            </div>
          )}
          {!isAboutEditing && (
            <button
              type="button" 
              className="btn btn-link text-decoration-none p-0 mt-2"
              onClick={e => {
                e.preventDefault();
                setShowFullDescription(!showFullDescription);
              }}
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                color: "black",
                display: "block",
                margin: "0 auto",
                textAlign: "center",
                cursor: "pointer",
                padding: "0",
              }}
              onMouseEnter={e => (e.target.style.color = "#2067d1")}
              onMouseLeave={e => (e.target.style.color = "black")}
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowAboutSection; 