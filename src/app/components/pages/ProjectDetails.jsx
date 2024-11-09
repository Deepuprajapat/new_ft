import React from "react";
// import '../styles/css/projectDetails.css'
import "../styles/css/projectDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandArrowsAlt,
  faRulerCombined,
  faBuilding,
  faCalendarAlt,
  faGavel,
  faBars,
  faFlag,
  faCity,
  faHouseUser,
  faKey,
  faPhone,

} from "@fortawesome/free-solid-svg-icons";

const ProjectDetails = ({}) => {
  
  
  const projectsamimg = "https://www.investmango.com/img/godrej-woods/godrej-woods-noida.webp";
  return (
    <>
      <div className="details-gallery">
        <div className="container-fluid">
          <div className="row">
            {/* Large image on the left */}
            <div className="col-md-6">
              <a
                href="https://www.investmango.com/img/ace-divino/ace-divino-greater-noida-west.webp"
                data-toggle="lightbox"
                data-gallery="gallery"
              >
                <img
                  alt="https://www.investmango.com/img/ace-divino/ace-divino-greater-noida-west.webp"
                  src="https://www.investmango.com/img/ace-divino/ace-divino-greater-noida-west.webp"
                  className="img-fluid"
                  fetchpriority="high"
                />
              </a>
              <div className="artistic-label">Artistic</div>
            </div>

            {/* Smaller images on the right */}
            <div className="col-md-3">
              {/* Image 2 */}
              <div className="img-container">
                <a
                  href="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
                    src="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
                    className="img-fluid"
                    fetchpriority="high"
                  />
                </a>
                <div className="artistic-label">Artistic</div>
              </div>

              {/* Image 3 */}
              <div className="img-container">
                <a
                  href="https://www.investmango.com//img/ace-divino/ace-divino-rooms.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="https://www.investmango.com//img/ace-divino/ace-divino-rooms.webp"
                    src="https://www.investmango.com//img/ace-divino/ace-divino-rooms.webp"
                    className="img-fluid"
                    fetchpriority="high"
                  />
                </a>
                <div className="artistic-label">Artistic</div>
              </div>
            </div>

            <div className="col-md-3">
              {/* Image 4 */}
              <div className="img-container">
                <a
                  href="https://www.investmango.com/img/ace-divino/ace-divino-interior.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="https://www.investmango.com/img/ace-divino/ace-divino-interior.webp"
                    src="https://www.investmango.com/img/ace-divino/ace-divino-interior.webp"
                    className="img-fluid"
                    fetchpriority="high"
                  />
                </a>
                <div className="artistic-label">Artistic</div>
              </div>

              {/* Image 5 */}
              <div className="img-container">
                <a
                  href="https://www.investmango.com/img/ace-divino/ace-divino-dinning-room.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="https://www.investmango.com/img/ace-divino/ace-divino-dinning-room.webp"
                    src="https://www.investmango.com/img/ace-divino/ace-divino-dinning-room.webp"
                    className="img-fluid"
                    fetchpriority="high"
                  />
                </a>
                <div className="artistic-label">Artistic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content_index_bg">
        <div className="container">
          <ul className="content_index" id="links">
            <li>
              <a href="#overview">Overview</a>
            </li>
            {/* <li><a href="#why">Why</a></li> */}
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#floor">Floor</a>
            </li>
            <li>
              <a href="#price">Price</a>
            </li>
            <li>
              <a href="#payment_plan">Payment Plan</a>
            </li>
            <li>
              <a href="#amenities">Amenities</a>
            </li>
            <li>
              <a href="#video">Video</a>
            </li>
            <li>
              <a href="#location">Location</a>
            </li>
            <li>
              <a href="#siteplan">Site Plan</a>
            </li>
            <li>
              <a href="#developer">Developer</a>
            </li>
            {/* Uncomment the line below if you want to conditionally render it */}
            {/* {sameDevCount !== 1 && <li><a href="#projects_by_developer">Projects by Developer</a></li>} */}
            <li>
              <a href="#faqs">FAQs</a>
            </li>
            {/* <li><a href="#faqs" style={{ display: 'none' }}>FAQs</a></li> */}
            <li>
              <a href="#similar_projects">Similar Projects</a>
            </li>
          </ul>
        </div>
      </div>

      {/*  */}

      <section className="main-body">
        <div className="details-header">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <img
                  id="logo_img"
                  style={{
                    width: "89px",
                    padding: "6px",
                    height: "67px",
                    border: "1px solid #ced4da",
                  }}
                  src="https://www.investmango.com/img/all-logo/ace-divino-logo.webp"
                  className="img-fluid"
                  alt="https://www.investmango.com/img/all-logo/ace-divino-logo.webp"
                />

                <span>
                  <div
                    className="second-container"
                    style={{ paddingLeft: "106px" }}
                  >
                    <h1
                      id="name"
                      className="name"
                      style={{
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        fontSize: "19px",
                        fontWeight: "700",
                        marginTop: "-65px",
                      }}
                    >
                      ACE Divino
                    </h1>
                  </div>
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "-9px",
                    textAlign: "left",
                  }}
                >
                  Sector 1 Greater Noida West
                </p>
                <div id="project_logo">
                  <p
                    className="dev"
                    style={{
                      marginTop: "-3px",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  >
                    By <a href="#"> ACE Group</a>
                  </p>
                </div>

                <div id="component2" style={{ marginTop: "15px" }}>
                  <button
                    style={{
                      border: "none",
                      background: "#2067d1",
                      color: "white",
                      width: "55px",
                      fontSize: "11px",
                    }}
                  >
                    Rera
                  </button>
                  {/* {showReraDetails && ( */}
                  <div id="myDIV">
                    <table>
                      <tbody>
                        <h6>Rera Detail</h6>
                        <i
                          className="fa fa-close"
                          style={{
                            fontSize: "17px",
                            float: "right",
                            marginTop: "-29px",
                          }}
                        ></i>
                        <tr>
                          <th
                            style={{
                              width: "45%",
                              textAlign: "left",
                              fontSize: "12px",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Phase
                          </th>
                          <th
                            style={{
                              width: "34%",
                              textAlign: "left",
                              fontSize: "12px",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Rera Number
                          </th>
                        </tr>
                        {
                        /* {projectData.projectReraData.map((row, index) => ( */}
                        <tr>
                          <td
                            style={{
                              display: "flex",
                              fontSize: "12px",
                              lineHeight: "16px",
                              fontWeight: "400",
                              color: "#42526e",
                              textAlign: "left",
                              verticalAlign: "middle",
                              padding: "12px 0px",
                            }}
                          >
                            {/* {row.phase} */}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#42526e",
                              fontWeight: "400",
                            }}
                          >
                            {" "}
                            Available On
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#42526e",
                              fontWeight: "400",
                            }}
                          >
                            {" "}
                            https://uprera.azurewebsites.net/ViewProjectInDetailPublicView.aspx?id=6734
                          </td>
                        </tr>
                        {/* ))} */}
                        <tr>
                          <td
                            style={{
                              display: "flex",
                              fontSize: "12px",
                              lineHeight: "16px",
                              fontWeight: "400",
                              color: "#42526e",
                              textAlign: "left",
                              verticalAlign: "middle",
                              padding: "12px 0px",
                            }}
                          ></td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#42526e",
                              fontWeight: "400",
                            }}
                          >
                            Available On
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#42526e",
                              fontWeight: "400",
                            }}
                          >
                            {" "}
                            https://uprera.azurewebsites.net/ViewProjectInDetailPublicView.aspx?id=6734
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* )} */}
                  <button
                    style={{
                      border: "none",
                      color: "black",
                      width: "84px",
                      fontSize: "11px",
                    }}
                  >
                    No Brokerage
                  </button>
                  <button
                    style={{ border: "none", width: "131px", fontSize: "11px" }}
                  >
                    Floor Plans Available
                  </button>
                  <button
                    style={{ border: "none", width: "90px", fontSize: "11px" }}
                  >
                    Top Amenities
                  </button>
                </div>
              </div>

              <div className="col-md-4" style={{ textAlign: "right" }}>
                <p
                  className="emi-link"
                  style={{ fontWeight: "700", fontSize: "18px" }}
                >
                  Starting from
                </p>
                <p className="price">
                  <i className="fas fa-rupee-sign"></i>
                  1.5 Cr - 2.06 Cr
                </p>
                <p className="emi-link" style={{ display: "none" }}>
                  <a href="#">EMI starts at ₹--.-- K</a>
                </p>
              </div>
            </div>
            <hr />
            <div className="col-md-12">
              <div className="d-flex">
                {/* Additional content can go here */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="details-content">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <section id="overview">
                <div className="box overview">
                  <h2 className="headline">Project Details</h2>
                  <p className="para_two_line">
                    This is a brief overview of the project that gives essential
                    information about its features and amenities.
                  </p>
                  <div className="row">
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faExpandArrowsAlt} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Area
                          <br />
                          <b>1000 sq ft</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faRulerCombined} />
                        </p>
                        <p className="amenities">
                          Sizes <br />
                          <b>800 sq ft - 1500 sq ft</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Units
                          <br />
                          <b>
                            200 Units
                            <br />
                            <span>50 Flats left</span>
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Launch Date
                          <br />
                          <b>January 2023</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faGavel} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Possession Date
                          <br />
                          <b>December 2025</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBuilding} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Towers
                          <br />
                          <b>5 Towers</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faBars} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Total Floors
                          <br />
                          <b>20 Floors</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faFlag}
                            style={{ fontSize: "24px" }}
                          />
                        </p>
                        <p className="amenities">
                          {" "}
                          Project Status
                          <br />
                          <b style={{ textTransform: "capitalize" }}>
                            Under Construction
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon icon={faCity} />
                        </p>
                        <p className="amenities">
                          {" "}
                          Property Type
                          <br />
                          <b>Residential</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faHouseUser}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          {" "}
                          Configurations
                          <br />
                          <b>1 BHK, 2 BHK, 3 BHK</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-6 col-sm-6">
                      <div className="inner-item d-flex">
                        <p className="icon">
                          <FontAwesomeIcon
                            icon={faKey}
                            style={{ fontSize: "20px" }}
                          />
                        </p>
                        <p className="amenities">
                          RERA Number.
                          <br />
                          <b>RERA123456</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="overview1">
  <div id="why" className="box overview">
    <h2 className="headline">Why to choose Project Name?</h2>
    <div className="Why_action">
      <p className="para_two_line">This is the reason why you should choose this project. It offers excellent amenities and prime location.</p>

      <div className="row">
        <div className="col-md-6">
          <div className="project-gallery">
            <div className="item">
              <a href="img/project_sample1.jpg">
                <img
                  alt="Project Image 1"
                  style={{ width: '100%', height: '230px' }}
                  src="img/project_sample1.jpg"
                  className="img-fluid lazy"
                  fetchpriority="high"
                />
              </a>
              <div className="artistic-label" style={{ top: '59%', right: '19px' }}>Artistic</div>
            </div>
            <div className="item">
              <a href="img/project_sample2.jpg">
                <img
                  alt="Project Image 2"
                  style={{ height: '130px', width: '100%' }}
                  src="img/project_sample2.jpg"
                  className="img-fluid lazy"
                  fetchpriority="high"
                />
              </a>
              <div className="artistic-label" style={{ top: '95%', left: '150px' }}>Artistic</div>
            </div>
            <div className="item">
              <a href="img/project_sample3.jpg">
                <img
                  alt="Project Image 3"
                  style={{ height: '130px', width: '100%' }}
                  src="img/project_sample3.jpg"
                  className="img-fluid lazy"
                  fetchpriority="high"
                />
              </a>
              <div className="artistic-label" style={{ top: '95%', right: '19px' }}>Artistic</div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row right_section">
            <div className="col-md-6 col-6">
              <span>
                <img
                  className="lazy height"
                  alt="USP 1"
                  src="img/icon/interior-icon4.svg"
                  fetchpriority="high"
                />
              </span>
              <span>USP 1</span>
            </div>
            <div className="col-md-6 col-6">
              <span>
                <img
                  className="lazy height"
                  alt="USP 2"
                  src="img/icon/interior-icon4.svg"
                  fetchpriority="high"
                />
              </span>
              <span>USP 2</span>
            </div>
            <div className="col-md-6 col-6">
              <span>
                <img
                  className="lazy height"
                  alt="USP 3"
                  src="img/icon/interior-icon4.svg"
                  fetchpriority="high"
                />
              </span>
              <span>USP 3</span>
            </div>
            <div className="col-md-6 col-6">
              <span>
                <img
                  className="lazy height"
                  alt="USP 4"
                  src="img/icon/interior-icon4.svg"
                  fetchpriority="high"
                />
              </span>
              <span>USP 4</span>
            </div>
            <div className="col-md-12">
              <a href="#form_side" id="BookBtn2" className="theme-btn">Book Your Site Visit</a>
            </div>
            <div className="col-md-12">
              <a href="tel:911234567890" className="theme-btn white-btn">
                <p className="icon">
                  <FontAwesomeIcon icon={faPhone} style={{ fontSize: "20px" }} /> Connect to Our Expert
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


              <section id="about" className="main-body">
                <div class="box overview">
                  <h2 class="headline">Know About ACE Forest</h2>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="inner-item limitcon">
                        <p>
                          ACE Forest is a premium residential project offering a
                          blend of modern living and serene surroundings. It
                          provides a variety of amenities and spacious
                          apartments designed for comfort and convenience.
                        </p>
                        <p>
                          <span style={{ color: "#2067d1", fontWeight: 600 }}>
                            {" "}
                            Coming Soon{" "}
                          </span>
                        </p>
                        <p>
                          Click on the{" "}
                          <button
                            id="download-btn2"
                            style={{
                              border: "none",
                              backgroundColor: "white",
                              color: "#2067d1",
                            }}
                            aria-label="Download brochure"
                          >
                            <b>"Download"</b>
                          </button>{" "}
                          button to download <b>ACE Forest brochure</b>.
                        </p>

                        <a class="readmore">Read More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="floor">
  <div className="box overview">
    <h2 className="headline">Project Name Floor Plan</h2>
    <div className="row">
      <div className="col-md-12" style={{ padding: "0px 30px" }}>
        <p className="para_two_line">
          This is a brief description of the floor plan for the project.
        </p>
        <div className="floorplan_btn">
          <button
            id="allshow"
            style={{
              border: "2px solid #000",
              borderRadius: "15px",
              padding: "5px 15px",
              fontWeight: "600",
            }}
            className="btn activebtn"
          >
            All
          </button>
          <button
            id="2BHK"
            style={{
              border: "2px solid #000",
              borderRadius: "15px",
              padding: "5px 15px",
              fontWeight: "600",
            }}
            className="btn"
          >
            2 BHK
          </button>
          <button
            id="3BHK"
            style={{
              border: "2px solid #000",
              borderRadius: "15px",
              padding: "5px 15px",
              fontWeight: "600",
            }}
            className="btn"
          >
            3 BHK
          </button>
        </div>
        <button
          className="slide_left_btn"
          style={{ zIndex: 99 }}
          aria-label="Slide left to view similar items"
        >
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </button>
        <button
          className="slide_right_btn"
          style={{ zIndex: 99 }}
          aria-label="Slide right to view similar items"
        >
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <div id="gallery_owl" className="inner-item owl-carousel owl-theme">
          <div className="floor_item 2BHK">
            <div className="row">
              <div className="col-md-12">
                <small>&nbsp;</small>
                <p>2 BHK Floor Plan</p>
              </div>
              <div className="col-md-12">
                <a
                  href="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="Project Name Floor Plan"
                    src="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                    className="img-fluid lazy"
                    style={{ width: "100%" }}
                    fetchpriority="high"
                  />
                </a>
              </div>
              <div className="col-md-6">
                <small>Builtup Area</small>
                <p>1000 sq ft</p>
              </div>
              <div className="col-md-6">
                <small>Price</small>
                <p>₹75,00,000</p>
              </div>
              <div className="col-md-12">
                <a className="btn btn-primary" href="tel:+911234567890">
                  Talk to our Expert
                </a>
                <button
                  style={{ float: "right" }}
                  onClick={() => console.log("Download Brochure")}
                  className="btn btn-outline"
                >
                  Download Floor Plan
                </button>
              </div>
            </div>
          </div>
          <div className="floor_item 3BHK">
            <div className="row">
              <div className="col-md-12">
                <small>&nbsp;</small>
                <p>3 BHK Floor Plan</p>
              </div>
              <div className="col-md-12">
                <a
                  href="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                  data-toggle="lightbox"
                  data-gallery="gallery"
                >
                  <img
                    alt="Project Name Floor Plan"
                    src="https://www.investmango.com/img/ace-divino/ace-divino-floor-plan-2bhk-995sq.ft.webp"
                    className="img-fluid lazy"
                    style={{ width: "100%" }}
                    fetchpriority="high"
                  />
                </a>
              </div>
              <div className="col-md-6">
                <small>Builtup Area</small>
                <p>1500 sq ft</p>
              </div>
              <div className="col-md-6">
                <small>Price</small>
                <p>₹1,00,00,000</p>
              </div>
              <div className="col-md-12">
                <a className="btn btn-primary" href="tel:+911234567890">
                  Talk to our Expert
                </a>
                <button
                  style={{ float: "right" }}
                  onClick={() => console.log("Download Brochure")}
                  className="btn btn-outline"
                >
                  Download Floor Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="price">
  <div className="box overview">
    <h2 className="headline">Project Name Price List</h2>
    <div className="row">
      <div className="col-md-12">
        <p className="para_two_line">
          This is a brief description of the price list for the project.
        </p>
        <div className="inner-item">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Configurations</th>
                  <th scope="col">Size</th>
                  <th scope="col">Price</th>
                  <th scope="col">BEST BUY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2 BHK</td>
                  <td>1000 sq ft</td>
                  <td>₹75,00,000</td>
                  <td>₹70,00,000</td>
                </tr>
                <tr>
                  <td>3 BHK</td>
                  <td>1500 sq ft</td>
                  <td>₹1,00,00,000</td>
                  <td>₹95,00,000</td>
                </tr>
                <tr>
                  <td>4 BHK</td>
                  <td>2000 sq ft</td>
                  <td>Prices On Request</td>
                  <td>₹1,85,00,000</td>
                </tr>
                <tr>
                  <td>5 BHK</td>
                  <td>2500 sq ft</td>
                  <td>Sold Out</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div className="alert alert-warning calltoactionbtn" role="alert">
        Get Free Consultation for this property. Call us at: <a href="tel:+91-1234567890">+91-1234567890</a>
      </div>

      {/* Payment Plan Section */}
      <section id="payment_plan">
        <div className="box overview">
          <h2 className="headline">Project Name Payment Plan</h2>
          <div className="row">
            <div className="col-md-12">
              <p className="para_two_line" style={{ paddingLeft: '20px' }}>
                This is a brief description of the payment plan for the project.
              </p>
              <div className="inner-item">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td>Booking Amount</td>
                        <td>10% of Total Price</td>
                      </tr>
                      <tr>
                        <td>On Agreement</td>
                        <td>20% of Total Price</td>
                      </tr>
                      <tr>
                        <td>On Foundation</td>
                        <td>15% of Total Price</td>
                      </tr>
                      <tr>
                        <td>On Completion</td>
                        <td>Remaining Balance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="video">
  <div className="box overview">
    <h2 className="headline">VIDEO PRESENTATION OF Example Project</h2>
    <div className="row">
      <div className="col-md-12">
        <p className="para_two_line">Click for the video of ACE Divino Sector 1 Greater Noida West and understand every perspective of 'quality living' that they are offering. And for more property videos visit our YouTube channel.</p>
        <div className="inner-item">
          {/* If there is a video ID, display the video player */}
          <div className="youtube" data-embed="VIDEO_ID_HERE">
            <div className="play-button" style={{ background: 'red' }}></div>
          </div>

          {/* If no video ID, display the YouTube link banner */}
          <a 
            href="https://youtu.be/OmvpphgerjI?si=0ZMNitpsk55EGcUG" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://img.youtube.com/vi/OmvpphgerjI/sddefault.jpg"  
              alt="Example Project video" 
              className="img-fluid" 
              style={{ width: '100%', cursor: 'pointer', height: 'auto' }} 
              fetchpriority="high" 
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<section>
      <div className="box overview">
        <h2 className="headline">ACE Divino Location Advantage</h2>
        <div className="row">
          <div className="col-md-12" style={{ padding: '0px 35px' }}>
            <div className="inner-item">
              <p>
                The residential development of <b>ACE Divino</b> has been strategically located in Sector-1 Greater Noida West. 
                <b>ACE Divino location</b> places you near top schools, colleges, sports complexes, entertainment centers, and much more.
              </p>

              <b>SPORTS FACILITIES</b>
              <ul>
                <li>Skyjumper trampoline park - 23-minute drive</li>
                <li>Golf Course Noida - 25-minute drive</li>
                <li>Play All Sports Complex - 19-minute drive</li>
              </ul>

              <b>ROAD CONNECTIVITY</b>
              <ul>
                <li>Ek Murti Gol Chakkar - 20-minute drive</li>
                <li>Indira Gandhi International Airport - 1 hr 12 minutes drive</li>
                <li>Pari Chowk - 25-minute drive</li>
              </ul>

              <b>PUBLIC TRANSPORT</b>
              <ul>
                <li>Blue Line Metro Station 52 - 25-minute drive</li>
                <li>Sector 101 Metro Station Road Sector 78 - 16-minute drive</li>
              </ul>

              <b>MEDICAL FACILITIES</b>
              <ul>
                <li>Saini Hospital - 13-minute drive</li>
                <li>Yatharth Hospital - 25-minute drive</li>
                <li>Kailash Hospital - 32-minute drive</li>
                <li>Nix Multi Speciality Hospital - 10-minute drive</li>
              </ul>

              <b>ENTERTAINMENT HUB</b>
              <ul>
                <li>Bhangel Market - 25-minute drive</li>
                <li>Gaur City Mall - 19-minute drive</li>
                <li>Ace City Square Mall - 13-minute drive</li>
              </ul>

              <b>EDUCATIONAL INSTITUTIONS</b>
              <ul>
                <li>K C International School - 10-minute drive</li>
                <li>G D Goenka International School - 17-minute drive</li>
                <li>Amity University - 31-minute drive</li>
                <li>D.S International School - 7-minute drive</li>
                <li>J M International School Greater Noida West - 15-minute drive</li>
                <li>Maharishi University Of IT, Noida - 25-minute drive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="location">
      <div className="box overview">
        <h2 className="headline">ACE Divino Location Map</h2>
        <div className="row">
          <div className="col-md-12">
            <p className="para_two_line">
              Ace Divino is located in <b>Sector-1, Greater Noida West,</b> Uttar Pradesh 201306. The location is easily accessible from all major highways and has good connectivity to nearby areas.
            </p>
            <div className="inner-item">
              <div
                className="over"
                style={{
                  background: '#f22a2a00',
                  position: 'absolute',
                  width: '80%',
                  height: '100%',
                }}
              ></div>
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2857262980438!2d77.43616551440543!3d28.56118159405898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef9c39e91025%3A0x7a015a36f37ecdee!2sAce%20Divino!5e0!3m2!1sen!2sin!4v1663676267893!5m2!1sen!2sin"
                width="100%"
                height="300px"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="siteplan">
      <div className="box overview">
        <h2 className="headline">ACE Divino Site Plan</h2>
        <div className="row">
          <div className="col-md-12">
            <p className="para_two_line">
              If we talk about the ACE Divino site plan, it spreads over 10.41 acres of area. In fact, it has 70% green landscape and its rest 30% will be used for construction according to sustainable lifestyle living.
            </p>
            <div className="inner-item">
              <div className="image-container">
                <div className="zoom-image-container">
                  <a href="https://www.investmango.com/img/ace-divino/ace-divino-site-plan.webp" data-toggle="lightbox" data-gallery="gallery">
                    <img
                      className="lazy img-fluid"
                      id="zoom-image"
                      style={{ width: '100%' }}
                      alt="ACE Divino Site Plan"
                      src="https://www.investmango.com/img/ace-divino/ace-divino-site-plan.webp"
                      fetchpriority="high"
                    />
                  </a>
                  <div className="zoom-buttons">
                    <button
                      id="zoom-in"
                      style={{
                        background: '#dddd',
                        display: 'block',
                        border: 0,
                        margin: 0,
                        padding: 0,
                        textTransform: 'none',
                        appearance: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        userSelect: 'none',
                        overflow: 'hidden',
                        width: '40px',
                        height: '40px',
                        top: 0,
                        left: 0,
                      }}
                      aria-label="Zoom In"
                    >
                      +
                    </button>
                    <button
                      id="zoom-out"
                      style={{
                        background: '#dddd',
                        display: 'block',
                        border: 0,
                        margin: 0,
                        padding: 0,
                        textTransform: 'none',
                        appearance: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        userSelect: 'none',
                        overflow: 'hidden',
                        width: '40px',
                        height: '40px',
                        top: 0,
                        left: 0,
                      }}
                      aria-label="Zoom Out"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="developer">
      <div className="box overview">
        <h2 className="headline">About ACE Group</h2>
        <div className="row">
          <div className="col-md-12">
            <div className="inner-item">
              <div className="over_head">
                <img
                  src="https://www.investmango.com/img/developer-img/ace-group.webp"
                  className="img-fluid lazy"
                  alt="ACE Group logo"
                  fetchpriority="high"
                  style={{width:'50px'}}
                />
                <p>
                  ESTABLISHED IN - <b>2010</b>
                  <br />
                  TOTAL PROJECTS - <b>10+</b>
                </p>
              </div>
              <p className="des">
                <br />
                <b>Ace Group of India</b> wants to deliver your 'dream home' - where you can enjoy the luxury in your personal space. Under the leadership of Mr.Ajay Ch . . .
              </p>
              <a href="developer.php/2/ace-group" className="theme-btn">read more</a>
              <br /><br />
              <h4 style={{ fontSize: '18px' }}>
                <b>Contact Details</b>
                <br />
              </h4>
              <p>
                <b>ACE Divino</b>
                <br />
                <b>Address:</b> GH-14A, Sector-1, Greater Noida West, Uttar Pradesh 201306
                <br />
                <b>Phone:</b>
                <a className="remove_under" href="tel:+918595-189-189"> +91- 8595-189-189</a>
                <br />
                <b>Book Your Site Visit</b> <span id="BookBtn3" style={{ cursor: 'pointer', color: '#2067d1', fontWeight: 700 }}>Click Here</span>
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="faqs">
      <div className="box overview">
        <h5 className="headline">Frequently Asked Questions (FAQs)</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="inner-item">
              <div className="item-fq">
                <b>Why to choose ACE Divino for investment?</b>
                <div className="panel">
                  <p>
                    There are countless reasons to choose ACE Divino in Sector-1, Greater Noida West, some of the prominent reasons to choose ACE Divino are as follows:
                  </p>
                  <ul>
                    <li>Only 3 Apartments on a Single Floor for Privacy</li>
                    <li>A Skywalk is developed for the Inter-Walking Tower</li>
                    <li>One main clubhouse with 2 Mini Clubhouses</li>
                  </ul>
                </div>
              </div>
              <div className="item-fq">
                <b>What is the location of the project?</b>
                <div className="panel">
                  <p>The ACE Divino address is Plot no GH-14A, Sector-1, Greater Noida West, Uttar Pradesh 201306.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>What is the RERA Number of ACE Divino?</b>
                <div className="panel">
                  <p>ACE Divino RERA Number is UPRERAPRJ6734.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>What is the project area of ACE Divino?</b>
                <div className="panel">
                  <p>The ACE Divino project is spread over a total land area of 10.41 acres.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>On which date it was launched?</b>
                <div className="panel">
                  <p>ACE Divino was launched in May 2017.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>What is the possession date of the ACE Divino?</b>
                <div className="panel">
                  <p>The possession date for the ACE Divino possession started in December 2022.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>Is the project Bank Approved?</b>
                <div className="panel">
                  <p>Banks such as the State Bank of India, AXIS Bank, ICICI Bank, Tata Capital, and HDFC Bank have approved the project.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>How many towers are there in the project?</b>
                <div className="panel">
                  <p>There are a total of 11 towers in the project with 23 floors in each tower.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>How many apartment units are there in ACE Divino?</b>
                <div className="panel">
                  <p>There are 1572 flats in 3 different configurations including ACE Divino 2 BHK, 3 BHK, and 4 BHK apartments in Greater Noida West.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>What are the sizes of the apartments in ACE Divino?</b>
                <div className="panel">
                  <p>The sizes of the apartment units in ACE Divino vary from 995 sq. ft to 1875 sq. ft.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>How can I download the ACE Divino brochure?</b>
                <div className="panel">
                  <p>You can easily download the ACE Divino Brochure from our website.</p>
                </div>
              </div>
              <div className="item-fq">
                <b>Which is the nearest metro station to Ace Divino?</b>
                <div className="panel">
                  <p>The Ace Divino nearest metro is Sector 52 Noida Metro Station on the Blue Line.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  

            </div>
            <div className="col-md-4" id="from-top">
      <div className="right-sti">
        <div className="details-form" id="form_side">
          <p className="form-headline">Connect to Our Expert</p>
          <form id="sendtodata" action="api.php" method="POST">
            <div id="firstForm">
              <input
                name="username"
                id="username_side"
                className="form-control"
                type="text"
                placeholder="Name : "
              />
              <input
                name="useremail"
                id="useremail_side"
                className="form-control"
                type="text"
                placeholder="Email : "
              />

              <div className="d-flex phone_num">
                <select name="dial_code" id="dial_code" className="form-control">
                  <option value="91">+91</option>
                  <option value="61">+61</option>
                  <option value="852">+852</option>
                  <option value="968">+968</option>
                  <option value="974">+974</option>
                  <option value="65">+65</option>
                  <option value="971">+971</option>
                  <option value="44">+44</option>
                  <option value="1">+1</option>
                  <option value="27">+27</option>
                  <option value="60">+60</option>
                  <option value="64">+64</option>
                  <option value="66">+66</option>
                  <option value="966">+966</option>
                  <option value="31">+31</option>
                  <option value="973">+973</option>
                  <option value="54">+54</option>
                  <option value="43">+43</option>
                  <option value="880">+880</option>
                  <option value="32">+32</option>
                  <option value="55">+55</option>
                  <option value="86">+86</option>
                  <option value="385">+385</option>
                  <option value="42">+42</option>
                  <option value="45">+45</option>
                  <option value="1809">+1809</option>
                  <option value="20">+20</option>
                  <option value="358">+358</option>
                  <option value="679">+679</option>
                  <option value="33">+33</option>
                  <option value="49">+49</option>
                  <option value="30">+30</option>
                  <option value="592">+592</option>
                  <option value="36">+36</option>
                  <option value="62">+62</option>
                  <option value="353">+353</option>
                  <option value="972">+972</option>
                  <option value="39">+39</option>
                  <option value="81">+81</option>
                  <option value="962">+962</option>
                  <option value="82">+82</option>
                  <option value="965">+965</option>
                  <option value="853">+853</option>
                  <option value="52">+52</option>
                  <option value="212">+212</option>
                  <option value="47">+47</option>
                  <option value="48">+48</option>
                  <option value="351">+351</option>
                  <option value="40">+40</option>
                  <option value="7">+7</option>
                  <option value="34">+34</option>
                  <option value="46">+46</option>
                  <option value="41">+41</option>
                  <option value="1868">+1868</option>
                  <option value="216">+216</option>
                  <option value="90">+90</option>
                  <option value="84">+84</option>
                </select>
                <input
                  name="usermobile"
                  id="usermobile_side"
                  maxLength="10"
                  className="form-control"
                  required
                  type="text"
                  placeholder="Phone : "
                />
              </div>
              <div className="form-group">
                <label>
                  <b>I am interested in</b>
                </label>
                <select className="form-control" name="intersted_in">
                  <option value="select">select</option>
                  {/* You can map through an array of options here */}
                  <option value="Example Option 1">Example Option 1</option>
                  <option value="Example Option 2">Example Option 2</option>
                </select>
              </div>
              <input type="hidden" name="project_name" value="Project Name" />
              <textarea
                name="usermsg"
                className="form-control"
                placeholder="Message :"
                rows="3"
              ></textarea>
              <div className="alert alert-success error_display_side" role="alert">
                <b id="error_display_side">
                  OTP send on <span></span>
                </b>
              </div>
              <button name="send" type="submit" className="theme-btn" id="mainfrasasom">
                Get a Call back
              </button>
            </div>
            <div id="secondForm">
              <div className="alert alert-success error_display_verify" role="alert">
                <b>
                  <span id="error_text_verify">OTP sent to your mobile number</span>
                  <a href="#" id="back_otp">Edit</a>
                </b>
              </div>
              <div id="popverify">
                <input
                  name="enterotp"
                  id="user_otp"
                  className="form-control"
                  type="text"
                  placeholder="Enter OTP : "
                />
                <div className="d-flex justify-content-between">
                  <button style={{ margin: 0, maxWidth: '160px' }} id="resend" className="theme-btn">
                    Resend
                  </button>
                  <button style={{ margin: 0, maxWidth: '160px' }} id="verifyOTP" className="theme-btn">
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="brochure">
          <main id="btnmain">
            <section className="btnsection">
              <button
                className="btnbutton"
                id="download-btn"
                onClick={() => {/* brochurePopup() */}}
                aria-label="Download PDF"
                style={{ width: '315px' }}
              >
                <i className="fas fa-download fa-lg"></i> DOWNLOAD BROCHURE
              </button>
              <div className="bar-container" id="bar-container">
                <div className="progress-bar" id="progress-bar"></div>
              </div>
              <i
                className="repeat-btn fas fa-redo-alt fa-lg"
                id="repeat-btn"
                onClick={() => {/* reset() */}}
              ></i>
            </section>
          </main>
        </div>
      </div>
    </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
