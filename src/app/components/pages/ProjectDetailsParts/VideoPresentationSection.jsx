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
  showEdit,
  handleSave,
}) => {
  const [videoPara, setVideoPara] = useState(projectData?.web_cards?.video_presentation?.description || projectData?.videoPara || '');
  
  const getVideoUrlFromData = (data) => {
    const videoPresentation = data?.web_cards?.video_presentation;
    if (videoPresentation?.url) {
      return videoPresentation.url;
    }
    if (videoPresentation?.urls && Array.isArray(videoPresentation.urls) && videoPresentation.urls.length > 0) {
      return videoPresentation.urls[0];
    }
    return '';
  };

  const [videoUrl, setVideoUrl] = useState(getVideoUrlFromData(projectData));
  
  const handleCancel = () => setIsVideoEditing(false);

  useEffect(() => {
    if (!isVideoEditing) {
      setVideoPara(projectData?.web_cards?.video_presentation?.description || projectData?.videoPara || '');
      setVideoUrl(getVideoUrlFromData(projectData));
    }
  }, [isVideoEditing, projectData?.web_cards?.video_presentation?.description, projectData?.videoPara, projectData?.web_cards?.video_presentation?.url, projectData?.web_cards?.video_presentation?.urls]);

  const handleSaveChanges = () => {
    const updatedData = {
      ...projectData,
      videoPara: videoPara,
      web_cards: {
        ...(projectData.web_cards || {}),
        video_presentation: {
          ...(projectData.web_cards?.video_presentation || {}),
          description: videoPara,
          url: videoUrl,
          urls: videoUrl ? [videoUrl] : [],
        },
      },
    };
    handleSave(updatedData);
    setIsVideoEditing(false);
  };

  const videoPresentationUrl = getVideoUrlFromData(projectData);

  const getEmbedUrl = (urlOrId) => {
    if (!urlOrId || urlOrId.trim() === '') return '';
    
    if (urlOrId.startsWith('http')) {
      return urlOrId;
    }
    
    let videoId = urlOrId;
    
    if (urlOrId.includes('youtube.com/watch?v=')) {
      videoId = urlOrId.split('v=')[1].split('&')[0];
    }
    else if (urlOrId.includes('youtu.be/')) {
      videoId = urlOrId.split('youtu.be/')[1].split('?')[0];
    }
    else if (urlOrId.includes('youtube.com/embed/')) {
      videoId = urlOrId.split('embed/')[1].split('?')[0];
    }
    
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${window.location.origin}`;
  };

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
                onClick={handleSaveChanges}
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
          {isVideoEditing ? (
            <>
              <textarea
                className="form-control mb-3"
                value={videoPara}
                onChange={e => setVideoPara(e.target.value)}
                rows={3}
                style={{
                  fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                  color: "#333",
                  fontWeight: 500,
                  marginBottom: "12px",
                  background: "#f8faff",
                  borderRadius: "4px",
                  padding: "8px",
                  minHeight: "40px",
                }}
                placeholder="Enter video description..."
              />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-control mb-0"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video link or ID (e.g., jFTncG2IZxY)"
                  style={{
                    fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                    color: "#333",
                    fontWeight: 500,
                    background: "#f8faff",
                    borderRadius: "4px",
                    padding: "8px",
                    minHeight: "40px",
                    display: 'inline-block',
                    width: 'calc(100% - 90px)',
                    marginRight: '8px',
                  }}
                />
                <button
                  onClick={() => setVideoUrl('')}
                  style={{
                    border: "none",
                    background: "#dc3545",
                    color: "white",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    width: "70px",
                    verticalAlign: 'top',
                  }}
                >
                  Remove
                </button>
              </div>
              {videoUrl.trim() !== '' && (
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={getEmbedUrl(videoUrl)}
                    title={`${projectData?.name} Video Presentation`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: "none",
                      borderRadius: "8px",
                    }}
                  ></iframe>
                </div>
              )}
            </>
          ) : (
            <>
              {projectData?.web_cards?.video_presentation?.description && (
                <div
                  style={{
                    fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                    color: "#333",
                    fontWeight: 500,
                    marginBottom: "12px"
                  }}
                  >
                  {DOMPurify.sanitize(projectData.web_cards.video_presentation.description, {ALLOWED_TAGS: []})}
                </div>
              )}
              {videoPresentationUrl && videoPresentationUrl.trim() !== '' ? (
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={getEmbedUrl(videoPresentationUrl)}
                    title={`${projectData?.name} Video Presentation`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: "none",
                      borderRadius: "8px",
                    }}
                  ></iframe>
                </div>
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
  );
};

export default VideoPresentationSection;