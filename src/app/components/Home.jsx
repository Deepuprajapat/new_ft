import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/style.css";
import "../components/styles/css/Head.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import AboutUs from "../components/pages/AboutUs";
import OurAssociations from "./pages/OurAssociations";
import HowWeWork from "./pages/HowWeWork";
import MailSection from "./pages/MailSection";
import Testimonial from "./pages/Testimonial";
import ProjectCard from "./pages/ProjectCard";
import BlogCard from "./pages/BlogCard";
// import BlogSection from "./BlogSection"; 
import BlogSection from "./pages/BlogSection";
// import Popup from "./pages/Popup";
import CityPopup from "./pages/Popup";
import { getAllProject } from "../apis/api";
import { getAllBlog } from "../apis/api";
import { sliderSettings } from "../../utils/common";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Home.css";

const Head = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading stat
  const [showPopup, setShowPopup] = useState(false);



  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };


  useEffect(() => {
    // Fetch projects from API on component mount
    const fetchProjects = async () => {
      setLoading(true); // Set loading to true when data starts loading
      const response = await getAllProject();
      console.log(response.content);
      setProjects(response.content || []); // Assuming `projects` is the array in response
      setLoading(false); // Set loading to false after data is loaded
    };
    const fetchBlog = async () => {
      setLoading(true);
      const response = await getAllBlog();
      console.log("data of blpog", response.content);
      setBlog(response.console || []);
      setLoading(false);
    };
    fetchBlog();
    fetchProjects();
  }, []);

  return (
    <div>
       {showPopup && <CityPopup onClose={closePopup} />}
      <section className="main-body">
        <div className="main-slider">
          <div className="form-top-home">
            <div className="container">
              <form
                method="POST"
                action="#"
                autocomplete="off"
                style={{ marginTop: "-200px" }}
              >
                <div className="form">
                  <div className="form-group">
                    <div className="form-top-home-select">
                      <select
                        name="location"
                        className="form-control"
                        aria-label="Noida"
                      >
                        <option value="" selected>
                          Location --{" "}
                        </option>
                        <option value="Noida">Noida</option>
                        <option value="Greater Noida">Greater Noida</option>
                        <option value="Sector 150 Noida">
                          Sector 150 Noida
                        </option>
                        <option value="Noida Extension">Noida Extension</option>
                        <option value="Delhi">New Delhi</option>
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      list="projects"
                      id="search"
                      type="text"
                      name="search"
                      placeholder="Search using Project Name"
                    />
                    <datalist id="projects">
                      {/* Add options here if needed */}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <div className="form-top-home-select">
                      <select
                        name="type"
                        className="form-control border-r"
                        aria-label="Residential"
                      >
                        <option value="" selected>
                          Property --{" "}
                        </option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-dark">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="listing-home">
          <div className="container-fluid">
            <div className="row">
              <div className="offset-md-1"></div>
              <div className="col-md-10">
                <div className="headline" style={{ display: "contents" }}>
                  <h1 className="h3">Top Projects</h1>
                  <p className="head_p">
                    Connecting people with their dream properties
                  </p>
                </div>
                <div className="main-con">
                  <div className="container">
                    <Swiper {...sliderSettings}>
                      <SliderButton />
                      {loading ? ( // Check if still loading
                        <div className="loader-container">
                          <div className="loader">Loading...</div>{" "}
                          {/* Loader element */}
                        </div>
                      ) : (
                        <div className="listing-home listing-page row">
                          {projects.map((project) => (
                            <SwiperSlide key={project.id}>
                              <ProjectCard project={project} />
                            </SwiperSlide>
                          ))}
                        </div>
                      )}
                    </Swiper>
                  </div>
                </div>
              </div>
              <div className="offset-md-1"></div>
            </div>
          </div>
        </div>

        <div class="about-us">
          <div class="container">
            <AboutUs />
          </div>
        </div>
        <div class="weWork" style={{ marginTop: "-84px" }}>
          <div class="container">
            <HowWeWork />
          </div>
        </div>
        <div class="testimonial" style={{ marginTop: "-86px" }}>
          <div class="container">
            <Testimonial />
          </div>
        </div>
        

        <div class="blog-card">
          <div class="container">
            <div className="main-con">
              <div className="container">
                  {loading ? ( // Check if still loading
                    <div className="loader-container">
                      <div className="loader">Loading...</div>{" "}
                      {/* Loader element */}
                    </div>
                  ) : (
                    <div className="listing-home listing-page row">
                      {/* {blogs.map((blog) => ( */}
                        {/* <SwiperSlide key={blog.id}> */}
                        <BlogSection isSwiper={true} />
                        {/* </SwiperSlide> */}
                      {/* ))} */}
                    </div>
                  )}
                {/* </Swiper> */}
              </div>
            </div>
          </div>
        </div>

        <div className="your-parent-div">
          <div className="client_slider">
            <OurAssociations />
          </div>
        </div>

        <div class="mail-section">
          <MailSection />
        </div>
      </section>
    </div>
  );
};

export default Head;

const SliderButton = () => {
  const swiper = useSwiper();
  return (
    <div className="r-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};
