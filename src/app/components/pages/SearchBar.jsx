// src/components/SearchBar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce"; // Use lodash's debounce for controlling the API calls
import { getAllProject } from "../../apis/api"; // Ensure this path is correct for your project
import { getAllLocalities } from "../../apis/api";
import "../styles/css/search.css";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [localities, setLocalities] = useState([]);
  const navigate = useNavigate();

  // Fetch localities when the component mounts
  React.useEffect(() => {
    const fetchLocalities = async () => {
      const data = await getAllLocalities();
      setLocalities(data);
    };
    fetchLocalities();
  }, []);

  // Handle Location Change
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Handle Project Name Change with Debounced API Call
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Only call the API after the user stops typing for a while (debounce)
    debouncedSearch(value);
  };

  const debouncedSearch = debounce(async (query) => {
    if (query.trim() === "") {
      setProjectSuggestions([]); // Clear suggestions when query is empty
      return;
    }

    const response = await getAllProject({ name: query });
    setProjectSuggestions(response.content || []); // Set project suggestions
  }, 500); // Delay the API call by 500ms

  // Handle Property Type Change
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const isInvalidQuery = (query) => {
    const regex = /[^a-zA-Z\s]/; // Only allow alphabets and spaces
    return regex.test(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  
    // If a project name is provided, navigate to the dynamic project URL
    if (searchQuery) {
        const matchedProject = projectSuggestions.find(
          (project) => project.name.toLowerCase() === searchQuery.toLowerCase()
        );
  
        if (matchedProject) {
          // Navigate to the project's URL
          navigate(`/project/${matchedProject.url}`);
        } else {
          // Navigate to 404 if no matching project
          navigate("/404");
        }
      }
  


    
    // If a location is selected and a property type is selected, navigate with both
    if (location && propertyType) {
      const selectedCity = localities.find(
        (city) => city.id === parseInt(location)
      );
      if (selectedCity) {
        const formattedLocationName = selectedCity.name
          .toLowerCase()
          .replace(/\s+/g, "-");
        navigate(
          `/allProjects?location=${formattedLocationName}&locationId=${selectedCity.id}&propertyType=${propertyType}`
        );
      }
    }
  
    // If only a location is selected, navigate using location NAME
    if (location && !propertyType) {
      const selectedCity = localities.find(
        (city) => city.id === parseInt(location)
      );
      if (selectedCity) {
        const formattedLocationName = selectedCity.name
          .toLowerCase()
          .replace(/\s+/g, "-");
        navigate(
          `/allProjects?location=${formattedLocationName}&locationId=${selectedCity.id}`
        );
      }
    }
  
    // If only property type is selected, navigate using property type
    if (!location && propertyType) {
      navigate(`/allProjects?propertyType=${propertyType}`);
    }
  };
  

  return (
    <form onSubmit={handleSearchSubmit} method="POST" autoComplete="off">
    <div className="form">
      <div className="form-group">
        <div className="form-top-home-select">
          <select
            name="location"
            className="form-control"
            aria-label="Location"
            value={location}
            onChange={handleLocationChange}
          >
            <option value="">Location --</option>
            {localities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
          <input
            className="form-control"
            list="projects"
            id="search"
            type="text"
            name="search"
            placeholder="Search using Project Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <datalist id="projects">
            {projectSuggestions.map((project) => (
              <option key={project.id} value={project.name} />
            ))}
          </datalist>
        </div>
      <div className="form-group">
        <div className="form-top-home-select">
          <select
            name="type"
            className="form-control border-r"
            aria-label="Property Type"
            value={propertyType}
            onChange={handlePropertyTypeChange}
          >
            <option value="">Property --</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-dark">
          Search
        </button>
      </div>
    </div>
  </form>
  
  );
};

export default SearchBar;
