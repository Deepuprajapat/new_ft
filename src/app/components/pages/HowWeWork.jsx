import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../styles/css/style.css"; // Adjust the path if needed

const HowWeWork = () => {
  return (
    <div className="weWork" style={{ marginTop: "-84px" }}>
      <div className="container">
        <div className="col-md-12">
          <div className="headline">
            <p className="sub-headline">How We Work</p>
            <h3 className="h3">
              We Bestow Full Assistance at
              <span className="mobiHide"> Every Stride</span>
            </h3>
          </div>
          <div className="weWorkInner">
            <div className="item">
              <div className="img-ic">
                <img
                  src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/dbb50f66-4af8-4647-9f98-07518108d700/public"
                  title="Select Property"
                  alt="Select Property"
                  className="img-fluid"
                />
              </div>
              <p className="title">Select Property</p>
            </div>
            <div className="item">
              <div className="img-ic">
                <img
                  src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/0b0cb9f4-cf5b-4572-a2b1-10c0ac8b6300/public"
                  title="Meet Our Expert"
                  alt="Meet Our Expert"
                  className="img-fluid"
                />
              </div>
              <p className="title">Meet Our Expert</p>
            </div>
            <div className="item">
              <div className="img-ic">
                <img
                  src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/c38c23e3-0d9f-4545-a515-65b7db6a3c00/public"
                  title="Visit Property"
                  alt="Visit Property"
                  className="img-fluid"
                />
              </div>
              <p className="title">Visit Property</p>
            </div>
            <div className="item">
              <div className="img-ic">
                <img
                  src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/9f3778dc-385f-4c09-79cd-4a7831d6e900/public"
                  title="Buy Property"
                  alt="Buy Property"
                  className="img-fluid"
                />
              </div>
              <p className="title">Buy Property</p>
            </div>
            <div className="item">
              <div className="img-ic">
                <img
                  src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/580c40d2-ca8f-4187-2fe9-9d65f78bae00/public"
                  title="Customer Support"
                  alt="Customer Support"
                  className="img-fluid"
                />
              </div>
              <p className="title">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;
