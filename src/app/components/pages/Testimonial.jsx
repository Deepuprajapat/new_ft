import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/css/home.css";
import { fetchTestimonials } from "../../apis/api"; // Import the API function

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
      <div className="testimonial">
        <div className="container">
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial">
      <div className="container">
        <div className="col-md-12">
          <div className="headline">
            <p className="sub-headline">Clients Testimonial</p>
            <h3 className="h3">
              A Relation Built on Trust & <span className="mobiHide">Experience</span>
            </h3>
          </div>
          <div className="client-slide owl-carousel owl-theme" id="testi_slide">
            {testimonials.map((testimonial, index) => (
              <div className="item" key={index}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`fa fa-star ${i < testimonial.rating ? "checked" : ""}`}
                  ></span>
                ))}
                <p className={`normal ${expanded[index] ? "expanded" : ""}`}>
                  {testimonial.text}
                </p>
                {/* <span
                  className="read-more"
                  onClick={() => toggleReadMore(index)}
                >
                  {expanded[index] ? "Read Less" : "Read More"}
                </span> */}
                <h3 className="title">{testimonial.name}</h3>
                <p className="project">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
