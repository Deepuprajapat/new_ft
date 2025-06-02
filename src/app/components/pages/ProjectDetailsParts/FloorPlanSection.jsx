import React from "react";
import Carousel from "react-multi-carousel";
import BrochurePopupDialog from "../BrochurePopup";
import DOMPurify from "dompurify";

const BASE_URL = "https://image.investmango.com/images/";

const FloorPlanSection = ({
  projectData,
  activeFilter,
  setActiveFilter,
  formatPrice,
  handleImageClick,
  showImagePopup,
  selectedImage,
  closeImagePopup,
  handleDownloadFloorPlan,
  showFloorPlanPopup,
  closeFloorPlanPopup,
}) => (
  <div
    className="mb-4"
    id="floor"
    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
  >
    <div className="p-0 pb-2">
      <h2
        className="mb-3 py-2 fw-bold text-white ps-3"
        style={{
          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
          backgroundColor: "#2067d1",
          borderRadius: "4px 4px 0 0",
        }}
      >
        {projectData?.name} Floor Plan
      </h2>
      <div className="px-3">
        <p
          className="mb-3"
          style={{
            fontSize: window.innerWidth <= 768 ? "12px" : "16px",
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(projectData?.floorPara),
          }}
        />
        <div className="d-flex gap-2 mb-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`btn ${activeFilter === "all" ? "btn-primary" : ""}`}
            style={{
              border: "2px solid #000",
              borderRadius: "15px",
              padding: window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
              fontSize: window.innerWidth <= 768 ? "10px" : "14px",
              fontWeight: "600",
              backgroundColor:
                activeFilter === "all" ? "rgb(32, 103, 209)" : "",
            }}
          >
            All
          </button>
          {projectData?.configurations
            ?.slice()
            .sort((a, b) => {
              const numA = parseFloat(a) || 0;
              const numB = parseFloat(b) || 0;
              return numA - numB;
            })
            .map((config, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(config)}
                className={`btn ${activeFilter === config ? "btn-primary" : ""}`}
                style={{
                  border: "2px solid #000",
                  borderRadius: "15px",
                  padding: window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                  fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                  fontWeight: "600",
                  backgroundColor:
                    activeFilter === config ? "rgb(32, 103, 209)" : "",
                }}
              >
                {config}
              </button>
            ))}
        </div>
        <Carousel
          responsive={{
            superLargeDesktop: {
              breakpoint: { max: 4000, min: 3000 },
              items: 3,
              slidesToSlide: 1,
            },
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 2,
              slidesToSlide: 1,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 1,
              slidesToSlide: 1,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
              slidesToSlide: 1,
            },
          }}
          infinite={false}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
          style={{ width: "60%", margin: "0 auto" }}
        >
          {(() => {
            const filteredPlans = projectData?.floorplans || [];
            const filtered = filteredPlans.filter(
              (plan) =>
                activeFilter === "all" ||
                plan.projectConfigurationName === activeFilter
            );
            const sortedPlans = filtered.sort((a, b) => {
              const sizeA = parseFloat(a.size);
              const sizeB = parseFloat(b.size);
              return sizeA - sizeB;
            });

            return sortedPlans.map((plan, index) => (
              <div key={index} className="px-2 d-flex justify-content-center">
                <div
                  className="card border-0"
                  style={{
                    width: "80%",
                    maxWidth: window.innerWidth <= 768 ? "80%" : "auto",
                  }}
                >
                  <div className="card-body p-3">
                    <p
                      className="mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                        fontWeight: "600",
                      }}
                    >
                      {plan.title}
                    </p>
                    <img
                      src={
                        plan.imageUrl &&
                        plan.imageUrl !== BASE_URL &&
                        plan.imageUrl !== ""
                          ? plan.imageUrl
                          : "/images/Floor.png"
                      }
                      alt={`${plan.type} Floor Plan`}
                      loading="lazy"
                      className="img-fluid mb-3"
                      style={{ width: "100%" }}
                      onClick={() => handleImageClick(plan.imageUrl)}
                    />
                    <div className="row mb-3">
                      <div className="col-6">
                        <small
                          className="text-muted"
                          style={{
                            fontSize: window.innerWidth <= 768 ? "11px" : "12px",
                          }}
                        >
                          Builtup Area
                        </small>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: window.innerWidth <= 768 ? "13px" : "14px",
                            fontWeight: "600",
                          }}
                        >
                          {plan.size} sq.ft
                        </p>
                      </div>
                      <div className="col-6">
                        <small
                          className="text-muted"
                          style={{
                            fontSize: window.innerWidth <= 768 ? "11px" : "12px",
                          }}
                        >
                          Price
                        </small>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: window.innerWidth <= 768 ? "13px" : "14px",
                            fontWeight: "600",
                          }}
                        >
                          {formatPrice(plan.price)}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 align-items-center">
                      <a
                        href={`tel:+91${
                          projectData?.locality?.city?.phoneNumber?.[0] ||
                          "8595189189"
                        }`}
                        className="btn btn-primary w-100"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          backgroundColor: "rgb(32, 103, 209)",
                        }}
                      >
                        Talk to our Expert
                      </a>
                      <button
                        onClick={handleDownloadFloorPlan}
                        className="btn btn-outline-primary w-100"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                          margin: "0px",
                        }}
                      >
                        Download Floor Plan
                      </button>
                      <BrochurePopupDialog
                        open={showFloorPlanPopup}
                        onClose={closeFloorPlanPopup}
                        projectName={projectData?.name || "Invest Mango"}
                        brochure={projectData?.brochure}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </Carousel>
        {/* Image Popup Modal */}
        {showImagePopup && (
          <div
            className="image-popup-modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="image-popup-content"
              style={{
                position: "relative",
                maxWidth: "50%",
              }}
            >
              <img
                src={
                  selectedImage &&
                  selectedImage !== BASE_URL &&
                  selectedImage !== ""
                    ? selectedImage
                    : "/images/Floor.png"
                }
                alt="Floor Plan"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
              <button
                onClick={closeImagePopup}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ×
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
            .react-multiple-carousel__arrow--left {
                left: -10px;
            }
            .react-multiple-carousel__arrow--right {
                right: -10px;
            }
          `}
        </style>
      </div>
    </div>
  </div>
);

export default FloorPlanSection;