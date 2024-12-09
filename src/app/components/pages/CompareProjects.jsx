import React, { useState, useEffect } from "react";
import axios from "axios";
//import "../styles/css/compareProjects.css"

const CompareProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(["", "", ""]);
  const [comparedProjects, setComparedProjects] = useState([]);

  // Fetch project data from the API
  useEffect(() => {
    axios
      .get("http://13.200.229.71:8282/project/get/all?isDeleted=false&page=0&size=12")
      .then((response) => setProjects(response.data.content))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  // Handle dropdown selection
  const handleSelect = (index, value) => {
    const updatedSelection = [...selectedProjects];
    updatedSelection[index] = value;
    setSelectedProjects(updatedSelection);
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
        case "Image": // Fetch the image from the 'images' array
        // Check if the project has images and return the first one
        const image = project.images && project.images.length > 0 ? project.images[0].imageUrl : null;
        return image ? (
          <img src={image} alt={project.name} style={{ width: '300px', height: '300px',borderRadius: '10px' }} />
        ) : (
          "No Image Available" // Placeholder text if no image is found
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
        return project.configurations.join(", ");
      case "Per Sq.ft. Rate":
        // Assuming we get price per sq ft from another source or calculation
        return "₹1000"; // Placeholder value
      case "Property Type":
        return project.configurationsType.propertyType;
      case "No. of Towers":
        return project.totalFloor; // Assuming `totalFloor` can represent towers
      case "Total Floors":
        return project.totalFloor;
      case "Per Tower Lifts":
        return project.liftCount || "Not Available"; // Assuming lift count is in project data
      case "Open Area":
        return "5000 sq ft"; // Placeholder value
      case "Construction Type":
        return project.configurationsType.configurationName;
      default:
        return "";
    }
  };

  return (
    <div className="container mt-5">
      <h1>Compare Projects</h1>
      <p>Home / Compare Projects</p>

      <div className="text-center my-4">
        {/* <h2 className="text-primary">Confused?</h2>
        <p className="lead">Easy way to compare projects</p> */}
        <h2>
        <b style={{color:'#2067d1',fontSize:'60px',fontFamily:'lato,sans-serif'}}>Confused?</b> 
          {/* <b style={{color:'#2067d1'font-size:'60px'}}>Confused?</b>  */}
          <br/>Easy way to compare projects
        </h2>
      </div>

      <div className="d-flex  flex-wrap justify-content-center mb-4">
        {[0, 1, 2].map((index) => (
            <div key={index} className="d-flex flex-column mx-2 mb-3" >
          <select
            key={index}
            className="custom-select form-select mx-2"
            style={{ width: "200px" }}
            value={selectedProjects[index]}
            onChange={(e) => handleSelect(index, e.target.value)}
          >
            <option value="">Select</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          </div>
        ))}
        <div className="w-100 d-flex justify-content-center">
        <button className="btn btn-primary" style={{width: 'auto'}} onClick={handleCompare}>
          Compare Now
        </button>
        </div>
      </div>

      {comparedProjects.length > 0 && (
        <div className="table-responsive">
          <h3 className="my-4">Project Comparison</h3>
          <table className="table table-bordered table-responsive">
            <thead>
              {/* <tr>
                <th>Fields</th>
                {comparedProjects.map((project) => (
                  <th key={project.id}>{project.name}</th>
                ))}
              </tr> */}
            </thead>
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
                  <td>{field}</td>
                  {comparedProjects.map((project) => (
                    <td key={project.id}>{renderProjectData(project, field)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareProjects;
