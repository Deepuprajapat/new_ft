import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { aboutUsData } from "../../../utils/about";

const About = () => {
  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Helmet>
        <title>About Us – Know About Invest Mango</title>
        <meta
          name="description"
          content="Invest Mango | Reputed Investment and Real Estate Portfolio Management Organisation. We provide Real Estate Consulting services in Delhi NCR."
        />
        <link rel="canonical" href="https://www.investmango.com/about" />
        <meta
          name="keywords"
          content="real estate investment consultant, investment and portfolio management, top real estate agents in noida, property investment consultant, commercial property management, real estate consultants services, real estate advisory services, top real estate companies in noida."
        />
      </Helmet>

      <section className="main-body">
        <div className="container">
          <h1
            style={{
              fontSize: window.innerWidth <= 480 ? 22 : 32,
              fontWeight: 700,
              // textAlign: "center",
              marginBottom: 8,
              marginTop: 15,
              color: "#000",
            }}
          >
            {aboutUsData.title}
          </h1>
          <p style={{ color: "#888", fontSize: window.innerWidth <= 480 ? 13 : 16, marginBottom: 24 }}>
            {aboutUsData.breadcrumb.map((item, index) => (
              <span key={index}>
                <a
                  href={item.path}
                  target={item.label === "Home" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="styled-link"
                >
                  {item.label}
                </a>
                {index < aboutUsData.breadcrumb.length - 1 && " / "}
              </span>
            ))}
          </p>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="content">
              <div className="row padding_im_about">
                <div className="col-md-6">
                  <h2 style={{ fontWeight: 700, fontSize: window.innerWidth <= 480 ? 18 : 24, color: "#222", textAlign: window.innerWidth <= 480 ? "center" : "left", marginBottom: 8 }}>
                    Our Process
                  </h2>
                  <hr />
                  {aboutUsData.process.map((item, index) => (
                    <div style={{ fontSize: window.innerWidth <= 480 ? 15 : 20, marginBottom: 12 }}>
                      <p
                        className="p_n"
                        key={index}
                        style={{ marginBottom: "10px", color: "#444", textAlign: window.innerWidth <= 480 ? "center" : "left" }}
                      >
                        <b>{item.title}</b> - {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="col-md-6" style={{ marginTop: "25px" }}>
                  <img
                    src={aboutUsData.image.src}
                    loading="lazy"
                    alt={aboutUsData.image.alt}
                    className="responsive-image"
                    style={{
                      width: "100%",
                      height: window.innerWidth <= 480 ? "200px" : "400px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "30px" }}>
                <p
                  style={{
                    fontSize: window.innerWidth <= 480 ? 18 : 24,
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: window.innerWidth <= 480 ? "center" : "left",
                  }}
                >
                  {aboutUsData.keyTakeaway.title}
                </p>
                <p style={{ fontSize: window.innerWidth <= 480 ? 14 : 16, color: "#666", textAlign: window.innerWidth <= 480 ? "center" : "left" }}>
                  {aboutUsData.keyTakeaway.description}
                </p>
                <p
                  style={{
                    fontSize: window.innerWidth <= 480 ? 18 : 24,
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: window.innerWidth <= 480 ? "center" : "left",
                  }}
                >
                  {aboutUsData.differentiation.title}
                </p>
                <ul
                  style={{
                    paddingLeft: "20px",
                    listStyleType: "disc",
                    color: "#666",
                    textAlign: window.innerWidth <= 480 ? "center" : "left",
                  }}
                >
                  {aboutUsData.differentiation.points.map((point, index) => (
                    <li
                      key={index}
                      style={{ fontSize: window.innerWidth <= 480 ? 14 : 16, marginBottom: "5px" }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
