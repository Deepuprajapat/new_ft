import React, { useEffect, useState } from "react";
import { getAllProject } from "../../apis/api"; // Assuming this is the API file
import "../styles/css/video.css";

const Video = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProject({ isDeleted: false });
      setProjects(data.content || []);
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Our Videos</h1>
          <p>
            <a
              href="https://www.investmango.com/"
              target="_blank"
              rel="noopener"
              className="styled-link"
            >
              Home
            </a>{" "}
            / Our Videos
          </p>
          <h2 style={{ textAlign: "center" }}> Latest Videos</h2>
        </div>
        <div className="main-con">
          <div className="container">
            <div className="listing-home listing-page">
              <div className="listing-slide row">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div className="col-md-4" key={project.id}>
                      <div className="card-im">
                        {project.videos && project.videos.length > 0 ? (
                          <div
                            className="youtube"
                            data-embed={`https://www.youtube.com/watch?v=${project.videos[0]}`}
                          >
                            <div className="play-button"></div>
                          </div>
                        ) : (
                          <div className="no-video">No Video Available</div>
                        )}
                        <p className="list_headline_two">{project.name}</p>
                        <p className="location_im">
                          <i className="fas fa-map-marker-alt"></i> {project.shortAddress}
                        </p>
                        <h3 className="details">
                          <span>
                            <i className="fas fa-ruler-combined"></i> {project.area}
                          </span>
                          <span>
                            <i className="fa fa-bed" aria-hidden="true"></i> {project.configurations.join(", ")}
                          </span>
                        </h3>
                        <div className="list-footer">
                          <p className="price">
                            Start from <b><i className="fas fa-rupee-sign"></i>Price on Request</b>
                          </p>
                          <a
                            href={`tel:+91${project.userPhone}`}
                            target="_blank"
                            rel="noopener"
                            className="theme-btn"
                          >
                            Talk to our Expert
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No projects available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Video;
