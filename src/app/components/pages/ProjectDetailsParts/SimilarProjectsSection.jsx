import React from "react";
import Carousel from "react-multi-carousel";
    
const SimilarProjectsSection = ({
  allSimilarProjects,
  formatPrice,
  getLeastPriceOfFloorPlan,
}) => (
  <div
    className="mb-4"
    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    id="similar_projects"
  >
    <div className="p-0 pb-2">
      <h4
        className="mb-3 py-2 fw-bold text-white ps-3"
        style={{
          fontSize: window.innerWidth <= 768 ? "14px" : "16px",
          backgroundColor: "#2067d1",
          borderRadius: "4px 4px 0 0",
        }}
      >
        Similar Projects
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
              {allSimilarProjects && allSimilarProjects.length > 0 ? (
                allSimilarProjects.map((project, index) => (
                  <div key={index} className="px-2">
                    <div className="similar_projects_item">
                      <div style={{ color: "#000" }}>
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

export default SimilarProjectsSection;