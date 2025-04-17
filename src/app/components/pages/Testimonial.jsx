import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";
import { fetchTestimonials } from "../../apis/api";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { sliderSettings } from "../../../utils/common";

const Testimonial = () => {
  const [expanded, setExpanded] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      const fetchedTestimonials = await fetchTestimonials();
      setTestimonials(
        fetchedTestimonials.map((item) => ({
          text: item.description,
          name: item.name,
          role: item.type,
          rating: item.rating,
        }))
      );
      setLoading(false);
    };

    loadTestimonials();
  }, []);

  const toggleReadMore = (index) => {
    setExpanded((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#2067d1" }}>
        Loading testimonials...
      </p>
    );
  }

  return (
    <div
      style={{
        // backgroundColor: "#fff",
        padding: "10px 10px",
        // borderRadius: "8px",
        // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#2067d1",
            fontWeight: "650",
            marginBottom: "10px",
          }}
        >
          Clients Testimonial
        </p>
        <h3 style={{ fontSize: "2rem", color: "#000", marginBottom: "20px" }}>
          A Relation Built on Trust & <br className="mobiHide" />
          Experience
        </h3>
      </div>

      <div>
        <Swiper {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                  margin: "10px auto",
                  maxWidth: "500px",
                  textAlign: "center",
                }}
              >
                <div>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="fa fa-star"
                      style={{ color: "#2067d1", marginRight: "2px" }}
                    ></span>
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    margin: "20px 0",
                    minHeight: "100px", // Ensures enough space
                    overflow: "visible", // Allow content to be fully displayed
                  }}
                >
                  {testimonial.text.length > 250 && !expanded[index]
                    ? `${testimonial.text.substring(0, 250)}...`
                    : testimonial.text}
                </p>

                {testimonial.text.length > 250 && (
                  <span
                    style={{
                      color: "#2067d1",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textDecoration: "underline",
                    }}
                    onClick={() => toggleReadMore(index)}
                  >
                    {expanded[index] ? " Read Less" : " Read More"}
                  </span>
                )}

                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "#000",
                    marginTop: "10px",
                  }}
                >
                  {testimonial.name}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#2067d1",
                  }}
                >
                  {testimonial.role}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
