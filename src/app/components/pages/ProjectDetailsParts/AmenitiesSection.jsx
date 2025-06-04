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

  // Dummy data for dropdowns (replace with API data as needed)
  const ALL_CATEGORIES = [
    "Club House",
    "Swimming Pool",
    "Gym",
    "Security",
    "Parking",
    "Garden",
    "Other",
  ];

  const ALL_AMENITIES = {
    "Club House": [
      { name: "Banquet Hall", icon: "/images/banquet.svg" },
      { name: "Indoor Games", icon: "/images/indoor-games.svg" },
    ],
    "Swimming Pool": [
      { name: "Kids Pool", icon: "/images/kids-pool.svg" },
      { name: "Lap Pool", icon: "/images/lap-pool.svg" },
    ],
    "Gym": [
      { name: "Cardio Zone", icon: "/images/cardio.svg" },
      { name: "Weight Training", icon: "/images/weights.svg" },
    ],
    // ...add more as needed
  };

  // Add these states at the top of your component:
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  // Helpers for dropdowns
  const addedCategories = editableAmenities.map((cat) => cat.name);
  const availableCategories = ALL_CATEGORIES;
  const addedAmenities = (catName) => {
    const cat = editableAmenities.find((c) => c.name === catName);
    return cat ? cat.assets.map((a) => a.name) : [];
  };
  const availableAmenities = selectedCategory
    ? (ALL_AMENITIES[selectedCategory] || []).map((amenity) => ({
        ...amenity,
        alreadyAdded: addedAmenities(selectedCategory).includes(amenity.name),
      }))
    : [];

  // Add this function in your component:
  const handleAddAmenity = () => {
    if (!selectedCategory || !selectedAmenity) return;
    const amenityObj = (ALL_AMENITIES[selectedCategory] || []).find(a => a.name === selectedAmenity);
    let updated = [...editableAmenities];
    let catIndex = updated.findIndex(c => c.name === selectedCategory);
    if (catIndex === -1) {
      updated.push({ name: selectedCategory, assets: [amenityObj] });
    } else {
      updated[catIndex].assets.push(amenityObj);
    }
    setEditableAmenities(updated);
    setSelectedAmenity("");
  };
 const handleCancel = () => {
  setIsAmenitiesEditing(false);
  // Optionally reset editableAmenities and editableAmenitiesPara to original values if needed
};
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
              <>
              <button
                className="btn btn-success btn-sm"
                style={{ backgroundColor: "white", color: "black" }}
                onClick={saveAmenitiesChanges}
              >
                Save
              </button>
              <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#6c757d",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                </>
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
                    <>
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
                      <button
                        onClick={() => removeCategoryAmenities(categoryIndex)}
                        style={{
                          border: "none",
                          background: "#dc3545",
                          color: "white",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          fontSize: "16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Remove Category"
                      >
                        ×
                      </button>
                    </>
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
                                <span>{amenity.name}</span>
                              </div>
                              <button
                                onClick={() => removeAmenity(categoryIndex, index)}
                                style={{
                                  border: "none",
                                  background: "#dc3545",
                                  color: "white",
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginLeft: "8px"
                                }}
                                title="Remove Amenity"
                              >
                                ×
                              </button>
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
         
          </div>
        </div>
      </div>
      {isAmenitiesEditing && (
        <div
          style={{
            borderTop: "1px solid #eee",
            marginTop: "24px",
            paddingTop: "16px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedAmenity("");
            }}
            style={{ minWidth: 150, padding: "6px" }}
          >
            <option value="">Select Category</option>
            {availableCategories.map((cat, idx) => (
              <option
                key={cat}
                value={cat}
                disabled={addedCategories.includes(cat)}
                style={
                  addedCategories.includes(cat)
                    ? { filter: "blur(1px)", color: "#aaa" }
                    : {}
                }
              >
                {cat}
                {addedCategories.includes(cat) ? " (Already added)" : ""}
              </option>
            ))}
          </select>
          {/* Amenity Dropdown */}
          <select
            value={selectedAmenity}
            onChange={(e) => setSelectedAmenity(e.target.value)}
            style={{ minWidth: 150, padding: "6px" }}
            disabled={!selectedCategory}
          >
            <option value="">Select Amenity</option>
            {availableAmenities.map((amenity, idx) => (
              <option
                key={amenity.name}
                value={amenity.name}
                disabled={amenity.alreadyAdded}
                style={
                  amenity.alreadyAdded
                    ? { filter: "blur(1px)", color: "#aaa" }
                    : {}
                }
              >
                {amenity.name}
                {amenity.alreadyAdded ? " (Already added)" : ""}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddAmenity}
            disabled={
              !selectedCategory ||
              !selectedAmenity ||
              availableAmenities.find(
                (a) => a.name === selectedAmenity && a.alreadyAdded
              )
            }
          >
            Add Amenity
          </button>
        </div>
      )}
    </div>
  );
};

export default AmenitiesSection;