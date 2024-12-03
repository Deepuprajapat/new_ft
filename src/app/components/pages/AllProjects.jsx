import React, { useEffect, useState } from "react";
import "../styles/css/projectCard.css";
import { getAllProject } from "../../apis/api";
import { useNavigate } from "react-router-dom";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleMoreDetails = (name) => {
    navigate(`/project/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  // Fetch projects from the API when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProject();
        console.log("Fetched Projects:", data);
        setProjects(data.content);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1 className="project-title">All Projects</h1>
          <p>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="styled-link"
            >
              Home
            </a>
            / All Projects
          </p>
          <h2>Best Residential And Commercial Projects</h2>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="listing-home listing-page">
              {loading ? (
                <p>Loading projects...</p>
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <div key={index} className="card-im">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={project?.coverPhoto}
                        alt={project?.name}
                        className="img-fluid"
                        fetchpriority="high"
                      />

                      <p className="list_headline_two">{project?.name}</p>
                    </a>

                    <p className="location_im">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {`${project?.locality?.name} ${project?.locality?.city?.name}`}
                    </p>
                    <p className="details">
                      <span>
                        <i className="fas fa-ruler-combined"></i>{" "}
                        {project?.minSize && project?.maxSize
                          ? `${project?.minSize} To ${project?.maxSize} Sq.ft.`
                          : "Size Info"}
                      </span>

                      <span>
                        <i className="fa fa-bed" aria-hidden="true"></i>{" "}
                        {Array.isArray(project.configuration)
                          ? project.configuration.join(", ")
                          : project.configuration || "Property Type"}
                      </span>
                    </p>
                    <div className="list-footer">
                      <p className="price">
                        Start from{" "}
                        <b>
                          ₹
                          {project.minPrice >= 10000000
                            ? (project.minPrice / 10000000).toFixed(2) + "Cr"
                            : (project.minPrice / 100000).toFixed(2) + "L"}
                        </b>
                      </p>
                      {/* <a
                        href={project.url}
                        target="_blank"
                        className="theme-btn"
                        rel="noopener noreferrer"
                      >
                        more details
                      </a> */}
                      <button
                        onClick={() => handleMoreDetails(project.name)}
                        className="project-card-details-btn"
                      >
                        more details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProjects;
