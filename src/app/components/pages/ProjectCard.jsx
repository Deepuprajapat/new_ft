// ProjectCard.js
import React from "react";
// import { useNavigate } from "react-router-dom";
import "../styles/css/home.css"; // Link to the updated CSS file

const ProjectCard = ({ project }) => {
  const defaultImage = "http://localhost:3000/img/building_soon.jpg"; // Placeholder image
  // const navigate = useNavigate();
  const handleMoreDetails = (url) => {
    window.open(
      `/${url.toLowerCase().replace(/\s+/g, "-")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Extract floorplan sizes
  const floorplanSizes =
    project.floorplans?.map((floorplan) => floorplan.size) || [];
  const minSize = floorplanSizes.length ? Math.min(...floorplanSizes) : null;
  const maxSize = floorplanSizes.length ? Math.max(...floorplanSizes) : null;

  const validPrices = project.floorplans
    ?.filter((floorplan) => floorplan.price && floorplan.price > 1.5) // Exclude falsy values (0, "", null) and <= 1.5
    .map((floorplan) => floorplan.price);

  const minPrice = validPrices?.length ? Math.min(...validPrices) : null;

  return (
    <div className="card-im">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
      >
       
       {project.isPremium && <span className="premium-tag">Premium</span>}
        <img
          alt={project.name}
          src={(project.images && project.images[2]?.imageUrl) || defaultImage}
          loading="lazy"
          className="project-card-image"
        />
       
        <p className="project-card-title">{project.name}</p>
      </a>
      <p className="project-card-location">
        <i className="fas fa-map-marker-alt"></i>{" "}
        {project.shortAddress}
      </p>
      <p className="project-card-details">
        <span>
          <i className="fas fa-ruler-combined"></i>{" "}
          <span>
            {minSize && maxSize
              ? `${minSize} To ${maxSize} Sq.ft.`
              : "Size Info"}
          </span>
        </span>
        <span>
          <i className="fa fa-bed" aria-hidden="true"></i>{" "}
          <span>
            {Array.isArray(project.configurations) &&
            project.configurations.length > 0
              ? (() => {
                  // Separate BHK configurations
                  const bhkConfigs = project.configurations
                    .filter((config) => /\d+BHK/.test(config)) // Match numeric BHK configurations
                    .map((config) => parseFloat(config)) // Extract numeric part (e.g., 2 from 2BHK)
                    .filter((num) => !isNaN(num)); // Ensure valid numbers only

                  // Find unique configurations
                  const otherConfigs = project.configurations.filter(
                    (config) => !/\d+BHK/.test(config) // Exclude BHK configurations
                  );

                  // Prepare BHK output
                  let bhkOutput = null;
                  if (bhkConfigs.length > 0) {
                    const minBHK = Math.min(...bhkConfigs);
                    const maxBHK = Math.max(...bhkConfigs);
                    bhkOutput =
                      minBHK === maxBHK
                        ? `${minBHK}BHK`
                        : `${minBHK}BHK, ${maxBHK}BHK`;
                  }

                  // Prepare other configurations output
                  const otherOutput =
                    otherConfigs.length > 1
                      ? `${otherConfigs[0]}, ${
                          otherConfigs[otherConfigs.length - 1]
                        }`
                      : otherConfigs[0] || null;

                  // Combine outputs
                  const combinedOutput = [bhkOutput, otherOutput]
                    .filter(Boolean)
                    .join(", ");

                  return combinedOutput || "Property Type"; // Fallback if no configurations exist
                })()
              : "Property Type"}
          </span>
        </span>
      </p>
      <div className="project-card-footer">
        <p className="project-card-price">
          Start from{" "}
          <b>
            ₹
            {minPrice
              ? minPrice >= 10000000
                ? parseFloat((minPrice / 10000000).toFixed(2)) + " Cr"
                : parseFloat((minPrice / 100000).toFixed(2)) + " Lakh"
              : " "}
          </b>
        </p>

        <button
          onClick={() => handleMoreDetails(project.url)}
          className="project-card-details-btn"
        >
          more details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
