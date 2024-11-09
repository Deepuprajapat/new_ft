// src/app/components/Testimonial.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../styles/css/home.css"; // Ensure the path is correct
import '../styles/css/home.css';

const Testimonial = () => {
  return (
    <div className="testimonial">
      <div className="container">
        <div className="col-md-12">
          <div className="headline">
            <p className="sub-headline">Clients Testimonial</p>
            <h3 className="h3">
              A Relation Built on Trust & <span className="mobiHide">Experience</span>
            </h3>
          </div>
          <div className="client-slide owl-carousel owl-theme" id="testi_slide">
            <div className="item">
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <p className="normal">
                "Now the search is over finally, I would like to thanks Mr.
                Aditya Sharma for all the help and support. He offered Ace
                Divino to us and in just one visit we decided to book our
                dream home. His marketing skills and attention to detail
                made the process easy and lucrative for us. He help us for
                further processing too which was seamless and efficient.
                That’s not the easy lift but with your efforts all settled
                on time. Thanks once again, will love to have more happy
                experiences with you in future deals."
              </p>
              <h3 className="title">Priyanka Khatri</h3>
              <p className="project">Client</p>
            </div>
            <div class="item">
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <p class="normal">
                    " Buying a house for the first time is a very tough job but
                    I got lucky to meet the right investors in the first go.
                    Thank you Invest Mango for helping me find my dream home!"
                  </p>
                  <h3 class="title">Rakesh Gusain</h3>
                  <p class="project">Customer</p>
                </div>
                <div class="item">
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <p class="normal">
                    " I would like to thanks Invest Mango for helping us out and
                    giving the best supervision during the whole process of
                    purchasing this property Thank you, this is what I was
                    looking for!"{" "}
                  </p>
                  <h3 class="title">George Gomes</h3>
                  <p class="project">Client</p>
                </div>
                <div class="item">
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <p class="normal">
                    " Invest Mango is excellent in his service and deal. We are
                    in touch with Mr.Varun last 2 years, Finally after long
                    time, I have done deal with help of Varun. Thanks for your
                    nice effort. "
                  </p>
                  <h3 class="title">Saurabh Kumar Agrawal</h3>
                  <p class="project">Client</p>
                </div>
                <div class="item">
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <p class="normal">
                    " I am satisfied with Invest Mango team. They supervised and
                    made the whole process super easy. The team is very friendly
                    and professional at the same time."
                  </p>
                  <h3 class="title">Chaudhary Gaurav Malik</h3>
                  <p class="project">Client</p>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
