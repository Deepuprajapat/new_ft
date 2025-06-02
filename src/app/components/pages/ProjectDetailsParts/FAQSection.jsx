import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const FaqSection = ({
  displayedFaqs,
  setDisplayedFaqs, // <-- You need to pass this from parent
  expandedIndex,
  setExpandedIndex,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFaqs, setEditFaqs] = useState(displayedFaqs || []);

  useEffect(() => {
    if (!isEditing) setEditFaqs(displayedFaqs || []);
  }, [displayedFaqs, isEditing]);

  const handleFaqChange = (index, field, value) => {
    setEditFaqs((prev) =>
      prev.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    );
  };

  const handleSave = () => {
    setDisplayedFaqs(editFaqs);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFaqs(displayedFaqs || []);
    setIsEditing(false);
  };

  const handleAddFaq = () => {
    setEditFaqs((prev) => [
      ...prev,
      { question: "", answer: "" }
    ]);
    setExpandedIndex(editFaqs.length); // Expand the new FAQ
  };

  const handleRemoveFaq = (index) => {
    setEditFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="mb-4"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      id="FAQs"
    >
      <div className="p-0 pb-2">
        <div
          style={{
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "48px",
            padding: "0 1rem",
          }}
        >
          <h4
            className="mb-0 fw-bold text-white"
            style={{
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
              lineHeight: "48px",
            }}
          >
            Frequently Asked Questions (FAQs)
          </h4>
         <span style={{ cursor: "pointer", marginLeft: "12px" }}>
    {isEditing ? (
      <>
        <button
          className="btn btn-success btn-sm"
          style={{ backgroundColor: "#000", borderColor: "#000", marginRight: "10px" }}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </>
    ) : (
      <span
        onClick={() => setIsEditing(true)}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <img
          src="/images/edit-icon.svg"
          alt="Edit"
          style={{ width: "18px", height: "18px" }}
        />
      </span>
    )}
  </span>
        </div>
        <div className="px-3">
          {(isEditing ? editFaqs : displayedFaqs)?.map((faq, index) => (
            <div key={index} className="mb-3">
              <div
                className="d-flex justify-content-between align-items-center p-2"
                style={{
                  backgroundColor:
                    expandedIndex === index ? "#f8f9fa" : "white",
                  cursor: "pointer",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                }}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                {isEditing ? (
                  <input
                    className="form-control me-2"
                    style={{ fontWeight: "bold", fontSize: "inherit" }}
                    value={faq.question || faq.text || ""}
                    placeholder="Question"
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                  />
                ) : (
                  <span className="fw-bold">
                    {faq.text || faq.question}
                  </span>
                )}
                <span>
                  {expandedIndex === index ? "−" : "+"}
                  {isEditing && (
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveFaq(index);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </span>
              </div>
              {expandedIndex === index && (
                <div
                  className="p-3"
                  style={{
                    border: "1px solid #dee2e6",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    fontSize: window.innerWidth <= 768 ? "12px" : "13px",
                  }}
                >
                  {isEditing ? (
                    <textarea
                      className="form-control"
                      rows={3}
                      value={faq.answer || ""}
                      placeholder="Answer"
                      onChange={e =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(faq?.answer),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          {isEditing && (
            <>
              <div className="mb-3">
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleSave}
                >
                  Save FAQs
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
              <div className="mb-3 text-end">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddFaq}
                >
                  <i className="fa fa-plus me-1"></i> Add FAQ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;