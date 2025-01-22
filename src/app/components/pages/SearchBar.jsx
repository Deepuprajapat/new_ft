import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getAllProject } from "../../apis/api";
import { getAllLocalities } from "../../apis/api";
import "../styles/css/search.css";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Track if suggestions should be shown
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
    debouncedSearch(value);
  };

  const debouncedSearch = debounce(async (query) => {
    if (query.trim() === "") {
      setProjectSuggestions([]);
      return;
    }

    const response = await getAllProject({ name: query });
    setProjectSuggestions(response.content || []);
    setShowSuggestions(true); // Show suggestions when data is fetched
  }, 500);

  // Handle Property Type Change
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    let queryParams = [];

    // Include the search query in the URL
    if (searchQuery) {
      const matchedProject = projectSuggestions.find(
        (project) => project.name.toLowerCase() === searchQuery.toLowerCase()
      );

      if (matchedProject) {
        navigate(`/project/${matchedProject.url}`);
        return; // Exit since we found an exact match
      }

      queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    }

    // Include the location in the URL
    if (location) {
      const selectedCity = localities.find(
        (city) => city.id === parseInt(location)
      );
      if (selectedCity) {
        const formattedLocationName = selectedCity.name
          .toLowerCase()
          .replace(/\s+/g, "-");
        queryParams.push(
          `location=${formattedLocationName}&locationId=${selectedCity.id}`
        );
      }
    }

    // Include the property type in the URL
    if (propertyType) {
      queryParams.push(`propertyType=${propertyType}`);
    }

    // Navigate with all query parameters
    if (queryParams.length > 0) {
      navigate(`/allProjects?${queryParams.join("&")}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false); // Hide suggestions after selection
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
            type="text"
            name="search"
            id="search"
            placeholder="Search Projects"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
          />
          {showSuggestions && searchQuery && (
            <ul className="suggestions-list">
              {projectSuggestions.map((project) => (
                <li
                  key={project.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(project)}
                >
                  {project.name}
                </li>
              ))}
            </ul>
          )}
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
