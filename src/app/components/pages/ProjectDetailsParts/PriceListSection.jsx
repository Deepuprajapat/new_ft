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
          onChange={e => updatePriceList(index, "title", e.target.value)}
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
          onChange={e => updatePriceList(index, "size", e.target.value)}
          className="form-control"
        />
      ) : (
        `${plan.size} sq ft`
      )}
    </td>
    <td>
      {isEditing ? (
        <input
          type="text"
          value={plan.price}
          onChange={e => updatePriceList(index, "price", e.target.value)}
          className="form-control"
        />
      ) : (
        formatPrice ? formatPrice(plan.price) : plan.price
      )}
    </td>
    {isEditing && (
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => removePriceList(index)}
        >
          Remove
        </button>
      </td>
    )}
  </tr>
);

// Modular row component
const PriceRow = ({
  plan,
  index,
  isEditing,
  updateFloorplan,
  removeFloorplan,
  formatPrice,
}) => (
  <tr>
    <td style={{
      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
    }}>
      {isEditing ? (
        <input
          type="text"
          value={plan.title}
          onChange={e => updateFloorplan(index, "title", e.target.value)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: window.innerWidth <= 768 ? "11px" : "14px",
            width: "100%",
            background: "#f8faff",
          }}
        />
      ) : (
        plan.title
      )}
    </td>
    <td style={{
      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
    }}>
      {isEditing ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            value={plan.size}
            onChange={e => updateFloorplan(index, "size", e.target.value)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: window.innerWidth <= 768 ? "11px" : "14px",
              width: "80px",
              background: "#f8faff",
              marginRight: "4px",
            }}
          />
          <span style={{ fontSize: window.innerWidth <= 768 ? "11px" : "14px" }}>sq ft</span>
        </div>
      ) : (
        `${plan.size} sq ft`
      )}
    </td>
    <td style={{
      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
    }}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={plan.price}
            onChange={e => updateFloorplan(index, "price", e.target.value)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: window.innerWidth <= 768 ? "11px" : "14px",
              width: "100px",
              background: "#f8faff",
              marginBottom: "4px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
            <input
              type="checkbox"
              checked={plan.isSoldOut || false}
              onChange={e => updateFloorplan(index, "isSoldOut", e.target.checked)}
              style={{ marginRight: "4px" }}
            />
            <span style={{ fontSize: "10px" }}>Sold Out</span>
            <button
              type="button"
              className="btn btn-danger btn-sm ms-2"
              style={{ fontSize: "10px", padding: "2px 8px" }}
              onClick={() => removeFloorplan(index)}
              title="Remove"
            >
              Remove
            </button>
          </div>
        </div>
      ) : !plan.isSoldOut ? (
        formatPrice(plan.price)
      ) : (
        "Sold Out"
      )}
    </td>
  </tr>
);

const PriceListSection = ({
  projectData,
  formatPrice,
  addFloorplan,      // new prop: function to add a floorplan
  removeFloorplan,   // new prop: function to remove a floorplan by index
}) => {
  // Default new floorplan structure
  const [newPlan, setNewPlan] = React.useState({
    title: "",
    size: "",
    price: "",
    isSoldOut: false,
  });

  const handleAdd = () => {
    if (!newPlan.title || !newPlan.size || !newPlan.price) return;
    addFloorplan({ ...newPlan });
    setNewPlan({ title: "", size: "", price: "", isSoldOut: false });
  };

  const plans = isPriceEditing ? floorplans : projectData?.floorplans || [];

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
          {projectData?.name} Price List
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isPriceEditing ? (
              <button
                className="btn btn-success btn-sm"
                style={{
                  backgroundColor: "white",
                  color: "#2067d1",
                  border: "1px solid #2067d1",
                  fontWeight: "bold",
                  padding: "2px 10px",
                  fontSize: "14px",
                }}
                onClick={savePriceChanges}
              >
                Save
              </button>
            ) : (
              <img
                src="/images/edit-icon.svg"
                alt="Edit"
                style={{ width: "18px", height: "18px" }}
                onClick={() => setIsPriceEditing(true)}
              />
            )}
          </span>
        </h2>
        <div className="px-3">
          <div className="px-3">
            <div
              className="mb-3"
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                outline: isPriceEditing ? "1px solid #2067d1" : "none",
                background: isPriceEditing ? "#f8faff" : "transparent",
                borderRadius: "4px",
                padding: isPriceEditing ? "8px" : "0",
                cursor: isPriceEditing ? "text" : "default",
                minHeight: "40px",
              }}
              contentEditable={isPriceEditing}
              suppressContentEditableWarning={true}
              onInput={e => setPriceListPara(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  isPriceEditing ? priceListPara : projectData?.priceListPara
                ),
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            <table
              className="table table-striped"
              style={{
                minWidth: window.innerWidth <= 768 ? "100%" : "auto",
              }}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#fff",
                      zIndex: 1,
                    }}
                  >
                    Configuration
                  </th>
                  <th
                    scope="col"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#fff",
                      zIndex: 1,
                    }}
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    style={{
                      fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                      padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#fff",
                      zIndex: 1,
                    }}
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans
                  .slice()
                  .sort((a, b) => a.size - b.size)
                  .map((plan, index) => (
                    <PriceRow
                      key={index}
                      plan={plan}
                      index={index}
                      isEditing={isPriceEditing}
                      updateFloorplan={updateFloorplan}
                      removeFloorplan={removeFloorplan}
                      formatPrice={formatPrice}
                    />
                  ))}
              </tbody>
            </table>
            {/* Add new row */}
            {isPriceEditing && (
              <div className="d-flex gap-2 align-items-center mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Configuration"
                  value={newPlan.title}
                  onChange={e => setNewPlan({ ...newPlan, title: e.target.value })}
                  style={{ maxWidth: 120, fontSize: "13px" }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Size"
                  value={newPlan.size}
                  onChange={e => setNewPlan({ ...newPlan, size: e.target.value })}
                  style={{ maxWidth: 100, fontSize: "13px" }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Price"
                  value={newPlan.price}
                  onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
                  style={{ maxWidth: 120, fontSize: "13px" }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                  onClick={handleAdd}
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