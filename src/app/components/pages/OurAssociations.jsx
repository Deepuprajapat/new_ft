import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../styles/css/style.css"; // Update the path if needed
import "../styles/css/home.css";
import OwlCarousel from "react-owl-carousel"; // Assuming OwlCarousel is installed

// Carousel settings for continuous right-to-left scrolling
const carouselOptions = {
  items: 7, // Display 7 icons at a time
  margin: 20,
  loop: true, // Enable continuous loop
  autoplay: true,
  autoplayTimeout: 3000,
  autoplaySpeed: 5000,
  autoplayHoverPause: false, // Prevent pausing on hover
  nav: false, // Remove previous and next buttons
  dots: false,
};

const OurAssociations = () => {
  return (
    <div className="client_slider">
      <div className="container">
        <div className="headline">
          <h3 className="h3">Our Associations</h3>
        </div>
        <OwlCarousel className="owl-theme" {...carouselOptions}>
          {/* Carousel Items */}
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/37178abf-34c2-4c3f-5026-1c9c98630c00/public"
              alt="Ace Divino"
              title="Ace Divino"
              className="img-fluid icon-hover"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/c38da8af-989d-43f7-ba71-9443f2a83600/public"
              alt="Raheja"
              title="Raheja"
              className="img-fluid icon-hover"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/76635ae7-c537-4e9f-54b1-fd641f163e00/public"
              alt="Devsai SportsHome"
              title="Devsai SportsHome"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/e79f5753-87b2-4ab4-8819-516a4ce0e500/public"
              alt="Godrej Properties"
              title="Godrej Properties"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/89db5220-032e-4768-1301-932653850300/public"
              alt="Tata Value Homes"
              title="Tata Value Homes"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/7eacab40-769b-4d5c-8633-160844f84000/public"
              alt="DLF"
              title="DLF"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/1751a5a6-7584-452c-f2c7-9e15bd3b4600/public"
              alt="Bhutani Infra"
              title="Bhutani Infra"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/963eace5-a6e7-4713-6c8e-88d90955c900/public"
              alt="Risland"
              title="Risland"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/629090cc-a88a-4f0c-f90d-3602c6c0da00/public"
              alt="Eldeco"
              title="Eldeco"
              className="img-fluid"
            />
          </div>
          <div className="item">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/8c629361-cbe0-4af0-71de-b516032d5900/public"
              alt="ATS Group"
              title="ATS Group"
              className="img-fluid"
            />
          </div>
        </OwlCarousel>
      </div>
    </div>
  );
};

export default OurAssociations;
