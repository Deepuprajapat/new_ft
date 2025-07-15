import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DUMMY_IMAGE_PATH = require('../../../assets/img/dummy.webp');

const SortableImage = ({
  id,
  index,
  imageData,
  isMainImage,
  handleImageUpload,
  hoveredImageIndex,
  setHoveredImageIndex,
  setShowFullScreen,
  setCurrentImageIndex,
  showEdit,
  isDataLoaded, // Add this prop
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Only show dummy image if data is loaded and no actual image exists
  const imageUrl = imageData?.imageUrl
    ? imageData.imageUrl
    : (isDataLoaded ? DUMMY_IMAGE_PATH : "");
  
  const caption = imageData?.caption || `Image ${index + 1}`;

  // Don't render anything if data is not loaded and no image URL
  if (!isDataLoaded && !imageData?.imageUrl) {
    return (
      <div
        ref={setNodeRef}
        {...(showEdit ? { ...attributes, ...listeners } : {})}
        className={isMainImage ? "col-12 col-md-6 p-0 pe-0 pe-md-1" : "col-6"}
        style={{
          ...style,
          height: isMainImage ? "540px" : "270px",
          padding: !isMainImage ? "0 0 0.5px 0.5px" : undefined,
          backgroundColor: '#f8f9fa', // Light background while loading
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const imageContent = (
    <div
      className={`position-relative ${isMainImage ? 'h-100' : ''}`}
      style={{ height: isMainImage ? "540px" : "270px" }}
      onMouseEnter={() => showEdit && setHoveredImageIndex(index)}
      onMouseLeave={() => showEdit && setHoveredImageIndex(null)}
    >
      <a
        href={imageUrl}
        data-toggle="lightbox"
        data-gallery="gallery"
        className="d-block h-100"
        onClick={(e) => {
          e.preventDefault();
          setShowFullScreen(true);
          setCurrentImageIndex(index);
        }}
      >
        <img
          alt={caption}
          src={imageUrl}
          loading="lazy"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            cursor: "pointer",
            filter: showEdit && hoveredImageIndex === index ? "blur(4px)" : "none",
            transition: "filter 0.3s ease"
          }}
          fetchpriority="high"
        />
      </a>
      {showEdit && hoveredImageIndex === index && (
        <div
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            padding: '15px',
            cursor: 'pointer',
            zIndex: 2
          }}
        >
          <label htmlFor={`image-upload-${index}`} style={{ margin: 0, cursor: 'pointer' }}>
            <FontAwesomeIcon
              icon={faCamera}
              style={{
                color: 'white',
                fontSize: '25px',
                transition: 'transform 0.3s ease',
                transform: 'scale(1.2)'
              }}
            />
          </label>
          <input
            type="file"
            id={`image-upload-${index}`}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleImageUpload(index, e)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      {...(showEdit ? { ...attributes, ...listeners } : {})}
      className={isMainImage ? "col-12 col-md-6 p-0 pe-0 pe-md-1" : "col-6"}
      style={{
        ...style,
        height: isMainImage ? "540px" : "270px",
        padding: !isMainImage ? "0 0 0.5px 0.5px" : undefined
      }}
    >
      {imageContent}
    </div>
  );
};

const ProjectGallerySection = ({
  projectData,
  setProjectData,
  setShowFullScreen,
  setCurrentImageIndex,
  showEdit,
  handleSave: handleSaveProp,
}) => {
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [localImages, setLocalImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Add this state
  const [selectedImage, setSelectedImage] = useState(null);

  const IMAGE_BASE_URL = "https://image.investmango.com/project/venkatesh-laurel/";

  function getDisplayUrl(img) {
    if (!img?.imageUrl) return DUMMY_IMAGE_PATH;
    if (img.imageUrl.startsWith("blob:") || img.imageUrl.startsWith("data:")) {
      return img.imageUrl; // Local preview for new uploads
    }
    if (!img.imageUrl.startsWith("http")) {
      return IMAGE_BASE_URL + img.imageUrl; // For file names from DB
    }
    return img.imageUrl;
  }

  // Initialize localImages with projectData.web_cards.images (skip first image)
  useEffect(() => {
    // Only process if projectData is available
    if (projectData && projectData.web_cards && projectData.web_cards.images) {
      // Skip the first image (index 0)
      const images =
        projectData.web_cards.images.length > 1
          ? projectData.web_cards.images.slice(1).map((fileName, idx) => ({
              imageUrl: fileName, // Just the file name
              caption: fileName,
            }))
          : [];
      setLocalImages(images);
      setIsDataLoaded(true); // Mark data as loaded
    } else if (projectData) {
      // If projectData exists but no images, still mark as loaded
      setLocalImages([]);
      setIsDataLoaded(true);
    }
  }, [projectData]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    const mainImage = projectData?.web_cards?.images?.[0] || "";
    const imagesArray = [mainImage, ...imageSlots.map(img => img.imageUrl || "")];
    setProjectData({
      ...projectData,
      web_cards: {
        ...projectData.web_cards,
        images: imagesArray
      }
    });
    setIsEditing(false);
    // Call parent handleSave if provided
    if (typeof handleSaveProp === 'function') {
      handleSaveProp({
        web_cards: {
          ...projectData.web_cards,
          images: imagesArray
        }
      });
    }
  };
  const handleCancel = () => {
    setLocalImages(projectData?.images || []);
    setIsEditing(false);
  };

  // Only call handleSave when an image is selected/uploaded or reordered (not on every localImages change)
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...localImages];
      while (newImages.length <= index) {
        newImages.push({});
      }
      newImages[index] = {
        ...newImages[index],
        imageUrl: URL.createObjectURL(file), // For preview
        caption: file.name,                  // For saving
      };
      setLocalImages(newImages);

      // Save only file names
      const mainImage = projectData?.web_cards?.images?.[0] || "";
      const imagesForWebCards = [
        mainImage,
        ...newImages.map(img => img.caption || "")
      ];
      setProjectData({
        ...projectData,
        web_cards: {
          ...projectData.web_cards,
          images: imagesForWebCards
        }
      });
      if (typeof handleSaveProp === 'function') {
        handleSaveProp({
          web_cards: {
            ...projectData.web_cards,
            images: imagesForWebCards
          }
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    try {
      const oldIndex = localImages.findIndex((img, idx) => 
        (img?.imageUrl || `${DUMMY_IMAGE_PATH}-${idx}`) === active.id
      );
      const newIndex = localImages.findIndex((img, idx) => 
        (img?.imageUrl || `${DUMMY_IMAGE_PATH}-${idx}`) === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove([...localImages], oldIndex, newIndex);
        setLocalImages(newImages);
        // Prepare the new images array for web_cards.images (main + others)
        const mainImage = projectData?.web_cards?.images?.[0] || "";
        const imagesForWebCards = [mainImage, ...newImages.map(img => img.imageUrl || "")];
        setProjectData({
          ...projectData,
          web_cards: {
            ...projectData.web_cards,
            images: imagesForWebCards
          }
        });
        // Call handleSave only after drag/drop
        if (typeof handleSaveProp === 'function') {
          handleSaveProp({
            web_cards: {
              ...projectData.web_cards,
              images: imagesForWebCards
            }
          });
        }
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
    }
  };

  // Create array of 5 image slots (1 main + 4 grid), filling with dummy data if needed
  const imageSlots = Array.from({ length: 5 }, (_, index) => {
    const existingImage = localImages[index];
    return existingImage || { 
      imageUrl: null, 
      caption: `Image ${index + 1}` 
    };
  });

  // Create items array for DndContext with unique identifiers
  const items = imageSlots.map((img, index) => 
    img.imageUrl || `${DUMMY_IMAGE_PATH}-${index}`
  );

  return (
      <div className="row mx-0 g-0" style={{ padding: "0.5px" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div className="d-flex flex-wrap w-100">
              {/* Main Image */}
              <SortableImage
                id={items[0]}
                index={0}
                imageData={imageSlots[0]}
                isMainImage={true}
                handleImageUpload={handleImageUpload}
                hoveredImageIndex={hoveredImageIndex}
                setHoveredImageIndex={setHoveredImageIndex}
                setShowFullScreen={setShowFullScreen}
                setCurrentImageIndex={setCurrentImageIndex}
                showEdit={showEdit}
                isDataLoaded={isDataLoaded} // Pass the prop
              />

              {/* Grid Images */}
              <div className="col-12 col-md-6 p-0">
                <div className="row g-0">
                  {[1, 2, 3, 4].map((index) => (
                    <SortableImage
                      key={items[index]}
                      id={items[index]}
                      index={index}
                      imageData={imageSlots[index]}
                      isMainImage={false}
                      handleImageUpload={handleImageUpload}
                      hoveredImageIndex={hoveredImageIndex}
                      setHoveredImageIndex={setHoveredImageIndex}
                      setShowFullScreen={setShowFullScreen}
                      setCurrentImageIndex={setCurrentImageIndex}
                      showEdit={showEdit}
                      isDataLoaded={isDataLoaded} // Pass the prop
                    />
                  ))}
                </div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
  );
};

export default ProjectGallerySection;