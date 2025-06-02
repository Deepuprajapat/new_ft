import React from "react";

const KnowAboutSection = ({
  projectData,
  isAboutEditing,
  setIsAboutEditing,
  aboutHtml,
  setAboutHtml,
  showFullDescription,
  setShowFullDescription,
}) => (
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
            <img
              src="/images/update.svg"
              alt="Save"
              style={{ width: "22px", height: "22px" }}
              onClick={() => setIsAboutEditing(false)}
            />
          ) : (
            <img
              src="/images/edit-icon.svg"
              alt="Edit"
              style={{ width: "18px", height: "18px" }}
              onClick={() => setIsAboutEditing(true)}
            />
          )}
        </span>
      </h2>
      <div className="px-3">
        <div
          className="position-relative overflow-hidden"
          style={{
            maxHeight: showFullDescription ? "none" : "100px",
          }}
        >
          <div
            className={
              !showFullDescription
                ? "position-absolute w-100 h-100"
                : ""
            }
            style={{
              background: !showFullDescription
                ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)"
                : "none",
              top: 0,
              left: 0,
            }}
          ></div>
          <div
            className="mb-3 project-description"
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "15px",
              fontFamily: "'Roboto', sans-serif",
              lineHeight: "1.5",
              letterSpacing: "0.5px",
              outline: isAboutEditing ? "1px solid #2067d1" : "none",
              minHeight: "40px",
              background: isAboutEditing ? "#f8faff" : "transparent",
              borderRadius: "4px",
              padding: isAboutEditing ? "8px" : "0",
              cursor: isAboutEditing ? "text" : "default",
            }}
            contentEditable={isAboutEditing}
            suppressContentEditableWarning={true}
            onInput={e => setAboutHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        </div>
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
      </div>
    </div>
  </div>
);

export default KnowAboutSection;