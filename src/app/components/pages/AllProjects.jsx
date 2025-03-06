import React, { useEffect, useState } from "react";
import "../styles/css/projectCard.css";
import { getAllProject,getGenericKeywordByPath } from "../../apis/api";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { Helmet } from "react-helmet";
import Loading from "../Loader"; 

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract query params
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    let keyword = null;
  
    // Extract keyword if no standard key-value pairs are present
    if (![...searchParams.keys()].some(key => ["locationId", "location", "propertyType", "search"].includes(key))) {
      keyword = [...searchParams.keys()][0];
    }
  
    return {
      cityId: searchParams.get("locationId"), 
      locationName: searchParams.get("location"),
      propertyType: searchParams.get("propertyType"),
      search: searchParams.get("search"),
      keyword,
    };
  };
  
  

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { cityId, propertyType, search, keyword } = getQueryParams();
  
        let filters = {
          isDeleted: false,
          ...(cityId && { cityId }),
          ...(propertyType && { type: propertyType }),
        };
  
        let data = await getAllProject(filters); // Fetch all projects first
        let filteredProjects = data.content || [];
  
        // If a keyword exists, try fetching specific projects using it
        if (keyword) {
          const keywordData = await getGenericKeywordByPath(keyword);
          if (keywordData.content.length > 0) {
            filteredProjects = keywordData.content;
          } else {
            // If keyword API returns no data, fallback to filtering manually
            const normalizedKeyword = keyword.toLowerCase().replace(/-/g, " ");
            filteredProjects = filteredProjects.filter((project) =>
              project.name?.toLowerCase().includes(normalizedKeyword)
            );
          }
        }
  
        // Apply additional search filtering
        if (search) {
          const normalizedSearch = search.trim().toLowerCase().replace(/\s+/g, "");
          const isNumericSearch = !isNaN(search);
  
          filteredProjects = filteredProjects.filter((project) => {
            const configMatch = project.configurations?.some(
              (config) =>
                config.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch) ||
                (isNumericSearch && config.toLowerCase().includes(`${search}bhk`))
            );
  
            const propertyTypeMatch = project.configurationsType?.propertyType
              ?.toLowerCase()
              .includes(normalizedSearch);
  
            const nameMatch = project.name?.toLowerCase().includes(normalizedSearch);
  
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
  }, [location.search]);
  

  // const handleMoreDetails = (name) => {
  //   const formattedName = name.toLowerCase().replace(/\s+/g, "-"); // Convert to URL-friendly format
  //   const encodedName = encodeURIComponent(formattedName); // Encode special characters in the name
  //   navigate(`/project/${encodedName}`);
  // };

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
        <link rel="canonical" href={window.location.href} />
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
          <h2
            style={{
              textAlign: "center",
              padding: "10px 10px",
              margin: "20px 0",
              fontSize: "30px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Best Residential And Commercial Projects
          </h2>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="listing-home listing-page">
              <div className="listing-slide row">
                {loading ? (
                 <Loading isFullScreen={false} />
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
