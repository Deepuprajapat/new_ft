import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProject, getAllLocalities } from "../../apis/api";
import { Helmet } from "react-helmet";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import {
  Autocomplete,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,

} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ListIcon from '@mui/icons-material/List';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import GetAppIcon from "@mui/icons-material/GetApp";
import LeadFormModal from "./LeadFormModal";



const CompareProjects = () => {
  const [projects, setProjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProjects, setSelectedProjects] = useState(["", "", ""]);
  const [comparedProjects, setComparedProjects] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProject(selectedCity ? { city: selectedCity } : {});
      setProjects(data || []);
    };
    fetchProjects();
  }, [selectedCity]); // Re-run when selectedCity changes


  useEffect(() => {
    const fetchCities = async () => {
      const localCities = await getAllLocalities();
      setCities(localCities);
    };
    fetchCities();
  }, []);



const handleSelect = (index, value, event) => {
  const updatedSelection = [...selectedProjects];
  updatedSelection[index] = value ? value.project_id : "";
  setSelectedProjects(updatedSelection);
  console.log("Updated Selected Projects for Compare:", updatedSelection);
};





  const formatPriceInCrores = (price) => {
    if (price === 1.5) {
      return "Sold Out";
    }
    if (price === 1) {
      return "Price On Request";
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

const handleCompare = async () => {
  const selected = selectedProjects.filter((projectId) => projectId);
  if (selected.length < 2) {
    alert("Please select at least 2 projects to compare.");
    return;
  }

  try {
    // Filter projects from the existing projects state instead of making API calls
    const fullProjects = projects.filter((project) => 
      selected.includes(project.project_id)
    );
    setComparedProjects(fullProjects);
  } catch (error) {
    console.error("Error comparing projects:", error);
  }
};




  const handleShareClick = (platform) => {
    const url = encodeURIComponent(window.location.href);

    // Format table data as a string for sharing
    const tableContent = generateTableString(comparedProjects);

    let shareURL = "";
    const message = encodeURIComponent(
      `${tableContent}\n\nDetails: https://www.investmango.com/compare\n\nOur expert portfolio managers will connect with you soon to tailor the perfect investment strategy for your needs.`
    );

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

  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo(0, 0);
  }, []);

  const renderProjectData = (project, field) => {
    switch (field) {
      case "Image":
        const image = project?.web_cards?.images?.[1];
        return image ? (
          <img
            src={image}
            alt={project.name}
            loading="lazy"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => window.open(`/${project.url}`, "_blank")}
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
        const possessionDate = project.possessionDate;
        if (possessionDate === "Coming, Soon") {
          return possessionDate; // If it's "Coming, Soon", display it as is
        } else {
          const date = new Date(possessionDate);
          return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString(); // Check if it's a valid date
        }
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
      case "Highlights":
        return project?.usps?.length ? (
          <ul
            style={{
              paddingLeft: "15px",
              margin: "0",
              // listStylePosition: "inside",
              fontSize: "13px", // Makes the font smaller
              fontWeight: "600", // Ensures normal font weight
            }}
          >
            {project.usps.map((point, index) => (
              <li key={index} style={{ padding: "5px 0" }}>
                {point}
              </li>
            ))}
          </ul>
        ) : (
          "N/A"
        );

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
      "Property Type",
      "No. of Towers",
      "Total Floors",
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
                  `${config.title} - ${config.size
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
    setTimeout(() => {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a3",
      });

      doc.setFontSize(16);
      doc.text("Compared Projects", 40, 40);

      const tableHeaders = [
        "Details",
        ...comparedProjects.map((project) => project.name),
      ];

      const fields = [
        "Location",
        "Total Area",
        "No of Unit",
        "Possession Date",
        "Size/Price",
        "Property Type",
        "No. of Towers",
        "Total Floors",
        "Open Area",
        "Construction Type",
      ];

      const tableRows = fields.map((field) => {
        const row = [field];

        comparedProjects.forEach((project) => {
          let value =
            field === "Size/Price"
              ? project.floorplans?.length > 0
                ? project.floorplans
                  .map(
                    (config) =>
                      `${config.title} - ${config.size
                      } Sq.ft. - ${formatPriceInCrores(config.price)}`
                  )
                  .join("\n")
                : "No Data Available"
              : renderProjectData(project, field) || "No Data Available";

          const wrappedText = doc.splitTextToSize(value, 150);
          row.push(wrappedText);
        });

        return row;
      });

      let fontSize = 8;
      let columnWidths = {
        0: { cellWidth: 120 },
        1: { cellWidth: "wrap" },
      };

      const windowWidth = window.innerWidth;
      if (windowWidth <= 576) {
        fontSize = 6;
        columnWidths = {
          0: { cellWidth: 80 },
          1: { cellWidth: "wrap" },
        };
      } else if (windowWidth <= 768) {
        fontSize = 7;
        columnWidths = {
          0: { cellWidth: 100 },
          1: { cellWidth: "wrap" },
        };
      }

      doc.autoTable({
        head: [tableHeaders],
        body: tableRows,
        startY: 60,
        theme: "grid",
        styles: {
          fontSize: fontSize,
          overflow: "linebreak",
          valign: "middle",
        },
        columnStyles: columnWidths,
        margin: { top: 60 },
        didDrawPage: (data) => {
          doc.setFontSize(16);
          doc.text("Compared Projects", data.settings.margin.left, 40);
        },
      });

      doc.save("Compared_Projects.pdf");
    }, 100); // Delay added
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCitySelect = (value) => {
    setSelectedCity(value?.city || "");
    setSelectedProjects(["", "", ""]); // Reset project dropdowns
  };



  // Extract unique cities
  // const cities = [
  //   ...new Set(
  //     projects.map((project) => project?.locality?.city?.name).filter(Boolean)
  //   ),
  // ].sort((a, b) => a.localeCompare(b));


  // Filter projects based on selected city
  const filteredProjects = projects; // Already filtered by city in API


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
          <span>
            <i
              class="fa-solid fa-location-dot"
              style={{
                color: "#d0cccc",
                fontSize: "24px",
                alignItems: "center",
                padding: "7px",
              }}
            ></i>
          </span>
          <Autocomplete
            options={cities}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : option?.city?.charAt(0).toUpperCase() + option?.city?.slice(1).toLowerCase()
            }
            onChange={(event, value) => handleCitySelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select City"
                variant="outlined"
                size="small"
              />
            )}
            sx={{
              width: window.innerWidth <= 768 ? "100%" : "75%",
              margin: "0 8px",
            }}
          />
        </div>
        <div className="d-flex flex-wrap justify-content-center mb-4" style={{ gap: '10px' }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              // className="mx-2"
              style={{ width: window.innerWidth <= 768 ? "100%" : "320px", display: 'flex', alignItems: 'center' }}
            >
              <ListIcon />
              <Autocomplete
                options={filteredProjects}
                getOptionLabel={(option) => option.project_name}
                style={{ width: '100%', marginLeft: '10px' }}
                onChange={(event, value) =>
                  handleSelect(index, value ? value.project_id : "", event)
                }

                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Project"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>
          ))}


        </div>
        <div className="d-flex flex-wrap justify-content-center mb-4">
          <button
            className="btn mx-2"
            onClick={handleCompare}
            style={{
              backgroundColor: "#2067d1",
              borderColor: "#2067d1",
              color: "#fff",
              width: window.innerWidth <= 768 ? "100%" : "72%",
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
            <IconButton onClick={handleOpenForm} color="primary">
              <GetAppIcon />
            </IconButton>
            <LeadFormModal
              open={openForm}
              onClose={handleCloseForm}
              onDownload={generatePDF}
            />
          </div>
        </div>
        {comparedProjects.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered" style={{ width: "100%" }}>
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
                  "Highlights",
                  "Total Area",
                  "No of Unit",
                  "Possession Date",
                  "Size/Price",
                  "Property Type",
                  "No. of Towers",
                  "Total Floors",
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
          </div>
        )}
      </div>
    </>
  );
};

export default CompareProjects;
