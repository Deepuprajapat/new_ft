// ProjectCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/css/home.css"; // Link to the updated CSS file

const ProjectCard = ({ project }) => {
  const defaultImage = "http://localhost:3000/img/building_soon.jpg"; // Placeholder image
  const navigate = useNavigate();
  const handleMoreDetails = (url) => {
    // console.log("tetsing url"+ this.project.name);
    // Open the project details in a new tab
    window.open(
      `/project/${url.toLowerCase().replace(/\s+/g, "-")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Extract floorplan sizes
  const floorplanSizes = project.floorplans?.map((floorplan) => floorplan.size) || [];
  const minSize = floorplanSizes.length ? Math.min(...floorplanSizes) : null;
  const maxSize = floorplanSizes.length ? Math.max(...floorplanSizes) : null;

  // Find the minimum price
  const minPrice = project.floorplans?.length
  ? Math.min(...project.floorplans.map((floorplan) => floorplan.price))
  : null;

  return (
    <div className="card-im">
      <a href={"project/"+project.url} target="_blank" rel="noopener noreferrer">
        <img
          alt={project.name}
          src={(project.images && project.images[0]?.imageUrl) || defaultImage}
          className="project-card-image"
        />
        <p className="project-card-title">{project.name}</p>
      </a>
      <p className="project-card-location">
        <i className="fas fa-map-marker-alt"></i>{" "}
        {`${project.locality.name} ${project.locality.city.name}`}
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
              ? project.configurations.join(", ") // Join configurations with commas
              : "Property Type"}{" "}
            {/* Fallback text when configurations are empty or not an array */}
          </span>
        </span>
      </p>
      <div className="project-card-footer">
      <p className="project-card-price">
          Start from{" "}
          <b>
            ₹
            {minPrice >= 10000000
              ? (minPrice / 10000000).toFixed(2) + " Cr"
              : (minPrice / 100000).toFixed(2) + " L"}
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
