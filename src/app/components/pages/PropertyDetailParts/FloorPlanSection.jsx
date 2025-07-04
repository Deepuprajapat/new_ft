import React, { useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import BrochurePopupDialog from "../BrochurePopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const FloorPlanSection = ({
  property,
  activeFilter,
  setActiveFilter,
  handleImageClick,
  showImagePopup,
  selectedImage,
  closeImagePopup,
  handleDownloadFloorPlan,
  showFloorPlanPopup,
  closeFloorPlanPopup,
  formatPrice,
  onSave
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editable2D, setEditable2D] = useState(property?.floorImage2D || "");
  const [editable3D, setEditable3D] = useState(property?.floorImage3D || "");
  const [editable2DTitle, setEditable2DTitle] = useState("2D Floor Plan");
  const [editable3DTitle, setEditable3DTitle] = useState("3D Floor Plan");
  const fileInputRefs = [useRef(), useRef()];

  const handleEdit = () => {
    setEditable2D(property?.floorImage2D || "");
    setEditable3D(property?.floorImage3D || "");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditable2D(property?.floorImage2D || "");
    setEditable3D(property?.floorImage3D || "");
    setEditable2DTitle("2D Floor Plan");
    setEditable3DTitle("3D Floor Plan");
  };

  const handleSave = () => {
    setEditMode(false);
    if (typeof onSave === 'function') {
      onSave({
        floorImage2D: editable2D,
        floorImage3D: editable3D,
        floorPlanTitles: {
          twoD: editable2DTitle,
          threeD: editable3DTitle
        }
      });
    }
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (index === 0) setEditable2D(e.target.result);
      else setEditable3D(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const defaultImage = process.env.PUBLIC_URL + "/images/coming_soon_floor.jpg";
  const isValidImage = (imageUrl) =>
    imageUrl?.includes("/images/img/") ? imageUrl : defaultImage;
  const images = [
    {
      title: editMode ? editable2DTitle : "2D Floor Plan",
      imageUrl: editMode ? editable2D : isValidImage(property?.floorImage2D),
    },
    {
      title: editMode ? editable3DTitle : "3D Floor Plan",
      imageUrl: editMode ? editable3D : isValidImage(property?.floorImage3D),
    },
  ];

  return (
    <div
      className="mb-4"
      id="floor"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
            paddingRight: '16px',
            marginBottom: '18px',
          }}
        >
          <span>{property?.propertyName} Floor Plan</span>
          <span className="d-flex align-items-center" style={{gap: '8px'}}>
            {!editMode ? (
              <FontAwesomeIcon icon={faEdit} className="ms-2" style={{ cursor: "pointer", color: "#fff", fontSize: '18px', padding: '2px 6px' }} onClick={handleEdit} title="Edit" />
            ) : (
              <>
                <button className="btn btn-primary btn-sm me-2" style={{minWidth: '60px', padding: '2px 12px', marginRight: '6px'}} onClick={handleSave}>Save</button>
                <button className="btn btn-secondary btn-sm" style={{minWidth: '60px', padding: '2px 12px'}} onClick={handleCancel}>Cancel</button>
              </>
            )}
          </span>
        </h4>
        {/* Floor Plan Title/Description from property_floor_plan */}
        {property?.web_cards?.property_floor_plan?.title && (
          <div className="px-3 pb-2" style={{fontSize: window.innerWidth <= 768 ? '12px' : '15px', color: '#222', fontWeight: 500}}>
            {property.web_cards.property_floor_plan.title}
          </div>
        )}
        <div className="px-3">
          {/* Toggle Buttons for 2D & 3D Floor Plans */}
          <div className="d-flex gap-2 mb-3">
            <button
              onClick={() => setActiveFilter("2D")}
              className={`btn ${activeFilter === "2D" ? "btn-primary" : ""}`}
              style={{
                border: "2px solid #000",
                borderRadius: "15px",
                padding: window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                fontWeight: "600",
                backgroundColor: activeFilter === "2D" ? "rgb(32, 103, 209)" : "",
              }}
            >
              2D Floor Plan
            </button>
            <button
              onClick={() => setActiveFilter("3D")}
              className={`btn ${activeFilter === "3D" ? "btn-primary" : ""}`}
              style={{
                border: "2px solid #000",
                borderRadius: "15px",
                padding: window.innerWidth <= 768 ? "2px 5px" : "5px 15px",
                fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                fontWeight: "600",
                backgroundColor: activeFilter === "3D" ? "rgb(32, 103, 209)" : "",
              }}
            >
              3D Floor Plan
            </button>
          </div>
          {/* Floor Plan Carousel */}
          <Carousel
            responsive={{
              superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            infinite={true}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            style={{ width: "60%", margin: "0 auto" }}
          >
            {/* If web_cards.property_floor_plan.plans exists, show those images */}
            {property?.web_cards?.property_floor_plan?.plans?.length > 0
              ? property.web_cards.property_floor_plan.plans.map((plan, idx) => (
                  <div key={idx} className="px-2 d-flex justify-content-center">
                    <div className="card border-0" style={{ width: "80%", maxWidth: window.innerWidth <= 768 ? "80%" : "auto" }}>
                      <div className="card-body p-3 text-center">
                        <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "16px", fontWeight: "600" }}>
                          {plan.title || `Floor Plan ${idx + 1}`}
                        </p>
                        {/* 2D Floor Plan */}
                        {plan["2D"] && (
                          <>
                            <div style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4 }}>2D Floor Plan</div>
                            <img
                              src={plan["2D"]}
                              alt={`2D Floor Plan ${idx + 1}`}
                              loading="lazy"
                              className="img-fluid mb-3"
                              style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "5px" }}
                              onClick={() => handleImageClick(plan["2D"])}
                            />
                          </>
                        )}
                        {/* 3D Floor Plan */}
                        {plan["3D"] && (
                          <>
                            <div style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4 }}>3D Floor Plan</div>
                            <img
                              src={plan["3D"]}
                              alt={`3D Floor Plan ${idx + 1}`}
                              loading="lazy"
                              className="img-fluid mb-3"
                              style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "5px" }}
                              onClick={() => handleImageClick(plan["3D"])}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : images
                  .filter((plan, idx) =>
                    (activeFilter === "2D" && idx === 0) ||
                    (activeFilter === "3D" && idx === 1) ||
                    activeFilter !== "2D" && activeFilter !== "3D"
                  )
                  .map((plan, index) => (
                    <div key={index} className="px-2 d-flex justify-content-center">
                      <div className="card border-0"
                        style={{ width: "80%", maxWidth: window.innerWidth <= 768 ? "80%" : "auto" }}
                      >
                        <div className="card-body p-3 text-center">
                          {editMode ? (
                            <>
                              <input
                                type="text"
                                className="form-control mb-2"
                                value={index === 0 ? editable2DTitle : editable3DTitle}
                                onChange={e => index === 0 ? setEditable2DTitle(e.target.value) : setEditable3DTitle(e.target.value)}
                                placeholder={`Title for ${index === 0 ? "2D" : "3D"} Floor Plan`}
                              />
                              <input
                                type="text"
                                className="form-control mb-2"
                                value={index === 0 ? editable2D : editable3D}
                                onChange={e => index === 0 ? setEditable2D(e.target.value) : setEditable3D(e.target.value)}
                                placeholder={`Image URL for ${index === 0 ? "2D" : "3D"} Floor Plan`}
                              />
                              <div className="mb-2">
                                <label className="form-label">Image</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <img src={index === 0 ? editable2D : editable3D} alt={plan.title} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => fileInputRefs[index].current?.click()} />
                                  <input type="file" accept="image/*" ref={fileInputRefs[index]} style={{ display: "none" }} onChange={e => handleImageUpload(index, e.target.files[0])} />
                                  <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => fileInputRefs[index].current?.click()}>Upload</button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p
                                className="mb-3"
                                style={{ fontSize: window.innerWidth <= 768 ? "14px" : "16px", fontWeight: "600" }}
                              >
                                {plan.title}
                              </p>
                              <img
                                src={plan.imageUrl}
                                alt={plan.title}
                                loading="lazy"
                                className="img-fluid mb-3"
                                style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "5px" }}
                                onClick={() => handleImageClick(plan.imageUrl)}
                              />
                            </>
                          )}
                          <div className="d-flex flex-column gap-2 align-items-center">
                            <a
                              href="tel:+918595189189"
                              className="btn btn-primary w-100"
                              style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px", backgroundColor: "#2067d1" }}
                            >
                              Talk to our Expert
                            </a>
                            <button
                              onClick={handleDownloadFloorPlan}
                              className="btn btn-outline-primary w-100"
                              style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px", margin: "0px" }}
                            >
                              Download Floor Plan
                            </button>
                            {/* Floor Plan Dialog Popup */}
                            <BrochurePopupDialog
                              open={showFloorPlanPopup}
                              onClose={closeFloorPlanPopup}
                              projectName={property?.propertyName || "Invest Mango"}
                              brochure={property?.brochure}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  src={selectedImage}
                  alt="Floor Plan"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
                <button
                  onClick={closeImagePopup}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        </div>
      </div>
    </div>
  );
};

export default FloorPlanSection; 