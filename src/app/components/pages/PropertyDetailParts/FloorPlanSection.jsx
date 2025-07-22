import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import BrochurePopupDialog from "../BrochurePopup";
import DOMPurify from "dompurify";
// import { imgUplod } from '../../../../utils/common.jsx'; // Uncomment and adjust if you have an image upload util for property

const DEFAULT_IMAGE = "/images/Floor.png";

const FloorPlanSection = ({
  property,
  showEdit,
  activeFilter: propActiveFilter,
  setActiveFilter: propSetActiveFilter,
  handleImageClick: propHandleImageClick,
  showImagePopup: propShowImagePopup,
  selectedImage: propSelectedImage,
  closeImagePopup: propCloseImagePopup,
  handleDownloadFloorPlan: propHandleDownloadFloorPlan,
  showFloorPlanPopup: propShowFloorPlanPopup,
  closeFloorPlanPopup: propCloseFloorPlanPopup,
  formatPrice,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableFloorPara, setEditableFloorPara] = useState(property?.web_cards?.property_floor_plan?.title || "");
  const [editableFloorplans, setEditableFloorplans] = useState(property?.web_cards?.property_floor_plan?.plans || []);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFloorPlanPopup, setShowFloorPlanPopup] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const fileInputRefs = useRef([]);

  useEffect(() => {
    setEditableFloorPara(property?.web_cards?.property_floor_plan?.title || "");
    setEditableFloorplans(property?.web_cards?.property_floor_plan?.plans || []);
  }, [property]);

  // Image popup logic
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true);
  };
  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(null);
  };
  const handleDownloadFloorPlan = () => {
    setShowFloorPlanPopup(true);
  };
  const closeFloorPlanPopup = () => {
    setShowFloorPlanPopup(false);
  };

  // Editing logic
  const handleFloorPlanChange = (index, field, value) => {
    const updated = [...editableFloorplans];
    if (field === "size" || field === "price") {
      let intValue = value.replace(/[^0-9]/g, "");
      if (intValue.length > 1 && intValue.startsWith("0")) {
        intValue = intValue.replace(/^0+/, "");
      }
      updated[index][field] = intValue;
    } else {
      updated[index][field] = value;
    }
    setEditableFloorplans(updated);
  };

  const handleAddFloorPlan = () => {
    setEditableFloorplans([
      {
        title: "",
        imageUrl: DEFAULT_IMAGE,
        size: "",
        price: "",
        configuration: "",
        type: "",
      },
      ...editableFloorplans,
    ]);
  };

  const handleRemoveFloorPlan = (index) => {
    const updated = [...editableFloorplans];
    updated.splice(index, 1);
    setEditableFloorplans(updated);
    setRemoveIndex(null);
  };

  const handleSaveChanges = () => {
    const floorplansForSave = editableFloorplans.map(plan => ({
      ...plan,
      image: plan.imageUrl || plan.image
    }));
    const updatedData = {
      ...property,
      web_cards: {
        ...property.web_cards,
        property_floor_plan: {
          ...property.web_cards?.property_floor_plan,
          title: editableFloorPara,
          plans: floorplansForSave
        }
      }
    };
    if (typeof onSave === "function") {
      onSave(updatedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableFloorPara(property?.web_cards?.property_floor_plan?.title || "");
    setEditableFloorplans(property?.web_cards?.property_floor_plan?.plans || []);
  };

  // Handle image upload for a floor plan (stub, implement actual upload if needed)
  const handleImageUpload = (index, file) => {
    if (!file) return;
    // If you have an upload util, use it here. For now, use local preview:
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...editableFloorplans];
      updated[index].imageUrl = e.target.result;
      setEditableFloorplans(updated);
    };
    reader.readAsDataURL(file);
  };

  // Filtering logic
  const filteredPlans = isEditing
    ? editableFloorplans
    : property?.web_cards?.property_floor_plan?.plans || [];

  const filtered = filteredPlans.filter(
    (plan) =>
      activeFilter === "all" ||
      plan.title === activeFilter ||
      plan.type === activeFilter
  );

  const sortedPlans = filtered.sort((a, b) => {
    const sizeA = parseFloat(a.size);
    const sizeB = parseFloat(b.size);
    return sizeA - sizeB;
  });

  const handleEdit = () => {
    setEditableFloorPara(property?.web_cards?.property_floor_plan?.title || "");
    setEditableFloorplans(property?.web_cards?.property_floor_plan?.plans || []);
    setIsEditing(true);
  };

  const filterOptions = [
    ...new Set((property?.web_cards?.property_floor_plan?.plans || []).map(
      (plan) => plan.title || plan.type
    )),
  ];

  const rawPlans = property?.web_cards?.property_floor_plan?.plans || [];
  const normalizedPlans = rawPlans.flatMap(plan => {
    if (plan["2D"] || plan["3D"]) {
      // Convert old format to new format (one entry per 2D/3D if present)
      const arr = [];
      if (plan["2D"]) arr.push({ title: "2D Floor Plan", imageUrl: plan["2D"], type: "2D" });
      if (plan["3D"]) arr.push({ title: "3D Floor Plan", imageUrl: plan["3D"], type: "3D" });
      return arr;
    }
    return [plan]; // Already in new format
  });

  return (
    <div className="mb-4" id="floor" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div className="p-0 pb-2">
        <h2
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {property?.propertyName || property?.name} Floor Plan
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ backgroundColor: "white", color: "#2067d1", fontWeight: "bold" }}
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: "white", fontWeight: "bold", marginLeft: 8 }}
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
        <div className="px-3">
          <div className="mb-3">
            {isEditing ? (
              <textarea
                className="form-control"
                value={typeof editableFloorPara === "string" && editableFloorPara.length > 0 ? editableFloorPara : property?.web_cards?.property_floor_plan?.title || ""}
                onChange={(e) => setEditableFloorPara(e.target.value)}
                rows={3}
                style={{ fontSize: window.innerWidth <= 768 ? "12px" : "16px" }}
              />
            ) : (
              <p
                style={{ fontSize: window.innerWidth <= 768 ? "12px" : "16px" }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(property?.web_cards?.property_floor_plan?.title || "") }}
              />
            )}
          </div>
          {isEditing && (
            <button
              className="btn btn-outline-primary mb-3"
              type="button"
              onClick={handleAddFloorPlan}
              style={{ fontWeight: 600, borderRadius: "20px", width: "auto" }}
            >
              + Add Floor Plan
            </button>
          )}
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
                backgroundColor: activeFilter === "all" ? "rgb(32, 103, 209)" : "",
              }}
            >
              All
            </button>
            {filterOptions.map((config, index) => (
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
                  backgroundColor: activeFilter === config ? "rgb(32, 103, 209)" : "",
                }}
              >
                {config}
              </button>
            ))}
          </div>
          <Carousel
            responsive={{
              superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3, slidesToSlide: 1 },
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2, slidesToSlide: 1 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 1, slidesToSlide: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
            }}
            infinite={false}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            style={{ width: "60%", margin: "0 auto" }}
          >
            {sortedPlans.map((plan, index) => (
              <div
                style={{ borderRadius: "8px", border: "1px  gray", borderColor: isEditing ? "gray" : "white", padding: "10px" }}
                key={index}
                className="px-2 d-flex justify-content-center"
              >
                <div className="card border-0" style={{ width: "80%", maxWidth: window.innerWidth <= 768 ? "80%" : "auto" }}>
                  <div className="card-body p-1">
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "flex-start", background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "12px", padding: "60px 60px 24px 24px", position: "relative", minHeight: "200px", marginBottom: "10px" }}>
                        {/* Delete Icon Wrapper */}
                        <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 2, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px" }}>
                          <img src="/images/delete1.png" alt="Remove" onClick={() => setRemoveIndex(index)} style={{ width: "25px", height: "25px", cursor: "pointer" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input className="form-control mb-2" type="text" value={plan.title} onChange={(e) => handleFloorPlanChange(index, "title", e.target.value)} placeholder="Title" />
                          <div className="mb-2">
                            <label style={{ fontSize: "13px", fontWeight: 500, display: "block" }}>Floor Plan Image</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <img src={plan.imageUrl ? plan.imageUrl : DEFAULT_IMAGE} alt="Floor Plan" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => fileInputRefs.current[index]?.click()} />
                              <input type="file" accept="image/*" ref={el => (fileInputRefs.current[index] = el)} style={{ display: "none" }} onChange={e => { const file = e.target.files[0]; handleImageUpload(index, file); }} />
                              <button className="btn btn-outline-secondary btn-sm" style={{ width: "auto" }} type="button" onClick={() => fileInputRefs.current[index]?.click()}>Upload</button>
                            </div>
                          </div>
                          <input className="form-control mb-2" type="text" value={plan.size} onChange={e => handleFloorPlanChange(index, "size", e.target.value)} placeholder="Size (sq.ft)" />
                          <input className="form-control mb-2" type="text" value={plan.price} onChange={e => handleFloorPlanChange(index, "price", e.target.value)} placeholder="Price" />
                          <input className="form-control mb-2" type="text" value={plan.configuration} onChange={e => handleFloorPlanChange(index, "configuration", e.target.value)} placeholder="Configuration Name" />
                          <input className="form-control mb-2" type="text" value={plan.type} onChange={e => handleFloorPlanChange(index, "type", e.target.value)} placeholder="Type" />
                        </div>
                        {/* Confirmation Popup */}
                        {removeIndex === index && (
                          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ background: "#fff", padding: "24px 32px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", minWidth: "300px", textAlign: "center", border: "2px solid #2067d1" }}>
                              <p style={{ marginBottom: "18px", fontWeight: 500 }}>Are you sure you want to remove this floor plan?</p>
                              <button className="btn btn-danger me-2" onClick={() => handleRemoveFloorPlan(index)}>OK</button>
                              <button className="btn btn-secondary" style={{ width: "auto" }} onClick={() => setRemoveIndex(null)}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="mb-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "16px", fontWeight: "600" }}>{plan.title}</p>
                        <img src={plan.image || plan.imageUrl || DEFAULT_IMAGE} alt={`${plan.type || plan.configuration || plan.title} Floor Plan`} loading="lazy" className="img-fluid mb-3" style={{ width: "100%" }} onClick={() => handleImageClick(plan.image || plan.imageUrl)} />
                        <div className="row mb-3">
                          <div className="col-6">
                            <small className="text-muted" style={{ fontSize: window.innerWidth <= 768 ? "11px" : "12px" }}>Builtup Area</small>
                            <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "14px", fontWeight: "600" }}>{plan.size} sq.ft</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted" style={{ fontSize: window.innerWidth <= 768 ? "11px" : "12px" }}>Price</small>
                            <p className="mb-0" style={{ fontSize: window.innerWidth <= 768 ? "13px" : "14px", fontWeight: "600" }}>{formatPrice ? formatPrice(plan.price) : plan.price}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {!isEditing && (
                      <div className="d-flex flex-column gap-2 align-items-center">
                        <a href="tel:+918595189189" className="btn btn-primary w-100" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px", backgroundColor: "#2067d1" }}>Talk to our Expert</a>
                        <button onClick={handleDownloadFloorPlan} className="btn btn-outline-primary w-100" style={{ fontSize: window.innerWidth <= 768 ? "12px" : "14px", margin: "0px" }}>Download Floor Plan</button>
                        <BrochurePopupDialog open={showFloorPlanPopup} onClose={closeFloorPlanPopup} projectName={property?.propertyName || property?.name || "Invest Mango"} brochure={property?.brochure} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          {/* Image Popup Modal */}
          {(showImagePopup || propShowImagePopup) && (
            <div className="image-popup-modal" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
              <div className="image-popup-content" style={{ position: "relative", maxWidth: "50%" }}>
                <img src={selectedImage || propSelectedImage} alt="Floor Plan" loading="lazy" style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
                <button onClick={closeImagePopup || propCloseImagePopup} style={{ position: "absolute", top: "10px", right: "10px", color: "white", border: "none", borderRadius: "50%", padding: "10px", cursor: "pointer", fontSize: "20px" }}>×</button>
              </div>
            </div>
          )}
          <style>{`
            .carousel-container { position: relative; }
            .react-multiple-carousel__arrow { background-color: #2067d1; height: 35px; width: 35px; min-width: 35px; min-height: 35px; border-radius: 50%; padding-right: 15px; padding-left: 15px; }
            .react-multiple-carousel__arrow--left { left: -10px; }
            .react-multiple-carousel__arrow--right { right: -10px; }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanSection;
