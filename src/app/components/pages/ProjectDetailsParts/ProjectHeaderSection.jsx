import React, { useRef, useState, useEffect } from "react";

const ProjectHeaderSection = ({
  projectData,
  reraDetails,
  showReraDetails,
  setShowReraDetails,
  setIsReraDetailHovered,
  isReraDetailHovered,
  formatPrice,
  getLeastPriceOfFloorPlan,
  getHighestPriceOfFloorPlan,
  isEditing,
  handleEdit,
  handleSave,
  handleInputChange,
}) => {
  const fileInputRef = useRef(null);

  // Local state for prices
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Initialize local state when entering edit mode or when projectData changes
  useEffect(() => {
    if (isEditing) {
      setMinPrice(
        projectData?.minPrice ??
        getLeastPriceOfFloorPlan(projectData?.floorplans?.filter(plan => plan.price > 1)) ??
        ""
      );
      setMaxPrice(
        projectData?.maxPrice ??
        getHighestPriceOfFloorPlan(projectData?.floorplans) ??
        ""
      );
    }
  }, [isEditing, projectData, getLeastPriceOfFloorPlan, getHighestPriceOfFloorPlan]);

  // Handle Save: update parent state for prices, then call handleSave
 const handleSaveAll = () => {
  handleInputChange("minPrice", minPrice);
  handleInputChange("maxPrice", maxPrice);
  handleSave();
};

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleInputChange("projectLogo", ev.target.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      className="container-fluid"
      style={{
        width: window.innerWidth <= 768 ? "90%" : "95%",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          {/* Left Section */}
          <div className="col-12 col-md-6 p-0 p-md-0">
            {/* Upper Section */}
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-2 mt-2 mt-md-3">
              <div
                className="mb-2 mb-md-0 me-md-3 text-center text-md-start position-relative"
                style={{
                  maxWidth: "90px",
                  border: "1px solid grey",
                  height: "66px",
                }}
              >
                <img
                  src={projectData?.projectLogo || "defaultLogo.jpg"}
                  alt={projectData?.projectLogo || "Project Logo"}
                  loading="lazy"
                  className="img-fluid"
                  style={{
                    maxWidth: "80px",
                    height: "64px",
                    objectFit: "contain",
                  }}
                />
                {isEditing && (
                  <>
                   <button
  type="button"
  onClick={() => fileInputRef.current.click()}
  title="Edit Logo"
  style={{
    background: "none",
    border: "none",
    padding: 0,
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 2,
    cursor: "pointer",
  }}
>
  <img
    src="/images/editlogo.png"
    alt="Edit"
    style={{ width: "16px", height: "16px" }}
  />
</button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
            <div className="text-center text-md-start w-100">
  {isEditing ? (
    <>
      <div className="input-group mb-2" style={{ maxWidth: 350 }}>
        <input
          type="text"
          className="form-control form-control-sm"
          value={projectData?.name || ""}
          onChange={e => handleInputChange("name", e.target.value)}
          placeholder="Project Name"
          style={{ fontSize: "18px", fontWeight: 600 }}
        />
        <button
          className="btn btn-primary btn-sm"
          style={{ backgroundColor: "#2067d1", borderColor: "#2067d1" }}
          onClick={handleSaveAll}
          type="button"
        >
          Save
        </button>
      </div>
      <input
        type="text"
        className="form-control form-control-sm mb-2"
        value={projectData?.shortAddress || ""}
        onChange={e => handleInputChange("shortAddress", e.target.value)}
        placeholder="Project Address"
        style={{ fontSize: "12px", maxWidth: 350 }}
      />
      <input
        type="text"
        className="form-control form-control-sm d-inline w-auto"
        value={projectData?.developerName || ""}
        onChange={e => handleInputChange("developerName", e.target.value)}
        placeholder="Developer Name"
        style={{ fontSize: "13px", display: "inline-block", maxWidth: 200 }}
      />
    </>
  ) : (
    <>
      <h1
        className="h3 mb-0 text-center text-md-start"
        style={{ fontSize: "20px" }}
      >
        {projectData?.name || "Project Name"}
        <span style={{ marginLeft: 10 }}>
          <button
            className="btn btn-light btn-sm"
            onClick={handleEdit}
            style={{ border: "1px solid #2067d1", marginLeft: 8, backgroundColor: "#2067d1" }}
          >
            <img
              src="/images/edit-icon.svg"
              alt="Edit"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        </span>
      </h1>
      <p className="mb-0 mt-2" style={{ fontSize: "11px" }}>
        {projectData?.shortAddress || "Project Address"}
      </p>
      <span style={{ fontSize: "13px" }}>
        By{" "}
        <a
          href={projectData?.developerLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {projectData?.developerName || "Developer Name"}
        </a>
      </span>
    </>
  )}
</div>
            </div>
        

          {/* Lower Section - Buttons */}
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start position-relative mt-2">
            {/* RERA Badge */}
            <span
              className="badge bg-primary"
              style={{
                padding: "6px 10px",
                fontSize: "12px",
                marginRight: "5px",
                marginBottom: "5px",
                borderRadius: "4px",
                backgroundColor: "#2067d1",
                cursor: "pointer",
              }}
              onMouseEnter={() => setShowReraDetails(true)}
            >
              Rera
            </span>

            {/* RERA Details Popup */}
            {showReraDetails && (
  <div
    onMouseEnter={() => setIsReraDetailHovered(true)}
    onMouseLeave={() => {
      setIsReraDetailHovered(false);
      setShowReraDetails(false);
    }}
    style={{
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 1000,
      backgroundColor: "white",
      padding: "15px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      borderRadius: "6px",
      minWidth: "350px",
      maxWidth: "90vw",
      overflowX: "auto",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-0">
      <h6 className="m-0" style={{ fontWeight: 700, fontSize: "14px" }}>
        RERA Details
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
      <span style={{ fontSize: "10px", color: "black" }}>
        Website Link
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm d-inline w-auto ms-2"
            value={projectData?.reraLink || ""}
            onChange={e => handleInputChange("reraLink", e.target.value)}
            placeholder="Website Link"
            style={{ fontSize: "10px", minWidth: 180, display: "inline-block" }}
          />
        ) : (
          <a href={projectData?.reraLink || "N/A"} target="_blank" rel="noopener noreferrer">
            {" "}{projectData?.reraLink || "N/A"}
          </a>
        )}
      </span>
      <table className="w-100">
        <thead>
          <tr>
            <th style={{ width: "40%", textAlign: "left", fontSize: "12px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white", padding: "8px" }}>Phase</th>
            <th style={{ width: "30%", textAlign: "left", fontSize: "12px", padding: "8px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>Status</th>
            <th style={{ width: "30%", textAlign: "left", fontSize: "12px", padding: "8px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>RERA Number</th>
            <th style={{ width: "30%", textAlign: "left", fontSize: "12px", padding: "8px", color: "black", fontWeight: 500, border: "none", backgroundColor: "white" }}>RERA QR</th>
            {isEditing && <th style={{ width: "10%" }}></th>}
          </tr>
        </thead>
        <tbody>
          {(projectData?.reraDetails || []).length > 0 ? (
            projectData.reraDetails.map((item, index) => (
              <tr key={index}>
                <td style={{ fontSize: "12px", padding: "10px", fontWeight: "500" }}>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={item.phase || ""}
                      onChange={e => {
                        const updated = [...projectData.reraDetails];
                        updated[index].phase = e.target.value;
                        handleInputChange("reraDetails", updated);
                      }}
                      placeholder="Phase"
                    />
                  ) : (
                    item.phase || "-"
                  )}
                </td>
                <td style={{ fontSize: "12px", padding: "10px" }}>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={item.status || ""}
                      onChange={e => {
                        const updated = [...projectData.reraDetails];
                        updated[index].status = e.target.value;
                        handleInputChange("reraDetails", updated);
                      }}
                      placeholder="Status"
                    />
                  ) : (
                    item.status || "-"
                  )}
                </td>
                <td style={{ fontSize: "12px", padding: "10px", fontWeight: "600" }}>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={item.reraNumber || ""}
                      onChange={e => {
                        const updated = [...projectData.reraDetails];
                        updated[index].reraNumber = e.target.value;
                        handleInputChange("reraDetails", updated);
                      }}
                      placeholder="RERA Number"
                    />
                  ) : (
                    item.reraNumber || "-"
                  )}
                </td>
                <td style={{ fontSize: "12px", padding: "10px", fontWeight: "600" }}>
                  {isEditing ? (
                    <>
                      {item.qrImages ? (
                        <img
                          src={item.qrImages}
                          alt="qrImage"
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                            marginBottom: 4,
                          }}
                        />
                      ) : (
                        <span>N/A</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control form-control-sm mt-1"
                        style={{ fontSize: "10px" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => {
                              const updated = [...projectData.reraDetails];
                              updated[index].qrImages = ev.target.result;
                              handleInputChange("reraDetails", updated);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </>
                  ) : item.qrImages ? (
                    <img
                      src={item.qrImages}
                      alt="qrImage"
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                {isEditing && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: 10, padding: "2px 6px" }}
                      onClick={() => {
                        const updated = [...projectData.reraDetails];
                        updated.splice(index, 1);
                        handleInputChange("reraDetails", updated);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={isEditing ? 5 : 4}
                style={{
                  textAlign: "center",
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "gray",
                }}
              >
                No RERA data available
              </td>
            </tr>
          )}
          {isEditing && (
            <tr>
              <td colSpan={5}>
                <button
                  className="btn btn-success btn-sm"
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    const updated = [
                      ...(projectData.reraDetails || []),
                      { phase: "", status: "", reraNumber: "", qrImages: "" },
                    ];
                    handleInputChange("reraDetails", updated);
                  }}
                >
                  + Add Row
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

            {/* Additional Badges */}
            <span
              className="badge text-dark"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                marginRight: "3px",
                marginBottom: "3px",
                borderRadius: "0",
                backgroundColor: "#f0f0f0",
                fontWeight: "300",
              }}
            >
              No Brokerage
            </span>
            <span
              className="badge text-dark"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                marginRight: "3px",
                marginBottom: "3px",
                borderRadius: "0",
                backgroundColor: "#f0f0f0",
                fontWeight: "300",
              }}
            >
              Floor Plans Available
            </span>
            <span
              className="badge text-dark"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                marginRight: "3px",
                marginBottom: "3px",
                borderRadius: "0",
                backgroundColor: "#f0f0f0",
                fontWeight: "300",
              }}
            >
              Top Amenities
            </span>
          </div>
        </div>

         {/* Right Section */}
          <div
            className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end mt-2 mt-md-2 p-0 p-md-0"
            style={{ boxShadow: "none", border: "none" }}
          >
            <p
              className="mb-1 fw-bold text-black text-center text-md-end mt-2 mt-md-4"
              style={{ fontSize: "16px" }}
            >
              Project Price
            </p>
            {isEditing ? (
           <div className="d-flex align-items-center">
  <span style={{ fontSize: "22px", fontWeight: 700, marginRight: 4 }}>₹</span>
  <input
    type="number"
    className="form-control form-control-sm"
    style={{ width: 180, fontSize: "18px", fontWeight: 600, marginRight: 8 }}
    value={minPrice}
    onChange={e => setMinPrice(e.target.value)}
    placeholder="Min Price"
  />
  <span style={{ fontSize: "18px", fontWeight: 700, margin: "0 8px" }}>-</span>
  <span style={{ fontSize: "22px", fontWeight: 700, marginRight: 4 }}>₹</span>
  <input
    type="number"
    className="form-control form-control-sm"
    style={{ width: 180, fontSize: "18px", fontWeight: 600, marginRight: 8 }}
    value={maxPrice}
    onChange={e => setMaxPrice(e.target.value)}
    placeholder="Max Price"
  />
  {/* No Save button here */}
</div>
            ) : (
              <h2
                className="h2 mb-0 fw-bold text-center text-md-end"
                style={{ fontSize: "25px", fontWeight: "800" }}
              >
                ₹{" "}
                {formatPrice(
                  projectData?.minPrice ??
                  getLeastPriceOfFloorPlan(projectData?.floorplans?.filter(plan => plan.price > 1))
                )}{" "}
                - ₹{" "}
                {formatPrice(
                  projectData?.maxPrice ??
                  getHighestPriceOfFloorPlan(projectData?.floorplans)
                )}
              </h2>
            )}
          </div>
        </div>
        {/* Save button for all edits (only one button, left section) */}
      
      </div>
      <div className="">
        <hr />
      </div>
    </section>
  );
};

export default ProjectHeaderSection;