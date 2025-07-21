import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

// Modular row component
const PriceRow = ({
  plan,
  index,
  isEditing,
  updatePriceList,
  removePriceList,
  formatPrice,
}) => (
  <tr>
    <td>
      {isEditing ? (
        <input
          type="text"
          value={plan.title}
          onChange={(e) => updatePriceList(index, "title", e.target.value)}
          className="form-control"
        />
      ) : (
        plan.title
      )}
    </td>
    <td>
      {isEditing ? (
        <input
          type="number"
          value={plan.size}
          onChange={(e) => updatePriceList(index, "size", e.target.value)}
          className="form-control"
        />
      ) : (
        `${plan.size} sq ft`
      )}
    </td>
    <td>
      {isEditing ? (
        <input
          type="number"
          value={plan.price}
          min="0"
          step="1"
          onChange={(e) => {
            // Only allow numbers
            const value = e.target.value.replace(/[^0-9]/g, "");
            updatePriceList(index, "price", value);
          }}
          className="form-control"
        />
      ) : formatPrice ? (
        formatPrice(plan.price)
      ) : (
        plan.price
      )}
    </td>
    {isEditing && (
      <td>
        <img
          src="/images/delete1.png" // adjust if path differs
          alt="Remove"
          onClick={() => removePriceList(index)}
          style={{
            padding: "4px",
            width: "30px", // adjust size as needed
            height: "30px", // adjust size as needed
            verticalAlign: "middle",
            cursor: "pointer",
            marginLeft: "10px", // optional spacing
          }}
        />
      </td>
    )}
  </tr>
);

const PriceListSection = ({
  projectData,
  formatPrice,
  showEdit,
  handleSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [priceList, setPriceList] = useState(
    projectData?.web_cards?.price_list?.product_configurations?.map((item) => ({
      title: item.configuration_name || "",
      size: item.size || "",
      price: item.price || "",
    })) || []
  );
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [priceListPara, setPriceListPara] = useState(
    projectData?.priceListPara || ""
  );
  const [newPlan, setNewPlan] = useState({
    title: "",
    size: "",
    price: "",
  });

  useEffect(() => {
    setPriceList(
      projectData?.web_cards?.price_list?.product_configurations?.map(
        (item) => ({
          title: item.configuration_name || "",
          size: item.size || "",
          price: item.price || "",
        })
      ) || []
    );
    setPriceListPara(projectData?.priceListPara || "");
  }, [projectData]);

  const updatePriceList = (index, field, value) => {
    setPriceList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  // // Add these functions
  // const savePriceChanges = () => {
  //   setProjectData(prev => ({
  //     ...prev,
  //     priceListPara: priceListPara,
  //     floorplans: floorplans
  //   }));
  //   setIsPriceEditing(false);
  // };

  const addPriceList = () => {
    if (!newPlan.title || !newPlan.size || !newPlan.price) return;
    setPriceList((prev) => [...prev, newPlan]);
    setNewPlan({ title: "", size: "", price: "" });
  };

  const removePriceList = (index) => {
    setPriceList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    // Map UI fields back to backend structure
    const updatedProductConfigurations = priceList.map((item) => ({
      configuration_name: item.title,
      size: item.size,
      price: item.price,
    }));
    const updatedData = {
      ...projectData,
      web_cards: {
        ...projectData.web_cards,
        price_list: {
          ...projectData.web_cards?.price_list,
          product_configurations: updatedProductConfigurations,
          description: priceListPara,
        },
      },
    };
    handleSave(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPriceList(projectData?.floorplans || []);
    setPriceListPara(projectData?.priceListPara || "");
    setIsEditing(false);
  };

  // Get the price list description from API data
  const priceListDescription =
    projectData?.web_cards?.price_list?.description || "";

  return (
    <div
      className="mb-4"
      id="price"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h2
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {projectData?.project_name} Price List
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{
                      backgroundColor: "white",
                      color: "#2067d1",
                      border: "1px solid #2067d1",
                      fontWeight: "bold",
                    }}
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: "auto" }}
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
                  onClick={() => setIsEditing(true)}
                />
              )}
            </span>
          )}
        </h2>
        <div className="px-3">
          {priceListDescription && (
            <div
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                color: "#333",
                fontWeight: 500,
                marginBottom: "0px",
              }}
            >
              {priceListDescription}
            </div>
          )}

          <div className="px-1">
            {isEditing ? (
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                  outline: "1px solid #2067d1",
                  background: "#f8faff",
                  borderRadius: "4px",
                  padding: "8px",
                  cursor: "text",
                  minHeight: "40px",
                }}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => setPriceListPara(e.currentTarget.innerHTML)}
                onBlur={(e) => setPriceListPara(e.currentTarget.innerHTML)}
                // Set initial content only when entering edit mode
                dangerouslySetInnerHTML={undefined}
                ref={el => {
                  if (el && el.innerHTML !== priceListPara) el.innerHTML = priceListPara;
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                  color: "#333",
                  fontWeight: 500,
                  marginBottom: "0px",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    priceListPara || projectData?.priceListPara || ""
                  ),
                }}
              />
            )}
          </div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Configuration</th>
                  <th>Size</th>
                  <th>Price</th>
                  {isEditing && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {priceList.map((plan, index) => (
                  <PriceRow
                    key={index}
                    plan={plan}
                    index={index}
                    isEditing={isEditing}
                    updatePriceList={updatePriceList}
                    removePriceList={removePriceList}
                    formatPrice={formatPrice}
                  />
                ))}
              </tbody>
            </table>
            {isEditing && (
              <div className="d-flex gap-2 align-items-center mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Configuration"
                  value={newPlan.title}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, title: e.target.value })
                  }
                  style={{ maxWidth: 120, fontSize: "13px" }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Size"
                  value={newPlan.size}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, size: e.target.value })
                  }
                  style={{ maxWidth: 100, fontSize: "13px" }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={newPlan.price}
                  min="0"
                  step="1"
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setNewPlan({ ...newPlan, price: value });
                  }}
                  style={{ maxWidth: 120, fontSize: "13px" }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  style={{ fontSize: "13px", fontWeight: 600, width: "auto" }}
                  onClick={addPriceList}
                  title="Add new price list row"
                >
                  + Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListSection;
