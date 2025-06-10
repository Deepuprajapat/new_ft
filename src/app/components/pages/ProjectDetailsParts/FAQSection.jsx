import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const defaultFaqs = [
  {
    question: "Why choose Invest Mango?",
    answer:
      "Invest Mango works as one team with a common purpose to provide best-in-class services, thoroughly understands the changing needs of its clients. We are client-centric as client is the focal point of Invest Mango. We provide advice and recommendations that are in the client's best interest. We strive to understand the client's requirement by entering into his shoes and offer advice which have far reaching impact. A happy client is what makes us happy and we are proud to serve our client's.",
  },
  {
    question: "How much is the total size of {{projectData.name}}?",
    answer: "{{projectData.area}}.",
  },
  {
    question: "What is the project location?",
    answer: "{{projectData.shortAddress}}.",
  },
];

function injectProjectData(template, data) {
  return template
    .replace(/{{projectData\.name}}/g, data?.name || "")
    .replace(/{{projectData\.shortAddress}}/g, data?.shortAddress || "")
    .replace(/{{projectData\.area}}/g, data?.area || "");
}

function isValidFaq(faq) {
  return faq?.question?.trim() !== "" || faq?.answer?.trim() !== "";
}

function cleanQuestion(question) {
  const match = question.match(/^(\d+)[.\s\t]+(.*)/);
  return match
    ? { number: parseInt(match[1]), text: match[2] }
    : { number: null, text: question.trim() };
}

const FAQSection = ({ projectData  , showEdit}) => {
  // State for expanded/collapsed
  const [expandedIndex, setExpandedIndex] = useState(null);
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  // State for faqs
  const [faqs, setFaqs] = useState([]);

  // Prepare faqs on mount or when projectData changes
  useEffect(() => {
    let sortedFaqs = projectData?.faqs
      ?.map((faq) => ({ ...faq, ...cleanQuestion(faq.question) }))
      ?.sort((a, b) => (a.number ?? Infinity) - (b.number ?? Infinity));
    let initialFaqs =
      Array.isArray(sortedFaqs) && sortedFaqs.some(isValidFaq)
        ? sortedFaqs
        : defaultFaqs.map((faq) => ({
            question: injectProjectData(faq.question, projectData),
            answer: injectProjectData(faq.answer, projectData),
          }));
    setFaqs(initialFaqs);
  }, [projectData]);

  // For editing
  const [editFaqs, setEditFaqs] = useState([]);
  useEffect(() => {
    if (isEditing) {
      setEditFaqs(faqs);
    }
  }, [isEditing, faqs]);

  const handleFaqChange = (index, field, value) => {
    setEditFaqs((prev) =>
      prev.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    );
  };

  const handleSave = () => {
    setFaqs(editFaqs);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFaqs(faqs);
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
          {showEdit && (
          <span style={{ cursor: "pointer", marginLeft: "12px" }}>
            {isEditing ? (
              <>
                <button
                  className="btn btn-success btn-sm"
                  style={{
                    backgroundColor: "white",
                    marginRight: "10px",
                    color: "#2067d1",
                    fontWeight: "bold",
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#6c757d",
                    width:"auto"
                  }}
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
          )}
        </div>
        <div className="px-3">
          {(isEditing ? editFaqs : faqs)?.map((faq, index) => (
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
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      transition: "transform 0.2s",
                      transform: expandedIndex === index ? "rotate(90deg)" : "rotate(0deg)",
                      fontSize: "18px",
                      marginRight: isEditing ? "8px" : 0,
                      color: "#2067d1",
                      userSelect: "none"
                    }}
                  >
                    {/* Chevron Right SVG */}
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M8 6l4 4-4 4" stroke="#2067d1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {isEditing && (
                     <img
                      src="/images/delete1.png" // adjust the path as needed
                      alt="Delete FAQ"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveFaq(index);
                      }}
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                        marginLeft: "8px", // like `ms-2` Bootstrap spacing
                      }}
                    />
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
            <div className="mb-3 text-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddFaq}
                style={{width:"auto"}}
              >
                <i className="fa fa-plus me-1"></i> Add FAQ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;