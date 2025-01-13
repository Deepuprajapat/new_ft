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
          const normalizedSearch = search.trim().toLowerCase().replace(/\s+/g, "");
    
          filteredProjects = filteredProjects.filter((project) => {
            // Check if configurations match the search term
            const configMatch = project.configurations?.some((config) =>
              config.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch)
            );
    
            // Check if property type matches
            const propertyTypeMatch = project.configurationsType?.propertyType
              ?.toLowerCase()
              .includes(normalizedSearch);
    
            // Check if project name matches
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

  return (
    <div>
      
<Helmet>
<title>Best Residential And Commercial Projects</title> 
<meta content="Find the Best Residential and commercial projects with ultra luxury amenities. Compare Price, Floor Plan, Amenities, Site Plan, and Payment Plan, Property Reviews." name="description"/>
 <link rel="canonical" href="https://www.investmango.com/allProjects"/>
</Helmet>
      <section className="main-body">
        <div className="container">
          <h1 className="project-title">
            {getQueryParams().locationName
              ? `Projects in ${getQueryParams().locationName}`
              : "All Projects"}
          </h1>
          <p>
            <a href="/" className="styled-link">
              Home
            </a>{" "}
            / {getQueryParams().locationName || "All Projects"}
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
                  <p className="no-projects-message">No projects available...</p>
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