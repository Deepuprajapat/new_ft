import React ,{useState,useEffect}from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../components/styles/css/footer.css";
import { footerItems } from "../../utils/footerItems";
import logo from "../assets/img/logo_investmango.png";
// import withSafeLinks from "../../utils/rel";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  };
 
  return (
    <div>
   <div className="CTA">
      <div className="whatsapp">
        <a
          href="https://api.whatsapp.com/send?phone=+918368547490&text=Hi%2C%20I%27m%20interested%20in%20Invest%20Mango.%20Please%20share%20details%20about%20this%20project."
          // style={{ fontSize: "20px" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
      <div className="callnow">
        <a href="tel:+918368547490">
          <i
            style={{ transform: "rotate(95deg)" }}
            className="fas fa-phone"
          ></i>{" "}
          8368547490
        </a>
      </div>
    </div>
    <button
      onClick={scrollToTop}
      id="ScrollTop"
      title="Go to top"
      style={{ display: isVisible ? "block" : "none" ,background: '#2067d1'}}
    >
      <i className="fas fa-chevron-up"></i>
    </button>
    
      <footer>
        <div className="Whatsupbuttn" style={{ width: "70px" }}>
          <a
            href="https://web.whatsapp.com/send?phone=+91-8368547490&text=Hi%2C%20I%27m%20interested%20in%20Invest%20Mango.%20Please%20share%20details%20about%20this%20project."
            target="_blank"
            style={{ float: "right" }}
          >
            <img
              src="https://www.investmango.com/images/whatsapp1.gif"
              title="SMS NOW"
              style={{ height: "59px", marginBottom: "3px" }}
              alt="WhatsApp"
            />
          </a>
        </div>
        <div className="top-footer">
        <div className="container">
          <div className="row">
            {footerItems.map((column, colIndex) => (
              <div className="col-md-3" key={colIndex}>
                <ul className="footer-links" >
                  {column.map((footerUrl, index) => (
                    <li key={index} >
                      <a href={footerUrl.href}>{footerUrl.projectName}</a>
                    </li>
                  ))}
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
                  alt="Invest Mango logo"
                  className="img-fluid footer-logo"
                />
                <p className="normal">
                  Giving the right experience to our Clients!
                </p>
                <ul className="content_li" style={{ color:' #737373'}}>
                  <li>
                    <a
                      href="mailto:info@investmango.com"
                     
                    >
                      <i className="fas fa-envelope"></i> info@investmango.com
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-key"></i> UPRERAAGT12212
                  </li>
                </ul>
                <div className="social-links">
                  <a  href="https://twitter.com/investmango"  target="_blank">
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
              <div className="col-md-3">
                <h5 className="headline">Contact</h5>
                <ul>
                  <li className="subhead">
                    <i className="fas fa-map-marker-alt"></i> HEAD OFFICE
                  </li>
                  <li className="add"><a href="https://goo.gl/maps/ULh6up2ZDQb78Rsm7">
                    11th Floor, Plot no 6, Magnus Tower, Sector 73, Noida, Uttar
                    Pradesh 201307</a>
                  </li>
                  <li><a href="tel:+91-8595-189-189">
                    <i className="fas fa-phone"></i> +91-8595-189-189</a>
                  </li>
                  <li><a href="tel:+91-7428-189-189">
                    <i className="fas fa-phone"></i> +91-7428-189-189</a>
                  </li>
                  <li><a href="tel:+91-9911-189-189">
                    <i className="fas fa-phone"></i> +91-9911-189-189</a>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="col-md-3">
                <h5 className="headline">Quick Links</h5>
                <ul >
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
              <div className="col-md-3" id="our-project">
                <h5 className="headline">Our Projects</h5>
                <ul>
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

export default (Footer);
