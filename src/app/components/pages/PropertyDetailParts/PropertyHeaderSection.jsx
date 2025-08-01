import React, { useState, useEffect } from "react";
import { imgUplod } from "../../../../utils/common";
import Swal from "sweetalert2";

const PropertyHeaderSection = ({ property, formatPrice, handleDownloadBrochure, showPopup, closePopup, BrochurePopupDialog, onSave,showEdit }) => {
  const [showReraDetails, setShowReraDetails] = useState(false);
  const [isReraDetailHovered, setIsReraDetailHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let reraTimeout = null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await imgUplod(file, { alt_keywords: "project,siteplan,real estate", file_path: "/new_vi" })
        console.log(imageUrl,"hhhhhhhhh");
        setEditData(prev => ({ ...prev, projectimages: imageUrl }));
        onSave({ ...property, property_images: [imageUrl] });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await imgUplod(file, { alt_keywords: "project,siteplan,real estate", file_path: "/new_vi" });
        setEditData(prev => ({ ...prev, developerLogo: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: property?.name || "",
    propertyAddress: property?.propertyAddress || "",
    price: property?.pricing_info?.price|| "",
    developerName: property?.developer?.name || "",
    developerLogo: property?.developer?.developer_logo || "",
    projectimages:property?.property_images?.[0]||"",
    developerAddress: property?.developer?.developer_address || "",
    reraDetails: Array.isArray(property?.reraDetails) ? property.reraDetails : [],
  });

  // Sync editData with property when edit mode is entered
  useEffect(() => {
    if (isEditing) {
      setEditData({
        name: property?.name || "",
        propertyAddress: property?.propertyAddress || "",
        price: property?.pricing_info?.price|| "",
        developerName: property?.developer?.name || "",
        developerLogo: property?.developer?.developer_logo || "",
        projectimages: property?.property_images?.[0] || "",
        developerAddress: property?.developer?.developer_address || "",
        reraDetails: Array.isArray(property?.reraDetails) ? property.reraDetails : [],
      });
    }
  }, [isEditing, property]);

  // Show popup on click or hover
  const handleReraMouseEnter = () => {
    clearTimeout(reraTimeout);
    setShowReraDetails(true);
  };
  const handleReraMouseLeave = () => {
    reraTimeout = setTimeout(() => {
      if (!isReraDetailHovered) setShowReraDetails(false);
    }, 150);
  };
  const handleReraDetailMouseEnter = () => {
    setIsReraDetailHovered(true);
    clearTimeout(reraTimeout);
  };
  const handleReraDetailMouseLeave = () => {
    setIsReraDetailHovered(false);
    setShowReraDetails(false);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditData({
      name: property?.name || "",
      propertyAddress: property?.propertyAddress || "",
      price: property?.pricing_info?.price || "",
      developerName: property?.developer?.name || "",
      developerLogo: property?.developer?.developer_logo || "",
      developerAddress: property?.developer?.developer_address || "",
      reraDetails: Array.isArray(property?.reraDetails) ? property.reraDetails : [],
    });
    setIsEditing(false);
  };
  const handleSave = async () => {
    const nameChanged = editData.name !== property?.name;
    
    if (nameChanged) {
      const result = await Swal.fire({
        title: 'Property Name Change Warning',
        html: `
          <div style="text-align: left;">
            <p><strong>You are about to change the property name from:</strong></p>
            <p style="color: #dc3545; margin: 8px 0;"><em>"${property?.name}"</em></p>
            <p><strong>To:</strong></p>
            <p style="color: #28a745; margin: 8px 0;"><em>"${editData.name}"</em></p>
            <br>
            <p style="color: #f39c12;"><strong>⚠️ Warning:</strong></p>
            <p>This will change the property's URL. Any existing links to this property may no longer work.</p>
            <p>The new URL will be generated based on the new property name.</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, change the name',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    const updatedHeaderData = {
      ...property, 
      name: editData.name,
      propertyAddress: editData.propertyAddress,
      property_images: [editData.projectimages],
      developer: {
        ...(property?.developer || {}),
        name: editData.developerName,
        developer_logo: editData.developerLogo,
        developer_address: editData.developerAddress,
      },
      reraDetails: editData.reraDetails,
      pricing_info: {
        ...(property?.pricing_info || {}),
        price: editData.price,
      },
    };
    await onSave(updatedHeaderData);
    setIsEditing(false);
  };

  // Save handler for RERA details
  const handleSaveRera = async () => {
    if (onSave) {
      const updatedReraData = {
        ...property,
        name: editData.name,
        propertyAddress: editData.propertyAddress,
        reraDetails: editData.reraDetails,
        developer: {
          ...(property?.developer || {}),
          name: editData.developerName,
          developer_logo: editData.developerLogo,
          developer_address: editData.developerAddress,
        },
        pricing_info: {
          ...(property?.pricing_info || {}),
          price: editData.price,
        },
      };
      await onSave(updatedReraData);
    }
    setIsEditing(false);
    setShowReraDetails(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleReraInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedReraDetails = [...editData.reraDetails];
    updatedReraDetails[index] = { ...updatedReraDetails[index], [name]: value };
    setEditData(prev => ({ ...prev, reraDetails: updatedReraDetails }));
  };

  return (
    <section className="container-fluid"
      style={{ width: window.innerWidth <= 768 ? "90%" : "95%", margin: "0 auto" }}
    >
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          {/* Left Section */}
          <div className="col-12 col-md-6 p-0 p-md-0">
            {/* Upper Section */}
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-2 mt-2 mt-md-3">
            <div 
              className="mb-2 mb-md-0 me-md-3 text-center text-md-start position-relative" 
              style={{ maxWidth: '90px', border: '1px solid grey', height: '66px' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={isEditing ? editData.projectimages || "defaultLogo.jpg" : property?.property_images?.[0]|| "defaultLogo.jpg"}
                alt={isEditing ? editData.name || "Developer Logo" : property?.name || "name"}
                loading="lazy"
                className="img-fluid"
                style={{ maxWidth: "80px", height: '64px', objectFit: 'contain' }}
              />
              {isEditing && isHovered && (
                <label 
                  htmlFor="image-upload" 
                  className="position-absolute top-50 start-50 translate-middle" 
                  style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '50%' }}
                >
                  <img src="/images/edit-icon.svg" alt="Upload" style={{ width: '24px', height: '24px' }} />
                  <input
                    id="image-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
              <div className="text-center text-md-start">
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control mb-1"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    placeholder="Property Name"
                    style={{ fontSize: "20px" }}
                  />
                ) : (
                  <h1 className="h3 mb-0 text-center text-md-start" style={{ fontSize: "20px" }}>
                    {property?.name || property?.projectName || "propert name"}
                    {showEdit && (
                    <button
                      className="btn btn-light btn-sm ms-2"
                      onClick={handleEdit}
                      style={{ border: "1px solid #2067d1", backgroundColor: "#2067d1" }}
                    >
                      <img src="/images/edit-icon.svg" alt="Edit" style={{ width: "18px", height: "18px" }} />
                    </button>
                       )}
                  </h1>
                )}
                <p className="mb-0" style={{ fontSize: "11px" }}>
                  {property?.propertyAddress || "Property Address"}
                </p>
                <span style={{ fontSize: "13px" }}>
                  By {" "}
                  <>
                    <a target="_blank" rel="noopener noreferrer">
                      {property?.developer?.name || "Developer Name"}
                    </a>
                    {property?.developer?.developer_address && (
                      <div style={{ fontSize: "11px", color: "#555" }}>{property.developer.developer_address}</div>
                    )}
                  </>
                </span>
                {isEditing && (
                  <div className="mt-2 d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
            {/* Lower Section - Badges */}
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start position-relative">
              <span
                className="badge bg-primary"
                style={{ padding: "4px 8px", fontSize: "10px", marginRight: "3px", marginBottom: "3px", borderRadius: "0", backgroundColor: "#2067d1", cursor: "pointer" }}
                onMouseEnter={handleReraMouseEnter}
                onMouseLeave={handleReraMouseLeave}
                onClick={() => setShowReraDetails((prev) => !prev)}
              >
                Rera
              </span>
              {showReraDetails && (
                <div
                  onMouseEnter={handleReraDetailMouseEnter}
                  onMouseLeave={handleReraDetailMouseLeave}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                    minWidth: "300px",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-0">
                    <h6 className="m-0" style={{ fontWeight: 700, fontSize: "14px" }}>
                      Rera Detail
                    </h6>
                    <i
                      className="fa fa-close"
                      style={{ fontSize: "15px", cursor: "pointer" }}
                      onClick={() => {
                        setShowReraDetails(false);
                        setIsReraDetailHovered(false);
                      }}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th style={{ width: "45%", textAlign: "left", fontSize: "11px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>Phase</th>
                          <th style={{ width: "34%", textAlign: "left", fontSize: "11px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>Status</th>
                          <th style={{ width: "40%", textAlign: "left", fontSize: "11px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>Rera Number</th>
                          {isEditing && <th style={{ width: "10%" }}></th>}
                        </tr>
                      </thead>
                      <tbody>
                        {isEditing ? (
                          editData.reraDetails.length > 0 ? (
                            editData.reraDetails.map((row, idx) => (
                              <tr key={idx}>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="phase"
                                    value={row.phase || ""}
                                    onChange={(e) => handleReraInputChange(e, idx)}
                                    placeholder="Phase"
                                  />
                                </td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="status"
                                    value={row.status || ""}
                                    onChange={(e) => handleReraInputChange(e, idx)}
                                    placeholder="Status"
                                  />
                                </td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="reraNumber"
                                    value={row.reraNumber || ""}
                                    onChange={(e) => handleReraInputChange(e, idx)}
                                    placeholder="Rera Number"
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    style={{ fontSize: 14, padding: "4px 8px", borderRadius: "50%" }}
                                    title="Delete"
                                    onClick={() => {
                                      const updated = [...editData.reraDetails];
                                      updated.splice(idx, 1);
                                      setEditData(prev => ({ ...prev, reraDetails: updated }));
                                    }}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} style={{ textAlign: "center", fontSize: "12px", color: "gray" }}>No RERA data available</td>
                            </tr>
                          )
                        ) : (
                          (Array.isArray(property?.reraDetails) && property.reraDetails.length > 0) ? (
                            property.reraDetails.map((row, idx) => (
                              <tr key={idx}>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>{row.phase}</td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>{row.status}</td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>{row.reraNumber}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} style={{ textAlign: "center", fontSize: "12px", color: "gray" }}>No RERA data available</td>
                            </tr>
                          )
                        )}
                        {isEditing && (
                          <tr>
                            <td colSpan={4}>
                              <button
                                className="btn btn-success btn-sm"
                                style={{ fontSize: 12 }}
                                onClick={() => setEditData(prev => ({ ...prev, reraDetails: [...prev.reraDetails, { phase: "", status: "", reraNumber: "" }] }))}
                              >
                                + Add Row
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {isEditing && (
                      <div className="mt-2 d-flex gap-2 justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={handleSaveRera}>Save RERA</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowReraDetails(false)}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <span className="badge text-dark" style={{ padding: "4px 8px", fontSize: "10px", marginRight: "3px", marginBottom: "3px", borderRadius: "0", backgroundColor: "#f0f0f0", fontWeight: "300" }}>
                No Brokerage
              </span>
              <span className="badge text-dark" style={{ padding: "4px 8px", fontSize: "10px", marginRight: "3px", marginBottom: "3px", borderRadius: "0", backgroundColor: "#f0f0f0", fontWeight: "300" }}>
                Floor Plans Available
              </span>
              <span className="badge text-dark" style={{ padding: "4px 8px", fontSize: "10px", marginRight: "3px", marginBottom: "3px", borderRadius: "0", backgroundColor: "#f0f0f0", fontWeight: "300" }}>
                Top Amenities
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end mt-2 mt-md-2 p-0 p-md-0" style={{ boxShadow: "none", border: "none" }}>
            <p className="mb-1 fw-bold text-black text-center text-md-end mt-2 mt-md-4" style={{ fontSize: "20px" }}>
              Starting from
            </p>
            {isEditing ? (
              <>
                <input
                  type="number"
                  className="form-control mb-2"
                  name="price"
                  value={editData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  style={{ fontSize: "18px", fontWeight: "700", width: "120px", display: "inline-block" }}
                />
                {/* Show original price if different */}
                {property?.price && editData.price !== property.pricing_info?.price && (
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Old: ₹{formatPrice(property.pricing_info)}
                  </div>
                )}
                {/* Show pricing_info.price if present and different */}
                {property?.pricing_info?.price && property.pricing_info?.price !== editData.price && (
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Pricing Info: ₹{formatPrice(property.pricing_info?.price)}
                  </div>
                )}
              </>
            ) : (
              <h2 className="h2 mb-0 fw-bold text-center text-md-end" style={{ fontSize: "25px", fontWeight: "800" }}>
                ₹{formatPrice(property?.price || property?.pricing_info?.price || "0")}
                {property?.pricing_info?.price && property?.price && property.pricing_info?.price !== property.pricing_info?.price && (
                  <span style={{ fontSize: "13px", color: "#888", marginLeft: 8 }}>
                    (Pricing Info: ₹{formatPrice(property.pricing_info?.price)})
                  </span>
                )}
              </h2>
            )}
            <button id="BookBtn2" className="theme-btn" style={{ display: "inline-block" }} onClick={handleDownloadBrochure}>
              Contact to Our Expert
            </button>
            {/* Dialog Popup Trigger */}
            {BrochurePopupDialog && (
              <BrochurePopupDialog
                open={showPopup}
                onClose={closePopup}
                projectName={property?.propertyName || "Invest Mango"}
                brochure={property?.brochure}
              />
            )}
          </div>
        </div>
        <div className="">
          <hr />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderSection;
