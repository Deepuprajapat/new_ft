import React, { useState, useEffect, useRef } from "react";
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
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const navigate = useNavigate();
  // const searchRef = useRef(null); // Ref for search input

  // Fetch localities when the component mounts
  useEffect(() => {
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
    console.log("Response", response);
    setProjectSuggestions(response || []);
    setShowSuggestions(true); // Show suggestions when data is fetched
  }, 500);

  // Handle Property Type Change
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    let queryParams = [];

    if (searchQuery) {
      console.log("Search Query", searchQuery);
      const matchedProject = projectSuggestions.find(
        (project) => project.project_name.toLowerCase() === searchQuery.toLowerCase()
      );

      if (matchedProject) {
        const stateData =  matchedProject.project_id ;
        const cleanUrl = `/${matchedProject.slug.toLowerCase().replace(/\s+/g, "-")}`;

        sessionStorage.setItem('projectState', stateData);

        const newWindow = window.open('', '_blank');
      if (newWindow) {
          newWindow.location.href = cleanUrl;
      }
        return;
      }
      queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    }
  
    // Include the location in the URL
    if (location) {
      console.log("Location", location);  
      const formattedLocationName = location;
      queryParams.push(`city=${formattedLocationName}`);
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
    setSearchQuery(suggestion.project_name);
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
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Location--</option>
              {localities.map((city) => (
                <option
                  key={city.city}
                  value={city.city}
                  style={{ fontSize: "13px", color: "#000" }}
                >
                  {city.city}
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
            <div className="suggestions-list">
              {projectSuggestions.map((project) => (
                <div
                  key={project.project_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(project)}
                >
                  {project.project_name}{" "}
                </div>
              ))}
            </div>
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
