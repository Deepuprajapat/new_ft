import React, { useState, useEffect } from "react";
import PopupDialog from "../CommanPopup"; // Adjust the path if needed

const WhyChooseSection = ({
  projectData,
  setProjectData,
  handleSitePopup,
  showSitePopup,
  closeSitePopup,
  showEdit,
  handleSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Map USPs for display and editing
  const uspRawList = projectData?.web_cards?.why_to_choose?.usp_list || [];
  const displayUSPs = Array(6)
    .fill("")
    .map((_, index) =>
      typeof uspRawList[index] === "string"
        ? uspRawList[index]
        : uspRawList[index]?.description || ""
    );

  // Local state for editing USPs
  const [editingUSPs, setEditingUSPs] = useState(displayUSPs);

  // Sync editingUSPs with displayUSPs when projectData changes (but not during editing)
  useEffect(() => {
    if (!isEditing) {
      const uspRawList = projectData?.web_cards?.why_to_choose?.usp_list || [];
      const newDisplayUSPs = Array(6)
        .fill("")
        .map((_, index) =>
          typeof uspRawList[index] === "string"
            ? uspRawList[index]
            : uspRawList[index]?.description || ""
        );
      setEditingUSPs(newDisplayUSPs);
    }
  }, [projectData, isEditing]);
  

  const handleEdit = () => {
    setEditingUSPs([...displayUSPs]); // Initialize with current values
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingUSPs([...displayUSPs]); // Reset to original values
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    // Update project data with edited values
    const updatedProjectData = {
      ...projectData,
      web_cards: {
        ...projectData.web_cards,
        why_to_choose: {
          ...projectData.web_cards?.why_to_choose,
          usp_list: editingUSPs,
        },
      },
    };
    setProjectData(updatedProjectData);
    handleSave(updatedProjectData); // Send updated data to parent component
    setIsEditing(false);
  };

  // Handle local USP changes during editing
  const handleUSPChange = (idx, value) => {
    setEditingUSPs((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  // Map why_to_choose.image_urls to images array for UI compatibility
  const images = projectData?.web_cards?.images?.length
    ? projectData.web_cards.images.map((url, idx) => ({
        imageUrl: url,
        caption: `Image ${idx + 1}`,
      }))
    : [];

  return (
    <div
      className="mb-4"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      id="why-choose"
    >
      <div>
        <div>
          <div>
            <h2
              className="mb-0 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
              style={{
                fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                backgroundColor: "#2067d1",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <span>Why to choose {projectData?.project_name}?</span>
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
                      onClick={handleEdit}
                    />
                  )}
                </span>
              )}
            </h2>
            <div
              className="px-3"
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                padding: "20px",
              }}
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="row g-1">
                    {/* First row with single image */}
                    {images && images[0] && (
                      <div className="col-12 mb-1">
                        <img
                          alt={"Project Image 1"}
                          src={images[1]?.imageUrl}
                          loading="lazy"
                          className="img-fluid rounded w-100"
                          style={{
                            height:
                              window.innerWidth <= 768 ? "200px" : "185px",
                            objectFit: "cover",
                            borderRadius: "16px",
                          }}
                          fetchpriority="high"
                        />
                      </div>
                    )}

                    {/* Second row with two images */}
                    <div className="col-12">
                      <div className="row g-2">
                        {/* <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => closeSitePopup(false)}
                  style={{ borderRadius: 8, fontWeight: 500 }}
                >
                  Close
                </button> */}

                        {images &&
                          images?.slice(2, 4).map((image, index) => (
                            <div className="col-6" key={index + 1}>
                              <a
                                href={image.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-block"
                              >
                                <img
                                  alt={
                                    image.caption ||
                                    `Project Image ${index + 2}`
                                  }
                                  src={image.imageUrl}
                                  loading="lazy"
                                  className="img-fluid rounded w-100"
                                  style={{
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "16px",
                                  }}
                                  fetchpriority="high"
                                />
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="row g-4"
                    style={{
                      marginTop: window.innerWidth <= 768 ? "5px" : "0",
                    }}
                  >
                    {(isEditing ? editingUSPs : displayUSPs).map((usp, idx) => (
                      <div className="col-6" key={idx}>
                        <div className="d-flex align-items-start">
                          <img
                            className="me-2"
                            src="/images/usp-icon.svg"
                            loading="lazy"
                            style={{
                              height:
                                window.innerWidth <= 768 ? "24px" : "30px",
                              marginTop: window.innerWidth <= 768 ? "2px" : "0",
                            }}
                            fetchpriority="high"
                            alt={`USP Icon ${idx + 1}`}
                          />

                          {isEditing ? (
                            <textarea
                              className="form-control form-control-sm"
                              value={usp}
                              placeholder={`Enter USP ${idx + 1}`}
                              onChange={(e) =>
                                handleUSPChange(idx, e.target.value)
                              }
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "10px" : "14px",
                                lineHeight:
                                  window.innerWidth <= 768 ? "1.2" : "normal",
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "10px" : "14px",
                                lineHeight:
                                  window.innerWidth <= 768 ? "1.2" : "normal",
                                color: usp ? "inherit" : "#6c757d",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: (usp || `USP ${idx + 1}`)
                                  .replace(/\\r\\n/g, "\n")
                                  .replace(/\\n/g, "\n")
                                  .replace(/\\r/g, "\r")
                                  .replace(/(\r\n|\n|\r)/g, "<br />"),
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="row mt-4"
                    style={{
                      position:
                        window.innerWidth <= 768 ? "static" : "relative",
                      bottom: window.innerWidth <= 768 ? "auto" : 0,
                      left: 0,
                      right: 0,
                      margin: "0 12px",
                    }}
                  >
                    <div className="col-12">
                      <a
                        className="btn w-100 py-1"
                        style={{
                          backgroundColor: "#2067d1",
                          color: "#fff",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#1854b0";
                          e.target.style.transition = "background-color 0.3s";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#2067d1";
                        }}
                        onClick={handleSitePopup}
                      >
                        Book Your Site Visit
                      </a>
                    </div>

                    {/* Floor Plan Dialog Popup */}
                    <PopupDialog
                      open={showSitePopup}
                      onClose={closeSitePopup}
                      projectName={projectData?.project_name || "Invest Mango"}
                    />
                    <div className="col-12 mt-2">
                      <a
                        href={`tel:+91${
                          projectData?.locality?.city?.phoneNumber?.[0] ||
                          "8595189189"
                        }`}
                        className="btn w-100 py-1"
                        style={{
                          backgroundColor: "#fff",
                          color: "#000",
                          border: "1px solid #000",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#2067d1";
                          e.target.style.color = "#fff";
                          e.target.style.transition = "all 0.3s";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.color = "#000";
                        }}
                      >
                        Connect to Our Expert
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseSection;
