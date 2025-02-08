import React, { useEffect, useState } from "react";
import "../styles/css/projectCard.css";
import { getAllProject } from "../../apis/api";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { Helmet } from "react-helmet";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract query params
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      cityId: searchParams.get("locationId"), // Extract locationId as cityId
      locationName: searchParams.get("location"), // Optional: Get location name
      propertyType: searchParams.get("propertyType"), // Get property type
      search: searchParams.get("search"), // Search term (project name)
    };
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { cityId, propertyType, search } = getQueryParams();

        const filters = {
          isDeleted: false,
          ...(cityId && { cityId }),
          ...(propertyType && { type: propertyType }),
        };

        const data = await getAllProject(filters);

        let filteredProjects = data.content || [];

        if (search) {
          const normalizedSearch = search
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");
          const isNumericSearch = !isNaN(search);

          filteredProjects = filteredProjects.filter((project) => {
            const configMatch = project.configurations?.some(
              (config) =>
                config
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .includes(normalizedSearch) ||
                (isNumericSearch &&
                  config.toLowerCase().includes(`${search}bhk`))
            );

            const propertyTypeMatch = project.configurationsType?.propertyType
              ?.toLowerCase()
              .includes(normalizedSearch);

            const nameMatch = project.name
              ?.toLowerCase()
              .includes(normalizedSearch);

            return configMatch || propertyTypeMatch || nameMatch;
          });
        }

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [location.search]); // Runs when query params change

  const handleMoreDetails = (name) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-"); // Convert to URL-friendly format
    const encodedName = encodeURIComponent(formattedName); // Encode special characters in the name
    navigate(`/project/${encodedName}`);
  };

  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <Helmet>
        <title>Best Residential And Commercial Projects</title>
        <meta
          content="Find the Best Residential and commercial projects with ultra luxury amenities. Compare Price, Floor Plan, Amenities, Site Plan, and Payment Plan, Property Reviews."
          name="description"
        />
        <link rel="canonical" href="https://propertymarvels.in/allProjects" />
      </Helmet>
      <section className="main-body">
        <div className="container">
          <h1 className="project-title">
            {getQueryParams().locationName
              ? `Projects In ${capitalizeWords(getQueryParams().locationName)}`
              : "All Projects"}
          </h1>
          <p>
            <a href="/" className="styled-link">
              Home
            </a>{" "}
            /
            {getQueryParams().locationName
              ? ` ${capitalizeWords(getQueryParams().locationName)}`
              : " All Projects"}
            {getQueryParams().propertyType &&
              ` / ${capitalizeWords(getQueryParams().propertyType)}`}
          </p>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="listing-home listing-page">
              <div className="listing-slide row">
                {loading ? (
                  <p>Loading projects...</p>
                ) : projects.length > 0 ? (
                  projects.map((project, index) => (
                    <div className="col-md-4" key={index}>
                      <ProjectCard project={project} />
                    </div>
                  ))
                ) : (
                  <p className="no-projects-message">
                    No projects available...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProjects;
