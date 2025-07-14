import React, { useState, useEffect } from "react";

const VideoSection = ({ property, onSave ,showEdit}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Extract video ID from full URL or return raw ID
  const extractVideoId = (url) => {
    if (!url || url.trim() === '') return "";
    
    // If it's already a valid embed URL, extract the ID
    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }
    
    // If it's a full URL, extract the ID
    if (url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes("youtu.be")) {
          return urlObj.pathname.slice(1).split('?')[0];
        }
        if (urlObj.hostname.includes("youtube.com")) {
          if (urlObj.searchParams.get("v")) {
            return urlObj.searchParams.get("v");
          }
          // Handle youtube.com/watch URLs
          if (url.includes('youtube.com/watch?v=')) {
            return url.split('v=')[1].split('&')[0];
          }
        }
      } catch (error) {
        console.warn('Error parsing video URL:', error);
      }
    }
    
    // Assume it's already a video ID if it's not a URL
    return url;
  };

  // Prefer web_cards.video_presentation if present
  const videoPresentation = property?.web_cards?.video_presentation || property?.video_presentation || {};
  const videoParaInit = property?.web_cards?.video_presentation?.description || property?.videoPara || videoPresentation.title || "";
console.log("Video presentation data:", videoPresentation);
console.log("Video para init:", videoParaInit);
  let videoUrlsInit = [];

// Use only the urls array from web_cards.video_presentation
if (Array.isArray(videoPresentation.urls) && videoPresentation.urls.length > 0) {
  videoUrlsInit = videoPresentation.urls.filter(url => url && url.trim() !== "");
} else if (property?.propertyVideo?.length > 0) {
  // Fallback to propertyVideo if urls array is not available
  videoUrlsInit = property.propertyVideo.filter(url => url && url.trim() !== "");
}

// Ensure we always have at least one empty string for editing
if (videoUrlsInit.length === 0) videoUrlsInit = [""];

console.log("Video URLs init:", videoUrlsInit);
console.log("Filtered videos:", videoUrlsInit.filter(v => v.trim() !== ""));

  const [videoPara, setVideoPara] = useState(videoParaInit);
  const [videos, setVideos] = useState(videoUrlsInit);

  useEffect(() => {
    setVideoPara(videoParaInit);
    setVideos(videoUrlsInit);
  }, [property]);

  const handleSave = () => {
    // Create updated property with consistent web_cards.video_presentation structure
    const updatedProperty = {
      ...property,
      web_cards: {
        ...(property.web_cards || {}),
        video_presentation: {
          description: videoPara,
          urls: videos.filter(v => v.trim() !== ""),
          // Keep title if it exists, otherwise don't include it
          ...(videoPresentation.title && { title: videoPresentation.title })
        },
      },
    };
    
    if (onSave) {
      onSave(updatedProperty);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setVideoPara(videoParaInit);
    setVideos(videoUrlsInit);
  };

  const handleVideoChange = (index, value) => {
    setVideos(prev => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleRemoveVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    setVideos(prev => [...prev, ""]);
  };

  return (
    <div className="mb-4" id="video" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Video Presentation 
          {/* {showEdit && (
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isEditing ? (
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
                  onClick={handleSave}
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
                onClick={() => setIsEditing(true)}
              />
            )}
          </span>
)} */}
        </h4>
        <div className="px-3">
          {isEditing ? (
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
              {videos.map((videoUrl, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <input
                    type="text"
                    className="form-control mb-0"
                    value={videoUrl}
                    onChange={e => handleVideoChange(index, e.target.value)}
                    placeholder="Enter YouTube video link or ID"
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
                    onClick={() => handleRemoveVideo(index)}
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
              ))}
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={handleAddVideo}
                style={{ fontSize: "13px", padding: "4px 12px" }}
              >
                + Add Video
              </button>
              {videos.filter(v => v.trim() !== "").map((videoUrl, index) => (
                <div key={index} className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(videoUrl)}?rel=0&modestbranding=1&origin=${window.location.origin}`}
                    title={`${property?.propertyName} Video Presentation ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: "none",
                      borderRadius: "8px",
                    }}
                  ></iframe>
                </div>
              ))}
            </>
          ) : (
            <>
              {(videoPara || videoPresentation.description || videoPresentation.title) && (
                <div
                  style={{
                    fontSize: window.innerWidth <= 768 ? "13px" : "15px",
                    color: "#333",
                    fontWeight: 500,
                    marginBottom: "12px"
                  }}
                >
                  {videoPara || videoPresentation.description || videoPresentation.title}
                </div>
              )}
              <div className="d-flex flex-column">
                {(() => {
                  const validVideos = videos.filter(v => v.trim() !== "");
                  console.log("Valid videos for display:", validVideos);
                  console.log("Video URLs length:", validVideos.length);
                  
                  return validVideos.length > 0 ? (
                    validVideos.map((videoUrl, index) => {
                      const videoId = extractVideoId(videoUrl);
                      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${window.location.origin}`;
                      console.log(`Video ${index + 1}:`, { videoUrl, videoId, embedUrl });
                      
                      return videoId ? (
                        <div key={index} className="ratio ratio-16x9 mb-3">
                          <iframe
                            src={embedUrl}
                            title={`${property?.propertyName || property?.name} Video Presentation ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              border: "none",
                              borderRadius: "8px",
                            }}
                          ></iframe>
                        </div>
                      ) : null;
                    })
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
                    >
                      {/* No Videos Available */}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
