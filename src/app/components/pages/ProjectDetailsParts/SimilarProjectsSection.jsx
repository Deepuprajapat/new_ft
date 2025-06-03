import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";

const defaultNewProject = {
  name: "",
  url: "",
  images: [{ imageUrl: "" }],
  shortAddress: "",
  area: "",
  configurations: [],
  floorplans: [],
};

const SimilarProjectsSection = ({
  allSimilarProjects,
  formatPrice,
  getLeastPriceOfFloorPlan,
  onSave, // optional: callback to save changes
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableProjects, setEditableProjects] = useState([]);
  const [newProject, setNewProject] = useState({ ...defaultNewProject });
  const [removeIndex, setRemoveIndex] = useState(null);

  useEffect(() => {
    setEditableProjects(
      allSimilarProjects
        ? JSON.parse(JSON.stringify(allSimilarProjects))
        : []
    );
  }, [allSimilarProjects]);

  const handleProjectChange = (index, field, value) => {
    const updated = [...editableProjects];
    if (field === "imageUrl") {
      updated[index].images[0].imageUrl = value;
    } else {
      updated[index][field] = value;
    }
    setEditableProjects(updated);
  };

  const handleAddProject = () => {
    if (!newProject.name) return;
    setEditableProjects([...editableProjects, { ...newProject }]);
    setNewProject({ ...defaultNewProject });
  };

  const handleRemoveProject = (index) => {
    const updated = [...editableProjects];
    updated.splice(index, 1);
    setEditableProjects(updated);
    setRemoveIndex(null);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(editableProjects);
  };

  return (
    <div
      className="mb-4"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      id="similar_projects"
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Similar Projects
          <button
            className={`btn ${isEditing ? "btn-primary" : ""}`}
            style={{
              border: "2px solid #2067d1",
              borderRadius: "15px",
              padding: window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
              fontSize: window.innerWidth <= 768 ? "10px" : "14px",
              fontWeight: "600",
              backgroundColor: isEditing ? "rgb(32, 103, 209)" : "white",
              color: isEditing ? "white" : "#2067d1",
              marginLeft: "10px",
            }}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            aria-label={isEditing ? "Save" : "Edit"}
          >
            <img
              src={isEditing ? "/images/update.svg" : "/images/edit-icon.svg"}
              alt={isEditing ? "Save" : "Edit"}
              style={{
                width: isEditing ? "22px" : "18px",
                height: isEditing ? "22px" : "18px",
              }}
            />
          </button>
        </h4>
        <div className="row">
          <div className="col-md-12">
            <div style={{ position: "relative" }}>
              <Carousel
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
                style={{ width: "100%", margin: "0 auto" }}
                focusOnSelect={false}
                responsive={{
                  desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 4,
                    slidesToSlide: 1,
                  },
                  tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2,
                    slidesToSlide: 1,
                  },
                  mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1,
                    slidesToSlide: 1,
                  },
                }}
              >
                {(isEditing ? editableProjects : allSimilarProjects)?.length > 0 ? (
                  (isEditing ? editableProjects : allSimilarProjects).map((project, index) => (
                    <div key={index} className="px-2">
                      <div className="similar_projects_item">
                        <div style={{ color: "#000" }}>
                          {isEditing ? (
                            <>
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.name}
                                onChange={e => handleProjectChange(index, "name", e.target.value)}
                                placeholder="Project Name"
                              />
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.url}
                                onChange={e => handleProjectChange(index, "url", e.target.value)}
                                placeholder="Project URL"
                              />
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.images?.[0]?.imageUrl || ""}
                                onChange={e => handleProjectChange(index, "imageUrl", e.target.value)}
                                placeholder="Image URL"
                              />
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.shortAddress}
                                onChange={e => handleProjectChange(index, "shortAddress", e.target.value)}
                                placeholder="Short Address"
                              />
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.area}
                                onChange={e => handleProjectChange(index, "area", e.target.value)}
                                placeholder="Area"
                              />
                              <input
                                className="form-control mb-2"
                                type="text"
                                value={project.configurations?.join(",")}
                                onChange={e =>
                                  handleProjectChange(index, "configurations", e.target.value.split(","))
                                }
                                placeholder="Configurations (comma separated)"
                              />
                              <button
                                className="btn btn-danger btn-sm"
                                type="button"
                                onClick={() => setRemoveIndex(index)}
                                style={{ marginTop: "5px" }}
                              >
                                Remove
                              </button>
                              {removeIndex === index && (
                                <div
                                  style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "rgba(0,0,0,0.4)",
                                    zIndex: 2000,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      background: "#fff",
                                      padding: "24px 32px",
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                      minWidth: "300px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <p style={{ marginBottom: "18px", fontWeight: 500 }}>
                                      Are you sure you want to remove this project?
                                    </p>
                                    <button
                                      className="btn btn-danger me-2"
                                      onClick={() => handleRemoveProject(index)}
                                    >
                                      OK
                                    </button>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => setRemoveIndex(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <a
                              href={project?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#000",
                                textDecoration: "none",
                              }}
                            >
                              <img
                                src={project?.images[0]?.imageUrl}
                                alt={project?.name}
                                loading="lazy"
                                style={{
                                  height: "150px",
                                  width: "100%",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                              />
                              <p
                                style={{
                                  color: "#2067d1",
                                  fontWeight: 600,
                                  margin: "10px 0",
                                  fontSize:
                                    window.innerWidth <= 768 ? "14px" : "16px",
                                  lineHeight: "20px",
                                  minHeight: "45px",
                                }}
                              >
                                {project.name}
                              </p>
                            </a>
                          )}
                          <div className="project-details">
                            <p
                              className="mb-1"
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "12px" : "13px",
                                color: "#000",
                              }}
                            >
                              <i
                                className="fas fa-map-marker-alt me-2"
                                style={{ color: "#2067d1" }}
                              ></i>
                              {project?.shortAddress}
                            </p>
                            {project?.area && (
                              <p
                                className="mb-1"
                                style={{
                                  fontSize:
                                    window.innerWidth <= 768 ? "12px" : "13px",
                                  color: "#000",
                                }}
                              >
                                <i
                                  className="fa fa-bed me-2"
                                  style={{ color: "#2067d1" }}
                                ></i>
                                Size Info:{" "}
                                {project?.configurations &&
                                project.configurations.length > 0
                                  ? `${
                                      Math.min(
                                        ...project.configurations.map((config) =>
                                          parseInt(config)
                                        )
                                      ) + "BHK"
                                    }`
                                  : ""}
                              </p>
                            )}
                            {project?.floorplans && (
                              <p
                                className="mb-1"
                                style={{
                                  fontSize:
                                    window.innerWidth <= 768 ? "12px" : "13px",
                                  color: "#000",
                                }}
                              >
                                Starting ₹
                                <b>
                                  {formatPrice(
                                    getLeastPriceOfFloorPlan(project?.floorplans)
                                  )}
                                </b>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No similar projects available</div>
                )}
              </Carousel>

              {/* Add Project Section */}
              {isEditing && (
                <div className="card mt-4 mb-3" style={{ maxWidth: 600, margin: "0 auto", border: "1px solid #2067d1" }}>
                  <div className="card-body">
                    <h5 className="card-title mb-3" style={{ color: "#2067d1" }}>Add New Project</h5>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.name}
                          onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                          placeholder="Project Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.url}
                          onChange={e => setNewProject({ ...newProject, url: e.target.value })}
                          placeholder="Project URL"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.images[0]?.imageUrl}
                          onChange={e => setNewProject({ ...newProject, images: [{ imageUrl: e.target.value }] })}
                          placeholder="Image URL"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.shortAddress}
                          onChange={e => setNewProject({ ...newProject, shortAddress: e.target.value })}
                          placeholder="Short Address"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.area}
                          onChange={e => setNewProject({ ...newProject, area: e.target.value })}
                          placeholder="Area"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          type="text"
                          value={newProject.configurations.join(",")}
                          onChange={e => setNewProject({ ...newProject, configurations: e.target.value.split(",") })}
                          placeholder="Configurations (comma separated)"
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-success mt-3"
                      type="button"
                      onClick={handleAddProject}
                      style={{ fontWeight: 600, borderRadius: "20px", width: "100%" }}
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              )}

              <style>
                {`
                  .carousel-container {
                    position: relative;
                  }
                  .react-multiple-carousel__arrow {
                    background-color: #2067d1;
                    height: 35px;
                    width: 35px;
                    min-width: 35px;
                    min-height: 35px;
                    border-radius: 50%;
                    padding-right: 15px;
                    padding-left: 15px;
                  }
                  @media (max-width: 768px) {
                    .react-multiple-carousel__arrow {
                      height: 25px;
                      width: 25px;
                      min-width: 25px;
                      min-height: 25px;
                      padding-right: 10px;
                      padding-left: 10px;
                    }
                  }
                  .react-multiple-carousel__arrow--left {
                    left: -10px;
                  }
                  .react-multiple-carousel__arrow--right {
                    right: -10px;
                  }
                  .react-multi-carousel-item  carousel-item-padding-40-px{
                    padding: 0px 20px;
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProjectsSection;