// ProjectCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/css/home.css"; // Link to the updated CSS file

const ProjectCard = ({ project }) => {
  console.log("ProjectCard", project);

  const defaultImage = "http://localhost:3000/img/building_soon.jpg"; // Placeholder image
  const navigate = useNavigate();

  
  const handleMoreDetails = (url, projectId) => {
    console.log(url, projectId, "yyyy");
    const stateData = { projectId };
    
    // Fix: Stringify the object before storing
    console.log("Storing in sessionStorage:", stateData);
    sessionStorage.setItem('projectState', JSON.stringify(stateData));
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.location.href = url;
    }
};

  const sizeRange = project.sizes?.match(/\d+/g); // Extract all numbers from the string
  console.log(project.slug,"canonical URL");

  const minSize = sizeRange && sizeRange.length ? parseInt(sizeRange[0]) : null;
  const maxSize = sizeRange && sizeRange.length > 1 ? parseInt(sizeRange[1]) : minSize;


  const validPrices = project.floorplans
    ?.filter((floorplan) => floorplan.price && floorplan.price > 1.5) 
    .map((floorplan) => floorplan.price);

  const minPrice = validPrices?.length ? Math.min(...validPrices) : null;

  return (
    <div className="card-im w-100">
      <div
        onClick={() => handleMoreDetails(project.slug, project.project_id)}
        style={{ cursor: "pointer" }}
      >
        {project.is_premium && <span className="premium-tag">Premium</span>}
        <img
          alt={project.name}
          src={(project.images && project.images[2]) || defaultImage}
          loading="lazy"
          className="project-card-image"
        />
        <p className="project-card-title">{project.project_name}</p>
      </div>
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
                const otherOutput =
                  otherConfigs.length > 1
                    ? `${otherConfigs[0]}, ${otherConfigs[otherConfigs.length - 1]}`
                    : otherConfigs[0] || null;

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
          className="project-card-details-btn btn btn-primary btn-sm w-100"
          style={{
            fontSize: "12px",
            padding: "8px 12px",
            borderRadius: "6px"
          }}
        >
          more details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
