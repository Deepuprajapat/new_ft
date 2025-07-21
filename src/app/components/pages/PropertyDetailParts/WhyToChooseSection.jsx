import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const WhyToChooseSection = ({ property, onSave ,showEdit}) => {
  const [editMode, setEditMode] = useState(false);
  // Support new structure: property.web_cards.why_to_choose.usp_list and image_urls
  const uspList = property?.web_cards?.why_to_choose?.usp_list || [];
  const imageUrls = property?.web_cards?.why_to_choose?.image_urls || [];
  const [editableUsp, setEditableUsp] = useState([...uspList]);

  // Sync editableUsp with uspList when property changes
  useEffect(() => {
    if (JSON.stringify(editableUsp) !== JSON.stringify(uspList)) {
      setEditableUsp([...uspList]);
    }
    // eslint-disable-next-line
  }, [uspList]);

  const handleUspChange = (idx, value) => {
    setEditableUsp((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleSave = () => {
    setEditMode(false);
    if (onSave) {
      onSave({
        ...property,
        web_cards: {
          ...property.web_cards,
          why_to_choose: {
            image_urls: imageUrls,
            usp_list: editableUsp,
          },
        },
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableUsp([...uspList]);
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
              {showEdit && (
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
                )}
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
                    {/* First row with single image */}
                    {imageUrls[0] && (
                      <div className="col-12 mb-1">
                        <a
                          href={imageUrls[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          <img
                            alt={"Project Image 1"}
                            src={imageUrls[0]}
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
                      : uspList.map((usp, idx) => (
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