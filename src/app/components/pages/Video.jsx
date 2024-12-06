import React from "react";
import "../styles/css/video.css";
const Video = () => {
  return (
    <div>
      <section class="main-body">
        <div class="container">
          <h1>Our Videos</h1>
          <p>
            <a
              href="https://www.investmango.com/"
              target="_blank"
              rel="noopener"
              class="styled-link"
            >
              Home
            </a>{" "}
            / Our Videos
          </p>
          <h2 style={{textAlign: 'center'}}> Latest Videos</h2>
        </div>
        <div class="main-con">
  <div class="container">
    <div class="listing-home listing-page">
      <div class="listing-slide row">

        <div class="col-md-4">
          <div class="card-im">
            <div class="youtube" data-embed="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              <div class="play-button"></div>
            </div>

            <p class="list_headline_two">Sunshine Apartments</p>
            <p class="location_im">
              <i class="fas fa-map-marker-alt"></i> 123 Palm Street, Sunnyvale
            </p>
            <h3 class="details">
              <span>
                <i class="fas fa-ruler-combined"></i> 750 To 1500 Sq. Ft.
              </span>
              <span>
                <i class="fa fa-bed" aria-hidden="true"></i> 2 BHK, 3 BHK
              </span>
            </h3>
            <div class="list-footer">
              <p class="price">
                Start from <b><i class="fas fa-rupee-sign"></i>45,</b>
              </p>
              <a href="tel:+918586819819" target="_blank" rel="noopener" class="theme-btn">
                Talk to our Expert
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card-im">
            <div class="youtube" data-embed="https://www.youtube.com/watch?v=3tmd-ClpJxA">
              <div class="play-button"></div>
            </div>

            <p class="list_headline_two">Greenview Villas</p>
            <p class="location_im">
              <i class="fas fa-map-marker-alt"></i> 45 Oak Avenue, Greenfield
            </p>
            <h3 class="details">
              <span>
                <i class="fas fa-ruler-combined"></i> 1200 To 2500 Sq. Ft.
              </span>
              <span>
                <i class="fa fa-bed" aria-hidden="true"></i> 3 BHK, 4 BHK
              </span>
            </h3>
            <div class="list-footer">
              <p class="price">
                Start from <b><i class="fas fa-rupee-sign"></i>85,</b>
              </p>
              <a href="tel:+918586819819" target="_blank" rel="noopener" class="theme-btn">
                Talk to our Expert
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card-im">
            <div class="youtube" data-embed="https://www.youtube.com/watch?v=V-_O7nl0Ii0">
              <div class="play-button"></div>
            </div>

            <p class="list_headline_two">Oceanic Towers</p>
            <p class="location_im">
              <i class="fas fa-map-marker-alt"></i> 10 Beachside Blvd, Marina Bay
            </p>
            <h3 class="details">
              <span>
                <i class="fas fa-ruler-combined"></i> 800 To 1800 Sq. Ft.
              </span>
              <span>
                <i class="fa fa-bed" aria-hidden="true"></i> 1 BHK, 2 BHK
              </span>
            </h3>
            <div class="list-footer">
              <p class="price">
                Start from <b><i class="fas fa-rupee-sign"></i>60</b>
              </p>
              <a href="tel:+918586819819" target="_blank" rel="noopener" class="theme-btn">
                Talk to our Expert
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

      </section>
    </div>
  );
};

export default Video;
