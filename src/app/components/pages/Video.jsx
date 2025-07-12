import React, { useEffect, useState } from "react";
import { getAllProject } from "../../apis/api"; // Assuming this is the API file
import "../styles/css/video.css";
import { Helmet } from "react-helmet";
import Loading from "../Loader";



const Video = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await getAllProject({ isDeleted: false });
      console.log("Fetched Projects: ", JSON.stringify(data)); // Log the data to verify the structure

      const sortedProjects = data
        ? data
          .filter(
            (project) =>
              project.video_urls &&
              project.video_urls.length > 0 &&
              project.video_urls.some((video) => video.trim() !== "")

          )
          .sort((a, b) => b.videoCount - a.videoCount)
        : [];

      setProjects(sortedProjects);
      setLoading(false); // End loading
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Our Videos</title>
        <link rel="canonical" href="https://www.investmango.com/video" />
        <meta
          name="description"
          content="Subscribe to our Youtube channel to know more about all other residential & commercial projects in Delhi/NCR region. Our video covers every aspect. "
        />
      </Helmet>
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

                  <Loading isFullScreen={false} />

                ) : projects.length > 0 ? (
                  projects.map((project) => {
                    // const floorplanSizes =
                    //   project.floorplans?.map((floorplan) => floorplan.size) ||
                    //   [];
                    // const minSize = floorplanSizes.length
                    //   ? Math.min(...floorplanSizes)
                    //   : null;
                    // const maxSize = floorplanSizes.length
                    //   ? Math.max(...floorplanSizes)
                    //   : null;

                    // const minPrice = project.floorplans?.length
                    //   ? Math.min(
                    //     ...project.floorplans
                    //       .filter((floorplan) => floorplan.price > 1.5) // Exclude prices <= 1.5
                    //       .map((floorplan) => floorplan.price)
                    //   )
                    //   : null;

                    return (
                      <div className="col-md-4" key={project.project_id}>
                        <div
                          className="card-im"
                          style={{
                            boxShadow: "2px 2px 5px 0px #00000057",
                            background: "white",
                            marginTop: "10px",
                          }}
                        >
                          {project.video_urls && project.video_urls.length > 0 && project.video_urls[0].trim() !== "" ? (
                            <div className="youtube">
                              <iframe
                                width="100%"
                                height="200"
                                src={`https://www.youtube.com/embed/${project.video_urls[0]}`}

                                title={project.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <div className="no-video">No Video Available</div>
                          )}
                          <p
                            className="list_headline_two"
                            style={{ fontSize: "20px" }}
                          >
                            {project.project_name}
                          </p>
                          <p className="location_im">
                            <i className="fas fa-map-marker-alt"></i>{" "}
                            {project.short_address}
                          </p>
                          <h3 className="details">
                            <span>
                              <i className="fas fa-ruler-combined"></i>{" "}
                              {project.sizes
                                ? project.sizes.replace(" - ", " To ").replace("sq.ft.", "Sq.ft.")
                                : "Size Info"}
                            </span>

                            <span>
                              <i className="fa fa-bed" aria-hidden="true"></i>{" "}
                              {(() => {
                                let configs = [];

                                try {
                                  configs = JSON.parse(project.configuration || "[]");
                                } catch (e) {
                                  console.error("Invalid configuration JSON:", project.configuration);
                                }

                                if (configs.length === 0) return "Property Type";

                                // Separate BHK configurations
                                const bhkConfigs = configs
                                  .filter((config) => /\d+BHK/.test(config))
                                  .map((config) => parseInt(config))
                                  .filter((num) => !isNaN(num));

                                const otherConfigs = configs.filter((config) => !/\d+BHK/.test(config));

                                let bhkOutput = null;
                                if (bhkConfigs.length > 0) {
                                  const minBHK = Math.min(...bhkConfigs);
                                  const maxBHK = Math.max(...bhkConfigs);
                                  bhkOutput =
                                    minBHK === maxBHK
                                      ? `${minBHK}BHK`
                                      : `${minBHK}BHK, ${maxBHK}BHK`;
                                }

                                const otherOutput =
                                  otherConfigs.length > 1
                                    ? `${otherConfigs[0]}, ${otherConfigs[otherConfigs.length - 1]}`
                                    : otherConfigs[0] || null;

                                const combinedOutput = [bhkOutput, otherOutput]
                                  .filter(Boolean)
                                  .join(", ");

                                return combinedOutput || "Property Type";
                              })()}

                            </span>
                          </h3>
                          <div className="list-footer">
                            <p className="price">
                              Start from{" "}
                              <b>
                                ₹
                                {project.min_price
                                  ? Number(project.min_price) >= 10000000
                                    ? (Number(project.min_price) / 10000000).toFixed(2) + " Cr"
                                    : (Number(project.min_price) / 100000).toFixed(2) + " Lakh"
                                  : "N/A"}
                              </b>
                            </p>

                            <a
                              href={`tel:+91-8595189189`}
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
