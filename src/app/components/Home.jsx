import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/css/style.css";
import "../components/styles/css/Head.css";
import AboutUs from "../components/pages/AboutUs";
import OurAssociations from "./pages/OurAssociations";
import HowWeWork from "./pages/HowWeWork";
import MailSection from "./pages/MailSection";
import Testimonial from "./pages/Testimonial";
import ProjectCard from "./pages/ProjectCard";
import BlogSection from "./pages/BlogSection";
// import Popup from "./pages/Popup";
import CityPopup from "./pages/Popup";
import { getAllProject } from "../apis/api";
import { sliderSettings } from "../../utils/common";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Home.css";
import withSafeLinks from "../../utils/rel";
import { getAllLocalities } from "../apis/api";

const Head = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer); 
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); 
      const response = await getAllProject();
      console.log(response.content);
      setProjects(response.content || []);
      setLoading(false); 
    };
    // const fetchBlog = async () => {
    //   setLoading(true);
    //   const response = await getAllBlog();
    //   console.log("data of blpog", response.content);
    //   setBlog(response.console || []);
    //   setLoading(false);
    // };
    // // fetchBlog();
    fetchProjects();
  }, []);

  useEffect(() => {
    // Fetch localities when the component mounts
    const fetchLocalities = async () => {
      const data = await getAllLocalities();
      setLocalities(data);
    };

    fetchLocalities();
  }, []);

  return (
    <div>
      {/* {showPopup && <CityPopup onClose={closePopup} />} */}
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
                    {localities.map((locality) => (
                      <option key={locality.id} value={locality.name}>
                        {locality.city.name} - {locality.name}
                      </option>
                    ))}
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
                    <datalist id="projects"></datalist>
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
                <div className="main-con">
                  <div className="container">
                    <div className="headline" style={{ display: "contents" }}>
                      <h1 className="h3" style={{marginTop:'26px'}}>Top Projects</h1>
                      <p className="head_p">
                        Connecting people with their dream properties
                      </p>
                    </div>
                    <Swiper {...sliderSettings}>
                      {loading ? (
                        <div className="loader-container">
                          <div className="loader">Loading...</div>{" "}
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

        <div className="about-us">
          <div className="container">
            <AboutUs />
          </div>
        </div>
        <div className="weWork">
          <div className="container">
            <HowWeWork />
          </div>
        </div>
        <div className="testimonial">
          <div className="container">
            <Testimonial />
          </div>
        </div>

        <div className="home-blog">
          <div className="container">
            <div className="headline">
              <p className="sub-headline">MANGO INSIGHTS</p>
              <h3 className="h3">
                An Outlook In The World of
                <br className="mobiHide" /> Real Estate
              </h3>
            </div>
            {loading ? (
              <div className="loader-container">
                <div className="loader">Loading...</div>{" "}
              </div>
            ) : (
              <div className="listing-home listing-page row">
                <BlogSection isSwiper={true} />
              </div>
            )}
          </div>
        </div>

        <div className="home-blog">
          <div className="container">
            <div className="headline">
              <h3 className="h3">Our Associations</h3>
            </div>
            {loading ? (
              <div className="loader-container">
                <div className="loader">Loading...</div>{" "}
              </div>
            ) : (
              <div className="listing-home listing-page row">
                <OurAssociations />
              </div>
            )}
          </div>
        </div>
        <div className="mail-section">
          <MailSection />
        </div>
      </section>
    </div>
  );
};

export default withSafeLinks(Head);

// const SliderButton = () => {
//   const swiper = useSwiper();
//   return (
//     <div className="r-buttons">
//       <button onClick={() => swiper.slidePrev()}>&lt;</button>
//       <button onClick={() => swiper.slideNext()}>&gt;</button>
//     </div>
//   );
// };
