import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const WhyToChooseSection = ({ property, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  let whyChoose = property?.web_cards?.why_choose_us || property?.why_choose_us;
  if (!whyChoose) {
    whyChoose = {
      image_urls: property?.images || [],
      usp_list: property?.usp || []
    };
  }
  const [editableUsp, setEditableUsp] = useState(whyChoose.usp_list ? [...whyChoose.usp_list] : []);

  // Keep editableUsp in sync with prop changes
  useEffect(() => {
    setEditableUsp(whyChoose.usp_list ? [...whyChoose.usp_list] : []);
  }, [whyChoose.usp_list]);

  const handleUspChange = (idx, value) => {
    setEditableUsp((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleSave = () => {
    setEditMode(false);
    if (onSave) onSave({
      ...property,
      why_choose_us: {
        ...whyChoose,
        usp_list: editableUsp
      }
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableUsp(whyChoose.usp_list ? [...whyChoose.usp_list] : []);
  };

  return (
    <div
      className="mb-4"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      id="why-choose"
    >
      <div className="">
        <div className="">
          <div className="">
            <h4
              className="mb-0 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between"
              style={{
                fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                backgroundColor: "#2067d1",
                borderRadius: "4px 4px 0 0",
                paddingRight: '16px',
                marginBottom: '18px',
              }}
            >
              <span>Why to choose {property?.propertyName}?</span>
              <span className="d-flex align-items-center" style={{gap: '8px'}}>
                {!editMode ? (
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="ms-2"
                    style={{ cursor: "pointer", color: "#fff", fontSize: '18px', padding: '2px 6px' }}
                    onClick={() => setEditMode(true)}
                    title="Edit"
                  />
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm me-2" style={{minWidth: '60px', padding: '2px 12px', marginRight: '6px'}} onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{minWidth: '60px', padding: '2px 12px'}} onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                )}
              </span>
            </h4>
            <div
              className="px-3"
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                padding: "20px",
              }}
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="row g-1">
                    {/* Show only the first image from why_choose_us.image_urls */}
                    {whyChoose.image_urls && whyChoose.image_urls.length > 0 && (
                      <div className="col-12 mb-1">
                        <a
                          href={whyChoose.image_urls[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          <img
                            alt="Project Image 1"
                            src={whyChoose.image_urls[0]}
                            loading="lazy"
                            className="img-fluid rounded w-100"
                            style={{
                              height: window.innerWidth <= 768 ? "200px" : "230px",
                              objectFit: "cover",
                              borderRadius: "16px",
                            }}
                            fetchpriority="high"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="row g-4"
                    style={{
                      marginTop: window.innerWidth <= 768 ? "5px" : "0",
                    }}
                  >
                    {editMode
                      ? editableUsp.map((usp, idx) => (
                          <div className="col-6" key={idx}>
                            <div className="d-flex align-items-start">
                              <img
                                className="me-2"
                                src="/images/usp-icon.svg"
                                loading="lazy"
                                style={{
                                  height: window.innerWidth <= 768 ? "24px" : "30px",
                                  marginTop: window.innerWidth <= 768 ? "2px" : "0",
                                }}
                                fetchpriority="high"
                                alt={`USP Icon ${idx + 1}`}
                              />
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={usp}
                                onChange={e => handleUspChange(idx, e.target.value)}
                                style={{ fontSize: window.innerWidth <= 768 ? "10px" : "14px" }}
                              />
                            </div>
                          </div>
                        ))
                      : whyChoose.usp_list &&
                        whyChoose.usp_list.map((usp, idx) => (
                          <div className="col-6" key={idx}>
                            <div className="d-flex align-items-start">
                              <img
                                className="me-2"
                                src="/images/usp-icon.svg"
                                loading="lazy"
                                style={{
                                  height: window.innerWidth <= 768 ? "24px" : "30px",
                                  marginTop: window.innerWidth <= 768 ? "2px" : "0",
                                }}
                                fetchpriority="high"
                                alt={`USP Icon ${idx + 1}`}
                              />
                              <span
                                style={{
                                  fontSize: window.innerWidth <= 768 ? "10px" : "14px",
                                  lineHeight: window.innerWidth <= 768 ? "1.2" : "normal",
                                }}
                              >
                                {usp}
                              </span>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyToChooseSection;