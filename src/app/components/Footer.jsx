import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../components/styles/css/footer.css";
import logo from "../assets/img/Logo-footer.png";
import {
  getAllGenericKeywords,
  getGenericKeywordByPath,
  getAllCityForMobile,
  getAllProjectsByUrlName,
  CustomSearch,
  filterforgeneric
} from "../apis/api";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";
import AddGenericLinkForm from "./AddGenericLinkForm";

const Footer = ({ shortAddress }) => {
  const [footerItems, setFooterItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [matchedPhoneNumber, setMatchedPhoneNumber] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const filterOptions = filterData || {};
  const cityOptions = filterOptions.cities || [];
  const typeOptions = filterOptions.types || [];
  const configurationOptions = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
  const developerOptions =  filterOptions.developers|| [];
  const locationOptions = filterOptions.locations || [];

  // Modal state for Add Generic Link
  const [showAddGenericModal, setShowAddGenericModal] = useState(false);
  const [genericForm, setGenericForm] = useState({
    title: "",
    description: "",
    slug: "",
    search_term: "",
    filters: {
      is_premium: false,
      city: "",
      type: "RESIDENTIAL",
      configurations: [],
      developer:"",
      location:"",
    },
  });

  const handleGenericFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["is_premium", "city", "type"].includes(name)) {
      setGenericForm((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "configurations") {
      setGenericForm((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          configurations: typeof value === "string" ? value.split(",") : value,
        },
      }));
    } else {
      setGenericForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenAddGenericModal = () => setShowAddGenericModal(true);
  const handleCloseAddGenericModal = () => setShowAddGenericModal(false);


  const handleSaveGenericLink = async () => {
    // Construct the payload from the form state
    const payload = {
      title: genericForm.title,
      description: genericForm.description,
      slug: genericForm.slug,
      search_term: genericForm.search_term,
      filters: {
        is_premium: genericForm.filters.is_premium,
        city: genericForm.filters.city,
        type: genericForm.filters.type,
        configurations: genericForm.filters.configurations,
      },
    };

    try {
      // Await the API call if CustomSearch is async
      const response = await CustomSearch({ payload });
      // Optionally handle the response here (e.g., show a message)
      console.log(response,"uyftyf")
    } catch (error) {
      // Optionally handle errors here
      console.error("Error saving generic link:", error);
    }
    handleCloseAddGenericModal();
  };

  const navigate = useNavigate();

  useEffect(() => {
    // const fetchFooterItems = async () => {
    //   try {
    //     const keywords = await getAlGenericKeywords();
    //     setFooterItems(keywords);
    //   } catch (error) {
    //     console.error("Error fetching footer items:", error);
    //   }
    // };

    // fetchFooterItems();
    const response = filterforgeneric()
    console.log(response)
    
    const handleScroll = () => {
      setIsVisible(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await filterforgeneric();
        console.log(response.data,"jgdjg")
        setFilterData(response.data);
        console.log(filterData,"yyyyyyyyyy") 
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();

    const handleScroll = () => {
      setIsVisible(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeywordClick = async (path) => {
    try {
      // Fetch data based on path
      const keywordData = await getGenericKeywordByPath(path);
      if (keywordData) {
        // Navigate first
        navigate(`allProjects?${path}`);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500); // Adjust delay if needed
      } else {
        console.warn("No valid data found for path:", path);
      }
    } catch (error) {
      console.error("Error fetching keyword data:", error);
    }
  };

  const handleClick = () => {
    navigate("/"); // Navigate to the home page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getAllCityForMobile(); // Fetch city data
        const cityData = Array.isArray(response) ? response : response?.data;

        if (!Array.isArray(cityData) || cityData.length === 0) {
          console.error("No data found in response");
          return;
        }

        // Extract city names and corresponding phone numbers
        const cityMap = cityData.reduce((acc, item) => {
          if (item?.city?.name) {
            acc[item.city.name.toLowerCase()] = item.city.phoneNumber;
          }

          return acc;
        }, {});
        // Match shortAddress with city names
        if (shortAddress) {
          const matchedCity = Object.keys(cityMap).find((city) =>
            shortAddress.toLowerCase().includes(city)
          );
          if (matchedCity) {
            setMatchedPhoneNumber(cityMap[matchedCity]); // Set the matched phone number
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [shortAddress]);

  // useEffect(() => {
  //   const fetchProject = async () => {
  //     const urlName = window.location.pathname.split("/").pop(); // or use `useParams()` if using react-router
  //     const project = await getAllProjectsByUrlName(urlName, navigate);
  //     setProjectName(project?.name || "");
  //   };

  //   fetchProject();
  // }, []);

  // const message = encodeURIComponent(
  //   projectName
  //     ? `I'm interested in the "${projectName}" project. Please provide more details!`
  //     : `I'm interested in a project. Please provide more details!`
  // );
  // const whatsappLink = `https://api.whatsapp.com/send?phone=+918448141652&text=${message}`;

  return (
    <div>
      {/* Add Generic Link Modal */}
      <AddGenericLinkForm
        open={showAddGenericModal}
        onClose={handleCloseAddGenericModal}
        onSave={handleSaveGenericLink}
        filterData={filterData}
        genericForm={genericForm}
        setGenericForm={setGenericForm}
        handleGenericFormChange={handleGenericFormChange}
      />
      <div className="CTA">
        <div className="whatsapp">
          <a
            href="https://api.whatsapp.com/send?phone=+918448141652&text=I%27m%20interested%20in%20this%20project.%20Please%20provide%20more%20details!"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
        {matchedPhoneNumber && matchedPhoneNumber.length > 0 ? (
          matchedPhoneNumber.map((number, index) => (
            <div className="callnow">
              <a href={`tel:+91${number}`}>
                <i className="fas fa-phone"></i> {number}
              </a>
            </div>
          ))
        ) : (
          <div className="callnow">
            <a href="tel:+918368547490">
              <i className="fas fa-phone"></i> 8595189189
            </a>
          </div>
        )}
      </div>

      <button
        onClick={scrollToTop}
        id="ScrollTop"
        title="Go to top"
        style={{ display: isVisible ? "block" : "none", background: "#2067d1" }}
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      <footer>
        {/* Add Generic Link Button (stick to footer) */}
        <div className="Whatsupbuttn" style={{ width: "70px" }}>
          <a
            href="https://web.whatsapp.com/send?phone=+91-8448141652&text=I%27m%20interested%20in%20this%20project.%20Please%20provide%20more%20details!"
            target="_blank"
            style={{ float: "right" }}
          >
            <img
              src="/images/whatsappGif.gif"
              loading="lazy"
              title="SMS NOW"
              style={{ height: "59px", marginBottom: "3px" }}
              alt="WhatsApp"
            />
          </a>
        </div>

        <div className="top-footer">
          <div className="container">
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2">
              {footerItems.map((item) => (
                <div className="col" key={item.id}>
                  <ul className="footer-links list-unstyled m-0 p-0">
                    <li>
                      <button
                        onClick={() => handleKeywordClick(item.path)}
                        className="text-reset text-start custom-link"
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                          cursor: "pointer",
                          padding: 0,
                          margin: 0,
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        {item.keywords}
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
       
        <div className="top-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={logo}
                  title="Invest Mango"
                  loading="lazy"
                  alt="Invest Mango logo"
                  className="img-fluid footer-logo"
                  style={{ cursor: "pointer" }}
                  // onClick={() => navigate("/")}
                  onClick={handleClick}
                />
                <p className="normal">
                  Giving the right experience to our Clients!
                </p>
                <ul className="content_li" style={{ color: " #737373" }}>
                  <li>
                    <a href="mailto:info@investmango.com">
                      <i className="fas fa-envelope"></i> info@investmango.com
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-key"></i> UPRERAAGT12212
                  </li>
                </ul>
                <div className="social-links">
                  <a
                    href="https://www.facebook.com/InvestMango/"
                    target="_blank"
                  >
                    <img
                      // src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/e6391943-c9b2-40a0-0eb9-1e14df3c8800/public"
                      src="/images/facebook.webp"
                      loading="lazy"
                      alt="Facebook"
                      className="social-icon"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                  <a href="https://x.com/investmango" target="_blank">
                    <img
                      //src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/1f2fc408-b9a8-4fff-ccae-874028f56400/public"
                      src="/images/twitter.png"
                      loading="lazy"
                      alt="Twitter"
                      className="social-icon"
                    />
                  </a>
                  <a href="https://instagram.com/investmango" target="_blank">
                    <img
                      // src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/00c6899a-05e6-488c-2ff6-1c5fd2d8bc00/public"
                      src="/images/instagram.jpg"
                      loading="lazy"
                      alt="Instagram"
                      className="social-icon"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/investmango/"
                    target="_blank"
                  >
                    <img
                      // src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/6e591ec2-b5f2-4a01-6a43-4287e23c2300/public"
                      src="/images/LIn.jpg"
                      loading="lazy"
                      alt="Linkedin"
                      className="social-icon"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/@InvestMango"
                    target="_blank"
                  >
                    <img
                      //src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/a3003793-d9c2-4393-222e-b1dd3deb6e00/public"
                      src="/images/ytube.png"
                      loading="lazy"
                      alt="YouTube"
                      className="social-icon"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                </div>
              </div>

              <div className="col-md-3">
                <p className="headline">Contact</p>
                <ul>
                  <li className="subhead">
                    <i className="fas fa-map-marker-alt"></i> HEAD OFFICE
                  </li>
                  <li className="add">
                    <a href="https://goo.gl/maps/ULh6up2ZDQb78Rsm7">
                      11th Floor, Plot no 6, Magnus Tower, Sector 73, Noida,
                      Uttar Pradesh 201307
                    </a>
                  </li>
                  <li>
                    <a href="tel:+91-8595-189-189">
                      <i className="fas fa-phone"></i> +91-8595-189-189
                    </a>
                  </li>
                  <li>
                    <a href="tel:+91-7428-189-189">
                      <i className="fas fa-phone"></i> +91-7428-189-189
                    </a>
                  </li>
                  <li>
                    <a href="tel:+91-9911-189-189">
                      <i className="fas fa-phone"></i> +91-9911-189-189
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <p className="headline">Quick Links</p>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/compare">Compare Projects</Link>
                  </li>
                  <li>
                    <Link to="/career">Careers</Link>
                  </li>
                  <li>
                    <Link to="/sitemap">Sitemap</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                </ul>
              </div>

              <div className="col-md-3" id="our-project">
                <p className="headline">Our Projects</p>
                <ul>
                  <li>
                    <a href="https://www.investmango.com/ace-starlit-sector-152-noida">
                      ACE Starlit
                    </a>
                  </li>
                  <li>
                    <a href="https://www.investmango.com/nirala-aspire-sector-16-greater-noida-west">
                      Nirala Aspire Low Rise Phase IV
                    </a>
                  </li>
                  <li>
                    <a href="https://www.investmango.com/ace-acreville">
                      Ace Acreville
                    </a>
                  </li>
                  <li>
                    <a href="https://www.investmango.com/godrej-vrikshya-sector-103-dwarka-expressway-gurugram">
                      Godrej Vrikshya
                    </a>
                  </li>
                  <li>
                    <a href="https://www.investmango.com/lodha-altero-pune">
                      Lodha Altero
                    </a>
                  </li>
                  <li>
                    <a href="https://www.investmango.com/conscient-parq-sector-80-gurugram">
                      Conscient Parq
                    </a>
                  </li>
                </ul>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddGenericModal}
            style={{ minWidth: 200 }}
          >
            Add Generic Link
          </Button>
        </div>
            </div>

            <div className="bottom-footer">
              <div className="container">
                <p>All right Reserved | Invest Mango</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
