import React, { useEffect } from "react";

const ThankYouPage = () => {
  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Google tag (gtag.js) */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-685964924"
      ></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-685964924');
        `}
      </script>

      {/* Event snippets for different pages */}
      {[
        "AW-685964924/8G6cCIX03KUDEPz8i8cC",
        "AW-685964924/wvtnCPCusLsDEPz8i8cC",
        "AW-685964924/5bG5COmlurwDEPz8i8cC",
        "AW-685964924/NdgSCKOyjdsDEPz8i8cC",
        "AW-685964924/eXssCNLA690DEPz8i8cC",
        "AW-685964924/_aJeCKWMtt8DEPz8i8cC",
        "AW-685964924/8aqACKfizeoYEPz8i8cC",
        "AW-685964924/k_CjCPudyIkYEPz8i8cC",
        "AW-685964924/sIFaCKmGv-oYEPz8i8cC",
        "AW-685964924/2Z-NCK6Ly4kYEPz8i8cC",
      ].map((eventSnippet) => (
        <script key={eventSnippet}>
          {`
            gtag('event', 'conversion', {'send_to': '${eventSnippet}'});
          `}
        </script>
      ))}

      <header>{/* Replace with your Header Component */}</header>

      <section className="main-body">
        <div className="main-con">
          <div className="container">
            <div
              className="row padding_im_about"
              style={{ alignItems: "center" }}
            >
              <div className="col-md-7">
                <img
                  style={{ width: "550px" }}
                  src="https://www.investmango.com/update/img/2.png"
                  alt="Thank You"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5">
                <p style={{ fontSize: "70px" }} className="h1 text-center">
                  Thank you for contacting us
                </p>
                <hr />
                <p
                  className="p_n"
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "25px",
                    color: "#424242",
                    textAlign: "center",
                  }}
                >
                  Your details have been forwarded to our portfolio manager.
                  We'll reach out to you soon.
                </p>

                <ul
                  className="d-flex"
                  style={{ listStyle: "none", justifyContent: "space-evenly" }}
                >
                  <li>
                    <a className="theme-btn" href="https://propertymarvels.in/">
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      className="theme-btn"
                      onClick={() => window.history.back()}
                    >
                      Back
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>{/* Replace with your Footer Component */}</footer>

      {/* Bootstrap JavaScript Libraries */}
      {/* Replace with your Footer Links Component */}
    </div>
  );
};

export default ThankYouPage;
