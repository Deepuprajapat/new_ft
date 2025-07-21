import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const PaymentPlanSection = ({ projectData, showEdit, handleSave }) => {
  const getPaymentPlansFromData = (data) => {
    return data?.web_cards?.payment_plans?.plans?.map(plan => ({
      planName: plan.name,
      details: plan.details,
    })) || data?.paymentPlans || [];
  };

  const getPaymentDescriptionFromData = (data) => {
    return data?.web_cards?.payment_plans?.description || data?.paymentPara || "";
  };

  const [localPaymentPlans, setLocalPaymentPlans] = useState(
    getPaymentPlansFromData(projectData)
  );
  const [localPaymentPara, setLocalPaymentPara] = useState(
    getPaymentDescriptionFromData(projectData)
  );
  const [isPaymentEditing, setIsPaymentEditing] = useState(false);

  useEffect(() => {
    if (!isPaymentEditing) {
      setLocalPaymentPlans(getPaymentPlansFromData(projectData));
      setLocalPaymentPara(getPaymentDescriptionFromData(projectData));
    }
  }, [projectData, isPaymentEditing]);

  const updatePaymentPlan = (index, field, value) => {
    setLocalPaymentPlans((prev) =>
      prev.map((plan, i) => (i === index ? { ...plan, [field]: value } : plan))
    );
  };

  const removePaymentPlan = (index) => {
    setLocalPaymentPlans((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewPaymentPlan = () => {
    setLocalPaymentPlans((prev) => [...prev, { planName: "", details: "" }]);
  };

  const handleSaveChanges = () => {
    const updatedData = {
      ...projectData,
      paymentPlans: localPaymentPlans,
      paymentPara: localPaymentPara,
      web_cards: {
        ...projectData.web_cards,
        payment_plans: {
          ...projectData.web_cards?.payment_plans,
          description: localPaymentPara,
          plans: localPaymentPlans.map(plan => ({
            name: plan.planName,
            details: plan.details,
          }))
        }
      }
    };
    console.log("Saving payment plan:", updatedData);
    handleSave(updatedData);
    setIsPaymentEditing(false);
  };

  const handleCancel = () => {
    setLocalPaymentPlans(getPaymentPlansFromData(projectData));
    setLocalPaymentPara(getPaymentDescriptionFromData(projectData));
    setIsPaymentEditing(false);
  };

  const validPaymentPlans = (
    isPaymentEditing ? localPaymentPlans : getPaymentPlansFromData(projectData)
  )?.filter(
    (plan) => plan?.planName?.trim() !== "" || plan?.details?.trim() !== ""
  );

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
          {projectData?.project_name} Payment Plan
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
                      marginRight: "8px",
                    }}
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      width: "auto",
                    }}
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
          {isPaymentEditing ? (
            <div
              className=""
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
              onInput={(e) => setLocalPaymentPara(e.currentTarget.innerHTML)}
              onBlur={(e) => setLocalPaymentPara(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={undefined}
              ref={el => {
                if (el && el.innerHTML !== localPaymentPara) el.innerHTML = localPaymentPara;
              }}
            />
          ) : (
            <div
              className=""
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "16px",
                color: "#333",
                fontWeight: 500,
                marginBottom: "0px",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  localPaymentPara || getPaymentDescriptionFromData(projectData) || ""
                ),
              }}
            />
          )}
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
                            onChange={(e) =>
                              updatePaymentPlan(
                                index,
                                "planName",
                                e.target.value
                              )
                            }
                            className="form-control"
                          />
                        </td>
                        <td>
                          <textarea
                            value={plan.details}
                            onChange={(e) =>
                              updatePaymentPlan(
                                index,
                                "details",
                                e.target.value
                              )
                            }
                            className="form-control"
                            style={{ minHeight: "60px", resize: "vertical" }}
                          />
                        </td>
                        <td>
                          <img
                            src="/images/delete1.png"
                            onClick={() => removePaymentPlan(index)}
                            style={{
                              padding: "4px",
                              width: "30px",
                              marginTop: "10px",
                              height: "30px",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                          />
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
                    width: "auto",
                    margin: "10px",
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