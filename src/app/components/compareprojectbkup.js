import React, { useState, useEffect } from "react";
import { getAllProject } from "../../apis/api"; // Importing the API function
import { Helmet } from "react-helmet";
const CompareProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(["", "", ""]);
  const [comparedProjects, setComparedProjects] = useState([]);

  // Fetch project data using api.js
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProject();
      setProjects(data.content); // Update state with fetched projects
    };

    fetchProjects();
  }, []);

  // Handle dropdown selection
  const handleSelect = (index, value) => {
    const updatedSelection = [...selectedProjects];
    updatedSelection[index] = value;
    setSelectedProjects(updatedSelection);
  };

  const formatPriceInCrores = (price) => {
    if (!price) return "N/A"; // Handle undefined/null prices
    const crore = price / 10000000; // Convert price to crores
    return `${crore.toFixed(2)} Cr`; // Format to 2 decimal places and add 'Cr'
  };

  // Handle compare action
  const handleCompare = () => {
    const selected = selectedProjects.filter((projectId) => projectId !== "");
    if (selected.length < 2) {
      alert("Please select at least 2 projects to compare.");
    } else {
      // Fetch the selected projects' details
      const selectedData = projects.filter((project) =>
        selected.includes(project.id.toString())
      );
      setComparedProjects(selectedData);
    }
  };

  // Render the table data for comparison
  const renderProjectData = (project, field) => {
    switch (field) {
      case "Image":
        const image =
          project.images && project.images.length > 0
            ? project.images[0].imageUrl
            : null;
        return image ? (
          <img
            src={image}
            loading="lazy"
            alt={project.name}
            style={{ width: "300px", height: "300px", borderRadius: "10px" }}
          />
        ) : (
          "No Image Available"
        );
      case "Project Name":
        return project.name;
      case "Total Area":
        return project.area;
      case "Location":
        return project.address;
      case "No of Unit":
        return project.units;
      case "Possession Date":
        return new Date(project.possessionDate).toLocaleDateString();
      case "Size/Price":
        return (
          <table className="nested-table">
            <tbody>
              {project.floorplans && project.floorplans.length > 0 ? (
                project.floorplans.map((config, index) => (
                  <tr key={index}>
                    <td>{config.title}</td>
                    <td>{config.size} Sq.ft.</td>
                    <td>{formatPriceInCrores(config.price)}</td> {/* Add formatted price */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case "Per Sq.ft. Rate":
        return "psf"; // Placeholder value
      case "Property Type":
        return project.configurationsType?.propertyType || "N/A";
      case "No. of Towers":
        const towerCount = project.totalTowers || 0; // Handle undefined or null values
        return towerCount === 1
          ? `${towerCount} Tower`
          : `${towerCount} Towers`;
      case "Total Floors":
        const floorCount = project.totalFloor || 0; // Handle undefined or null values
        return floorCount === 1
          ? `${floorCount} Floor`
          : `${floorCount} Floors`;
      case "Per Tower Lifts":
        return project.liftCount || "	--Lifts";
      case "Open Area":
        return "--"; // Placeholder value
      case "Construction Type":
        return project.configurationsType?.configurationName || "--";
      default:
        return "";
    }
  };

  return (
    <>
       <Helmet>
 <title>Compare projects</title>   
<meta name="description" content="We bring to you a comparison of different projects after a thorough discussion with our in-house Experts. Information drafted after proper research. " />
 <meta content="" name="keyword" />  
<link rel="canonical" href="https://www.investmango.com/compare"/>
 </Helmet>
    
    <div className="container mt-5">
      <h1>Compare Projects</h1>
      <p>Home / Compare Projects</p>

      <div className="text-center my-4">
        <h2>
          <b
            style={{
              color: "#2067d1",
              fontSize: "40px", // Adjust to desired size
              fontFamily: "Lato, sans-serif",
            }}
          >
            Confused?
          </b>
          <br />
          Easy way to compare projects
        </h2>
      </div>

      <div className="d-flex flex-wrap justify-content-center mb-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="d-flex flex-column mx-2 mb-3">
            <select
              key={index}
              className="custom-select form-select mx-2"
              style={{ width: "200px" }}
              value={selectedProjects[index]}
              onChange={(e) => handleSelect(index, e.target.value)}
            >
              <option value="">Select</option>
              {projects
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort projects alphabetically by name
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>
        ))}
        <div className="w-100 d-flex justify-content-center">
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={handleCompare}
          >
            Compare Now
          </button>
        </div>
      </div>

      {comparedProjects.length > 0 && (
        <div className="table-responsive">
          <h3 className="my-4">Project Comparison</h3>
          <table className="table table-bordered table-responsive">
            <tbody>
              {[
                "Image",
                "Project Name",
                "Total Area",
                "Location",
                "No of Unit",
                "Possession Date",
                "Size/Price",
                "Per Sq.ft. Rate",
                "Property Type",
                "No. of Towers",
                "Total Floors",
                "Per Tower Lifts",
                "Open Area",
                "Construction Type",
              ].map((field) => (
                <tr key={field}>
                  <th>{field}</th>
                  {comparedProjects.map((project) => (
                    <td key={project.id}>
                      {renderProjectData(project, field)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default CompareProjects;
