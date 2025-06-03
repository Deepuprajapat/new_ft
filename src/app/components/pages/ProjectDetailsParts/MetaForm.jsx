import React, { useState, useEffect } from "react";
function MetaFormSection() {
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [schema, setSchema] = useState("");

  const addKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const deleteKeyword = (index) => {
    setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (showMetaForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMetaForm]);

  return (
    <section
      className="container-fluid"
      style={{
        width: window.innerWidth <= 768 ? "90%" : "95%",
        margin: "0 auto",

      }}
    >
      <button
        className="btn btn-primary"
        onClick={() => setShowMetaForm(true)}
        style={{ margin: "20px 0" }}
      >
        Meta Data
      </button>

      {showMetaForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="p-4 bg-white rounded shadow"
            style={{
              maxWidth: 530,
              width: "95%",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(60,60,60,0.18)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0" style={{ fontWeight: 700, color: "#2d3748" }}>
                Meta Form
              </h4>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowMetaForm(false)}
                style={{ fontSize: 22 }}
              ></button>
            </div>
            <form onSubmit={e => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Meta Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder="Enter meta title"
                  style={{ borderRadius: 8, fontSize: 16 }}
                  maxLength={70}
                />
                <div className="form-text text-end" style={{ fontSize: 12 }}>
                  {metaTitle.length}/70
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Meta Description
                </label>
                <div
                  style={{
                    maxHeight: 110,
                    overflowY: "auto",
                    borderRadius: 8,
                    border: "1px solid #dee2e6",
                  }}
                >
                  <textarea
                    className="form-control border-0"
                    rows={3}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    placeholder="Enter meta description"
                    style={{ resize: "none", fontSize: 15, background: "transparent" }}
                    maxLength={160}
                  ></textarea>
                </div>
                <div className="form-text text-end" style={{ fontSize: 12 }}>
                  {metaDescription.length}/160
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Meta Keywords
                </label>
                <div className="mb-3">

                  <div
                    style={{
                      maxHeight: 110,
                      overflowY: "auto",
                      borderRadius: 8,
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <textarea
                      className="form-control border-0"
                      rows={3}
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      placeholder="Add keywords (comma separated)"
                      style={{ resize: "none", fontSize: 15, background: "transparent" }}
                      maxLength={160}
                    ></textarea>
                  </div>
                  <div className="form-text text-end" style={{ fontSize: 12 }}>
                    {keywordInput.split(",").filter(k => k.trim()).length} keywords
                  </div>
                </div>


              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Schema
                </label>
                <div
                  style={{
                    maxHeight: 110,
                    overflowY: "auto",
                    borderRadius: 8,
                    border: "1px solid #dee2e6",
                  }}
                >
                  <textarea
                    className="form-control border-0"
                    rows={3}
                    value={schema}
                    onChange={e => setSchema(e.target.value)}
                    placeholder="Paste schema JSON here"
                    style={{ resize: "none", fontSize: 15, background: "transparent" }}
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setShowMetaForm(false)}
                  style={{ borderRadius: 8, fontWeight: 500 }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: 8, fontWeight: 500 }}
                  disabled
                  title="Save functionality not implemented"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MetaFormSection;