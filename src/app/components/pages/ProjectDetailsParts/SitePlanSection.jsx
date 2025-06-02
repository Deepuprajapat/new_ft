import React from "react";

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
}) => (
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
      <span style={{ cursor: "pointer", marginLeft: "12px" }}>
        {isSitePlanEditing ? (
          <img
            src="/images/update.svg"
            alt="Save"
            style={{ width: "22px", height: "22px" }}
            onClick={() => setIsSitePlanEditing(false)}
          />
        ) : (
          <img
            src="/images/edit-icon.svg"
            alt="Edit"
            style={{ width: "18px", height: "18px" }}
            onClick={() => setIsSitePlanEditing(true)}
          />
        )}
      </span>
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
          onInput={e => setSiteplanParaHtml(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{
            __html: isSitePlanEditing ? siteplanParaHtml : (projectData?.siteplanPara || "")
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
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {isSitePlanEditing ? (
                <input
                  type="text"
                  className="form-control mb-2"
                  value={siteplanImgUrl}
                  onChange={e => setSiteplanImgUrl(e.target.value)}
                  placeholder="Enter Site Plan Image URL"
                />
              ) : null}
              <img
                className="img-fluid"
                id="zoom-image"
                alt={`${projectData?.name} Site Plan`}
                src={isSitePlanEditing ? siteplanImgUrl : imageSrc}
                loading="lazy"
                fetchpriority="high"
                style={{
                  transform: "scale(1) translate(0px, 0px)",
                  transition: "transform 0.3s ease-in-out",
                  position: "absolute",
                  maxWidth: "100%",
                  cursor: "grab",
                }}
                onClick={openModal}
                onMouseDown={(e) => {
                  const img = e.target;
                  img.style.cursor = "grabbing";
                  let lastX = e.clientX;
                  let lastY = e.clientY;

                  const onMouseMove = (moveEvent) => {
                    const deltaX = moveEvent.clientX - lastX;
                    const deltaY = moveEvent.clientY - lastY;
                    lastX = moveEvent.clientX;
                    lastY = moveEvent.clientY;

                    const transform = img.style.transform;
                    const scale = parseFloat(
                      transform.match(/scale\((.*?)\)/)[1]
                    );
                    const [translateX, translateY] = transform
                      .match(/translate\((.*?), (.*?)\)/)
                      ?.slice(1)
                      .map(parseFloat) || [0, 0];

                    if (scale > 1) {
                      img.style.transform = `scale(${scale}) translate(${
                        translateX + deltaX
                      }px, ${translateY + deltaY}px)`;
                    }
                  };

                  const onMouseUp = () => {
                    img.style.cursor = "grab";
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
              />
            </div>
          </div>
          <div className="position-absolute top-0 end-0">
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
                img.style.transform = `scale(${Math.min(
                  3,
                  currentScale * 1.2
                )}) translate(${translateX}px, ${translateY}px)`;
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
            src={isSitePlanEditing ? siteplanImgUrl : imageSrc}
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

export default SitePlanSection;