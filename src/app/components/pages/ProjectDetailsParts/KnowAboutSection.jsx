import React, { useState, useRef, useEffect } from "react";

const KnowAboutSection = ({
  projectData,
  isMobileView,
  handleDownloadBrochure,
  handleDownloadBrochuree,
}) => {
  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [aboutHtml, setAboutHtml] = useState(projectData?.about || '');
  const editableRef = useRef(null);
 const handleCancel = () => setIsAboutEditing(false);
  // Update local state when projectData changes
  useEffect(() => {
    setAboutHtml(projectData?.about || '');
  }, [projectData?.about]);

  const handleSave = () => {
    // You can add your save logic here
    // For example: onSave(aboutHtml);
    setIsAboutEditing(false);
  };

  const handleEditToggle = () => {
    if (isAboutEditing) {
      handleSave();
    } else {
      setIsAboutEditing(true);
      // Focus the editable area after state update
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInput = (e) => {
    setAboutHtml(e.currentTarget.innerHTML);
  };

  return (
    <div
      className="mb-4"
      id="about"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h2
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Know About {projectData?.name}
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isAboutEditing ? (
              <>
              <button
                className="btn btn-success btn-sm"
                style={{
                  backgroundColor: "white",
                  color: "#2067d1",
                  border: "1px solid #2067d1",
                  fontWeight: "bold"
                }}
                onClick={handleEditToggle}
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
                onClick={handleEditToggle}
              />
            )}
          </span>
        </h2>
        <div className="px-3">
          <div
            className="position-relative"
            style={{
              maxHeight:
                isAboutEditing || showFullDescription ? "none" : "100px",
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
              // Raw HTML editing mode
              <textarea
                value={aboutHtml}
                onChange={(e) => setAboutHtml(e.target.value)}
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
              // Display mode
              <div
                ref={editableRef}
                className="mb-3 project-description"
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "15px",
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "1.5",
                  letterSpacing: "0.5px",
                  minHeight: "40px",
                  cursor: "default",
                }}
                dangerouslySetInnerHTML={{ __html: aboutHtml }}
              />
            )}
          </div>

          {/* Download Brochure Link */}
          {!isAboutEditing && (
            <p
              className="mb-3"
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "16px",
              }}
            >
              Click on the{" "}
              <span
                className="fw-bold"
                style={{
                  cursor: "pointer",
                  color: "#2067d1",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s ease",
                }}
                id="download-btn2"
                onClick={
                  isMobileView
                    ? handleDownloadBrochuree
                    : handleDownloadBrochure
                }
                onMouseOver={e =>
                  (e.target.style.backgroundColor = "#e6f0fc")
                }
                onMouseOut={e =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Download
              </span>{" "}
              button to download{" "}
              <span className="fw-bold">
                {projectData?.name} brochure
              </span>
              .
            </p>
          )}

          {!isAboutEditing && (
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 mt-2"
              onClick={(e) => {
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
              onMouseEnter={(e) => (e.target.style.color = "#2067d1")}
              onMouseLeave={(e) => (e.target.style.color = "black")}
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