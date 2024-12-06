import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";
import { fetchTestimonials } from "../../apis/api"; // Import the API function
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { sliderSettings } from "../../../utils/common";

// import "swiper/css/pagination";
const Testimonial = () => {
  const [expanded, setExpanded] = useState({}); // Using an object to manage expanded state for each testimonial
  const [testimonials, setTestimonials] = useState([]); // State to hold testimonials fetched from the API
  const [loading, setLoading] = useState(true); // State to show a loading indicator

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

  // const toggleReadMore = (index) => {
  //   setExpanded((prevState) => ({
  //     ...prevState,
  //     [index]: !prevState[index], // Toggle the expanded state for the clicked testimonial
  //   }));
  // };

  if (loading) {
    return (
          <p>Loading testimonials...</p>
       
    );
  }

  return (
   
        <div className="col-md-12">
          <div className="headline">
            <p className="sub-headline">Clients Testimonial</p>
            <h3 className="h3">
              A Relation Built on Trust & <br className="mobiHide"/>Experience
            </h3>
          </div>
          <div className="client-slide owl-carousel owl-theme" id="testi_slide">
          <Swiper {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
              <div className="item" key={index}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span
                    key={i}
                    className={`fa fa-star ${i < testimonial.rating ? "checked" : ""}`}
                  ></span>
                ))}
                <p className={`normal ${expanded[index] ? "expanded" : ""}`}>
                  {testimonial.text}
                </p>
                <h3 className="title">{testimonial.name}</h3>
                <p className="project">{testimonial.role}</p>
              </div>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
        </div>
     
  );
};

export default Testimonial