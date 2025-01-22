import React, { useState, useEffect } from "react";
import { getAllProject } from "../../apis/api";
import { Helmet } from "react-helmet";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import { IconButton, Menu, MenuItem, ListItemText } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import GetAppIcon from "@mui/icons-material/GetApp";


const CompareProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(["", "", ""]);
  const [comparedProjects, setComparedProjects] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProject();
      setProjects(data.content);
    };
    fetchProjects();
  }, []);

  const handleSelect = (index, value) => {
    const updatedSelection = [...selectedProjects];
    updatedSelection[index] = value;
    setSelectedProjects(updatedSelection);
  };


  const formatPriceInCrores = (price) => {
    if (price === 1.5) {
      return "Sold Out";
    }
    if (!price) return "N/A";

    if (price >= 10000000) {
      // For Crores
      const crore = price / 10000000;
      return `${crore.toFixed(2)} Cr`;
    } else if (price >= 100000) {
      // For Lakhs
      const lakh = price / 100000;
      return `${lakh.toFixed(2)} Lakh`;
    } else {
      // For values less than 1 Lakh
      return price.toLocaleString("en-IN");
    }
  };

  const handleCompare = () => {
    const selected = selectedProjects.filter((projectId) => projectId !== "");
    if (selected.length < 2) {
      alert("Please select at least 2 projects to compare.");
    } else {
      const selectedData = projects.filter((project) =>
        selected.includes(project.id.toString())
      );
      setComparedProjects(selectedData);
    }
  };



  const handleShareClick = (platform) => {
    const url = encodeURIComponent(window.location.href);

    // Format table data as a string for sharing
    const tableContent = generateTableString(comparedProjects);

    let shareURL = "";
    const message = encodeURIComponent(`${tableContent}\n\nDetails: ${url}`);

    switch (platform) {
      case "whatsapp":
        shareURL = `https://api.whatsapp.com/send?text=${message}`;
        break;
      case "facebook":
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      default:
        return;
    }

    window.open(shareURL, "_blank");
    setAnchorEl(null);
  };

  const renderProjectData = (project, field) => {
    switch (field) {
      case "Image":
        const image = project.images?.[0]?.imageUrl;
        return image ? (
          <img
            src={image}
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
              {project.floorplans?.length > 0 ? (
                project.floorplans
                  .filter((config) => config.price !== 1.5) // Filter out "Sold Out" properties
                  .map((config, index) => (
                    <tr key={index}>
                      <td>{config.projectConfigurationName}</td>
                      <td>{config.size} Sq.ft.</td>
                      <td>{formatPriceInCrores(config.price)}</td>
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
        return "N/A"; // Returns area in Sq.ft., or "N/A" if not available

      case "Property Type":
        return project.configurationsType?.propertyType || "N/A";

      case "No. of Towers":
        return project?.totalTowers || "N/A";
      case "Total Floors":
        return project?.totalFloor || "N/A";
      case "Per Tower Lifts":
        return project?.Lifts || "N/A";
      case "Open Area":
        return project?.area || "N/A";
      case "Construction Type":
        return project?.status
          ? project.status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
          : "--";
      default:
        return "--";
    }
  };

  // Function to generate table data in a shareable text format
  const generateTableString = (projects) => {
    let tableString = "Check out these compared projects:\n\n"; // This line will be printed only once
    tableString += "Project Comparison:\n\n";

    const headers = [
      "Details",
      ...projects.map((project) => `${project.name}`),
    ];
    const rows = [
      "Location",
      "Total Area",
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
    ];

    rows.forEach((row) => {
      // Make row titles (headings) larger and darker
      tableString += `\n**${row.toUpperCase()}:**\n`;

      projects.forEach((project, index) => {
        let value = renderProjectData(project, row);

 
        if (row === "Size/Price") {
          if (project.floorplans && project.floorplans.length > 0) {
            value = project.floorplans
              .map(
                (config) =>
                  `${config.title} - ${
                    config.size
                  } Sq.ft. - ${formatPriceInCrores(config.price)}`
              )
              .join("\n");
          } else {
            value = "No Data Available";
          }
        }

        // For project names, make them slightly bold
        const name = `**${project.name}:**`;

        // Add the data for the current project
        tableString += `\n${name} ${value}\n`;

        // Add a visual separator between projects for better readability
        if (index < projects.length - 1) {
          tableString += `\n-----\n`; // Line break between projects
        }
      });

      tableString += "\n";
    });

    return tableString;
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF("landscape"); // Set orientation to landscape

    doc.setFontSize(16);
    doc.text("Compared Projects", 14, 20);

    // Dynamic table headers for all compared projects
    const tableHeaders = [
      "Details",
      ...comparedProjects.map((project) => project.name),
    ];

    // Fields to be displayed in the table
    const fields = [
      "Location",
      "Total Area",
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
    ];

    // Generate table rows dynamically
    const tableRows = fields.map((field) => {
      const row = [field];

      comparedProjects.forEach((project) => {
        if (field === "Size/Price") {
          const sizePriceData =
            project.floorplans?.length > 0
              ? project.floorplans
                  .map(
                    (config) =>
                      `${config.title} - ${
                        config.size
                      } Sq.ft. - ${formatPriceInCrores(config.price)}`
                  )
                  .join("\n")
              : "No Data Available";
          row.push(sizePriceData);
        } else {
          row.push(renderProjectData(project, field));
        }
      });

      return row;
    });

    // Create the table with dynamic column handling
    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 9, // Reduced font size
        cellWidth: "wrap", // Allow text to wrap
        overflow: "linebreak", // Break long text into lines
      },
      columnStyles: {
        0: { cellWidth: 40 }, // 'Details' column width
      },
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text("Compared Projects", data.settings.margin.left, 20);
      },
    });

    doc.save("Compared_Projects.pdf");
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Helmet>
        <title>Compare Projects</title>
        <meta
          name="description"
          content="Compare different projects with insights from experts. Detailed and researched information for better decision-making."
        />
        <link rel="canonical" href="https://www.investmango.com/compare" />
      </Helmet>

      <div className="container mt-5">
        <h1>Compare Projects</h1>
        <p>Home / Compare Projects</p>

        <div className="d-flex flex-wrap justify-content-center mb-4">
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              className="custom-select form-select mx-2"
              style={{ width: "200px" }}
              value={selectedProjects[index]}
              onChange={(e) => handleSelect(index, e.target.value)}
            >
              <option value="">Select</option>
              {projects
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by project name
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
          ))}

          <button
            className="btn mx-2"
            onClick={handleCompare}
            style={{
              backgroundColor: "#2067d1",
              borderColor: "#2067d1",
              color: "#fff",
            }}
          >
            Compare Now
          </button>
          <div
            className="share-btn"
            onMouseEnter={() => setShowShareOptions(true)}
            onMouseLeave={() => setShowShareOptions(false)}
          >
            <IconButton onClick={handleMenuClick} color="primary">
              <ShareIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleShareClick("whatsapp")}>
                <WhatsAppIcon sx={{ marginRight: 1 }} />
                <ListItemText>WhatsApp</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleShareClick("facebook")}>
                <FacebookIcon sx={{ marginRight: 1 }} />
                <ListItemText>Facebook</ListItemText>
              </MenuItem>
            </Menu>
            <IconButton onClick={generatePDF} color="primary">
              <GetAppIcon />
            </IconButton>
       
          </div>
         
        </div>

        {comparedProjects.length > 0 && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Details</th>
                {comparedProjects.map((project) => (
                  <th key={project.id}>{project.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                "Image",
                "Location",
                "Total Area",
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
                    <td key={project.id}>
                      {renderProjectData(project, field)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CompareProjects;
