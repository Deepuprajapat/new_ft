import React, { useState, useEffect } from "react";
import {getAmenties , getAllAmenitiesWithCategorys, Addcategories, Addamentiesforcategory, patchStaticSiteData, deleteamentiesforcategory, deletecategory} from '../../../apis/api'
import { imgUplod } from '../../../../utils/common.jsx';

const isMobile = window.innerWidth <= 768;

const AmenitiesSection = ({
  amenities = [],
  amenitiesPara = "",
  name = "",
  showEdit,
  handleSave,
  projectData
}) => {
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editableAmenities, setEditableAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editableAmenitiesPara, setEditableAmenitiesPara] = useState(amenitiesPara);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showCreateNewCategoryModal, setShowCreateNewCategoryModal] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    icon: "/images/noimage.png"
  });
  const [newCategoryAmenityName, setNewCategoryAmenityName] = useState("");
  const [showAddAmenityModal, setShowAddAmenityModal] = useState(false);
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

  const removeAmenity = async (categoryIndex, amenityIndex) => {
    const updated = [...editableAmenities];
    const categoryName = updated[categoryIndex].name;
    // The amenity value should be the backend value, not the display name
    // If your asset object has a 'value' field, use that. If not, convert from display name:
    let amenityValue = updated[categoryIndex].assets[amenityIndex].value;
    if (!amenityValue) {
      // Fallback: convert display name to value (e.g., "Car Parking" -> "car_parking")
      amenityValue = updated[categoryIndex].assets[amenityIndex].name
        .replace(/ /g, '_')
        .toLowerCase();
    }

    // Call the API to delete the amenity
    await deleteamentiesforcategory(categoryName, amenityValue);

    // Remove from local state
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

  const removeCategoryAmenities = async (categoryIndex) => {
    const categoryToRemove = editableAmenities[categoryIndex];
    console.log('categoryToRemove:', categoryToRemove);

    // Call the API to delete the entire category
    await deletecategory(categoryToRemove?.name || '');
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
    const safeProjectData = projectData || {};
    const safeWebCards = safeProjectData.web_cards || {};

    // Build categories_with_amenities object
    const categoriesObj = {};
    editableAmenities.forEach(category => {
      categoriesObj[category.name] = category.assets.map(asset => ({
        icon: asset.icon,
        value: asset.name?.replace(/ /g, '_').toLowerCase() || ''
      }));
    });

    // Build amenities object with description and categories_with_amenities
    const amenitiesObj = {
      description: editableAmenitiesPara,
      categories_with_amenities: categoriesObj
    };

    const updatedData = {
      ...safeProjectData,
      web_cards: {
        ...safeWebCards,
        amenities: amenitiesObj
      }
    };
    handleSave(updatedData);
    setIsAmenitiesEditing(false);
  };

  // Use grouped amenities for display
  const groupedAmenities = groupAmenities(amenities);

  // Add state for API amenities data
  const [apiAmenities, setApiAmenities] = useState({});

  // Fetch amenities from getAllAmenitiesWithCategorys when modal opens
  useEffect(() => {
    if (showAmenityModal) {
      const fetchAmenities = async () => {
        try {
          const res = await getAllAmenitiesWithCategorys();
          const categories = res?.data?.categories || {};
          console.log(categories,"ndjjledljned")
          setApiAmenities(categories);
        } catch (err) {
          setApiAmenities({});
        }
      };
      fetchAmenities();
    }
  }, [showAmenityModal]);

  // Use API data for categories and amenities
  const availableCategories = Object.keys(apiAmenities);

  const addedCategories = editableAmenities.map((cat) => cat.name);
  const addedAmenities = (catName) => {
    const cat = editableAmenities.find((c) => c.name === catName);
    return cat ? cat.assets.map((a) => a.name) : [];
  };

  const availableAmenities = selectedCategory
    ? (apiAmenities[selectedCategory] || []).map((amenity) => ({
        name: amenity.value,
        icon: amenity.icon,
        alreadyAdded: addedAmenities(selectedCategory).includes(amenity.value),
      }))
    : [];

  // Add these functions for handling selections
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAmenities([]);
    } else {
      setSelectedAmenities(availableAmenities);
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

  // Add this function to patch selected category and amenities
  const patchSelectedCategoryAmenities = async () => {
    if (!selectedCategory || selectedAmenities.length === 0) return;
    const categories = {
      [selectedCategory]: selectedAmenities
    };
    try {
      await patchStaticSiteData(categories);
      // Optionally handle success (e.g., show a message)
    } catch (err) {
      // Optionally handle error
    }
  };

  // Update handleAddAmenity to handle multiple selections
  const handleAddAmenity = async () => {
    if (selectedAmenities.length === 0) return;
    
    try {
      // First call the API to add amenities
      const payload = {
        amenities: selectedAmenities.map(a => ({ 
          value: a.value || a.name, 
          icon: a.icon 
        }))
      };
      await Addamentiesforcategory(selectedCategory, payload);
  
      // Then update local state
      let updated = [...editableAmenities];
      let catIndex = updated.findIndex(c => c.name === selectedCategory);
      
      // Convert selected amenities to the correct format
      const formattedAmenities = selectedAmenities.map(a => ({
        name: a.value ? a.value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : a.name,
        icon: a.icon
      }));
      
      if (catIndex === -1) {
        // Add new category with selected amenities
        updated.push({ 
          name: selectedCategory, 
          assets: formattedAmenities 
        });
      } else {
        // Add new amenities to existing category, avoiding duplicates
        const existingAmenities = updated[catIndex].assets;
        const newAmenities = formattedAmenities.filter(
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
      
      // Refresh API data to reflect changes
      await fetchCategoriesWithAmenities();
      
      // Reset selections but keep category selected
      setSelectedAmenities([]);
      setSelectAll(false);
      
      // Don't close modal, just show success
      alert('Amenities added successfully!');
      
    } catch (error) {
      console.error('Error adding amenities:', error);
      alert('Failed to add amenities. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsAmenitiesEditing(false);
    // Optionally reset editableAmenities and editableAmenitiesPara to original values if needed
  };

  const fetchCategoriesWithAmenities = async () => {
    try {
      // Get the latest data from the API that has all categories
      const res = await getAllAmenitiesWithCategorys();
      const categories = res?.data?.categories || {};
      setApiAmenities(categories);
    } catch (err) {
      setApiAmenities({});
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryData.name) return;

    try {
      // Call the Addcategories API with the correct payload
        await Addcategories({ category_name: newCategoryData.name });

      // Refresh categories from API
      await fetchCategoriesWithAmenities();

      setEditableAmenities([
        ...editableAmenities,
        {
          name: newCategoryData.name,
          assets: newCategoryAmenityName
            ? [{ name: newCategoryAmenityName, icon: newCategoryData.icon }]
            : []
        }
      ]);
      setNewCategoryData({
        name: "",
        icon: "/images/noimage.png"
      });
      setNewCategoryAmenityName("");
      setShowCreateNewCategoryModal(false);
      setShowAmenityModal(false); // Force close first

      setTimeout(() => {
        setShowAmenityModal(true); // Reopen after a tick
        setSelectedCategory("");   // Reset dropdown selection
      }, 0);
    } catch (error) {
      alert("Failed to save new category. Please try again.");
    }
  };

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // For amenities derived from projectData, use a different variable name:
  const projectAmenitiesObj = projectData?.web_cards?.amenities || {};
  const projectAmenities = Object.entries(projectAmenitiesObj)
    .filter(([key]) => key !== "description")
    .map(([category, assets]) => ({
      name: category,
      assets: Array.isArray(assets)
        ? assets.map((item) => ({
            name: item.value
              ? item.value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              : "",
            icon: item.icon || "",
          }))
        : []
    }));
  console.log(projectAmenities, "ajksdkh");

  // Add state for new amenity form
  const [showAddAmenityForm, setShowAddAmenityForm] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState("");
  const [newAmenityIconPreview, setNewAmenityIconPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [addingAmenity, setAddingAmenity] = useState(false);

  const handleAddAmenitiesToCategory = async () => {
    if (!selectedCategory || selectedAmenities.length === 0) return;
    try {
      // Prepare the payload as per the required format
      const payload = {
        amenities: selectedAmenities.map(a => ({ value: a.value, icon: a.icon }))
      };
      await Addamentiesforcategory(selectedCategory, payload);
      setShowAmenityModal(false);
      setSelectedAmenities([]);
      setSelectAll(false);
    } catch (err) {
      alert('Failed to add amenities.');
    }
  };

  // Add this useEffect after the other useEffects, before the return statement
  useEffect(() => {
    if (!isAmenitiesEditing && projectData?.web_cards?.amenities) {
      setEditableAmenities(groupAmenities(projectData.web_cards.amenities));
    }
    // eslint-disable-next-line
  }, [projectData?.web_cards?.amenities, isAmenitiesEditing]);

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
            onBlur={(e) => setEditableAmenitiesPara(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={undefined}
            ref={el => {
              if (el && el.innerHTML !== editableAmenitiesPara) el.innerHTML = editableAmenitiesPara;
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
              : Array.isArray(amenities) ? amenities : []
            ).map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: "10px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: "16px",
                  padding: "8px 12px",
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
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  {category.assets.map((amenity, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center"
                      style={{
                        fontSize: isMobile ? "11px" : "14px",
                        color: "black",
                        marginBottom: "8px",
                        fontWeight: "700",
                        position: "relative",
                        padding: "12px",
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
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "8px",
                marginBottom: "16px",
                maxHeight: "300px",
                display: "grid",
                gap: "8px",
              }}>
                {selectedCategory && apiAmenities[selectedCategory] && (
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
                    {apiAmenities[selectedCategory].map((amenity, idx) => {
                      // Use .name for selectedAmenities, since availableAmenities uses .name
                      const isSelected = selectedAmenities.some(a => a.name === amenity.value);
                      return (
                        <div
                          key={amenity.value || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px",
                            borderRadius: "4px",
                            backgroundColor: isSelected ? "#e6f0ff" : "#fff",
                            cursor: "pointer",
                            border: isSelected ? "2px solid #2067d1" : "1px solid #f0f0f0",
                            minHeight: "60px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                            fontSize: "14px",
                            color: "#333",
                            transition: "background 0.2s, border 0.2s"
                          }}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAmenities(selectedAmenities.filter(a => a.name !== amenity.value));
                            } else {
                              setSelectedAmenities([...selectedAmenities, { ...amenity, name: amenity.value }]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedAmenities(selectedAmenities.filter(a => a.name !== amenity.value));
                              } else {
                                setSelectedAmenities([...selectedAmenities, { ...amenity, name: amenity.value }]);
                              }
                            }}
                            style={{ marginRight: "12px" }}
                          />
                          <img
                            src={amenity.icon}
                            alt={amenity.value}
                            style={{ width: "24px", height: "24px", marginRight: "12px", objectFit: "contain" }}
                          />
                          <span style={{ flex: 1 }}>{amenity.value ? amenity.value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div
                  key="add-new-amenity"
                  style={{
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
                    fontSize: "18px",
                    color: "#2067d1",
                    fontWeight: "bold",
                    transition: "background 0.2s",
                    height: "60px", // Match the height of other cards
                    width: "100%", // Make it fill the grid cell like other cards
                    justifySelf: "stretch",
                    alignSelf: "stretch",
                    textAlign: "center"
                  }}
                  onClick={() => setShowAddAmenityForm(true)}
                  title="Add New Amenity"
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
                  <span style={{ fontSize: "13px", color: "#2067d1" }}>Add Amenity</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: isMobile ? "stretch" : "space-between",
                alignItems: "center",
                gap: "12px",
                borderTop: "1px solid #eee",
                paddingTop: "16px",
                marginTop: "auto",
                width: "100%",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateNewCategoryModal(true)}
                style={{
                  width: isMobile ? "100%" : "auto",
                  padding: isMobile ? "12px" : "8px 20px",
                  fontSize: isMobile ? "17px" : "14px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  order: isMobile ? 2 : 0, // On mobile, move below
                }}
              >
                Create New Category
              </button>
              <div style={{ display: "flex", gap: "12px", width: isMobile ? "100%" : "auto" }}>
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
                  disabled={selectedAmenities.length === 0 || !selectedCategory}
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
                  onClick={handleAddAmenity}
                >
                  Add Selected Amenities ({selectedAmenities.length})
                </button>
              </div>
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
      {showAddAmenityForm && (
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
          onClick={() => setShowAddAmenityForm(false)}
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
              <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>Amenity Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploading(true);
                    try {
                      const file = e.target.files[0];
                      const url = await imgUplod(file, { alt_keywords: newAmenityName||"icon" , file_path: "/new_vi"});

                      setNewAmenityIcon(url);
                      setNewAmenityIconPreview(url);
                    } catch (err) {
                      alert('Image upload failed');
                    }
                    setUploading(false);
                  }
                }}
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
              {newAmenityIconPreview && (
                <img src={newAmenityIconPreview} alt="Preview" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 6, border: "1px solid #eee", marginTop: 8 }} />
              )}
              {uploading && <span>Uploading...</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowAddAmenityForm(false);
                  setNewAmenityName("");
                  setNewAmenityIcon("");
                  setNewAmenityIconPreview("");
                }}
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
                onClick={async () => {
                  if (!newAmenityName || !newAmenityIcon) return;
                  setAddingAmenity(true);
                  try {
                    const payload = {
                      amenities: [
                        {
                          icon: newAmenityIcon,
                          value: newAmenityName
                        }
                      ]
                    };
                    await Addamentiesforcategory(selectedCategory, payload);
                    // Refresh the API data to show new amenity
                    await fetchCategoriesWithAmenities();
                    // Reset form but keep the modal open and category selected
                    setNewAmenityName("");
                    setNewAmenityIcon("");
                    setNewAmenityIconPreview("");
                    setShowAddAmenityForm(false);
                  } catch (err) {
                  }
                  setAddingAmenity(false);
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
                  opacity: !newAmenityName || !newAmenityIcon ? 0.6 : 1,
                }}
                disabled={!newAmenityName || !newAmenityIcon || addingAmenity}
              >
                {addingAmenity ? 'Adding...' : 'Add Amenity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitiesSection;