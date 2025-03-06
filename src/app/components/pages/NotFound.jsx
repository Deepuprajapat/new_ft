import React from "react";

const NotFound = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="main">
      {/* <header> */}
      {/* <div className="logo">
          <a href="https://investmango.com">
            <img src="https://www.investmango.com/img/logo.jpg" loading="lazy" alt="Logo" />
          </a>
        </div> */}
      {/* </header> */}
      <div className="content">
        <div className="col-md-6">
          <h1>Oops!</h1>
          <h2>
            We can't seem to find the page
            <br /> you're looking for.
          </h2>
          <h5>Error code: 404</h5>
          <ul>
            <li>
              <a className="btn" href="https://www.investmango.com/">
                Home
              </a>
            </li>
            <li>
              <button className="btn" onClick={goBack}>
                Back
              </button>
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <img src="https://investmango.com/images/404.webp" loading="lazy" alt="404 Image" />
        </div>
      </div>
      <style jsx>{`
        * {
          padding: 0px;
          margin: 0px;
        }
        .main {
          padding: 50px 0px 0px;
          font-family: "Oxygen", sans-serif;
          max-width: 1170px;
          margin: auto;
          text-align: left;
        }
        .main h2 {
          margin-bottom: 40px;
          font-weight: normal;
          letter-spacing: 0.8px;
          font-size: 30px;
        }
        .main h1 {
          font-size: 100px;
          font-weight: bolder;
          margin-bottom: 20px;
        }
        .main ul,
        li {
          list-style: none;
          line-height: 30px;
          font-size: 13px;
          display: contents;
          font-weight: 700;
          padding: 0;
          text-transform: uppercase;
        }
        .col-md-6 {
          flex-basis: 50%;
        }
        .main a.btn {
          text-decoration: none;
          line-height: 20px;
          background-color: #2067d1;
          color: #fff;
          padding: 10px 23px;
          border: 2px solid #2067d1;
        }
        .main a.btn:hover {
          text-decoration: none;
          line-height: 20px;
          background-color: #fff;
          color: #2067d1;
          padding: 10px 23px;
          border: 2px solid #2067d1;
        }
        .main h5 {
          font-size: 15px;
          margin-bottom: 30px;
        }
        img {
          width: 100%;
          height: auto;
        }
        .logo {
          max-width: 200px;
          height: 50px;
        }
        .content {
          margin: 30px 0px;
          display: flex;
          align-items: center;
        }
        @media (max-width: 600px) {
          .content {
            margin: 30px 0px;
            display: block !important;
          }
          .main {
            text-align: center !important;
          }
          .main a {
            line-height: 45px;
          }
          .main h2 {
            margin-bottom: 15px;
            font-size: 20px;
          }
          .logo {
            max-width: 200px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default NotFound;
