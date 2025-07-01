import React , {useState} from "react";
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

  const handleCancel = () => setIsEditing(false);
  // Map USPs for display and editing
  const uspRawList = projectData?.web_cards?.why_to_choose?.usp_list || [];
  const displayUSPs = Array(6).fill("").map((_, index) =>
    typeof uspRawList[index] === 'string' ? uspRawList[index] : (uspRawList[index]?.description || "")
  );
  const handleEdit = () => setIsEditing(true);
  const handleSaveChanges = () => {
    handleSave(projectData); // Send updated data to parent component
    setIsEditing(false);
  };

  // Map why_to_choose.image_urls to images array for UI compatibility
  const images = projectData?.web_cards?.why_to_choose?.image_urls?.length
  ? projectData.web_cards.why_to_choose.image_urls.map((url, idx) => ({
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
              <span>Why to choose {projectData?.name}?</span>
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
                          alt={
                            images[0].caption || "Project Image 1"
                          }
                          src={images[0].imageUrl}
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
                          images
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
                    {displayUSPs.map((usp, idx) => (
                      <div className="col-6" key={idx}>
                        <div className="d-flex align-items-start">
                          <img
                            className="me-2"
                            src="/images/usp-icon.svg"
                            loading="lazy"
                            style={{
                              height: window.innerWidth <= 768 ? "24px" : "30px",
                              marginTop: window.innerWidth <= 768 ? "2px" : "0",
                            }}
                            fetchpriority="high"
                            alt={`USP Icon ${idx + 1}`}
                          />

                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={usp}
                              placeholder={`Enter USP ${idx + 1}`}
                              onChange={(e) => {
                                const updatedUSPs = [...displayUSPs];
                                updatedUSPs[idx] = e.target.value;
                                setProjectData({
                                  ...projectData,
                                  web_cards: {
                                    ...projectData.web_cards,
                                    why_to_choose: {
                                      ...projectData.web_cards?.why_to_choose,
                                      usp_list: updatedUSPs
                                    }
                                  }
                                });
                              }}
                              style={{
                                fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                                lineHeight: window.innerWidth <= 768 ? "1.2" : "normal",
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                                lineHeight: window.innerWidth <= 768 ? "1.2" : "normal",
                                color: usp ? "inherit" : "#6c757d",
                              }}
                            >
                              {usp || `USP ${idx + 1}`}
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
                        href={`tel:+91${projectData?.locality?.city?.phoneNumber?.[0] ||
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