import React , {useState} from 'react';
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

  const imageContent = (
    <div
      className={`position-relative ${isMainImage ? 'h-100' : ''}`}
      style={{ height: isMainImage ? "540px" : "270px" }}
      onMouseEnter={() => setHoveredImageIndex(index)}
      onMouseLeave={() => setHoveredImageIndex(null)}
    >
      <a
        href={imageData?.imageUrl}
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
          alt={imageData?.caption || "Image"}
          src={imageData?.imageUrl}
          loading="lazy"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            cursor: "pointer",
            filter: hoveredImageIndex === index ? "blur(4px)" : "none",
            transition: "filter 0.3s ease"
          }}
          fetchpriority="high"
        />
      </a>
      {hoveredImageIndex === index && (
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
      {...attributes}
      {...listeners}
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
}) => {
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...projectData.images];
        newImages[index] = {
          ...newImages[index],
          imageUrl: e.target.result,
          caption: file.name,
        };
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

    if (active.id !== over.id) {
      const oldIndex = projectData.images.findIndex(img => img.imageUrl === active.id);
      const newIndex = projectData.images.findIndex(img => img.imageUrl === over.id);

      setProjectData({
        ...projectData,
        images: arrayMove(projectData.images, oldIndex, newIndex)
      });
    }
  };

  if (!projectData?.images?.length) return null;

  const items = projectData.images.map(img => img.imageUrl);

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
            {projectData.images[0] && (
              <SortableImage
                id={projectData.images[0].imageUrl}
                index={0}
                imageData={projectData.images[0]}
                isMainImage={true}
                handleImageUpload={handleImageUpload}
                hoveredImageIndex={hoveredImageIndex}
                setHoveredImageIndex={setHoveredImageIndex}
                setShowFullScreen={setShowFullScreen}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            )}

            {/* Grid Images */}
            <div className="col-12 col-md-6 p-0">
              <div className="row g-0">
                {[1, 2, 3, 4].map((index) =>
                  projectData.images[index] ? (
                    <SortableImage
                      key={projectData.images[index].imageUrl}
                      id={projectData.images[index].imageUrl}
                      index={index}
                      imageData={projectData.images[index]}
                      isMainImage={false}
                      handleImageUpload={handleImageUpload}
                      hoveredImageIndex={hoveredImageIndex}
                      setHoveredImageIndex={setHoveredImageIndex}
                      setShowFullScreen={setShowFullScreen}
                      setCurrentImageIndex={setCurrentImageIndex}
                    />
                  ) : null
                )}
              </div>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectGallerySection; 