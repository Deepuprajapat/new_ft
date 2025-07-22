import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import LeadFormPopup from "../LeadFormPopup";
import {
  faExpandArrowsAlt,
  faRulerCombined,
  faBuilding,
  faCalendarAlt,
  faGavel,
  faBars,
  faFlag,
  faCity,
  faHouseUser,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const ProjectDetailsSection = ({
  projectData,
  AddProjectButton,
  showEdit,
  handleSave
}) => {
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [showImgPopup, setImgShowPopup] = useState(false);

  const handleEdit = () => {
    setEditData({
      ...JSON.parse(JSON.stringify(projectData)),
      rera: projectData?.web_cards?.project_details?.rera_number?.value || '',
      web_cards: {
        ...projectData.web_cards,
        project_details: {
          ...projectData.web_cards?.project_details,
          project_status: {
            ...projectData.web_cards?.project_details?.project_status,
            value: projectData?.web_cards?.project_details?.project_status?.value || projectData?.status || ''
          }
        }
      }
    });
    setIsEditing(true);
  };

  console.log("rera----------", projectData?.web_cards?.project_details?.rera_number?.value);

  // Save: update main data
  const handleSaver = () => {
    // Ensure rera_number and establishment_year are nested objects with .value
    const patchedEditData = {
      ...editData,
      web_cards: {
        ...(editData.web_cards || {}),
        project_details: {
          ...(editData.web_cards?.project_details || {}),
          rera_number: { value: editData.rera || '' },
        },
        about: {
          ...(editData.web_cards?.about || {}),
          establishment_year: { value: editData.establishment_year || '' },
        },
      },
    };
    handleSave(patchedEditData);
    setIsEditing(false);
  };

  // Cancel: discard changes
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Input change for nested keys
  const handleInputChange = (path, value) => {
    setEditData(prev => {
      const newData = { ...prev };
      // Support nested keys like 'web_cards.project_details.area.value'
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLeadPopup(true);
    }, 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (projectData?.project_id === "d034a904e224b629") {
      setImgShowPopup(true);
    }
  }, [projectData]);

  return (
    <>
{projectData && (
  <Helmet>
    <title>{projectData?.meta_info?.title || "Default Title"}</title>
    <meta
      name="keywords"
      content={
        projectData.metaKeywords?.filter((k) => k.trim() !== "").join(", ") ||
        "default, keywords"
      }
    />
    <link rel="canonical" href={window.location.href} />

    {/* Inject Project Schema */}
    {projectData?.meta_info?.project_schema?.map((schemaStr, index) => {
      try {
        // Remove <script> tags and extra escaping
        let cleanJSON = schemaStr
          .replace(/<script[^>]*>|<\/script>/gi, "") // Remove <script> tags
          .replace(/\\"/g, '"') // Replace escaped quotes
          .replace(/\\\\/g, "\\"); // Replace double backslashes

        // Parse the cleaned JSON string
        const parsedSchema = JSON.parse(cleanJSON);

        // Stringify the parsed object to ensure valid JSON
        const finalJSON = JSON.stringify(parsedSchema);

        return (
          <script
            key={`project-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: finalJSON }}
          />
        );
      } catch (err) {
        console.warn("Schema parse error", err, schemaStr);
        return null;
      }
    })}
  </Helmet>
)}

      <div
        className="mb-4"
        id="overview"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <div className="p-0 pb-2">
          <div
            className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
            style={{
              fontSize: window.innerWidth <= 768 ? "16px" : "18px",
              backgroundColor: "#2067d1",
              borderRadius: "4px 4px 0 0",
            }}
          >
            <span>Project Details</span>
            {showEdit && (
              <span style={{ cursor: "pointer", marginRight: "12px" }}>
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      style={{ backgroundColor: "white", color: "#2067d1", fontWeight: 'bold' }}
                      onClick={handleSaver}
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
                  <span
                    onClick={handleEdit}
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
            )}
          </div>

          <div className="px-3">
            <div className="mb-2 mb-md-4" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "16px" }}>
              {isEditing ? (
                <textarea
                  className="form-control"
                  value={editData?.overviewPara || ''}
                  onChange={(e) => handleInputChange('overviewPara', e.target.value)}
                  rows="3"
                  placeholder="Project description..."
                  maxLength={500}
                />
              ) : (
                <div
                  className="project-description"
                  dangerouslySetInnerHTML={{
                    __html: AddProjectButton ? 'Enter project description...' : (projectData?.overviewPara || ''),
                  }}
                />
              )}
            </div>

            <div className="row g-3 mb-0 mb-md-4">
              {/* Project Area */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faExpandArrowsAlt}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Project Area
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.area?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.area.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.area?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faRulerCombined}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Sizes
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.sizes?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.sizes.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.sizes?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Units */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Project Units
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.units?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.units.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.units?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Launch Date */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Launch Date
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.launch_date?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.launch_date.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.launch_date?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Possession Date */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faGavel}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Possession Date
                    </small>
                    {isEditing ? (
                      <input
                        type="date"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.possession_date?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.possession_date.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.possession_date?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Towers */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Total Towers
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.total_towers?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.total_towers.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.total_towers?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Floors */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faBars}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Total Floors
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.web_cards?.project_details?.total_floor?.value || ''}
                        onChange={e => handleInputChange('web_cards.project_details.total_floor.value', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.web_cards?.project_details?.total_floor?.value || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div className="col-6 col-md-4 mt-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faFlag}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Project Status
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.status || ''}
                        onChange={e => setEditData(prev => ({ ...prev, status: e.target.value }))}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                          fontWeight: window.innerWidth <= 768 ? "400" : "800",
                        }}
                      >
                        {projectData?.status || '-- --'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="col-6 col-md-4 mt-2 mt-md-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faCity}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Property Type
                    </small>
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                        }}
                      >
                        {AddProjectButton
                          ? '-- --'
                          : (projectData?.web_cards?.project_details?.type?.value &&
                            projectData?.web_cards?.project_details?.type?.value
                              .toLowerCase()
                              .replace(/^[\w]/, (c) => c.toUpperCase()))}
                      </p>
              
                  </div>
                </div>
              </div>

              {/* Configurations */}
              <div className="col-6 col-md-4 mt-2 mt-md-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faHouseUser}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      Configurations
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={(() => {
                          const val = editData?.web_cards?.project_details?.configuration?.value;
                          if (!val) return '';
                          try {
                            const arr = JSON.parse(val);
                            return Array.isArray(arr) ? arr.join(', ') : '';
                          } catch {
                            return '';
                          }
                        })()}
                        onChange={e => {
                          const arr = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                          handleInputChange('web_cards.project_details.configuration.value', JSON.stringify(arr));
                        }}
                        placeholder="1BHK, 2BHK, 3BHK, 4BHK"
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder text-break"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                        }}
                      >
                        {AddProjectButton
                          ? '-- --'
                          : (() => {
                            const val = projectData?.web_cards?.project_details?.configuration?.value;
                            if (!val) return '-- --';
                            try {
                              const arr = JSON.parse(val);
                              return Array.isArray(arr) ? arr.join(', ') : '-- --';
                            } catch {
                              return '-- --';
                            }
                          })()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RERA Number */}
              <div className="col-6 col-md-4 mt-2 mt-md-4">
                <div className="d-flex align-items-center flex-column flex-md-row">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="mb-2 mb-md-0 me-md-3"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "14px" : "20px",
                      color: "#2067d1",
                    }}
                  />
                  <div className="text-center text-md-start w-100">
                    <small
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "11px" : "15px",
                        fontWeight: "600",
                      }}
                    >
                      RERA Number
                    </small>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        value={editData?.rera || ''}
                        onChange={(e) => handleInputChange('rera', e.target.value)}
                        maxLength={500}
                      />
                    ) : (
                      <p
                        className="mb-0 fw-normal fw-md-bolder"
                        style={{
                          color: "#000",
                          fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                          marginTop: "2px",
                        }}
                      >
                        {AddProjectButton ? '-- --' : projectData?.web_cards?.project_details?.rera_number?.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {showImgPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div className="popup-wrapper">
              <button
                onClick={() => setImgShowPopup(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  color: "#fff",
                  fontSize: "20px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  lineHeight: "30px",
                  textAlign: "center",
                }}
              >
                ×
              </button>

              <img
                src="/images/NiralaPopupNoidaIVR.png"
                alt="Popup"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>
        )}

        <LeadFormPopup open={showLeadPopup} onClose={() => setShowLeadPopup(false)} />
      </div>
    </>
  );
};

export default ProjectDetailsSection;
