import React, { useState, useEffect } from "react";

const AboutDeveloperSection = ({
  developerDetails,
  expandedIndex,
  setExpandedIndex,
  projectData,
  isMobileView,
  handleDownloadBrochuree,
  handleDownloadBrochure,
  showEdit,
}) => {
  // Local state for editing and form
  const [isDeveloperEditing, setIsDeveloperEditing] = useState(false);
  const [developerForm, setDeveloperForm] = useState({
    logo: developerDetails?.logo || "",
    altLogo: developerDetails?.altLogo || "",
    establishedYear: developerDetails?.establishedYear || "",
    totalProjects: developerDetails?.totalProjects || "",
    about: developerDetails?.about || "",
    address: developerDetails?.address || "",
  });

  // Sync form with developerDetails when not editing
  useEffect(() => {
    if (!isDeveloperEditing && developerDetails) {
      setDeveloperForm({
        logo: developerDetails.logo || "",
        altLogo: developerDetails.altLogo || "",
        establishedYear: developerDetails.establishedYear || "",
        totalProjects: developerDetails.totalProjects || "",
        about: developerDetails.about || "",
        address: developerDetails.address || "",
      });
    }
  }, [developerDetails, isDeveloperEditing]);

  // Save handler (could call an API or lift state up if needed)
  const handleSave = (e) => {
    e.preventDefault();
    setIsDeveloperEditing(false);
    // Optionally: call a prop function to update parent state or API
    // onSave(developerForm);
  };
  const handleCancel = () => {
    setDeveloperForm({
      logo: developerDetails?.logo || "",
      altLogo: developerDetails?.altLogo || "",
      establishedYear: developerDetails?.establishedYear || "",
      totalProjects: developerDetails?.totalProjects || "",
      about: developerDetails?.about || "",
    });
    setIsDeveloperEditing(false);
  };

  return (
    <div className="mb-4" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} id="developer">
      <div className="p-0 pb-2">
        <h2 className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}>
          About {developerDetails?.name}
          {showEdit && (
          <span style={{ cursor: "pointer", marginLeft: "12px" }}>
            {isDeveloperEditing ? (
              <>
                <button
                  className="btn btn-success btn-sm"
                  style={{ backgroundColor: "#000", borderColor: "#000", marginRight: "19px" }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: "white", fontWeight: "bold", backgroundColor: "#6c757d" }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <img src="/images/edit-icon.svg" alt="Edit" style={{ width: "18px", height: "18px", marginRight: "19px" }}
                onClick={() => setIsDeveloperEditing(true)} />
            )}
            </span>
          )}
        </h2>

        <div className="row px-3">
          <div className="col-12">
            {isDeveloperEditing ? (
              <form className="px-3" onSubmit={handleSave}>
                <div className="mb-2 d-flex align-items-center">
                  <input type="text" className="form-control me-2" style={{ maxWidth: 200 }}
                    value={developerForm.logo}
                    onChange={e => setDeveloperForm(f => ({ ...f, logo: e.target.value }))}
                    placeholder="Logo URL" />
                  <input type="text" className="form-control"
                    value={developerForm.altLogo}
                    onChange={e => setDeveloperForm(f => ({ ...f, altLogo: e.target.value }))}
                    placeholder="Alt text" />
                </div>
                <div className="mb-2 d-flex gap-2">
                  <input type="text" className="form-control"
                    value={developerForm.establishedYear}
                    onChange={e => setDeveloperForm(f => ({ ...f, establishedYear: e.target.value }))}
                    placeholder="Established Year" />
                  <input type="text" className="form-control"
                    value={developerForm.totalProjects}
                    onChange={e => setDeveloperForm(f => ({ ...f, totalProjects: e.target.value }))}
                    placeholder="Total Projects" />
                </div>
                <div className="mb-2">
                  <textarea className="form-control" rows={3}
                    value={developerForm.about}
                    onChange={e => setDeveloperForm(f => ({ ...f, about: e.target.value }))}
                    placeholder="About Developer" />
                </div>
                <div className="mb-2">
                  <input type="text" className="form-control"
                    value={developerForm.address}
                    onChange={e => setDeveloperForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Address" />
                </div>
              </form>
            ) : (
              <>
                <div className="d-flex align-items-center px-3">
                  <img src={developerDetails?.logo} className="img-fluid me-3"
                    alt={developerDetails?.altLogo}
                    loading="lazy"
                    style={{ maxWidth: "90px", border: "1px solid grey" }}
                    fetchpriority="high"
                  />
                  <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                    ESTABLISHED IN - <b>{developerDetails?.establishedYear}</b><br />
                    TOTAL PROJECTS - <b>{developerDetails?.totalProjects}+</b>
                  </p>
                </div>
                <div className="mb-4" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                  {developerDetails?.about && (
                    <>
                      <div className="project-description"
                        dangerouslySetInnerHTML={{
                          __html:
                            expandedIndex === "about"
                              ? developerDetails.about
                                .replace(/<ul>/g, '<ul style="padding-left: 20px; margin-top: 10px;">')
                                .replace(/<li>/g, '<li style="font-size: 1em; color: #666;">')
                              : developerDetails.about.substring(0, 150) + "...",
                        }}
                      />
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === "about" ? null : "about")}
                        className="btn btn-link p-0 read-more-btn"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          color: "#2067d1",
                          textDecoration: "none",
                          fontWeight: "bold",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {expandedIndex === "about" ? "Show Less" : "Read More"}
                      </button>
                    </>
                  )}
                </div>
                <h4 className="fw-bold mb-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "18px" }}>
                  Contact Details
                </h4>
                <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px" }}>
                  <b>{projectData?.name}</b><br />
                  <b>Address:</b> {isDeveloperEditing ? (
                    <input
                      type="text"
                      className="form-control d-inline-block"
                      style={{ width: "auto", display: "inline-block" }}
                      value={developerForm.address}
                      onChange={e => setDeveloperForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Address"
                    />
                  ) : (
                    projectData?.address
                  )}<br />
                  <b>Phone:</b>{" "}
                  <a href={`tel:+91${projectData?.locality?.city?.phoneNumber?.[0] || "8595189189"}`}
                    style={{ textDecoration: "none", color: "#2067d1", fontWeight: "bold" }}>
                    {projectData?.locality?.city?.phoneNumber?.[0] || "8595-189-189"}
                  </a>
                  <br />
                  <b>Book Your Site Visit</b>{" "}
                  <span style={{ cursor: "pointer", color: "#2067d1", fontWeight: 700 }}
                    id="BookBtn3"
                    onClick={isMobileView ? handleDownloadBrochuree : handleDownloadBrochure}>
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