import React from "react";
import DOMPurify from "dompurify";

const PaymentPlanSection = ({
  projectData,
  isPaymentEditing,
  setIsPaymentEditing,
  paymentPara,
  setPaymentPara,
  paymentPlans,
  updatePaymentPlan,
  removePaymentPlan,
  addNewPaymentPlan,
  savePaymentChanges,
}) => {
  const validPaymentPlans = (isPaymentEditing ? paymentPlans : projectData?.paymentPlans)?.filter(
    (plan) => plan?.planName?.trim() !== "" || plan?.details?.trim() !== ""
  );

  // Only hide if not editing AND no plans at all
  if (!isPaymentEditing && !validPaymentPlans?.length) return null;

  return (
    <div
      className="mb-4"
      id="payment_plan"
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
          {projectData?.name} Payment Plan
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isPaymentEditing ? (
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
                onClick={savePaymentChanges}
              >
                Save
              </button>
            ) : (
              <img
                src="/images/edit-icon.svg"
                alt="Edit"
                style={{ width: "18px", height: "18px" }}
                onClick={() => setIsPaymentEditing(true)}
              />
            )}
          </span>
        </h2>
        <div className="p-3">
          <div
            className="mb-3"
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "16px",
              outline: isPaymentEditing ? "1px solid #2067d1" : "none",
              background: isPaymentEditing ? "#f8faff" : "transparent",
              borderRadius: "4px",
              padding: isPaymentEditing ? "8px" : "0",
              cursor: isPaymentEditing ? "text" : "default",
              minHeight: "40px",
            }}
            contentEditable={isPaymentEditing}
            suppressContentEditableWarning={true}
            onInput={(e) => setPaymentPara(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                isPaymentEditing ? paymentPara : projectData?.paymentPara
              ),
            }}
          />
          <div className="table-responsive">
            <table className="table table-striped">
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
                    Plan Name
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
                    Details
                  </th>
                  {isPaymentEditing && (
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
                        width: "60px",
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(validPaymentPlans?.length > 0 ? validPaymentPlans : isPaymentEditing ? paymentPlans : []).map((plan, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                        padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                      }}
                    >
                      {isPaymentEditing ? (
                        <input
                          type="text"
                          value={plan.planName}
                          onChange={(e) =>
                            updatePaymentPlan(index, "planName", e.target.value)
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
                        plan?.planName
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                        padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                      }}
                    >
                      {isPaymentEditing ? (
                        <textarea
                          value={plan.details}
                          onChange={(e) =>
                            updatePaymentPlan(index, "details", e.target.value)
                          }
                          style={{
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize:
                              window.innerWidth <= 768 ? "11px" : "14px",
                            width: "100%",
                            background: "#f8faff",
                            minHeight: "60px",
                            resize: "vertical",
                          }}
                        />
                      ) : (
                        plan?.details
                      )}
                    </td>
                    {isPaymentEditing && (
                      <td
                        style={{
                          fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                          padding: window.innerWidth <= 768 ? "8px 4px" : "8px",
                          textAlign: "center",
                        }}
                      >
                        <button
                          onClick={() => removePaymentPlan(index)}
                          style={{
                            border: "none",
                            background: "#dc3545",
                            color: "white",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {isPaymentEditing && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  onClick={addNewPaymentPlan}
                  style={{
                    border: "1px solid #2067d1",
                    background: "#f8faff",
                    color: "#2067d1",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  + Add New Payment Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanSection;