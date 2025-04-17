import React, { useState,useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getAllProject, getAllLocalities } from "../../apis/api";
import "../styles/css/search.css";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Track if suggestions should be shown
  const navigate = useNavigate();
  // const searchRef = useRef(null); // Ref for search input


  // Fetch localities when the component mounts
  React.useEffect(() => {
    const fetchLocalities = async () => {
      const data = await getAllLocalities();
      setLocalities(data);
    };
    fetchLocalities();
  }, []);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (searchRef.current && !searchRef.current.contains(event.target)) {
  //       setShowSuggestions(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  

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

  // Close suggestions on ESC key
const handleKeyDown = (e) => {
  if (e.key === "Escape") {
    setShowSuggestions(false);
  }
};

  const debouncedSearch = debounce(async (query) => {
    if (query.trim() === "") {
      setProjectSuggestions([]);
      return;
    }
    console.log("Query", query);
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
      console.log("Search Query", searchQuery);
      const matchedProject = projectSuggestions.find(
        (project) => project.name.toLowerCase() === searchQuery.toLowerCase()
      );

      if (matchedProject) {
        navigate(`/${matchedProject.url}`);
        return; // Exit since we found an exact match
      }

      queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    }

    // Include the location in the URL
    if (location) {
      console.log("Location", location);
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
              <option value="">Location--</option>
              {localities
                .map((city) => ({
                  ...city,
                  name: city.name.toUpperCase(), // Convert name to uppercase
                }))
                // .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
                .map((city) => (
                  <option
                    key={city.id}
                    value={city.id}
                    style={{ fontSize: "13px", color: "#000" }}
                  >
                    {city.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <input
          //  ref={searchRef} // Attach ref to input
            className="form-control"
            type="text"
            name="search"
            id="search"
            placeholder="Search Projects"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
            onKeyDown={handleKeyDown} // Detect Escape key
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
          <button
            type="submit"
            className="btn btn-dark"
            style={{
              maxWidth: "150px", // Smaller width than dropdowns
              width: "100%",
              padding: "12px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
