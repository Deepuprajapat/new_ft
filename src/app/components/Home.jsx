// src/components/Head.js
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
import { getAllProject } from "../apis/api";
import { sliderSettings } from "../../utils/common";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Home.css";
// import withSafeLinks from "../../utils/rel";
import SearchBar from "./pages/SearchBar"; // Import the SearchBar component
import { Helmet } from "react-helmet";
const Head = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const response = await getAllProject({ isFeatured: true });
      setProjects(response.content || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Real Estate Portfolio & Strategic Management Company</title>
        <meta
          content="Invest Mango: Real estate portfolio and strategic management services. Elevate your financial future through informed decisions and prime opportunities."
          name="description"
        />
        <link rel="canonical" href="https://propertymarvels.in/" />
        <meta
          content="real estate company in noida, property in noida, property site, best property company in noida, real estate agency in noida, best real estate website, best property websites, best real estate sites, house search sites, top real estate companies in noida, best real estate company in noida."
          name="keyword"
        />
      </Helmet>
      <section className="main-body">
        {/* Render the SearchBar Component */}
        {/*  */}
        <div className="main-slider">
          <div className="form-top-home">
            <div className="container">
              <SearchBar />
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
                      <h1 className="h3" style={{ marginTop: "26px" }}>
                        Top Projects
                      </h1>
                      <p className="head_p" style={{ marginLeft: "39px" }}>
                        Connecting people with their dream properties
                      </p>
                    </div>
                    <div className="swiper-container">
                      <Swiper {...sliderSettings}>
                        {loading ? (
                          <div className="loader-container">
                            <div className="loader">Loading...</div>
                          </div>
                        ) : (
                          <div className="listing-home listing-page row">
                            {projects?.map((project) => (
                              <SwiperSlide key={project.id}>
                                <ProjectCard project={project} />
                              </SwiperSlide>
                            ))}
                          </div>
                        )}
                      </Swiper>
                      {/* Add custom navigation buttons */}
                      <div className="swiper-button-prev">
                        <i class="fas fa-chevron-left"></i>
                      </div>
                      <div className="swiper-button-next">
                        <i class="fas fa-chevron-right"></i>
                      </div>
                    </div>
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
                <div className="loader">Loading...</div>
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
                <div className="loader">Loading...</div>
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

export default Head;
