import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import "../components/styles/css/footer.css";

const Footer = () => {
  return (
    <div>
      <footer>
        <div className="Whatsupbuttn" style={{ width: "70px" }}>
          <a
            href="https://web.whatsapp.com/send?phone=+91-8368547490&text=Hi%2C%20I%27m%20interested%20in%20Invest%20Mango.%20Please%20share%20details%20about%20this%20project."
            target="_blank"
            style={{ float: "right" }}
          >
            <img
              src="../../images/whatsapp1.gif"
              title="SMS NOW"
              style={{ height: "59px", marginBottom: "3px" }}
              alt="WhatsApp"
            />
          </a>
        </div>
        <div
          className="top-footer"
          style={{ paddingTop: "74px", paddingBottom: "10px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <ul style={{ marginLeft: "-26px" }}>
                  <li>
                    <a href="/ace-projects-in-noida.php">
                      ACE Projects in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/ats-projects-in-noida.php">
                      ATS Projects in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/godrej-projects-in-noida.php">
                      Godrej Projects in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/godrej-projects-in-gurgoan.php">
                      Godrej Projects in Gurgoan
                    </a>
                  </li>
                  <li>
                    <a href="/property-in-yamuna-expressway.php">
                      Property in Yamuna Expressway
                    </a>
                  </li>
                  <li>
                    <a href="/flats-in-gurugram-for-sale.php">
                      Flats in Gurugram for sale
                    </a>
                  </li>
                  <li>
                    <a href="/max-estate-projects-in-gurugram.php">
                      Max Estate Projects In Gurugram
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul style={{ marginLeft: "-26px" }}>
                  <li>
                    <a href="/flats-in-gurgaon.php">Flats in Gurgaon</a>
                  </li>
                  <li>
                    <a href="/flats-in-greater-noida.php">
                      Flats in Greater Noida
                    </a>
                  </li>
                  <li>
                    <a href="/flats-in-noida-for-sale.php">
                      Flats for Sale in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/flats-in-mumbai-for-sale.php">
                      New Flats in Mumbai for Sale
                    </a>
                  </li>
                  <li>
                    <a href="/flats-in-pune-for-sale.php">
                      Flats for Sale in Pune
                    </a>
                  </li>
                  <li>
                    <a href="/flats-in-delhi-for-sale.php">
                      Flats in Delhi for sale
                    </a>
                  </li>
                  <li>
                    <a href="/m3m-new-projects-in-gurgaon.php">
                      M3M new projects in gurgaon
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul style={{ marginLeft: "-26px" }}>
                  <li>
                    <a href="/commercial-property-in-noida.php">
                      Commercial Property in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/commercial-property-in-greater-noida.php">
                      Commercial Property in Greater Noida
                    </a>
                  </li>
                  <li>
                    <a href="/new-projects-in-noida-extension.php">
                      New Projects in Noida Extension
                    </a>
                  </li>
                  <li>
                    <a href="/new-residential-projects-in-noida.php">
                      New Residential Projects in Noida
                    </a>
                  </li>
                  <li>
                    <a href="/residential-projects-in-sector-150-noida.php">
                      Residential Projects in Sector 150 Noida
                    </a>
                  </li>
                  <li>
                    <a href="/new-launch-projects-in-dwarka-expressway.php">
                      New Launch Projects In Dwarka Expressway
                    </a>
                  </li>
                  <li>
                    <a href="/new-launch-projects-in-gurugram.php">
                      New Launch Projects in Gurugram
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul style={{ marginLeft: "-26px" }}>
                  <li>
                    <a href="/2-bhk-flat-in-noida-extension-ready-to-move.php">
                      2BHK Flats in Noida Extension
                    </a>
                  </li>
                  <li>
                    <a href="/3-bhk-flats-in-noida-extension-ready-to-move.php">
                      3BHK Flats in Noida Extension
                    </a>
                  </li>
                  <li>
                    <a href="/3bhk-flat-in-gurugram.php">
                      3BHK Flats in Gurugram
                    </a>
                  </li>
                  <li>
                    <a href="/4bhk-flats-in-gurugram.php">
                      4BHK Flats in Gurugram
                    </a>
                  </li>
                  <li>
                    <a href="/new-launch-residential-projects-in-gurgaon.php">
                      New Residential Projects in Gurgaon
                    </a>
                  </li>
                  <li>
                    <a href="/best-residential-projects-in-greater-noida-west.php">
                      Residential Projects in Greater Noida West
                    </a>
                  </li>
                  <li>
                    <a href="/best-residential-projects-in-siddharth-vihar-ghaziabad.php">
                      Residential Projects in Siddharth Vihar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="container">
            <div className="row">
              {/* Logo and Contact Information */}
              <div className="col-md-4">
                <img
                  src="/img/logo_investmango.png"
                  title="Invest Mango"
                  alt="Invest Mango logo"
                  className="img-fluid footer-logo"
                  style={{
                    marginBottom: "10px",
                    width: "150px",
                    height: "auto",
                  }} // Adjust as needed
                />
                <p className="footer-description">
                  Giving the right experience to our Clients!
                </p>
                <ul className="contact-info">
                  <li>
                    <a
                      href="mailto:info@investmango.com"
                      style={{ color: "white" }}
                    >
                      <i className="fas fa-envelope"></i> info@investmango.com
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-key"></i> UPRERAAGT12212
                  </li>
                </ul>
                <div className="social-links">
                  <a target="_blank">
                    <img
                      src="	https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/e6391943-c9b2-40a0-0eb9-1e14df3c8800/public"
                      alt="Facebook"
                      className="social-icon"
                    />
                  </a>
                  <a href="https://twitter.com/investmango" target="_blank">
                    <img
                      src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/1f2fc408-b9a8-4fff-ccae-874028f56400/public"
                      alt="X"
                      className="social-icon"
                    />
                  </a>
                  <a href="https://instagram.com/investmango" target="_blank">
                    <img
                      src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/00c6899a-05e6-488c-2ff6-1c5fd2d8bc00/public"
                      alt="Instagram"
                      className="social-icon"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/investmango/"
                    target="_blank"
                  >
                    <img
                      src="	https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/6e591ec2-b5f2-4a01-6a43-4287e23c2300/public"
                      alt="LinkedIn"
                      className="social-icon"
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCkQZ1pJJTnEZG5XOyJsthhA"
                    target="_blank"
                  >
                    <img
                      src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/a3003793-d9c2-4393-222e-b1dd3deb6e00/public"
                      alt="YouTube"
                      className="social-icon"
                    />
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-md-4">
                <h5 className="footer-title">Contact</h5>
                <ul className="contact-list">
                  <li>
                    <i className="fas fa-map-marker-alt"></i> HEAD OFFICE
                  </li>
                  <li>
                    11th Floor, Plot no 6, Magnus Tower, Sector 73, Noida, Uttar
                    Pradesh 201307
                  </li>
                  <li>
                    <i className="fas fa-phone"></i> +91-8595-189-189
                  </li>
                  <li>
                    <i className="fas fa-phone"></i> +91-7428-189-189
                  </li>
                  <li>
                    <i className="fas fa-phone"></i> +91-9911-189-189
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="col-md-2">
                <h5 className="footer-title">Quick Links</h5>
                <ul className="quick-links">
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
            
                  <li>
                    <Link to="/career">Careers</Link>
                  </li>
                  <li>
                    <Link to="/sitemap">Sitemap</Link>
                  </li>
                </ul>
              </div>

              {/* Our Projects */}
              <div className="col-md-2">
                <h5 className="footer-title">Our Projects</h5>
                <ul className="project-links">
                  <li>
                    <a href="/projects/ace-divino">ACE Divino</a>
                  </li>
                  <li>
                    <a href="/projects/godrej-woods">Godrej Woods</a>
                  </li>
                  <li>
                    <a href="/projects/ace-starlit">ACE Starlit</a>
                  </li>
                  <li>
                    <a href="/projects/nirala-aspire">
                      Nirala Aspire Low Rise Phase IV
                    </a>
                  </li>
                  <li>
                    <a href="/projects/ace-terra">ACE Terra</a>
                  </li>
                  <li>
                    <a href="/projects/max-antara">Max Antara</a>
                  </li>
                </ul>
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
