import React from "react";

// Helper function to process amenities from web_cards.amenities
const processAmenities = (property) => {
  const raw = property?.web_cards?.amenities?.categories_with_amenities || {};
  return Object.keys(raw).map((categoryKey) => ({
    name: categoryKey.toLowerCase(),
    assets: raw[categoryKey].map(item => ({
      name: item.value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: item.icon,
    })),
  }));
};

const AmenitiesSection = ({ property }) => (
  <div
    className="mb-4"
    id="amenities"
    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
  >
    <div className="p-0 pb-2">
      <h4
        className="mb-3 py-2 fw-bold text-white ps-3"
        style={{
          fontSize: window.innerWidth <= 768 ? "16px" : "18px",
          backgroundColor: "#2067d1",
          borderRadius: "4px 4px 0 0",
        }}
      >
        {property?.propertyName} Amenities
      </h4>
      <div className="px-3">
        <p
          className="mb-3"
          style={{ fontSize: window.innerWidth <= 768 ? "12px" : "16px" }}
        >
          {property?.web_cards?.amenities?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: property.web_cards.amenities.description,
              }}
            />
          ) : (
            <p>
              World class amenities are there in {property?.propertyName} for the residents to enjoy a luxurious lifestyle. Know in detail about the amenities in the list below.
            </p>
          )}
        </p>

        <div
          className="inner-item"
          style={{ height: "400px", overflowY: "auto", overflowX: "hidden" }}
        >
          {processAmenities(property)?.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <p
                className="fw-bolder mb-3"
                style={{
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  color: "#2067d1",
                  fontWeight: "1000",
                }}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </p>
              <div className="row g-4 mb-5">
                {category.assets?.map((amenity, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <div
                      className="d-flex align-items-center"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                        marginBottom: "16px",
                        fontWeight: "600",
                      }}
                    >
                      <img
                        src={amenity.icon}
                        alt={amenity.name}
                        loading="lazy"
                        style={{
                          width: "35px",
                          height: "35px",
                          marginRight: "16px",
                        }}
                      />
                      {amenity.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AmenitiesSection;
