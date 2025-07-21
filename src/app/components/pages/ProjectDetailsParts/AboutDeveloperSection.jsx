import React, { useState, useEffect, useRef } from "react";
import { imgUplod } from "../../../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
const AboutDeveloperSection = ({
  developerDetails,
  expandedIndex,
  setExpandedIndex,
  projectData,
  isMobileView,
  handleDownloadBrochuree,
  handleDownloadBrochure,
  showEdit,
  handleSave,
}) => {
  // Local state for editing and form
  const [isDeveloperEditing, setIsDeveloperEditing] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [developerForm, setDeveloperForm] = useState({
    logo: developerDetails?.logo || "",
    altLogo: developerDetails?.altLogo || "",
    establishedYear: developerDetails?.establishedYear || "",
    totalProjects: developerDetails?.totalProjects || "",
    about: developerDetails?.about  || "",
    address: developerDetails?.address || "",
  });
  console.log("developerDetails----------", developerDetails);
  // Sync form with developerDetails when not editing
  useEffect(() => {
    if (!isDeveloperEditing && developerDetails) {
      setDeveloperForm({
        logo: developerDetails.logo || "",
        altLogo: developerDetails.altLogo || "",
        establishedYear: developerDetails.establishedYear || "",
        totalProjects: developerDetails.totalProjects || "",
        about: developerDetails?.about || "",
        address: developerDetails.address || "",
      });
    }
  }, [developerDetails, isDeveloperEditing]);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoUploading(true);
      try {
        const url = await imgUplod(file, { alt_keywords: developerDetails?.name || "developer-logo", file_path: "/new_vi" });
        setDeveloperForm((f) => ({ ...f, logo: url }));
      } catch (err) {
        alert("Image upload failed. Please try again.");
      }
      setLogoUploading(false);
    }
  };
  // Save handler (could call an API or lift state up if needed)
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsDeveloperEditing(false);
    // Build the correct payload structure for PATCH
    const payload = {
      developer_info: {
        alt_logo: developerForm.altLogo,
        established_year: developerForm.establishedYear,
        developer_name: developerDetails?.name || "",
        phone: developerDetails?.phone || "",
      },
      web_cards: {
        ...(projectData?.web_cards || {}),
        about: {
          ...((projectData?.web_cards && projectData.web_cards.about) || {}),
          logo_url: developerForm.logo,
          total_projects: developerForm.totalProjects,
          description: developerForm.about,
          contact_details: {
            ...((projectData?.web_cards?.about?.contact_details) || {}),
            project_address: developerForm.address,
          },
        },
      },
    };
    handleSave(payload);
  };
  const handleCancel = () => {
    setDeveloperForm({
      logo: developerDetails?.logo || "",
      altLogo: developerDetails?.altLogo || "",
      establishedYear: developerDetails?.establishedYear || "",
      totalProjects: developerDetails?.totalProjects || "",
      about: developerDetails?.about   || "",
      address: developerDetails?.address || "",
    });
    setIsDeveloperEditing(false);
  };

  return (
    <div
      className="mb-4"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      id="developer"
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
          About {developerDetails?.name}
          {showEdit && (
            <span style={{ cursor: "pointer" }}>
              {isDeveloperEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ backgroundColor: "#000", borderColor: "#000" }}
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
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
                <img
                  src="/images/edit-icon.svg"
                  alt="Edit"
                  style={{ width: "18px", height: "18px", marginRight: "19px" }}
                  onClick={() => setIsDeveloperEditing(true)}
                />
              )}
            </span>
          )}
        </h2>

        <div className="row px-3">
          <div className="col-12">
            {isDeveloperEditing ? (
              <form className="px-3" onSubmit={handleSaveChanges}>
                <div className="mb-2 d-flex align-items-center">
                  <div
                    className="position-relative me-2"
                    style={{
                      width: "90px",
                      height: "90px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.querySelector(".camera-overlay").style.display = "flex")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.querySelector(".camera-overlay").style.display = "none")
                    }
                  >
                    <img
                      src={developerForm.logo}
                      alt="logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <div
                      className="camera-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      {logoUploading ? (
                        "..."
                      ) : (
                        <FontAwesomeIcon icon={faCamera} />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={developerForm.altLogo}
                    onChange={(e) =>
                      setDeveloperForm((f) => ({
                        ...f,
                        altLogo: e.target.value,
                      }))
                    }
                    placeholder="Alt text"
                  />
                </div>
                <div className="mb-2 d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={developerForm.establishedYear}
                    onChange={(e) =>
                      setDeveloperForm((f) => ({
                        ...f,
                        establishedYear: e.target.value,
                      }))
                    }
                    placeholder="Established Year"
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={developerForm.totalProjects}
                    onChange={(e) =>
                      setDeveloperForm((f) => ({
                        ...f,
                        totalProjects: e.target.value,
                      }))
                    }
                    placeholder="Total Projects"
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={3}
                    value={developerForm.about}
                    onChange={(e) =>
                      setDeveloperForm((f) => ({ ...f, about: e.target.value }))
                    }
                    placeholder="About Developer"
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={developerForm.address}
                    onChange={(e) =>
                      setDeveloperForm((f) => ({
                        ...f,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Address"
                  />
                </div>
              </form>
            ) : (
              <>
                <div className="d-flex align-items-center px-3">
                  <img
                    src={developerDetails?.logo}
                    className="img-fluid me-3"
                    alt={developerDetails?.altLogo}
                    loading="lazy"
                    style={{ maxWidth: "90px", border: "1px solid grey" }}
                    fetchpriority="high"
                  />
                  <p
                    className="mb-0"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                    }}
                  >
                    ESTABLISHED IN - <b>{developerDetails?.establishedYear}</b>
                    <br />
                    TOTAL PROJECTS - <b>{developerDetails?.totalProjects || "N/A"}+</b>
                  </p>
                </div>
                <div
                  className="mb-4"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                  }}
                >
                  {developerDetails?.about && (
                    <>
                      <div
                        className="project-description"
                        dangerouslySetInnerHTML={{
                          __html:
                            expandedIndex === "about"
                              ? developerDetails.about
                                  .replace(
                                    /<ul>/g,
                                    '<ul style="padding-left: 20px; margin-top: 10px;">'
                                  )
                                  .replace(
                                    /<li>/g,
                                    '<li style="font-size: 1em; color: #666;">'
                                  )
                              : developerDetails.about.substring(0, 150) +
                                "...",
                        }}
                      />
                      <button
                        onClick={() => {
                          window.location.href = `/developerPage/${developerDetails?.id}}`;
                        }}
                        className="btn btn-primary"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          backgroundColor: "#2067d1", 
                          color: "#ffffff",
                          fontWeight: "bold",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          transition: "background-color 0.3s ease"
                        }}
                      >
                        View Developer Details
                      </button>
                    </>
                  )}
                </div>
                <h4
                  className="fw-bold mb-3"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "18px",
                  }}
                >
                  Contact Details
                </h4>
                <p
                  className="mb-0"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                  }}
                >
                  <b>{developerDetails?.name}</b>
                  <br />
                  <b>Address:</b>{" "}
                  {isDeveloperEditing ? (
                    <input
                      type="text"
                      className="form-control d-inline-block"
                      style={{ width: "auto", display: "inline-block" }}
                      value={developerForm.address}
                      onChange={(e) =>
                        setDeveloperForm((f) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Address"
                    />
                  ) : (
                    developerDetails?.address
                  )}
                  <br />
                  <b>Phone:</b>{" "}
                  {developerDetails?.phone ? (
                    <a
                      href={`tel:${developerDetails.phone}`}
                      style={{
                        textDecoration: "none",
                        color: "#2067d1",
                        fontWeight: "bold",
                      }}
                    >
                      {developerDetails.phone}
                    </a>
                  ) : (
                    <span style={{ color: "#888" }}>Not Available</span>
                  )}
                  <br />
                  <b>Book Your Site Visit</b>{" "}
                    <span
                      onClick={
                        isMobileView
                          ? handleDownloadBrochuree
                          : handleDownloadBrochure
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        cursor: "pointer",
                        color: "#2067d1",
                        fontWeight: 700,
                      }}
                      id="BookBtn3"
                    >
                      Click Here
                    </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloperSection;
