import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const isMobile = window.innerWidth <= 768;

const AmenitiesSection = ({
  amenities = [],
  amenitiesPara = "",
  name = "",
  onSave, // Optional: callback to save changes to parent or API
  showEdit
}) => {
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editableAmenities, setEditableAmenities] = useState([]);
  const [editableAmenitiesPara, setEditableAmenitiesPara] = useState(amenitiesPara);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showCreateNewCategoryModal, setShowCreateNewCategoryModal] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    icon: "/images/noimage.png"
  });
  const [newCategoryAmenityName, setNewCategoryAmenityName] = useState("");
  const [showAddAmenityModal, setShowAddAmenityModal] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState("/images/noimage.png");
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
      icon: "/images/noimage.png",
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
          icon: "/images/noimage.png",
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
      { name: "Banquet Hall", icon: "/images/noimage.png" },
      { name: "Indoor Games", icon: "/images/noimage.png" },
    ],
    "Swimming Pool": [
      { name: "Kids Pool", icon: "/images/noimage.png" },
      { name: "Lap Pool", icon: "/images/noimage.png" },
    ],
    "Gym": [
      { name: "Cardio Zone", icon: "/images/noimage.png" },
      { name: "Weight Training", icon: "/images/noimage.png" },
      { name: "Yoga Studio", icon: "/images/noimage.png" },
      { name: "CrossFit Area", icon: "/images/noimage.png" },
      { name: "Steam Room", icon: "/images/noimage.png" },
      { name: "Sauna", icon: "/images/noimage.png" },
      { name: "Personal Training", icon: "/images/noimage.png" },
      { name: "Fitness Classes", icon: "/images/noimage.png" },
      { name: "Spinning Studio", icon: "/images/noimage.png" },
      { name: "Boxing Area", icon: "/images/noimage.png" },
      { name: "Dance Studio", icon: "/images/noimage.png" },
      { name: "Pilates Room", icon: "/images/noimage.png" },
      { name: "Zumba Classes", icon: "/images/noimage.png" },
      { name: "Aerobics Room", icon: "/images/noimage.png" },
      { name: "Stretching Area", icon: "/images/noimage.png" },
    ],
    "Security": [
      { name: "24/7 Security", icon: "/images/noimage.png" },
      { name: "CCTV Surveillance", icon: "/images/noimage.png" },
      { name: "Security Guards", icon: "/images/noimage.png" },
    ],
    "Parking": [
      { name: "Car Parking", icon: "/images/noimage.png" },
      { name: "Bike Parking", icon: "/images/noimage.png" },
      { name: "Visitor Parking", icon: "/images/noimage.png" },
    ],
    "Garden": [
      { name: "Landscaped Garden", icon: "/images/noimage.png" },
      { name: "Children's Play Area", icon: "/images/noimage.png" },
      { name: "Walking Track", icon: "/images/noimage.png" },
    ],
    "Other": [
      { name: "Power Backup", icon: "/images/noimage.png" },
      { name: "Rain Water Harvesting", icon: "/images/noimage.png" },
      { name: "Solar Panels", icon: "/images/noimage.png" },
    ],
  };

  // Add these states at the top of your component:
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Helpers for dropdowns
  const addedCategories = editableAmenities.map((cat) => cat.name);
  const availableCategories = ALL_CATEGORIES;
  const addedAmenities = (catName) => {
    const cat = editableAmenities.find((c) => c.name === catName);
    return cat ? cat.assets.map((a) => a.name) : [];
  };
  const [allAmenities, setAllAmenities] = useState(ALL_AMENITIES);
  const availableAmenities = selectedCategory
    ? (allAmenities[selectedCategory] || []).map((amenity) => ({
        ...amenity,
        alreadyAdded: addedAmenities(selectedCategory).includes(amenity.name),
      }))
    : [];

  // Add these functions for handling selections
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAmenities([]);
    } else {
      const availableItems = availableAmenities.filter(a => !a.alreadyAdded);
      setSelectedAmenities(availableItems);
    }
    setSelectAll(!selectAll);
  };

  const handleAmenitySelection = (amenity) => {
    const isSelected = selectedAmenities.some(a => a.name === amenity.name);
    if (isSelected) {
      setSelectedAmenities(selectedAmenities.filter(a => a.name !== amenity.name));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedAmenities, amenity];
      setSelectedAmenities(newSelected);
      // Check if all available amenities are now selected
      const availableItems = availableAmenities.filter(a => !a.alreadyAdded);
      setSelectAll(newSelected.length === availableItems.length);
    }
  };

  // Update handleAddAmenity to handle multiple selections
  const handleAddAmenity = () => {
    if (selectedAmenities.length === 0) return;
    
    let updated = [...editableAmenities];
    let catIndex = updated.findIndex(c => c.name === selectedCategory);
    
    if (catIndex === -1) {
      // Add new category with selected amenities
      updated.push({ 
        name: selectedCategory, 
        assets: selectedAmenities 
      });
    } else {
      // Add new amenities to existing category, avoiding duplicates
      const existingAmenities = updated[catIndex].assets;
      const newAmenities = selectedAmenities.filter(
        newAmenity => !existingAmenities.some(
          existing => existing.name === newAmenity.name
        )
      );
      
      if (newAmenities.length > 0) {
        updated[catIndex].assets = [
          ...existingAmenities,
          ...newAmenities
        ];
      }
    }
    
    setEditableAmenities(updated);
    setSelectedAmenities([]);
    setSelectAll(false);
  };

  const handleCancel = () => {
    setIsAmenitiesEditing(false);
    // Optionally reset editableAmenities and editableAmenitiesPara to original values if needed
  };

  const handleCreateNewCategory = () => {
    if (!newCategoryData.name) return;

    const updated = [...editableAmenities];
    updated.push({
      name: newCategoryData.name,
      assets: newCategoryAmenityName
        ? [{ name: newCategoryAmenityName, icon: newCategoryData.icon }]
        : []
    });

    setEditableAmenities(updated);
    setNewCategoryData({
      name: "",
      icon: "/images/noimage.png"
    });
    setNewCategoryAmenityName("");
    setShowCreateNewCategoryModal(false);
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
            fontSize: isMobile ? "16px" : "18px",
            backgroundColor: "#2067d1",
            borderRadius: "4px 4px 0 0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {name} Amenities
          {showEdit && (
            <span style={{ cursor: "pointer", marginRight: "12px" }}>
              {isAmenitiesEditing ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    style={{
                      backgroundColor: "white",
                      color: "#2067d1",
                      border: "1px solid #2067d1",
                      fontWeight: "bold"
                    }}
                    onClick={saveAmenitiesChanges}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      marginLeft: 8,
                      backgroundColor: "#6c757d",
                      color: "white",
                      fontWeight: "bold",
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
          )}
        </h2>
        <div className="px-3">
          <div
            className="mb-3"
            style={{
              fontSize: isMobile ? "12px" : "16px",
              outline: isAmenitiesEditing ? "1px solid #2067d1" : "none",
              background: isAmenitiesEditing ? "#f8faff" : "transparent",
              borderRadius: "4px",
              padding: isAmenitiesEditing ? "12px" : "0",
              cursor: isAmenitiesEditing ? "text" : "default",
              minHeight: "40px",
              lineHeight: "1.6",
              color: "#444",
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
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {(isAmenitiesEditing
              ? processEditableAmenities()
              : groupedAmenities
            ).map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: "32px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: "16px",
                  padding: "8px 12px",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}>
                  {isAmenitiesEditing ? (
                    <>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                        style={{
                          width: "100%",
                          padding: isMobile ? "8px" : "10px 12px",
                          fontSize: isMobile ? "15px" : "16px",
                          marginBottom: isMobile ? "10px" : "16px",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#2067d1"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                      />
                      <button
                        onClick={() => removeCategoryAmenities(categoryIndex)}
                        style={{
                          border: "none",
                          background: "#dc3545",
                          color: "white",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          fontSize: "16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
                        title="Remove Category"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <p
                      className="fw-bolder mb-0"
                      style={{
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#2067d1",
                        fontWeight: "600",
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {category.name}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "8px",
                    width: "100%",
                    marginBottom: isMobile ? "12px" : "16px",
                  }}
                >
                  {category.assets.map((amenity, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center"
                      style={{
                        fontSize: isMobile ? "11px" : "14px",
                        marginBottom: "16px",
                        fontWeight: "500",
                        position: "relative",
                        backgroundColor: "#fff",
                        padding: "12px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "transform 0.2s",
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
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
                                  width: "32px",
                                  height: "32px",
                                  marginRight: "12px",
                                  objectFit: "contain",
                                }}
                              />
                              <span style={{ color: "#444" }}>{amenity.name}</span>
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
                                marginLeft: "auto",
                                transition: "all 0.2s",
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                              onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
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
                              width: "32px",
                              height: "32px",
                              marginRight: "12px",
                              objectFit: "contain",
                            }}
                          />
                          <span style={{ color: "#444" }}>{amenity.name}</span>
                        </>
                      )}
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
            padding: "16px",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            backgroundColor: "#f8f9fa",
            borderRadius: "0 0 4px 4px",
          }}
        >
          <div style={{ width: isMobile ? "100%" : "auto", display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowAmenityModal(true)}
              style={{
                padding: isMobile ? "10px" : "8px 20px",
                border: "none",
                borderRadius: "6px",
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: "500",
                backgroundColor: "#2067d1",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: isMobile ? "8px" : "0",
                width: "auto",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1857b0"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#2067d1"}
            >
              <span>+</span> Add Amenity
            </button>
          </div>
        </div>
      )}
      {showAmenityModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            padding: isMobile ? 0 : undefined,
          }}
          onClick={() => {
            setShowAmenityModal(false);
            setSelectedAmenities([]);
            setSelectAll(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: isMobile ? "16px 16px 0 0" : "12px",
              padding: isMobile ? "16px" : "32px",
              width: isMobile ? "100vw" : "90vw",
              maxWidth: isMobile ? "100vw" : "800px",
              maxHeight: isMobile ? "90vh" : "80vh",
              margin: isMobile ? 0 : "auto",
              position: "relative",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "24px",
              borderBottom: "1px solid #eee",
              paddingBottom: "16px",
              flexShrink: 0,
            }}>
              <h5 style={{ 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "600",
                color: "#2067d1"
              }}>Add Amenities</h5>
              <button
                style={{
                  position: "absolute",
                  top: isMobile ? 8 : 16,
                  right: isMobile ? 8 : 16,
                  fontSize: isMobile ? "28px" : "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  borderRadius: "50%",
                  width: isMobile ? "40px" : "32px",
                  height: isMobile ? "40px" : "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  setShowAmenityModal(false);
                  setSelectedAmenities([]);
                  setSelectAll(false);
                }}
              >
                ×
              </button>
            </div>

            <div style={{ 
              marginBottom: "24px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#444"
              }}>Category</label>
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setSelectedAmenities([]);
                  setSelectAll(false);
                }}
                style={{ 
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#2067d1"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              >
                <option value="">Select Category</option>
                {availableCategories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{
                      padding: "8px",
                      backgroundColor: "#fff",
                      color: "#333",
                    }}
                  >
                    {cat}
                    {addedCategories.includes(cat) ? " (Has existing amenities)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ 
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}>
              <div style={{ 
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}>
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <label 
                  htmlFor="selectAll"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#444",
                    cursor: "pointer",
                  }}
                >
                  Select All Available Amenities
                </label>
              </div>

              <div style={{ 
                flex: 1,
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "8px",
                marginBottom: "16px",
                maxHeight: "300px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}>
                {availableAmenities.length > 0 ? (
                  <>
                    {availableAmenities.map((amenity) => (
                      <div
                        key={amenity.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px",
                          borderRadius: "4px",
                          backgroundColor: amenity.alreadyAdded ? "#f5f5f5" : "#fff",
                          cursor: amenity.alreadyAdded ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          border: "1px solid transparent",
                          height: "100%",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          background: "#ffffff",
                          border: "1px solid #f0f0f0",
                          minHeight: "60px",
                        }}
                        onMouseOver={(e) => !amenity.alreadyAdded && (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                        onMouseOut={(e) => !amenity.alreadyAdded && (e.currentTarget.style.backgroundColor = "#fff")}
                        onClick={() => !amenity.alreadyAdded && handleAmenitySelection(amenity)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.some(a => a.name === amenity.name)}
                          onChange={() => !amenity.alreadyAdded && handleAmenitySelection(amenity)}
                          disabled={amenity.alreadyAdded}
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "12px",
                            cursor: amenity.alreadyAdded ? "not-allowed" : "pointer",
                          }}
                        />
                        <img
                          src={amenity.icon}
                          alt={amenity.name}
                          loading="lazy"
                          style={{
                            width: "24px",
                            height: "24px",
                            marginRight: "12px",
                            objectFit: "contain",
                            opacity: amenity.alreadyAdded ? 0.5 : 1,
                          }}
                        />
                        <span style={{
                          color: amenity.alreadyAdded ? "#999" : "#333",
                          fontSize: "14px",
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {amenity.name}
                          {amenity.alreadyAdded && " (Already added)"}
                        </span>
                      </div>
                    ))}
                    <div
                      key="add-new-amenity"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px",
                        borderRadius: "4px",
                        backgroundColor: "#f4f8fb",
                        cursor: "pointer",
                        border: "1px dashed #2067d1",
                        minHeight: "60px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                        fontSize: "28px",
                        color: "#2067d1",
                        fontWeight: "bold",
                        transition: "background 0.2s",
                      }}
                      onClick={() => setShowAddAmenityModal(true)}
                      title="Add New Amenity"
                    >
                      <span style={{ fontSize: "28px", fontWeight: "bold" }}>+</span>
                      <span style={{ fontSize: "13px", color: "#2067d1" }}>Add Amenity</span>
                    </div>
                  </>
                ) : (
                  <div style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    border: "1px dashed #ddd",
                    gridColumn: "1 / -1",
                  }}>
                    No amenities available for this category
                  </div>
                )}
              </div>

              <div style={{ margin: isMobile ? "12px 0" : "0" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateNewCategoryModal(true)}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    padding: isMobile ? "12px" : "8px 20px",
                    fontSize: isMobile ? "17px" : "15px",
                    borderRadius: "6px",
                    fontWeight: 600,
                  }}
                >
                  Create New
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "flex-end",
                alignItems: isMobile ? "stretch" : "center",
                gap: "12px",
                borderTop: "1px solid #eee",
                paddingTop: "16px",
                marginTop: "auto",
                width: "100%",
              }}
            >
              <button
                className="btn btn-light"
                onClick={() => {
                  setShowAmenityModal(false);
                  setSelectedAmenities([]);
                  setSelectAll(false);
                }}
                style={{
                  width: isMobile ? "100%" : "auto",
                  padding: isMobile ? "12px" : "8px 20px",
                  fontSize: isMobile ? "17px" : "14px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontWeight: 500,
                  color: "#666",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleAddAmenity();
                  setShowAmenityModal(false);
                }}
                disabled={selectedAmenities.length === 0}
                style={{
                  width: isMobile ? "100%" : "auto",
                  padding: isMobile ? "12px" : "8px 20px",
                  fontSize: isMobile ? "17px" : "14px",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor: "#2067d1",
                  cursor: "pointer",
                  opacity: selectedAmenities.length === 0 ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                Add Selected Amenities ({selectedAmenities.length})
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateNewCategoryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCreateNewCategoryModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "24px",
              borderBottom: "1px solid #eee",
              paddingBottom: "16px",
            }}>
              <h5 style={{ 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "600",
                color: "#2067d1"
              }}>Create New Category</h5>
              <button 
                onClick={() => setShowCreateNewCategoryModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#444" }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    color: "#333",
                    backgroundColor: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2067d1"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>

              {/* <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#444" }}>
                  Amenity Name
                </label>
                <input
                  type="text"
                  value={newCategoryAmenityName}
                  onChange={(e) => setNewCategoryAmenityName(e.target.value)}
                  placeholder="Enter amenity name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    color: "#333",
                    backgroundColor: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2067d1"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div> */}

              {/* <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#444" }}>
                  Default Icon URL
                </label>
                <input
                  type="text"
                  value={newCategoryData.icon}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="Enter icon URL"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    color: "#333",
                    backgroundColor: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2067d1"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div> */}
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "12px",
              marginTop: "24px",
              borderTop: "1px solid #eee",
              paddingTop: "16px",
            }}>
              <button
                onClick={() => setShowCreateNewCategoryModal(false)}
                style={{
                  padding: "8px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#666",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewCategory}
                disabled={!newCategoryData.name}
                style={{
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#fff",
                  backgroundColor: "#2067d1",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: !newCategoryData.name ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#1857b0";
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#2067d1";
                  }
                }}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddAmenityModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowAddAmenityModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#2067d1", marginBottom: "20px" }}>
              Add New Amenity
            </h5>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>Amenity Name</label>
              <input
                type="text"
                value={newAmenityName}
                onChange={e => setNewAmenityName(e.target.value)}
                placeholder="Enter amenity name"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>Icon URL</label>
              <input
                type="text"
                value={newAmenityIcon}
                onChange={e => setNewAmenityIcon(e.target.value)}
                placeholder="Enter icon URL"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowAddAmenityModal(false)}
                style={{
                  padding: "8px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#666",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newAmenityName) return;
                  setAllAmenities(prev => {
                    const updated = { ...prev };
                    if (updated[selectedCategory]) {
                      updated[selectedCategory] = [
                        ...updated[selectedCategory],
                        { name: newAmenityName, icon: newAmenityIcon || "/images/noimage.png" }
                      ];
                    } else {
                      updated[selectedCategory] = [{ name: newAmenityName, icon: newAmenityIcon || "/images/noimage.png" }];
                    }
                    return updated;
                  });
                  setShowAddAmenityModal(false);
                  setNewAmenityName("");
                  setNewAmenityIcon("/images/noimage.png");
                }}
                style={{
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#fff",
                  backgroundColor: "#2067d1",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: !newAmenityName ? 0.6 : 1,
                }}
                disabled={!newAmenityName}
              >
                Add Amenity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitiesSection;