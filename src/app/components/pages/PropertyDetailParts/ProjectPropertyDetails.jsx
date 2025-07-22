import React, { useState, useEffect } from "react";
import {
  faExpandArrowsAlt,
  faRulerCombined,
  faBuilding,
  faCalendarAlt,
  faKey,
  faParking,
  faBed,
  faCity,
  faCouch,
  faFlag,
  faEdit,
  faBath,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const renderedFields = [
  "built_up_area",
  "size",
  "floor_number",
  "possession_status",
  "balconies",
  "covered_parking",
  "bedrooms",
  "property_type",
  "age_of_property",
  "furnishing_type",
  "facing",
  "rera_number",
  "configuration",
];

const ProjectPropertyDetails = ({ property, onSave , ageOfProperty,showEdit}) => {
  const [editMode, setEditMode] = useState(false)
  console.log(property , "propertyprop")
  console.log(ageOfProperty, "age of proprt")
  const editProperty = property

  const [editableProperty, setEditableProperty] = useState({ ...editProperty });

  // Sync editableProperty with property when property changes or when entering edit mode
  useEffect(() => {
    if (editMode && property) {
      setEditableProperty({ ...property });
    }
  }, [editMode, property]);

  const getDetailValue = (field) => {
    const nested = editableProperty?.web_cards?.property_details?.[field]?.value;
    if (nested !== undefined && nested !== null && nested !== "") return nested;
    
    if (editableProperty[field] !== undefined && editableProperty[field] !== null && editableProperty[field] !== "") return editableProperty[field];


    const altKeys = {
      built_up_area:["built_up_area"],
      size: ["size"],
      floor_number: ["floor_number", "floorNo"],
      possession_status: ["possession_status", "possessionStatus"],
      balconies: ["balconies", "balconyCount"],
      covered_parking: ["covered_parking", "coveredParking"],
      bedrooms: ["bedrooms", "bedroomCount"],
      property_type: ["property_type"],
      age_of_property: ["age_of_property"],
      furnishing_type: ["furnishing_type"],
      facing: ["facing"],
      rera_number: ["rera_number"],
      configuration: ["configuration"],
    };
    console.log(altKeys,"altkeys")
    if (altKeys[field]) {
      for (const key of altKeys[field]) {
        if (editableProperty[key] !== undefined && editableProperty[key] !== null && editableProperty[key] !== "") return editableProperty[key];
      }
    }
    return "";
  };

  // Helper to update deeply nested property_details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProperty((prev) => ({
      ...prev,
      web_cards: {
        ...prev.web_cards,
        property_details: {
          ...prev.web_cards?.property_details,
          [name]: {
            ...prev.web_cards?.property_details?.[name],
            value: value,
          },
        },
      },
    }));
  };

  // For nested configurationTypeName
  // const handleConfigTypeChange = (e) => {
  //   setEditableProperty((prev) => ({
  //     ...prev,
  //     configuration: {
  //       ...prev.configuration,
  //       configurationType: {
  //         ...prev.configuration?.configurationType,
  //         configurationTypeName: e.target.value,
  //       },
  //     },
  //   }));
  // };

  const handleSave = () => {
    setEditMode(false);
    if (onSave) onSave(editableProperty);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableProperty({ ...editProperty });
  };

  return (
    <div
      className="mb-4"
      id="overview"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h4
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex align-items-center justify-content-between"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
            paddingRight: '16px',
            marginBottom: '18px',
          }}
        >
          <span>Property Details</span>
          {showEdit && (
          <span className="d-flex align-items-center" style={{gap: '8px'}}>
            {!editMode ? (
              <FontAwesomeIcon
                icon={faEdit}
                className="ms-2"
                style={{ cursor: "pointer", color: "#fff", fontSize: '18px', padding: '2px 6px' }}
                onClick={() => setEditMode(true)}
                title="Edit"
              />
            ) : (
              <>
                <button className="btn btn-primary btn-sm me-2" style={{minWidth: '60px', padding: '2px 12px', marginRight: '6px'}} onClick={handleSave}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" style={{minWidth: '60px', padding: '2px 12px'}} onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </span>
          )}
        </h4>
        <div className="px-3">
          <div className="row g-3 mb-0 mb-md-4">
            {/* Built Up Area */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faExpandArrowsAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Built Up Area</small>
                  {editMode ? (
                    <input type="text" name="built_up_area" value={getDetailValue("built_up_area")}
                      onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px", fontWeight: window.innerWidth <= 768 ? "400" : "800" }}>
                      {property?.web_cards?.property_details?.built_up_area?.value || property?.built_up_area  }</p>
                  )}
                </div>
              </div>
            </div>
            {/* Sizes */}
            <div className="col-6 col-md-4 mt-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faRulerCombined} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Sizes</small>
                  {editMode ? (
                    <input type="text" name="size" value={getDetailValue("size") || property?.size || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px", fontWeight: window.innerWidth <= 768 ? "400" : "800" }}>{property?.web_cards?.property_details?.size?.value || property?.size || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Floor No */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Floor No</small>
                  {editMode ? (
                    <input type="text" name="floor_number" value={getDetailValue("floor_number") || property?.floorNo || property?.floor_number || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.floor_number?.value || property?.floorNo || property?.floor_number || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Configurations */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCalendarAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Configurations</small>
                  {editMode ? (
                    <input
                      type="text"
                      name="configuration"
                      value={getDetailValue("configuration")}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.web_cards?.property_details?.configuration?.value || property?.configuration}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Possession Status */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faKey} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Possession Status</small>
                  {editMode ? (
                    <input type="text" name="possession_status" value={getDetailValue("possession_status") || property?.possessionStatus || property?.possession_status || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.possession_status?.value || property?.possessionStatus || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Balcony */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBuilding} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Balcony</small>
                  {editMode ? (
                    <input type="text" name="balconies" value={getDetailValue("balconies") || property?.balconyCount || property?.balconies || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.balconies?.value || property?.balconyCount || property?.balconies || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Covered Parking */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faParking} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Covered Parking</small>
                  {editMode ? (
                    <input type="text" name="covered_parking" value={getDetailValue("covered_parking") || property?.covered_parking || property?.coveredParking || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.covered_parking?.value || property?.covered_parking || property?.coveredParking || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Bedrooms */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faBed} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Bedrooms</small>
                  {editMode ? (
                    <input type="text" name="bedrooms" value={getDetailValue("bedrooms") || property?.bedroomCount || property?.bedrooms || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.bedrooms?.value || property?.bedroomCount || property?.bedrooms || ""}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Property Type */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCity} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Type</small>
                  {editMode ? (
                    <input type="text" name="property_type" value={getDetailValue("property_type") || property?.propertyType || ""} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.web_cards?.property_details?.property_type?.value || property?.property_type || ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Age of Property */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCalendarAlt} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Age of Property</small>
                  {editMode ? (
                    <input type="text" name="age_of_property" value={getDetailValue("age_of_property")} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder text-break" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.web_cards?.property_details?.age_of_property?.value || property?.ageOfProperty}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Furnishing */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faCouch} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Furnishing</small>
                  {editMode ? (
                    <input type="text" name="furnishing_type" value={getDetailValue("furnishing_type")} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>
                      {property?.web_cards?.property_details?.furnishing_type?.value || property?.furnishing}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Facing */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faFlag} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>Facing</small>
                  {editMode ? (
                    <input type="text" name="facing" value={getDetailValue("facing")} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.facing?.value || property?.facing}</p>
                  )}
                </div>
              </div>
            </div>
            {/* RERA Number */}
            <div className="col-6 col-md-4 mt-2 mt-md-4">
              <div className="d-flex align-items-center flex-column flex-md-row">
                <FontAwesomeIcon icon={faKey} className="mb-2 mb-md-0 me-md-3" style={{ fontSize: window.innerWidth <= 768 ? "14px" : "20px", color: "#2067d1" }} />
                <div className="text-center text-md-start">
                  <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>RERA Number.</small>
                  {editMode ? (
                    <input type="text" name="rera_number" value={getDetailValue("rera_number")} onChange={handleChange} className="form-control" />
                  ) : (
                    <p className="mb-0 fw-normal fw-md-bolder" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{property?.web_cards?.property_details?.rera_number?.value }</p>
                  )}
                </div>
              </div>
            </div>
          {/* Render any extra property_details fields not already shown */}
          {/* {property?.web_cards?.property_details &&
            Object.entries(property.web_cards.property_details)
              .filter(([key]) => !renderedFields.includes(key))
              .map(([key, detail]) => (
                <div className="col-6 col-md-4 mt-2 mt-md-4" key={key}>
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="mb-2 mb-md-0 me-md-3" style={{ width: 24, height: 24 }} />
                    <div className="text-center text-md-start">
                      <small style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "11px" : "15px", fontWeight: "600" }}>{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</small>
                      {editMode ? (
                        <input type="text" name={key} value={getDetailValue(key)} onChange={handleChange} className="form-control" />
                      ) : (
                        <p className="mb-0 fw-normal fw-md-bolder text-break" style={{ color: "#000", fontSize: window.innerWidth <= 768 ? "12px" : "13px", marginTop: "2px" }}>{detail?.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPropertyDetails;