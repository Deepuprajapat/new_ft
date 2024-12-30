import React, { useEffect, useState } from "react";
import { getAllProject } from "../../apis/api"; // Assuming this is the API file
import "../styles/css/video.css";

const Video = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await getAllProject({ isDeleted: false });
      console.log("Fetched Projects: ", JSON.stringify(data)); // Log the data to verify the structure

      const sortedProjects = data.content
        ? data.content.sort((a, b) => b.videoCount - a.videoCount)
        : [];

      setProjects(sortedProjects);
      setLoading(false); // End loading
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
                {loading ? (
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      height: "20vh",
                    }}
                  >
                    Loading...
                  </p>
                ) : projects.length > 0 ? (
                  projects.map((project) => {
                    const floorplanSizes =
                      project.floorplans?.map((floorplan) => floorplan.size) ||
                      [];
                    const minSize = floorplanSizes.length
                      ? Math.min(...floorplanSizes)
                      : null;
                    const maxSize = floorplanSizes.length
                      ? Math.max(...floorplanSizes)
                      : null;

                    const minPrice = project.floorplans?.length
                      ? Math.min(
                          ...project.floorplans.map(
                            (floorplan) => floorplan.price
                          )
                        )
                      : null;

                    return (
                      <div className="col-md-4" key={project.id}>
                        <div
                          className="card-im"
                          style={{
                            boxShadow: "2px 2px 5px 0px #00000057",
                            background: "white",
                          }}
                        >
                          {project.videos && project.videos.length > 0 ? (
                            <div className="youtube">
                              <iframe
                                width="100%"
                                height="200"
                                src={`https://www.youtube.com/embed/${project.videos[0]}`}
                                title={project.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <div className="no-video">No Video Available</div>
                          )}
                          <p className="list_headline_two">{project.name}</p>
                          <p className="location_im">
                            <i className="fas fa-map-marker-alt"></i>{" "}
                            {project.shortAddress}
                          </p>
                          <h3 className="details">
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
                              {project.configurations.join(", ")}
                            </span>
                          </h3>
                          <div className="list-footer">
                            <p className="price">
                              Start from{" "}
                              <b>
                                ₹
                                {minPrice
                                  ? minPrice >= 10000000
                                    ? (minPrice / 10000000).toFixed(2) + " Cr"
                                    : (minPrice / 100000).toFixed(2) + " L"
                                  : "Price on Request"}
                              </b>
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
                    );
                  })
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
