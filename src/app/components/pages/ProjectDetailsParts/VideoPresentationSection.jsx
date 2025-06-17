import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const VideoPresentationSection = ({
  projectData,
  isVideoEditing,
  setIsVideoEditing,
  editableVideos,
  updateVideoUrl,
  removeVideo,
  addNewVideo,
  saveVideoChanges,
  showEdit,
}) => {
  // Always keep videoPara in sync with API/projectData when not editing
  const [videoPara, setVideoPara] = useState(projectData?.videoPara || '');
 const handleCancel = () => setIsVideoEditing(false);
  useEffect(() => {
    if (!isVideoEditing) {
      setVideoPara(projectData?.videoPara || '');
    }
  }, [isVideoEditing, projectData?.videoPara]);

  return (
    <div
      className="mb-4"
      id="video"
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
          Video Presentation of {projectData?.name}
          {showEdit && (
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isVideoEditing ? (
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
                onClick={saveVideoChanges}
              >
                Save
              </button>
               <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      marginLeft: 8,
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
                onClick={() => setIsVideoEditing(true)}
              />
            )}
          </span>
          )}
        </h2>
        <div className="px-3">
          {/* Show video description from API if available */}
          {projectData?.web_cards?.video_presentation?.description && (
            <div
              style={{
                fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                color: "#333",
                fontWeight: 500,
                marginBottom: "12px"
              }}
            >
              {projectData.web_cards.video_presentation.description}
            </div>
          )}
          <div className="mb-3 mb-md-5">
            {isVideoEditing ? (
              <textarea
                className="form-control"
                value={videoPara}
                onChange={e => setVideoPara(e.target.value)}
                rows={3}
                style={{
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  background: "#f8faff",
                  borderRadius: "4px",
                  padding: "8px",
                  minHeight: "40px",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  background: "transparent",
                  borderRadius: "4px",
                  minHeight: "40px",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(projectData?.videoPara),
                }}
              />
            )}
          </div>
          <div className="d-flex flex-column">
            {isVideoEditing ? (
              <>
                {editableVideos.map((videoUrl, index) => (
                  <div key={index} className="mb-3">
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
                        value={videoUrl}
                        onChange={(e) => updateVideoUrl(index, e.target.value)}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          flex: 1,
                          background: "#f8faff",
                          marginRight: "8px",
                        }}
                      />
                      <button
                        onClick={() => removeVideo(index)}
                        style={{
                          border: "none",
                          background: "#dc3545",
                          color: "white",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          fontSize: "12px",
                          cursor: "pointer",
                          width:"auto"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    {videoUrl.trim() !== "" && (
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1&origin=${window.location.origin}`}
                          title={`${projectData?.name} Video Presentation ${index + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            border: "none",
                            borderRadius: "8px",
                          }}
                        ></iframe>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  {/* <button
                    onClick={addNewVideo}
                    style={{
                      border: "1px solid #2067d1",
                      background: "#f8faff",
                      color: "#2067d1",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      marginRight: "8px",
                      width:"auto"
                    }}
                  >
                    + Add Video
                  </button> */}
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "#666" }}>
                    <strong>How to get YouTube video ID:</strong>
                    <br />
                    From URL: https://www.youtube.com/watch?v=
                    <strong>dQw4w9WgXcQ</strong>
                    <br />
                    Use only the ID part: <strong>dQw4w9WgXcQ</strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                {projectData?.videos &&
                projectData.videos.length > 0 &&
                projectData.videos.some((videoUrl) => videoUrl.trim() !== "") ? (
                  projectData.videos.map(
                    (videoUrl, index) =>
                      videoUrl.trim() !== "" && (
                        <div key={index} className="ratio ratio-16x9 mb-3">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1&origin=${window.location.origin}`}
                            title={`${projectData?.name} Video Presentation ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              border: "none",
                              borderRadius: "8px",
                            }}
                          ></iframe>
                        </div>
                      )
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      backgroundImage: "url('/images/investmango-youtube-banner.webp')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#f0f0f0",
                    }}
                  ></div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPresentationSection;