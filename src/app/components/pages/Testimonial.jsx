import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/css/home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import Swiper Navigation module
import { fetchTestimonials } from "../../apis/api"; // Import the API function
import { sliderSettings } from "../../../utils/common";
const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      const fetchedTestimonials = await fetchTestimonials();
      setTestimonials(
        fetchedTestimonials.map((item) => ({
          text: item.description,
          name: item.userName,
          role: item.type,
          rating: item.rating,
        }))
      );
      setLoading(false);
    };

    loadTestimonials();
  }, []);

  if (loading) {
    return <p>Loading testimonials...</p>;
  }

  return (
    <div className="testimonial-container">
      <div className="col-md-12">
        <div className="headline">
          <p className="sub-headline">Clients Testimonial</p>
          <h3 className="h3">
            A Relation Built on Trust & <span className="mobiHide">Experience</span>
          </h3>
        </div>

        <Swiper {...sliderSettings} className="swiper-container">
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="testimonial-slide">
              <div className="testimonial-item">
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span
                      key={i}
                      className={`fa fa-star ${i < testimonial.rating ? "checked" : ""}`}
                    ></span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
