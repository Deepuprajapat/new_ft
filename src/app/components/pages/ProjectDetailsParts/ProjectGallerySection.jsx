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

  // Use dummy image if no imageUrl is present
  const imageUrl = imageData?.imageUrl || DUMMY_IMAGE_PATH;
  const caption = imageData?.caption || `Image ${index + 1}`;

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
}) => {
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [localImages, setLocalImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize localImages with projectData images or empty array
  useEffect(() => {
    setLocalImages(projectData?.images || []);
  }, [projectData]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => {
    setLocalImages(projectData?.images || []);
    setIsEditing(false);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...localImages];
        
        // Ensure the array has enough slots
        while (newImages.length <= index) {
          newImages.push({});
        }
        
        newImages[index] = {
          ...newImages[index],
          imageUrl: e.target.result,
          caption: file.name,
        };
        
        setLocalImages(newImages);
        setProjectData({
          ...projectData,
          images: newImages,
        });
      };
      reader.readAsDataURL(file);
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
        setProjectData({
          ...projectData,
          images: newImages,
        });
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