import React, { useEffect, useState } from "react";
import "../styles/css/projectCard.css";
import { getAllProject } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { sliderSettings } from "../../../utils/common";
// import { sliderSettings } from "../../utils/common";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleMoreDetails = (name) => {
    navigate(`/project/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };

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
            <div class="listing-slide row">
              {loading ? (
                <p>Loading projects...</p>
              ) : projects.length > 0 ? (
                projects.map((project,index) => (
                  
                        <div class="col-md-4">
                  <div key={index} className="card-im">
                    <ProjectCard project={project} />
                  </div>
                  </div>
                 

                ))
               
              ) : (
                <p>No projects available.</p>
              )}
          </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProjects;
