import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/css/metaform.css";

function MetaFormSection() {
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [schema, setSchema] = useState("");
  const [canonical, setCanonical] = useState("");
  const [brochure, setBrochure] = useState(null);
  const [brochureError, setBrochureError] = useState("");

  // Prefill with your provided meta_info JSON when form opens
  useEffect(() => {
    if (showMetaForm) {
      // Replace this with dynamic data if needed
      const meta_info = {
        "title": "ACE Divino | 4 BHK Luxury Flats in Sector 1, Noida Extension",
        "description": "ACE Divino Sector 1, Noida Extension: Explore prices, floor plans, payment options, location, photos, videos, and more. Download the project brochure now!",
        "keywords": "ace divino,  ace divino noida extension,  ace divino noida,  flat at noida extension,  ace divino floor plan,  ace divino price list,  2 bhk flat in noida extension,  3 bhk flats in noida extension,  4 bhk flat in noida extension,  ace divino possession date,  ready to move flats in noida extension,  ace divino location,  ace divino latest construction update,  ace divino reviews,  ready to move flats in noida extension,  ultra luxury apartments in noida,  3 bhk flats in noida extension ready to move,  ace group,  residential apartment in noida extension,  residential apartment in noida extension,  best residential project in noida extension,  ready to move apartments",
        "canonical": "ace-divino",
        "project_schema": [
          `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "ACE Divino",
  "image": "https://image.investmango.com/images/img/ace-divino/ace-divino-greater-noida-west.webp",
  "description": "ACE Divino Sector 1, Noida Extension: Explore prices, floor plans, payment options, location, photos, videos, and more. Download the project brochure now!",
  "brand": {
    "@type": "Brand",
    "name": "Ace Group of India"
  },
  "offers": {
    "@type": "AggregateOffer",
    "url": "https://www.investmango.com/ace-divino",
    "priceCurrency": "INR",
    "lowPrice": "18800000",
    "highPrice": "22500000"
  }
}
</script>`
        ]
      };
      setMetaTitle(meta_info.title || "");
      setMetaDescription(meta_info.description || "");
      setMetaKeywords(meta_info.keywords ? meta_info.keywords.split(",").map(k => k.trim()).filter(Boolean) : []);
      setKeywordInput(meta_info.keywords || "");
      setSchema(Array.isArray(meta_info.project_schema) ? meta_info.project_schema[0] : meta_info.project_schema || "");
      setCanonical(meta_info.canonical || "");
    }
  }, [showMetaForm]);

  const addKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const deleteKeyword = (index) => {
    setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
  };

  const handleBrochureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        setBrochureError("Please upload a PDF file");
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setBrochureError("File size should be less than 10MB");
        return;
      }
      setBrochureError("");
      setBrochure(file);
    }
  };

  const removeBrochure = () => {
    setBrochure(null);
    setBrochureError("");
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

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    // Preserve HTML tags by not sanitizing on input
    setter(value);
  };

  return (
    <section
      className="container"
      style={{
        width: "auto",
        marginRight: "10px",
        justifyContent: "flex-end",
        alignItems: "end",
      }}
    >
      <div className="d-flex justify-content-center justify-content-md-end my-3 w-100">
        <button
          style={{
            alignItems: 'end',
            width: '100%',
            backgroundColor: '#2067d1',
            color: 'white',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          className="btn btn-primary meta-data-btn w-100 w-md-auto"
          onClick={() => setShowMetaForm(true)}
          type="button"
        >
          Meta Data
        </button>
      </div>

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
            className="meta-form-modal p-4 bg-white rounded shadow"
            style={{
              maxWidth: 700, // Increased from 530 to 700
              width: "98%",  // Increased from 95% to 98%
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
            {/* <div className="alert alert-info py-2" style={{ fontSize: '0.9rem' }}>
              <strong>Tip:</strong> You can use HTML tags (e.g., &lt;b&gt;, &lt;i&gt;, &lt;strong&gt;, &lt;em&gt;) in these fields.
            </div> */}
            <form onSubmit={e => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Meta Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={metaTitle}
                  onChange={(e) => handleInputChange(e, setMetaTitle)}
                  placeholder="Enter meta title with HTML tags if needed"
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
                    onChange={(e) => handleInputChange(e, setMetaDescription)}
                    placeholder="Enter meta description with HTML tags if needed"
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
                      onChange={(e) => handleInputChange(e, setKeywordInput)}
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
                  Canonical
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={canonical}
                  onChange={(e) => handleInputChange(e, setCanonical)}
                  placeholder="Canonical URL or slug"
                  style={{ borderRadius: 8, fontSize: 16 }}
                />
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
                    onChange={(e) => handleInputChange(e, setSchema)}
                    placeholder="Paste schema JSON here"
                    style={{ resize: "none", fontSize: 15, background: "transparent", fontFamily: 'monospace' }}
                  ></textarea>
                </div>
              </div>

              {/* Brochure Upload Section */}
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>
                  Project Brochure (PDF)
                </label>
                <div className="border rounded p-3" style={{ borderRadius: 8 }}>
                  {brochure ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faFile} className="me-2" />
                        <span>{brochure.name}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0"
                        onClick={removeBrochure}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <label htmlFor="brochure-upload" style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faUpload} className="mb-2" size="2x" />
                        <div>Click to upload brochure</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                          PDF only, max 10MB
                        </div>
                      </label>
                      <input
                        type="file"
                        id="brochure-upload"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleBrochureUpload}
                      />
                    </div>
                  )}
                  {brochureError && (
                    <div className="text-danger mt-2" style={{ fontSize: '0.8rem' }}>
                      {brochureError}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: 8, fontWeight: 500 }}
                  disabled={!metaTitle || !metaDescription || brochureError}
                  title={!metaTitle || !metaDescription ? "Please fill required fields" : ""}
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