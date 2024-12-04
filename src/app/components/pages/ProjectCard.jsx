// ProjectCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/css/home.css"; // Link to the updated CSS file


const ProjectCard = ({ project }) => {
  const defaultImage = "http://localhost:3000/img/building_soon.jpg"; // Placeholder image
  const navigate = useNavigate(); 
  const handleMoreDetails = (name) => {
    // Navigate to the project name directly (without the /projectDetails prefix)
    navigate(`/project/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };
  return (
    
    <div className="card-im">
      <a href={project.url} target="_blank" rel="noopener noreferrer">
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
          <span>{project.minSize && project.maxSize
            ? `${project.minSize} To ${project.maxSize} Sq.ft.`
            : "Size Info"}
            </span>
        </span>
        <span>
          <i className="fa fa-bed" aria-hidden="true"></i>{" "}
          <span>
          {Array.isArray(project.configuration)
            ? project.configuration.join(", ")
            : project.configuration || "Property Type"}
            </span>
        </span>
      </p>
      <div className="project-card-footer">
        <p className="project-card-price">
          Start from{" "}
          <b>
            ₹
            {project.minPrice >= 10000000
              ? (project.minPrice / 10000000).toFixed(2) + "Cr"
              : (project.minPrice / 100000).toFixed(2) + "L"}
          </b>
        </p>
        <button onClick={() => handleMoreDetails(project.name)} className="project-card-details-btn">
          more details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
