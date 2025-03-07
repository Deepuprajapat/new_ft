import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../styles/css/style.css"; // Update the path if needed
import "../styles/css/home.css";
import OwlCarousel from "react-owl-carousel"; // Assuming OwlCarousel is installed
import { groupIcon } from "../../../utils/groupIcon";
import { Swiper, SwiperSlide } from "swiper/react";
// import { sliderSettings } from "../../../utils/common";
import { carouselOptions } from "../../../utils/common";
const OurAssociations = () => {
  return (
    <Swiper {...carouselOptions}>
      {groupIcon.map((group, index) => (
        <SwiperSlide>
          <div className="item" key={index}>
            <img
              src={group.src}
              alt={group.alt}
              loading="lazy"
              title={group.title}
              style={{
                width: "150px", // Adjust width as needed
                height: "80px", // Adjust height as needed
                objectFit: "contain", // Ensures the logo fits well inside the box
                borderRadius: "8px", // Adds rounded corners
                // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
                padding: "5px", // Adds space inside the image border
                backgroundColor: "#fff", // White background to make the logo stand out
                display: "block", // Ensures proper alignment
                margin: "auto", // Centers the image
              }}
              className="img-fluid icon-hover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default OurAssociations;
