import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const AmenitiesSection = ({
  amenities = [],
  amenitiesPara = "",
  name = "",
  onSave, // Optional: callback to save changes to parent or API
}) => {
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editableAmenities, setEditableAmenities] = useState([]);
  const [editableAmenitiesPara, setEditableAmenitiesPara] = useState(amenitiesPara);

  // Group amenities by category if not already grouped
  const groupAmenities = (amenitiesList) => {
    if (!amenitiesList || !Array.isArray(amenitiesList)) return [];
    if (amenitiesList.length && amenitiesList[0].assets) return amenitiesList; // Already grouped
    const grouped = amenitiesList.reduce((acc, amenity) => {
      const category = (amenity.category || "Other").toLowerCase();
      if (!acc[category]) {
        acc[category] = {
          name: category,
          assets: [],
        };
      }
      acc[category].assets.push({
        name: amenity.name
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        icon: amenity.url,
      });
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Initialize editable amenities when editing starts
  useEffect(() => {
    if (isAmenitiesEditing) {
      setEditableAmenities(JSON.parse(JSON.stringify(groupAmenities(amenities))));
      setEditableAmenitiesPara(amenitiesPara);
    }
    // eslint-disable-next-line
  }, [isAmenitiesEditing]);

  // Editable amenities functions
  const processEditableAmenities = () => editableAmenities;

  const updateCategoryName = (categoryIndex, newName) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].name = newName;
    setEditableAmenities(updated);
  };

  const updateAmenity = (categoryIndex, amenityIndex, field, value) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets[amenityIndex][field] = value;
    setEditableAmenities(updated);
  };

  const removeAmenity = (categoryIndex, amenityIndex) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets.splice(amenityIndex, 1);
    setEditableAmenities(updated);
  };

  const addNewAmenity = (categoryIndex) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets.push({
      name: "New Amenity",
      icon: "/images/default-icon.svg",
    });
    setEditableAmenities(updated);
  };

  const removeCategoryAmenities = (categoryIndex) => {
    const updated = editableAmenities.filter((_, index) => index !== categoryIndex);
    setEditableAmenities(updated);
  };

  const addNewCategory = () => {
    const newCategory = {
      name: "New Category",
      assets: [
        {
          name: "Sample Amenity",
          icon: "/images/default-icon.svg",
        },
      ],
    };
    setEditableAmenities([...editableAmenities, newCategory]);
  };

  const saveAmenitiesChanges = () => {
    setIsAmenitiesEditing(false);
    if (onSave) onSave(editableAmenities, editableAmenitiesPara);
  };

  // Use grouped amenities for display
  const groupedAmenities = groupAmenities(amenities);

  return (
    <div
      className="mb-4"
      id="amenities"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="p-0 pb-2">
        <h2
          className="mb-3 py-2 fw-bold text-white ps-3 d-flex justify-content-between align-items-center"
          style={{
            fontSize: window.innerWidth <= 768 ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {name} Amenities
          <span style={{ cursor: "pointer", marginRight: "12px" }}>
            {isAmenitiesEditing ? (
              <button
                className="btn btn-success btn-sm"
                style={{ backgroundColor: "white", color: "black" }}
                onClick={saveAmenitiesChanges}
              >
                Save
              </button>
            ) : (
              <img
                src="/images/edit-icon.svg"
                alt="Edit"
                style={{ width: "18px", height: "18px" }}
                onClick={() => setIsAmenitiesEditing(true)}
              />
            )}
          </span>
        </h2>
        <div className="px-3">
          <div
            className="mb-3"
            style={{
              fontSize: window.innerWidth <= 768 ? "12px" : "16px",
              outline: isAmenitiesEditing ? "1px solid #2067d1" : "none",
              background: isAmenitiesEditing ? "#f8faff" : "transparent",
              borderRadius: "4px",
              padding: isAmenitiesEditing ? "8px" : "0",
              cursor: isAmenitiesEditing ? "text" : "default",
              minHeight: "40px",
            }}
            contentEditable={isAmenitiesEditing}
            suppressContentEditableWarning={true}
            onInput={(e) => setEditableAmenitiesPara(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                isAmenitiesEditing ? editableAmenitiesPara : amenitiesPara
              ),
            }}
          />
          <div
            className="inner-item"
            style={{
              height: "400px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {(isAmenitiesEditing
              ? processEditableAmenities()
              : groupedAmenities
            ).map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  {isAmenitiesEditing ? (
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                        fontWeight: "bold",
                        color: "#2067d1",
                        background: "#f8faff",
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <p
                      className="fw-bolder mb-3"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                        color: "#2067d1",
                        fontWeight: "1000",
                        margin: 0,
                      }}
                    >
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </p>
                  )}
                  {isAmenitiesEditing && (
                    <div>
                      <button
                        onClick={() => addNewAmenity(categoryIndex)}
                        style={{
                          border: "1px solid #28a745",
                          background: "#f8fff8",
                          color: "#28a745",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      >
                        + Add Amenity
                      </button>
                      <button
                        onClick={() => removeCategoryAmenities(categoryIndex)}
                        style={{
                          border: "1px solid #dc3545",
                          background: "#fff8f8",
                          color: "#dc3545",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Remove Category
                      </button>
                    </div>
                  )}
                </div>
                <div className="row g-4 mb-5">
                  {category.assets.map((amenity, index) => (
                    <div key={index} className="col-6 col-md-3">
                      <div
                        className="d-flex align-items-center"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                          marginBottom: "16px",
                          fontWeight: "600",
                          position: "relative",
                        }}
                      >
                        {isAmenitiesEditing ? (
                          <>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                <img
                                  src={amenity.icon}
                                  alt={amenity.name}
                                  loading="lazy"
                                  style={{
                                    width: "35px",
                                    height: "35px",
                                    marginRight: "8px",
                                  }}
                                />
                                <input
                                  type="text"
                                  value={amenity.name}
                                  onChange={(e) => updateAmenity(categoryIndex, index, 'name', e.target.value)}
                                  style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    fontSize: window.innerWidth <= 768 ? "11px" : "14px",
                                    flex: 1,
                                    background: "#f8faff",
                                  }}
                                />
                              </div>
                              <div style={{ display: "flex", gap: "4px" }}>
                                <input
                                  type="text"
                                  placeholder="Icon URL"
                                  value={amenity.icon}
                                  onChange={(e) => updateAmenity(categoryIndex, index, 'icon', e.target.value)}
                                  style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    flex: 1,
                                    background: "#f8faff",
                                  }}
                                />
                                <button
                                  onClick={() => removeAmenity(categoryIndex, index)}
                                  style={{
                                    border: "none",
                                    background: "#dc3545",
                                    color: "white",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isAmenitiesEditing && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={addNewCategory}
                  style={{
                    border: "1px solid #2067d1",
                    background: "#f8faff",
                    color: "#2067d1",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  + Add New Category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSection;