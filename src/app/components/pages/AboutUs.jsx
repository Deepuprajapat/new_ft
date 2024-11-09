import React from "react";
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/870dad0c-7f7a-440b-70a3-afc3df3a8300/public"
              title="About Invest Mango"
              alt="About Invest Mango"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <div className="headline">
              <p className="sub-headline">Invest Only to gain profit.....</p>
              <h3 className="h3">About Us</h3>
            </div>
            <div className="content">
              <p className="p_n">
                When you talk about investment, our trained professionals know
                how to adapt to the changes & work according to the needs of the
                customers. Invest Mango is the only Consultant in the real
                estate market who does not deal with builders but instead deals
                with the project. We verify Construction Merits, Authority
                Approvals, Builder’s Finances, RERA Registration, and lastly,
                the Developer's Approach towards the delivery of the project.
              </p>
              <p className="p_n">
                Our vision in the real estate business is to assure flawless
                management of your funds, allocating you to the most fiercely
                growing areas of NCR and offering exclusive opportunities in all
                the different locations.
              </p>
              <p className="p_n">
                We are in the Real Estate business and know how to give
                Developers the most compelling services and the residents an
                EXCLUSIVE experience with wonderful amenities. An affordable
                budget for the buyers and investors as well. Invest Mango
                strives hard to generate maximum returns at minimum risk with
                easy liquidity.
              </p>
              <Link to="/about" className="theme-btn">
                Know more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
