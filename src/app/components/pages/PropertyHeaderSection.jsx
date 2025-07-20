import React, { useState } from "react";

const PropertyHeaderSection = ({ property, formatPrice, handleDownloadBrochure, showPopup, closePopup, BrochurePopupDialog, onSave }) => {
  const [showReraDetails, setShowReraDetails] = useState(false);
  const [isReraDetailHovered, setIsReraDetailHovered] = useState(false);
  let reraTimeout = null;

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(property?.name || "");
  // Developer details state (nested object)
  const [editDeveloperName, setEditDeveloperName] = useState(property?.developer?.name || "");
  const [editDeveloperLogo, setEditDeveloperLogo] = useState(property?.developer?.developer_logo || "");
  const [editDeveloperAddress, setEditDeveloperAddress] = useState(property?.developer?.developer_address || "");
  const [editPropertyAddress, setEditPropertyAddress] = useState(property?.propertyAddress || "");
  const [editPrice, setEditPrice] = useState(property?.pricing_info?.price || "");

  // Add local state for editable RERA details
  const [editReraRows, setEditReraRows] = useState(
    Array.isArray(property?.reraDetails) ? property.reraDetails : []
  );

  // Sync editReraRows with property when edit mode is entered
  React.useEffect(() => {
    if (isEditing) {
      setEditReraRows(Array.isArray(property?.reraDetails) ? property.reraDetails : []);
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
    setEditName(property?.name || "");
    setEditDeveloperName(property?.developer?.name || "");
    setEditDeveloperLogo(property?.developer?.developer_logo || "");
    setEditDeveloperAddress(property?.developer?.developer_address || "");
    setEditPropertyAddress(property?.propertyAddress || "");
    setEditPrice(property?.pricing_info?.price || "");
    setIsEditing(false);
  };
  const handleSave = () => {
    if (onSave) {
      onSave({
        ...property,
        name: editName,
        propertyAddress: editPropertyAddress,
        price: editPrice,
        developer: {
          ...(property?.developer || {}),
          name: editDeveloperName,
          developer_logo: editDeveloperLogo,
          developer_address: editDeveloperAddress,
        },
      });
    }
    setIsEditing(false);
  };

  // Save handler for RERA details
  const handleSaveRera = () => {
    if (onSave) {
      onSave({
        ...property,
        name: editName,
        propertyAddress: editPropertyAddress,
        price: editPrice,
        reraDetails: editReraRows,
        developer: {
          ...(property?.developer || {}),
          name: editDeveloperName,
          developer_logo: editDeveloperLogo,
          developer_address: editDeveloperAddress,
        },
      });
    }
    setIsEditing(false);
    setShowReraDetails(false);
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
            <div className="mb-2 mb-md-0 me-md-3 text-center text-md-start" style={{ maxWidth: '90px', border: '1px solid grey', height: '66px' }}>
              <img
                src={isEditing ? editDeveloperLogo || "defaultLogo.jpg" : property?.developer?.developer_logo || "defaultLogo.jpg"}
                alt={isEditing ? editDeveloperName || "Developer Logo" : property?.developer?.name || "Developer Logo"}
                loading="lazy"
                className="img-fluid"
                style={{ maxWidth: "80px", height: '64px', objectFit: 'contain' }}
              />
            </div>
              <div className="text-center text-md-start">
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control mb-1"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Property Name"
                    style={{ fontSize: "20px" }}
                  />
                ) : (
                  <h1 className="h3 mb-0 text-center text-md-start" style={{ fontSize: "20px" }}>
                    {property?.name || "Property Name"}
                    <button
                      className="btn btn-light btn-sm ms-2"
                      onClick={handleEdit}
                      style={{ border: "1px solid #2067d1", backgroundColor: "#2067d1" }}
                    >
                      <img src="/images/edit-icon.svg" alt="Edit" style={{ width: "18px", height: "18px" }} />
                    </button>
                  </h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control mb-1"
                    value={editPropertyAddress}
                    onChange={e => setEditPropertyAddress(e.target.value)}
                    placeholder="Property Address"
                    style={{ fontSize: "11px" }}
                  />
                ) : (
                  <p className="mb-0" style={{ fontSize: "11px" }}>
                    {property?.propertyAddress || "Property Address"}
                  </p>
                )}
                <span style={{ fontSize: "13px" }}>
                  By {" "}
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="form-control d-inline-block mb-1"
                        value={editDeveloperName}
                        onChange={e => setEditDeveloperName(e.target.value)}
                        placeholder="Developer Name"
                        style={{ width: "auto", fontSize: "13px", display: "inline-block" }}
                      />
                      <span style={{ fontSize: "13px", color: "#888", marginLeft: 6 }}>
                        {property?.developer?.name && editDeveloperName !== property?.developer?.name ? `(${property.developer.name})` : ''}
                      </span>
                      <input
                        type="text"
                        className="form-control d-inline-block mb-1"
                        value={editDeveloperAddress}
                        onChange={e => setEditDeveloperAddress(e.target.value)}
                        placeholder="Developer Address"
                        style={{ width: "auto", fontSize: "11px", display: "inline-block" }}
                      />
                      <span style={{ fontSize: "11px", color: "#888", marginLeft: 6 }}>
                        {property?.developer?.developer_address && editDeveloperAddress !== property?.developer?.developer_address ? `(${property.developer.developer_address})` : ''}
                      </span>
                      <input
                        type="text"
                        className="form-control d-inline-block mb-1"
                        value={editDeveloperLogo}
                        onChange={e => setEditDeveloperLogo(e.target.value)}
                        placeholder="Developer Logo URL"
                        style={{ width: "auto", fontSize: "11px", display: "inline-block" }}
                      />
                      <span style={{ fontSize: "11px", color: "#888", marginLeft: 6 }}>
                        {property?.developer?.developer_logo && editDeveloperLogo !== property?.developer?.developer_logo ? `(${property.developer.developer_logo})` : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <a target="_blank" rel="noopener noreferrer">
                        {property?.developer?.name || "Developer Name"}
                      </a>
                      {property?.developer?.developer_address && (
                        <div style={{ fontSize: "11px", color: "#555" }}>{property.developer.developer_address}</div>
                      )}
                    </>
                  )}
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
                          editReraRows.length > 0 ? (
                            editReraRows.map((row, idx) => (
                              <tr key={idx}>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={row.phase || ""}
                                    onChange={e => {
                                      const updated = [...editReraRows];
                                      updated[idx].phase = e.target.value;
                                      setEditReraRows(updated);
                                    }}
                                    placeholder="Phase"
                                  />
                                </td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={row.status || ""}
                                    onChange={e => {
                                      const updated = [...editReraRows];
                                      updated[idx].status = e.target.value;
                                      setEditReraRows(updated);
                                    }}
                                    placeholder="Status"
                                  />
                                </td>
                                <td style={{ fontSize: "11px", padding: "8px 0" }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={row.reraNumber || ""}
                                    onChange={e => {
                                      const updated = [...editReraRows];
                                      updated[idx].reraNumber = e.target.value;
                                      setEditReraRows(updated);
                                    }}
                                    placeholder="Rera Number"
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    style={{ fontSize: 14, padding: "4px 8px", borderRadius: "50%" }}
                                    title="Delete"
                                    onClick={() => {
                                      const updated = [...editReraRows];
                                      updated.splice(idx, 1);
                                      setEditReraRows(updated);
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
                                onClick={() => setEditReraRows([...editReraRows, { phase: "", status: "", reraNumber: "" }])}
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
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  placeholder="Price"
                  style={{ fontSize: "18px", fontWeight: "700", width: "120px", display: "inline-block" }}
                />
                {/* Show original price if different */}
                {property?.price && editPrice !== property.price && (
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Old: ₹{formatPrice(property.price)}
                  </div>
                )}
                {/* Show pricing_info.price if present and different */}
                {property?.pricing_info?.price && property.pricing_info.price !== editPrice && (
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Pricing Info: ₹{formatPrice(property.pricing_info.price)}
                  </div>
                )}
              </>
            ) : (
              <h2 className="h2 mb-0 fw-bold text-center text-md-end" style={{ fontSize: "25px", fontWeight: "800" }}>
                ₹{formatPrice(property?.price || property?.pricing_info?.price || "0")}
                {property?.pricing_info?.price && property?.price && property.pricing_info.price !== property.price && (
                  <span style={{ fontSize: "13px", color: "#888", marginLeft: 8 }}>
                    (Pricing Info: ₹{formatPrice(property.pricing_info.price)})
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
