import React, { useEffect, useState } from "react";
import { getAllProject } from "../../apis/api"; // Ensure correct import path
import ProjectCard from "./ProjectCard"; // Import ProjectCard component

const FeaturedProperties = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await getAllProject({ });
        // const filteredProjects = response.content?.filter(project => project.isFeatured && project.isPremium) || [];
        const filteredProjects =
        response.filter(
          (project) => project.is_priority || project.is_premium
        ) || [];
        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching featured and premium projects:", error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);
  


  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Featured Properties</h1>
          <p>
            <a href="/" className="styled-link">
              Home
            </a>{" "}
            / Featured Properties
          </p>
          <h2 style={{ textAlign: "center" }}>Best Premium Properties</h2>
        </div>
        <div className="main-con">
          <div className="container">
            <div className="listing-home listing-page">
              <div className="listing-slide row">
                {loading ? (
                  <p>Loading projects...</p>
                ) : projects.length > 0 ? (
                  projects.map((project, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3" key={index}>
                      <ProjectCard project={project} />
                    </div>
                  ))
                ) : (
                  <p className="no-projects-message">
                    No projects available...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedProperties;
