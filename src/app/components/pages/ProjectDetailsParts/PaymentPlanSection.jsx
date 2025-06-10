import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const PaymentPlanSection = ({
  projectData,
  showEdit,
}) => {
  const [localPaymentPlans, setLocalPaymentPlans] = useState(projectData?.paymentPlans || []);
  const [localPaymentPara, setLocalPaymentPara] = useState(projectData?.paymentPara || "");
  const [isPaymentEditing, setIsPaymentEditing] = useState(false);
  // Sync with projectData when not editing
  useEffect(() => {
    if (!isPaymentEditing) {
      setLocalPaymentPlans(projectData?.paymentPlans || []);
      setLocalPaymentPara(projectData?.paymentPara || "");
    }
  }, [projectData, isPaymentEditing]);

  // Update a payment plan row
  const updatePaymentPlan = (index, field, value) => {
    setLocalPaymentPlans(prev =>
      prev.map((plan, i) =>
        i === index ? { ...plan, [field]: value } : plan
      )
    );
  };

  // Remove a payment plan row
  const removePaymentPlan = (index) => {
    setLocalPaymentPlans(prev => prev.filter((_, i) => i !== index));
  };

  // Add a new payment plan row
  const addNewPaymentPlan = () => {
    setLocalPaymentPlans(prev => [
      ...prev,
      { planName: "", details: "" }
    ]);
  };

  // Save changes
  const handleSave = () => {
    setIsPaymentEditing(false);
    // Optionally: send localPaymentPlans to API or parent here
  };

  // Cancel editing and reset changes
  const handleCancel = () => {
    setLocalPaymentPlans(projectData?.paymentPlans || []);
    setLocalPaymentPara(projectData?.paymentPara || "");
    setIsPaymentEditing(false);
  };

  const validPaymentPlans = (isPaymentEditing ? localPaymentPlans : projectData?.paymentPlans)?.filter(
    (plan) => plan?.planName?.trim() !== "" || plan?.details?.trim() !== ""
  );

  // Only hide if not editing AND no plans at all
  if (!isPaymentEditing && !validPaymentPlans?.length) return null;

  return (
    <div className="mb-4" id="payment_plan" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div className="p-0 pb-2">
        <h2 className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
            style={{
              fontSize: window.innerWidth <= 768 ? "16px" : "18px",
              backgroundColor: "#2067d1",
              borderRadius: "4px 4px 0 0",
            }}>
          {projectData?.name} Payment Plan
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isPaymentEditing ? (
                <>
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
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: "white", fontWeight: "bold" }}
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
                  onClick={() => setIsPaymentEditing(true)}
                />
              )}
            </span>
          )}
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
            onInput={e => setLocalPaymentPara(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                isPaymentEditing ? localPaymentPara : projectData?.paymentPara
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
                {isPaymentEditing
                  ? localPaymentPlans.map((plan, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={plan.planName}
                            onChange={e => updatePaymentPlan(index, "planName", e.target.value)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <textarea
                            value={plan.details}
                            onChange={e => updatePaymentPlan(index, "details", e.target.value)}
                            className="form-control"
                            style={{ minHeight: "60px", resize: "vertical" }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              setLocalPaymentPlans(prev => prev.filter((_, i) => i !== index))
                            }
                            className="btn btn-danger btn-sm"
                            style={
                              { fontSize: "13px", fontWeight: 600, width: "auto" }
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  : validPaymentPlans.map((plan, index) => (
                      <tr key={index}>
                        <td>{plan?.planName}</td>
                        <td>{plan?.details}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {isPaymentEditing && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  onClick={addNewPaymentPlan}
                  className="btn btn-primary btn-sm"
                  style={{
                    border: "1px solid #2067d1",
                    background: "#f8faff",
                    color: "#2067d1",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    width:"auto",
                    margin:"10px"
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