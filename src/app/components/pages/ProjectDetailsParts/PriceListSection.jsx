import React from "react";
import DOMPurify from "dompurify";

const PriceListSection = ({
  projectData,
  isPriceEditing,
  setIsPriceEditing,
  priceListPara,
  setPriceListPara,
  floorplans,
  updateFloorplan,
  savePriceChanges,
  formatPrice,
}) => (
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
            <img
              src="/images/update.svg"
              alt="Save"
              style={{ width: "22px", height: "22px" }}
              onClick={savePriceChanges}
            />
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
            onInput={(e) => setPriceListPara(e.currentTarget.innerHTML)}
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
              {(isPriceEditing ? floorplans : projectData?.floorplans) &&
                (isPriceEditing ? floorplans : projectData.floorplans)
                  .slice()
                  .sort((a, b) => a.size - b.size)
                  .map((plan, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                          padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                        }}
                      >
                        {isPriceEditing ? (
                          <input
                            type="text"
                            value={plan.title}
                            onChange={(e) =>
                              updateFloorplan(index, "title", e.target.value)
                            }
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize:
                                window.innerWidth <= 768 ? "11px" : "14px",
                              width: "100%",
                              background: "#f8faff",
                            }}
                          />
                        ) : (
                          plan.title
                        )}
                      </td>
                      <td
                        style={{
                          fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                          padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                        }}
                      >
                        {isPriceEditing ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                              type="number"
                              value={plan.size}
                              onChange={(e) =>
                                updateFloorplan(index, "size", e.target.value)
                              }
                              style={{
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                                width: "80px",
                                background: "#f8faff",
                                marginRight: "4px",
                              }}
                            />
                            <span
                              style={{
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                              }}
                            >
                              sq ft
                            </span>
                          </div>
                        ) : (
                          `${plan.size} sq ft`
                        )}
                      </td>
                      <td
                        style={{
                          fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                          padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                        }}
                      >
                        {isPriceEditing ? (
                          <div>
                            <input
                              type="text"
                              value={plan.price}
                              onChange={(e) =>
                                updateFloorplan(index, "price", e.target.value)
                              }
                              style={{
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize:
                                  window.innerWidth <= 768 ? "11px" : "14px",
                                width: "100px",
                                background: "#f8faff",
                                marginBottom: "4px",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "4px",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={plan.isSoldOut || false}
                                onChange={(e) =>
                                  updateFloorplan(
                                    index,
                                    "isSoldOut",
                                    e.target.checked
                                  )
                                }
                                style={{ marginRight: "4px" }}
                              />
                              <span style={{ fontSize: "10px" }}>Sold Out</span>
                            </div>
                          </div>
                        ) : !plan.isSoldOut ? (
                          formatPrice(plan.price)
                        ) : (
                          "Sold Out"
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default PriceListSection;