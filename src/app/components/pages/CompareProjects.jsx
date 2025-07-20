import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProject, getAllLocalities, compareProjectsAPI } from "../../apis/api";
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

  // useEffect(() => {
  //   const filteredProjects = selectedProjects.filter(id => id && id.trim() !== "");
  //   if (filteredProjects.length >= 2) {
  //     handleCompare();
  //   }
  // }, [selectedProjects]);




  const handleSelect = (index, value) => {
    const updatedSelection = [...selectedProjects];
    updatedSelection[index] = value?.project_id || "";
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
    const filteredProjects = selectedProjects.filter(id => id && id.trim() !== "");

    if (filteredProjects.length < 2) {
      alert("Please select at least 2 valid projects to compare.");
      return;
    }

    try {
      const response = await compareProjectsAPI(filteredProjects); // send only valid IDs
      if (response?.data?.projects?.length > 0) {
        setComparedProjects(response.data.projects); // assuming you're setting state here
      } else {
        console.warn("No data returned from compare API");
      }
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
            alt={project.project_name}
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
        return project.project_name;
      case "Total Area":
        return project?.web_cards?.project_details?.area?.value || "N/A";
      case "Location":
        return project.location_info.short_address;
      case "No of Unit":
        return project?.web_cards?.project_details?.units?.value;
      case "Possession Date":
        const possessionDate = project?.web_cards?.project_details?.possession_date?.value;

        if (!possessionDate) return "N/A";

        if (possessionDate.toLowerCase() === "coming, soon") {
          return "Coming Soon";
        }

        // If format is like "March,2028", split and return properly
        const [month, year] = possessionDate.split(",");
        if (month && year) {
          return `${month.trim()} ${year.trim()}`;
        } else {
          return possessionDate; // fallback
        }



      case "Size/Price":
        const rawConfigurations = project?.web_cards?.project_details?.configuration?.value || null;
        const floorPlans = project?.web_cards?.floor_plan?.products || [];

        // Parse configurations array
        let configurations = [];
        if (rawConfigurations) {
          try {
            const parsed = JSON.parse(rawConfigurations);
            if (Array.isArray(parsed)) {
              configurations = parsed;
            } else if (typeof parsed === "string") {
              configurations = [parsed];
            }
          } catch (e) {
            configurations = [rawConfigurations];
          }
        }

        // Sort configurations by number (e.g., 1BHK, 2BHK, etc.)
        configurations.sort((a, b) => {
          const numA = parseInt(a);
          const numB = parseInt(b);
          return numA - numB;
        });

        // Match each configuration with floor plan product
        const rows = configurations.map((config) => {
          const matchedPlan = floorPlans.find((plan) =>
            plan.flat_type?.toLowerCase().includes(config.toLowerCase())
          );

          if (matchedPlan) {
            return {
              config,
              size: matchedPlan.building_area,
              price: matchedPlan.price,
            };
          } else {
            return {
              config,
              size: "N/A",
              price: "Price on Request",
            };
          }
        });

        // Render Table
        if (rows.length > 0) {
          return (
            <table className="nested-table">
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.config}</td>
                    <td>{row.size} Sq.ft.</td>
                    <td>{typeof row.price === "string" ? formatPriceInCrores(row.price) : row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else {
          return (
            <table className="nested-table">
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center">
                    No Data Available
                  </td>
                </tr>
              </tbody>
            </table>
          );
        }



      case "Per Sq.ft. Rate":
        return "N/A"; // Returns area in Sq.ft., or "N/A" if not available

      case "Property Type":
        return project?.web_cards?.project_details?.type?.value || "N/A";
      case "Highlights":
        return Array.isArray(project?.web_cards?.why_to_choose?.usp_list) &&
          project.web_cards.why_to_choose.usp_list.length > 0 ? (
          <ul
            style={{
              paddingLeft: "15px",
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {project.web_cards.why_to_choose.usp_list.map((point, index) => (
              <li key={index} style={{ padding: "5px 0" }}>
                {point}
              </li>
            ))}
          </ul>
        ) : (
          "N/A"
        );


      case "No. of Towers":
        return project?.web_cards?.project_details?.total_towers?.value || "N/A";
      case "Total Floors":
        return project?.web_cards?.project_details?.total_floor?.value || "N/A";
      case "Per Tower Lifts":
        return project?.Lifts || "N/A";
      case "Open Area":
        return project?.web_cards?.project_details?.area?.value || "N/A";
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

      <div
        className="container mt-5"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: window.innerWidth <= 480 ? "10px" : window.innerWidth <= 768 ? "20px" : "40px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 32px rgba(32,103,209,0.10)",
          marginBottom: window.innerWidth <= 480 ? 24 : 40,
        }}
      >
        <h1
          style={{
            fontSize: window.innerWidth <= 480 ? 22 : 32,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 16,
            color: "#000",
          }}
        >
          Compare Projects
        </h1>
        <p style={{ textAlign: "center", color: "#000", fontSize: window.innerWidth <= 480 ? 13 : 16, marginBottom: 24 }}>
          Home / Compare Projects
        </p>

        <div
          className="d-flex flex-wrap justify-content-center mb-4"
          style={{ gap: 8, alignItems: "center", marginBottom: 24 }}
        >
          <span>
            <i
              className="fa-solid fa-location-dot"
              style={{
                color: "#d0cccc",
                fontSize: 24,
                alignItems: "center",
                padding: 7,
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
                style={{
                  background: "#f8fafd",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(32,103,209,0.07)",
                }}
              />
            )}
            sx={{
              width: window.innerWidth <= 768 ? "100%" : "75%",
              margin: "0 8px",
              background: "#f8fafd",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(32,103,209,0.07)",
            }}
          />
        </div>
        <div
          className="d-flex flex-wrap justify-content-center mb-4"
          style={{ gap: 10, marginBottom: 24 }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: window.innerWidth <= 768 ? "100%" : 320,
                display: "flex",
                alignItems: "center",
                background: "#f8fafd",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(32,103,209,0.07)",
                padding: window.innerWidth <= 480 ? "8px" : "12px",
                marginBottom: window.innerWidth <= 480 ? 8 : 0,
              }}
            >
              <ListIcon style={{ color: "#2067d1", fontSize: 28 }} />
              <Autocomplete
                options={filteredProjects}
                getOptionLabel={(option) => option.project_name}
                style={{ width: '100%', marginLeft: '10px' }}
                onChange={(event, value) => handleSelect(index, value)}


                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Project"
                    variant="outlined"
                    size="small"
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      fontSize: window.innerWidth <= 480 ? 13 : 15,
                    }}
                  />
                )}
              />
            </div>
          ))}
        </div>
        <div
          className="d-flex flex-wrap justify-content-center mb-4"
          style={{ gap: 10, marginBottom: 24 }}
        >
          <button
            className="btn mx-2"
            onClick={handleCompare} // This is now the only place where comparison triggers
            style={{
              backgroundColor: "#2067d1",
              borderColor: "#2067d1",
              color: "#fff",
              width: window.innerWidth <= 768 ? "100%" : "72%",
              borderRadius: 8,
              padding: window.innerWidth <= 480 ? "10px 0" : "12px 0",
              fontWeight: 600,
              fontSize: window.innerWidth <= 480 ? 15 : 16,
              marginBottom: 8,
              boxShadow: "0 2px 8px rgba(32,103,209,0.07)",
              transition: "background 0.2s",
            }}
          >
            Compare Now
          </button>


          <div
            className="share-btn"
            onMouseEnter={() => setShowShareOptions(true)}
            onMouseLeave={() => setShowShareOptions(false)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <IconButton onClick={handleMenuClick} color="primary" style={{ background: "#f0f4fa", borderRadius: 8 }}>
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
            <IconButton onClick={handleOpenForm} color="primary" style={{ background: "#f0f4fa", borderRadius: 8 }}>
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
          <div
            className="table-responsive"
            style={{
              overflowX: "auto",
              marginTop: 24,
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(32,103,209,0.07)",
              background: "#fff",
              padding: window.innerWidth <= 480 ? 4 : 16,
            }}
          >
            <table
              className="table table-bordered"
              style={{
                width: "100%",
                minWidth: 600,
                fontSize: window.innerWidth <= 480 ? 12 : 15,
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f0f4fa" }}>
                  <th style={{ fontWeight: 700, fontSize: window.innerWidth <= 480 ? 13 : 16, padding: window.innerWidth <= 480 ? 6 : 12 }}>Details</th>
                  {comparedProjects.map((project) => (
                    <th key={project.id} style={{ fontWeight: 700, fontSize: window.innerWidth <= 480 ? 13 : 16, padding: window.innerWidth <= 480 ? 6 : 12 }}>{project.project_name}</th>
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
                    <td style={{ fontWeight: 600, background: "#f8fafd", padding: window.innerWidth <= 480 ? 6 : 12 }}>{field}</td>
                    {comparedProjects.map((project) => (
                      <td key={project.id} style={{ padding: window.innerWidth <= 480 ? 6 : 12, verticalAlign: "middle", background: "#fff" }}>
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
