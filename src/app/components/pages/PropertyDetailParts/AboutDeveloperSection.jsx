import React from "react";

const AboutDeveloperSection = ({ property }) => (
  <section
    id="developer"
    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px" }}
  >
    <div className="box overview">
      <h2
        className="headline"
        style={{
          borderBottom: "solid 1px #e8e8e8",
          padding: "12px 16px",
          fontSize: "15px",
          backgroundColor: "#2067d1",
          textTransform: "uppercase",
          letterSpacing: "0.2px",
          fontWeight: "700",
          color: "#fff",
          borderRadius: "6px 6px 0 0",
        }}
      >
        About {property?.propertyName}
      </h2>
      <div
        className="row"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <div className="col-md-12" style={{ padding: "18px" }}>
          <div className="inner-item">
            <div
              className="over_head"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <img
                src={property?.developerLogo || "/img/developer-img/ace-group.webp"}
                className="img-fluid"
                alt="Developer Logo"
                loading="lazy"
                fetchPriority="high"
                style={{
                  maxWidth: "80px",
                  height: "auto",
                  borderRadius: "4px",
                  border: "1px solid #b5a9a9",
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                ESTABLISHED IN -{" "}
                <b style={{ fontSize: "15px", color: "#2067d1" }}>
                  {property?.developerEstiblishedYear || "N/A"}
                </b>
                <br />
                TOTAL PROJECTS -{" "}
                <b style={{ fontSize: "15px", color: "#2067d1" }}>
                  {property?.totlprojects || "N/A"}
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutDeveloperSection; 