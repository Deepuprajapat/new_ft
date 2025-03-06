import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../styles/css/style.css"; // Update the path if needed
import "../styles/css/home.css";
import OwlCarousel from "react-owl-carousel"; // Assuming OwlCarousel is installed
import { groupIcon } from "../../../utils/groupIcon";
import { Swiper, SwiperSlide } from "swiper/react";
// import { sliderSettings } from "../../../utils/common";
import { carouselOptions } from "../../../utils/common";
const   OurAssociations = () => {
  return (
        <Swiper {...carouselOptions}>
       {groupIcon.map((group,index)=>(
        <SwiperSlide>
        <div className="item" key={index}>
            <img
              src={group.src}
              alt={group.alt}
              loading="lazy"
              title={group.title}
              className="img-fluid icon-hover"
            />
          </div>
          </SwiperSlide>
       ))}
       </Swiper>
      
  );
};

export default OurAssociations;
