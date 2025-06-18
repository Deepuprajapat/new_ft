import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const SitePlanSection = ({
  projectData,
  isSitePlanEditing,
  setIsSitePlanEditing,
  siteplanParaHtml,
  setSiteplanParaHtml,
  siteplanImgUrl,
  setSiteplanImgUrl,
  imageSrc,
  isModalOpen,
  openModal,
  closeModal,
  showEdit,
  handleSave,
}) => {
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSiteplanImgUrl(ev.target.result); // base64 preview
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => setIsSitePlanEditing(false);

  const handleSaveChanges = () => {
    const updatedData = {
      ...projectData,
      web_cards: {
        ...projectData.web_cards,
        site_plan: {
          ...projectData.web_cards?.site_plan,
          image: siteplanImgUrl,
          html_content: siteplanParaHtml
        }
      }
    };
    handleSave(updatedData);
    setIsSitePlanEditing(false);
  };

  return (
    <div className="bg-white rounded-3 mb-4" id="siteplan">
      <h2
        className="mb-4 d-flex justify-content-between align-items-center"
        style={{
          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
          color: "#ffffff",
          fontWeight: "bold",
          textAlign: "left",
          backgroundColor: "#2067d1",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      >
        {projectData?.name} Site Plan
        {showEdit && (
          <span style={{ cursor: "pointer", marginLeft: "12px" }}>
            {isSitePlanEditing ? (
              <>
                <button
                  className="btn btn-success btn-sm"
                  style={{
                    backgroundColor: "white",
                    color: "#2067d1",
                    border: "1px solid #2067d1",
                    fontWeight: "bold",
                  }}
                  onClick={handleSaveChanges}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: "#6c757d",
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
                onClick={() => setIsSitePlanEditing(true)}
              />
            )}
          </span>
        )}
      </h2>
      <div className="row">
        <div className="col-12">
          <div
            className="mb-4 px-3"
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "14px",
              outline: isSitePlanEditing ? "1px solid #2067d1" : "none",
              background: isSitePlanEditing ? "#f8faff" : "transparent",
              borderRadius: "4px",
              padding: isSitePlanEditing ? "8px" : "0",
              minHeight: "40px",
            }}
            contentEditable={isSitePlanEditing}
            suppressContentEditableWarning={true}
            onInput={(e) => setSiteplanParaHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{
              __html: isSitePlanEditing
                ? siteplanParaHtml
                : projectData?.web_cards?.site_plan?.html_content || "",
            }}
          />
          <div className="position-relative px-3">
            <div
              className="position-relative"
              style={{
                overflow: "hidden",
                height: window.innerWidth <= 768 ? "200px" : "400px",
              }}
            >
              <div
                id="image-container"
                style={{
                    width: "100vw", // full viewport width
  
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
               <img
  className="img-fluid"
  id="zoom-image"
  alt={`${projectData?.name} Site Plan`}
  src={isSitePlanEditing ? siteplanImgUrl : projectData?.web_cards?.site_plan?.image || imageSrc}
  loading="lazy"
  fetchpriority="high"
  style={{
    width: "120%",
    height: "100%",

    transition: "transform 0.3s ease-in-out, filter 0.3s",
    // position: "absolute", // isko hata dein
    cursor: isSitePlanEditing ? "pointer" : "grab",
    zIndex: 1,
    filter: isSitePlanEditing && hovered ? "blur(4px)" : "none",
  }}
  onClick={
    isSitePlanEditing
      ? () => fileInputRef.current.click()
      : openModal
  }
/>
                {isSitePlanEditing && hovered && (
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                      padding: "15px",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <label
                      htmlFor="siteplan-image-upload"
                      style={{ margin: 0, cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={faCamera}
                        style={{
                          color: "white",
                          fontSize: "25px",
                          transition: "transform 0.3s ease",
                          transform: "scale(1.2)",
                        }}
                      />
                    </label>
                    <input
                      type="file"
                      id="siteplan-image-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className="position-absolute top-0 end-0"
              style={{
                zIndex: 3,
                margin: "10px",
              }}
            >
              <button
                className="d-block border-0 mb-1"
                id="zoom-in"
                aria-label="Zoom In"
                style={{
                  background: "#dddd",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  color: "#000",
                  zIndex: 3,
                }}
                onClick={() => {
                  const img = document.getElementById("zoom-image");
                  const match = img.style.transform.match(/scale\((.*?)\)/);
                  const currentScale = match ? parseFloat(match[1]) : 1;
                  const translateMatch = img.style.transform.match(/translate\((.*?), (.*?)\)/);
                  const [translateX, translateY] = translateMatch
                    ? translateMatch.slice(1).map(parseFloat)
                    : [0, 0];
                  img.style.transform = `scale(${Math.min(3, currentScale * 1.2)}) translate(${translateX}px, ${translateY}px)`;
                }}
              >
                +
              </button>
              <button
                className="d-block border-0"
                id="zoom-out"
                aria-label="Zoom Out"
                style={{
                  background: "#dddd",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  color: "#000",
                }}
                onClick={() => {
                  const img = document.getElementById("zoom-image");
                  const currentScale = parseFloat(
                    img.style.transform.match(/scale\((.*?)\)/)[1]
                  );
                  const [translateX, translateY] = img.style.transform
                    .match(/translate\((.*?), (.*?)\)/)
                    ?.slice(1)
                    .map(parseFloat) || [0, 0];
                  img.style.transform = `scale(${Math.max(
                    1,
                    currentScale / 1.2
                  )}) translate(${translateX}px, ${translateY}px)`;
                }}
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying the image in full view */}
      {isModalOpen && (
        <div
          className="modal d-block"
          id="siteplan-modal"
          style={{
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: "1000",
            overflow: "auto",
            paddingTop: "60px",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              margin: "auto",
              padding: "20px",
              backgroundColor: "#fff",
              maxWidth: "60%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={isSitePlanEditing ? siteplanImgUrl : projectData?.web_cards?.site_plan?.image || imageSrc}
              alt={`${projectData?.name} Site Plan`}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
            <button
              className="btn btn-close"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "70%",
                padding: "10px 10px",
              }}
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitePlanSection;
