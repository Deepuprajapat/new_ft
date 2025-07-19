import React, { useEffect, useState } from "react";
import "../styles/css/projectCard.css";
import { getAllProject, getGenericKeywordByPath } from "../../apis/api";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { Helmet } from "react-helmet";
import Loading from "../Loader";

const allowedConfigurations = [
  "1BHK", "1.5BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK",
  "4BHK", "4.5BHK", "5BHK", "5.5BHK", "6BHK",
  "shop", "villa", "penthouse", "office"
];

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUrlWithConfiguration = (search) => {
    const currentParams = new URLSearchParams(location.search);
    ["configurations", "propertyType", "search"].forEach(param => currentParams.delete(param));

    const normalizedSearch = search?.trim().toUpperCase();
    if (allowedConfigurations.includes(normalizedSearch)) {
      currentParams.set("configurations", normalizedSearch);
    } else {
      currentParams.set("search", search);
    }

    const newUrl = `${location.pathname}?${currentParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    let keyword = null;
    if (![...searchParams.keys()].some(key => ["city", "propertyType", "search"].includes(key))) {
      keyword = [...searchParams.keys()][0];
    }

    return {
      city: searchParams.get("city"),
      propertyType: searchParams.get("propertyType"),
      search: searchParams.get("search"),
      configurations: searchParams.get("configurations"),
      keyword,
    };
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { city, propertyType, search, keyword } = getQueryParams();
        const normalizedSearch = search?.trim().toUpperCase();
        const isValidConfiguration = allowedConfigurations.includes(normalizedSearch);

        if (isValidConfiguration && search) {
          updateUrlWithConfiguration(search);
        }

        let filters = {
          isDeleted: false,
          ...(isValidConfiguration && { configurations: search }),
          ...(city && { city }),
          ...(propertyType && { type: propertyType }),
        };

        let data = await getAllProject(filters); 
        let filteredProjects = data || [];

        if (keyword) {
          const keywordData = await getGenericKeywordByPath(keyword);
          filteredProjects = keywordData.content.length > 0
            ? keywordData.content
            : filteredProjects.filter(project =>
                project.name?.toLowerCase().includes(keyword.toLowerCase().replace(/-/g, " "))
              );
        }

        if (search) {
          const searchWords = search.trim().toLowerCase().split(/\s+/);
          filteredProjects = filteredProjects.filter(project => {
            const name = project.project_name?.toLowerCase() || "";
            return searchWords.every(word => name.includes(word));
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

  const capitalizeWords = (string) =>
    string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const queryParams = getQueryParams();

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
            {queryParams.city
              ? `Projects In ${capitalizeWords(queryParams.city)}`
              : "All Projects"}
          </h1>
          <p>
            <a href="/" className="styled-link">Home</a> /
            {queryParams.city
              ? ` ${capitalizeWords(queryParams.city)}`
              : " All Projects"}
            {queryParams.propertyType && ` / ${capitalizeWords(queryParams.propertyType)}`}
          </p>
          <h2 style={{
            textAlign: "center", padding: "10px 10px", margin: "20px 0",
            fontSize: "30px", fontWeight: "bold", color: "#333"
          }}>
            {(() => {
              const types = queryParams.propertyType?.split(",").map(capitalizeWords);
              return types?.length === 1
                ? `Best ${types[0]} Projects`
                : "Best Residential And Commercial Projects";
            })()}
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
                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3" key={index}>
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
