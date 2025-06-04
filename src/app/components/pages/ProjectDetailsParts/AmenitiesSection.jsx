import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

// Example predefined amenities per category
const PREDEFINED_AMENITIES = {
  interior: [
    { name: "Modular Kitchen", icon: "/icons/kitchen.svg" },
    { name: "Wardrobes", icon: "/icons/wardrobe.svg" },
    { name: "False Ceiling", icon: "/icons/ceiling.svg" },
  ],
  exterior: [
    { name: "Swimming Pool", icon: "/icons/pool.svg" },
    { name: "Garden", icon: "/icons/garden.svg" },
    { name: "Play Area", icon: "/icons/playarea.svg" },
  ],
  security: [
    { name: "CCTV", icon: "/icons/cctv.svg" },
    { name: "Gated Security", icon: "/icons/gate.svg" },
    { name: "Fire Alarm", icon: "/icons/fire.svg" },
  ],
  other: [
    { name: "Power Backup", icon: "/icons/power.svg" },
    { name: "Lift", icon: "/icons/lift.svg" },
  ],
};

const AmenitiesSection = ({
  amenities = [],
  amenitiesPara = "",
  name = "",
  onSave,
}) => {
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editableAmenities, setEditableAmenities] = useState([]);
  const [editableAmenitiesPara, setEditableAmenitiesPara] = useState(amenitiesPara);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAmenities, setNewCategoryAmenities] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const fileInputRefs = useRef({});

  // Group amenities by category if not already grouped
  const groupAmenities = (amenitiesList) => {
    if (!amenitiesList || !Array.isArray(amenitiesList)) return [];
    if (amenitiesList.length && amenitiesList[0].assets) return amenitiesList;
    const grouped = amenitiesList.reduce((acc, amenity) => {
      const category = (amenity.category || "Other").toLowerCase();
      if (!acc[category]) {
        acc[category] = {
          name: category,
          assets: [],
        };
      }
      acc[category].assets.push({
        name: amenity.name,
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

  // Add amenity from dropdown
  const handleAddAmenity = (categoryIndex, amenity) => {
    const updated = [...editableAmenities];
    // Prevent duplicates
    if (!updated[categoryIndex].assets.some(a => a.name === amenity.name)) {
      updated[categoryIndex].assets.push({ ...amenity });
      setEditableAmenities(updated);
    }
  };

  // Remove amenity
  const removeAmenity = (categoryIndex, amenityIndex) => {
    const updated = [...editableAmenities];
    updated[categoryIndex].assets.splice(amenityIndex, 1);
    setEditableAmenities(updated);
  };

  // Change amenity icon
  const handleIconChange = (categoryIndex, amenityIndex, file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = [...editableAmenities];
      updated[categoryIndex].assets[amenityIndex].icon = ev.target.result;
      setEditableAmenities(updated);
    };
    reader.readAsDataURL(file);
  };

  // Save
  const saveAmenitiesChanges = () => {
    setIsAmenitiesEditing(false);
    if (onSave) onSave(editableAmenities, editableAmenitiesPara);
  };

  // Cancel
  const handleCancel = () => {
    setIsAmenitiesEditing(false);
    setEditableAmenities(groupAmenities(amenities));
    setEditableAmenitiesPara(amenitiesPara);
  };

  // Add this function inside your AmenitiesSection component
  const handleAddCategory = () => {
    if (
      newCategoryName &&
      !editableAmenities.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
      )
    ) {
      let assets = [];
      if (newCategoryAmenities) {
        assets = newCategoryAmenities.split(",").map((item) => {
          const name = item.trim();
          const lowerCat = newCategoryName.toLowerCase();
          const predefined = PREDEFINED_AMENITIES[lowerCat]?.find(a => a.name.toLowerCase() === name.toLowerCase());
          return {
            name,
            icon: predefined ? predefined.icon : "/icons/default.svg"
          };
        });
      }
      setEditableAmenities([
        ...editableAmenities,
        {
          name: newCategoryName.toLowerCase(),
          assets,
          icon: newCategoryIcon || "/icons/default.svg"
        }
      ]);
      setShowAddCategory(false);
      setNewCategoryName("");
      setNewCategoryAmenities("");
      setNewCategoryIcon("");
    }
  };

  // --- UI: Your original design preserved below ---
  return (
    <div className="mb-4" id="amenities" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
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
                  style={{ color: "white", fontWeight: "bold" }}
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
          <div className="inner-item" style={{ minHeight: "200px", maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
            {(isAmenitiesEditing ? editableAmenities : groupAmenities(amenities)).map(
              (category, categoryIndex) => (
                <div key={categoryIndex} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <span
                      className="fw-bolder"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                        color: "#2067d1",
                        fontWeight: "1000",
                        marginRight: 8,
                      }}
                    >
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </span>
                    {/* Only show dropdown in edit mode */}
                    {isAmenitiesEditing && (
                      <select
                        style={{
                          fontSize: "13px",
                          marginRight: 8,
                          borderRadius: 4,
                          border: "1px solid #2067d1",
                          padding: "2px 8px",
                        }}
                        onChange={e => {
                          const amenity = PREDEFINED_AMENITIES[category.name]?.find(
                            a => a.name === e.target.value
                          );
                          if (amenity) handleAddAmenity(categoryIndex, amenity);
                          e.target.selectedIndex = 0;
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Add Amenity
                        </option>
                        {(PREDEFINED_AMENITIES[category.name] || []).map((a, i) => (
                          <option key={i} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {category.assets.map((amenity, amenityIndex) => (
                      <div
                        key={amenityIndex}
                        className="d-flex align-items-center"
                        style={{
                          background: "#f8faff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "16px",
                          padding: "4px 10px 4px 6px",
                          marginBottom: 8,
                          position: "relative",
                          fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            marginRight: 6,
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={amenity.icon}
                            alt={amenity.name}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              border: "1px solid #ddd",
                              objectFit: "cover",
                              cursor: isAmenitiesEditing ? "pointer" : "default",
                              transition: "box-shadow 0.2s",
                            }}
                            title={isAmenitiesEditing ? "Change Icon" : amenity.name}
                            // Only allow icon upload in edit mode
                            onClick={() => {
                              if (isAmenitiesEditing) {
                                if (!fileInputRefs.current[`${categoryIndex}-${amenityIndex}`]) {
                                  fileInputRefs.current[`${categoryIndex}-${amenityIndex}`] = document.createElement('input');
                                  fileInputRefs.current[`${categoryIndex}-${amenityIndex}`].type = 'file';
                                  fileInputRefs.current[`${categoryIndex}-${amenityIndex}`].accept = 'image/*';
                                  fileInputRefs.current[`${categoryIndex}-${amenityIndex}`].style.display = 'none';
                                  fileInputRefs.current[`${categoryIndex}-${amenityIndex}`].onchange = (e) => {
                                    const file = e.target.files[0];
                                    if (file) handleIconChange(categoryIndex, amenityIndex, file);
                                  };
                                  document.body.appendChild(fileInputRefs.current[`${categoryIndex}-${amenityIndex}`]);
                                }
                                fileInputRefs.current[`${categoryIndex}-${amenityIndex}`].click();
                              }
                            }}
                          />
                        </div>
                        <span style={{ marginRight: 6 }}>{amenity.name}</span>
                        {/* Only show remove in edit mode */}
                        {isAmenitiesEditing && (
                          <span
                            style={{
                              color: "#dc3545",
                              fontWeight: "bold",
                              cursor: "pointer",
                              marginLeft: 2,
                              fontSize: 18,
                              lineHeight: 1,
                            }}
                            title="Remove"
                            onClick={() => removeAmenity(categoryIndex, amenityIndex)}
                          >
                            ×
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          {/* In your render, add this button just above the amenities list, only in edit mode: */}
          {isAmenitiesEditing && (
            <div className="mb-3">
              {!showAddCategory ? (
                <button
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  + Add New Category
                </button>
              ) : (
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    style={{ maxWidth: 150 }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Amenities (comma separated)"
                    value={newCategoryAmenities}
                    onChange={e => setNewCategoryAmenities(e.target.value)}
                    style={{ minWidth: 220 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 180 }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setNewCategoryIcon(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {newCategoryIcon && (
                    <img
                      src={newCategoryIcon}
                      alt="Category Icon"
                      style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #ddd" }}
                    />
                  )}
                  <button
                    className="btn btn-success btn-sm"
                    type="button"
                    onClick={handleAddCategory}
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    type="button"
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryName("");
                      setNewCategoryAmenities("");
                      setNewCategoryIcon("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSection;