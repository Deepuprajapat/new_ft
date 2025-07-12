// ProjectCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/css/home.css"; // Link to the updated CSS file

const ProjectCard = ({ project }) => {
  console.log("ProjectCard", project);

  const defaultImage = "http://localhost:3000/img/building_soon.jpg"; // Placeholder image
  const navigate = useNavigate();
  // Navigate to the project URL and pass projectId in state, so only the URL is shown in the address bar
  const handleMoreDetails = (url, projectId) => {
    console.log(url,projectId, "yyyy")
    const cleanUrl = `/${url.toLowerCase().replace(/\s+/g, "-")}`;
    navigate(cleanUrl, { state: { projectId } });
  };

  // Extract floorplan sizes
  // const floorplanSizes =
  //   project.floorplans?.map((floorplan) => floorplan.size) || [];
  // const minSize = floorplanSizes.length ? Math.min(...floorplanSizes) : null;
  // const maxSize = floorplanSizes.length ? Math.max(...floorplanSizes) : null;

  const sizeRange = project.sizes?.match(/\d+/g); // Extract all numbers from the string
  console.log(project.canonical,"canonical URL");

  const minSize = sizeRange && sizeRange.length ? parseInt(sizeRange[0]) : null;
  const maxSize = sizeRange && sizeRange.length > 1 ? parseInt(sizeRange[1]) : minSize;


  const validPrices = project.floorplans
    ?.filter((floorplan) => floorplan.price && floorplan.price > 1.5) // Exclude falsy values (0, "", null) and <= 1.5
    .map((floorplan) => floorplan.price);

  const minPrice = validPrices?.length ? Math.min(...validPrices) : null;

  return (
    <div className="card-im">
      <a
        href={project.canonical}
        target="_blank"
        rel="noopener noreferrer"
      >

        {project.is_premium && <span className="premium-tag">Premium</span>}
        <img
          alt={project.name}
          src={(project.images && project.images[2]) || defaultImage}
          loading="lazy"
          className="project-card-image"
        />

        <p className="project-card-title">{project.project_name}</p>
      </a>
      <p className="project-card-location">
        <i className="fas fa-map-marker-alt"></i>{" "}
        {project.short_address}
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
            {project.configuration
              ? (() => {
                let configArray = [];

                // Parse the string into an array
                try {
                  configArray = JSON.parse(project.configuration);
                } catch (err) {
                  console.error("Invalid configuration format:", project.configuration);
                }

                if (!Array.isArray(configArray) || configArray.length === 0) {
                  return "Property Type";
                }

                // Separate BHK configurations
                const bhkConfigs = configArray
                  .filter((config) => /\d+BHK/.test(config)) // Match BHKs
                  .map((config) => parseFloat(config)) // Extract the number
                  .filter((num) => !isNaN(num));

                const otherConfigs = configArray.filter(
                  (config) => !/\d+BHK/.test(config)
                );

                // Prepare BHK output
                let bhkOutput = null;
                if (bhkConfigs.length > 0) {
                  const minBHK = Math.min(...bhkConfigs);
                  const maxBHK = Math.max(...bhkConfigs);
                  bhkOutput =
                    minBHK === maxBHK ? `${minBHK}BHK` : `${minBHK}BHK, ${maxBHK}BHK`;
                }

                // Prepare other configurations output
                const otherOutput =
                  otherConfigs.length > 1
                    ? `${otherConfigs[0]}, ${otherConfigs[otherConfigs.length - 1]}`
                    : otherConfigs[0] || null;

                // Combine outputs
                const combinedOutput = [bhkOutput, otherOutput]
                  .filter(Boolean)
                  .join(", ");

                return combinedOutput || "Property Type";
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
            {project.min_price && project.min_price > 0
              ? project.min_price >= 10000000
                ? parseFloat((project.min_price / 10000000).toFixed(2)) + " Cr"
                : parseFloat((project.min_price / 100000).toFixed(2)) + " Lakh"
              : " "}
          </b>
        </p>
        <button
          onClick={() => handleMoreDetails(project.canonical, project.project_id)}
          className="project-card-details-btn"
        >
          more details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
