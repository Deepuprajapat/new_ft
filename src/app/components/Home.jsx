// src/components/Head.js
import React, { useEffect, useState, useRef } from "react";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; // Import styles
import "./Home.css";
import SearchBar from "./pages/SearchBar"; // Import the SearchBar component
import { Helmet } from "react-helmet";
import Loading from "./Loader";

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

  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start(); // Ensure autoplay starts
    }
  }, []);

  const sliderSettings = {
    modules: [Navigation, Autoplay],
    navigation: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
    spaceBetween: 10, // Reduce space to avoid layout issues
    slidesPerView: 1, // Default to 1 slide per view for mobile
    breakpoints: {
      480: { slidesPerView: 1, spaceBetween: 10 }, // Small screens
      600: { slidesPerView: 2, spaceBetween: 15 }, // Tablet portrait
      768: { slidesPerView: 2, spaceBetween: 20 }, // Tablet landscape
      1024: { slidesPerView: 3, spaceBetween: 30 }, // Desktop
    },
  };

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
                      <h1
                        className="h3"
                        style={{
                          marginTop: "26px",
                          fontFamily: "Lato, sans-serif",
                          fontSize: "32px",
                          fontWeight: 600,
                          color: "#000",
                        }}
                      >
                        Top Projects
                      </h1>
                      <p className="head_p" style={{ marginLeft: "45px" }}>
                        Connecting People With Their Dream Properties
                      </p>
                    </div>
                    <div className="swiper-container">
                      <Swiper
                        ref={swiperRef}
                        {...sliderSettings}
                        modules={[Navigation, Autoplay]} // Ensure modules are passed here too
                        navigation={{
                          nextEl: ".swiper-button-next",
                          prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }} // Directly define autoplay
                      >
                        {loading ? (
                          <Loading isFullScreen={false} />
                        ) : (
                          projects?.map((project) => (
                            <SwiperSlide key={project.id}>
                              <ProjectCard project={project} />
                            </SwiperSlide>
                          ))
                        )}
                      </Swiper>

                      {/* Custom navigation buttons */}
                      <div className="swiper-button-prev custom-prev">
                        <i className="fas fa-chevron-left"></i>
                      </div>
                      <div className="swiper-button-next custom-next">
                        <i className="fas fa-chevron-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="offset-md-1"></div>
            </div>
          </div>
        </div>

        <div className="about-us" style={{ marginTop: "20px" }}>
          <div className="container">
            <AboutUs />
          </div>
        </div>
        <div className="weWork" style={{ marginTop: "20px" }}>
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

        <div className="home-blog" style={{ marginTop: "40px" }}>
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
        <div className="mail-section" style={{ marginTop: "20px" }}>
          <MailSection />
        </div>
      </section>
    </div>
  );
};

export default Head;
