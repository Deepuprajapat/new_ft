import React from "react";
import PopupDialog from "../CommanPopup"; // Adjust the path if needed

const WhyChooseSection = ({
  projectData,
  isEditing,
  setIsEditing,
  setProjectData,
  handleSitePopup,
  showSitePopup,
  closeSitePopup,
}) => (
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
            <span>Why to choose {projectData?.name}?</span>
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isEditing ? (
                <span onClick={() => setIsEditing(false)}>
                  <img
                    src="/images/update.svg"
                    alt="Edit"
                    fill="true"
                    style={{ width: "22px", height: "22px" }}
                  />
                </span>
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
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
                  {projectData?.images && projectData?.images[0] && (
                    <div className="col-12 mb-1">
                      <img
                        alt={
                          projectData?.images[0].caption || "Project Image 1"
                        }
                        src={projectData?.images[0].imageUrl}
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
                      {projectData?.images &&
                        projectData?.images
                          ?.slice(1, 3)
                          .map((image, index) => (
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
                  {projectData?.usps?.map((usp, idx) => (
                    <div className="col-6" key={idx}>
                      <div className="d-flex align-items-start">
                        <img
                          className="me-2"
                          src="/images/usp-icon.svg"
                          loading="lazy"
                          style={{
                            height:
                              window.innerWidth <= 768 ? "24px" : "30px",
                            marginTop:
                              window.innerWidth <= 768 ? "2px" : "0",
                          }}
                          fetchpriority="high"
                          alt={`USP Icon ${idx + 1}`}
                        />

                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={usp}
                            onChange={(e) => {
                              const updatedUSPs = [...projectData.usps];
                              updatedUSPs[idx] = e.target.value;
                              setProjectData({
                                ...projectData,
                                usps: updatedUSPs,
                              });
                            }}
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
                            }}
                          >
                            {usp}
                          </span>
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
                    projectName={projectData?.name || "Invest Mango"}
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

export default WhyChooseSection;