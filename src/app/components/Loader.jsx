import React from "react";

export default function Loader({ isFullScreen = true }) {
  const loaderStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: isFullScreen ? "100vh" : "100%",
    position: isFullScreen ? "fixed" : "relative",
    top: isFullScreen ? 0 : "auto",
    left: isFullScreen ? 0 : "auto",
    backgroundColor: isFullScreen ? "rgba(255, 255, 255, 0.8)" : "transparent",
    zIndex: isFullScreen ? 9999 : "auto",
  };

  const imgStyles = {
    width: "100px",
    height: "100px",
  };

  return (
    <div style={loaderStyles}>
      <img
        alt="loader"
        src="/images/loading-load.gif"
        loading="lazy"
        style={{
          ...imgStyles,
          "@media (max-width: 1024px)": { width: "80px", height: "80px" }, // Tablet
          "@media (max-width: 768px)": { width: "70px", height: "70px" }, // Mobile
        }}
      />
    </div>
  );
}
