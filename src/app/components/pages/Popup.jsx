// components/CityPopup.js
import React from "react";
import "../styles/css/popup.css";

const cities = [
  { name: "Pune", image: "src/app/assets/img/Ahmedabad-thumbnail--1710403537995-img.jpeg" },
  { name: "Mumbai", image: "path/to/mumbai.png" },
  { name: "Thane", image: "path/to/thane.png" },
  { name: "Bangalore", image: "path/to/bangalore.png" },
  { name: "Ahmedabad", image: "path/to/ahmedabad.png" },
  { name: "Hyderabad", image: "path/to/hyderabad.png" },
  { name: "Nagpur", image: "path/to/nagpur.png" },
  { name: "Gurugram", image: "path/to/gurugram.png" },
];

const CityPopup = ({ onClose }) => {
  return (
    <div className="city-popup-overlay">
      <div className="city-popup-container">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="popup-title">Select Your Location</h2>
        <div className="city-grid">
          {cities.map((city, index) => (
            <div key={index} className="city-card">
              <img src={city.image} alt={city.name} className="city-image" />
              <p className="city-name">{city.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityPopup;
