import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  isEditing,
  handleEdit,
  handleSave,
  setProjectData,
  handleInputChange,
  AddProjectButton,
  showEdit,
}) => {

    const handleArrayInputChange = (field, value) => {
      const arrayValue = value.split(',').map(item => item.trim());
      setProjectData(prev => ({
        ...prev,
        [field]: arrayValue
      }));
    };
   
    const getSizeRange = () => {
        if (!projectData?.floorplans || projectData.floorplans.length === 0) {
          return "Size not available";
        }
        const sizes = projectData.floorplans.map(fp => fp.size);
        const minSize = Math.min(...sizes);
        const maxSize = Math.max(...sizes);
        return `${minSize} - ${maxSize} Sq. Ft.`;
      };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    if (dateStr.toLowerCase().includes("coming")) return "Coming Soon";
    try {
      const date = new Date(isNaN(dateStr) ? dateStr : Number(dateStr));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return dateStr;
    }
  };

  return (
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
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: 8, backgroundColor: "#6c757d", color: "white", fontWeight: "bold" }}
                  onClick={() => {
                    // Reset logic here if needed, or just exit edit mode
                    if (typeof handleEdit === "function") handleEdit(false); // or call a cancel handler if you have one
                  }}
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
                value={AddProjectButton ? '' : (projectData?.overviewPara || '')}
                onChange={(e) => handleInputChange('overviewPara', e.target.value)}
                rows="3"
                placeholder="Project description..."
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
                      value={AddProjectButton ? '' : (projectData?.area || '')}
                      onChange={(e) => handleInputChange('area', e.target.value)}
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
                      {AddProjectButton ? '-- --' : projectData?.area}
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
                      value={AddProjectButton ? '' : (projectData?.floorplans?.map(fp => fp.size).join(', ') || '')}
                      onChange={(e) => {
                        const sizes = e.target.value.split(',').map(s => ({ size: parseInt(s.trim()) || 0 }));
                        handleInputChange('floorplans', sizes);
                      }}
                      placeholder="850, 1200, 1650, 2100"
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
                      {AddProjectButton ? '-- --' : getSizeRange()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Units */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                      value={AddProjectButton ? '' : (projectData?.units || '')}
                      onChange={(e) => handleInputChange('units', e.target.value)}
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
                      {AddProjectButton ? '-- --' : projectData?.units}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Date */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                      type="date"
                      className="form-control form-control-sm mt-1"
                      value={AddProjectButton ? '' : (projectData?.launchDate || '')}
                      onChange={(e) => handleInputChange('launchDate', e.target.value)}
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
                      {AddProjectButton ? '-- --' : formatDate(projectData?.launchDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Possession Date */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                      value={AddProjectButton ? '' : (projectData?.possessionDate || '')}
                      onChange={(e) => handleInputChange('possessionDate', e.target.value)}
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
                      {AddProjectButton ? '-- --' : formatDate(projectData?.possessionDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Total Towers */}
            {((projectData?.totalTowers && !AddProjectButton) || isEditing) && (
              <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                        value={AddProjectButton ? '' : (projectData?.totalTowers || '')}
                        onChange={(e) => handleInputChange('totalTowers', e.target.value)}
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
                        {AddProjectButton ? '-- --' : `${projectData?.totalTowers || ""} Towers`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Total Floors */}
            {((projectData?.totalFloor && !AddProjectButton) || isEditing) && (
              <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                        value={AddProjectButton ? '' : (projectData?.totalFloor || '')}
                        onChange={(e) => handleInputChange('totalFloor', e.target.value)}
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
                        {AddProjectButton ? '-- --' : `${projectData?.totalFloor} Floors`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Project Status */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
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
                    <select
                      className="form-control form-control-sm mt-1"
                      style={{ paddingTop: "6px", paddingBottom: "6px" }}
                      value={AddProjectButton ? '' : (projectData?.status || '')}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="under_construction">Under Construction</option>
                      <option value="ready_to_move">Ready To Move</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <p
                      className="mb-0 fw-normal fw-md-bolder"
                      style={{
                        color: "#000",
                        fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                        marginTop: "2px",
                      }}
                    >
                      {AddProjectButton ? '-- --' : (projectData?.status
                        ?.toLowerCase()
                        ?.replace(/_/g, " ")
                        ?.replace(/\b\w/g, (char) => char.toUpperCase()))}
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
                      : (projectData?.configurationsType?.propertyType &&
                        projectData.configurationsType.propertyType
                          .toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase()))}
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
                      value={AddProjectButton ? '' : (projectData?.configurations?.join(', ') || '')}
                      onChange={(e) => handleArrayInputChange('configurations', e.target.value)}
                      placeholder="1BHK, 2BHK, 3BHK, 4BHK"
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
                        : (projectData?.configurations
                          ?.map((item) => item.toUpperCase())
                          ?.filter((value, index, self) => self.indexOf(value) === index)
                          ?.sort((a, b) => parseFloat(a) - parseFloat(b))
                          ?.join(", "))}
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
                      value={AddProjectButton ? '' : (projectData?.rera || '')}
                      onChange={(e) => handleInputChange('rera', e.target.value)}
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
                      {AddProjectButton ? '-- --' : projectData?.rera}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSection;