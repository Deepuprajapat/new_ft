import React from "react";

const MangoInsights = () => {
  return (
    <section className="main-body">
      <div className="container">
        <h1>Our Blogs</h1>
        <p>
          <a
            href="http://localhost:3000/"
            target="_blank"
            rel="noopener"
            className="styled-link"
          >
            Home
          </a>{" "}
          / Blogs
        </p>
        <h2 style={{ textAlign: "center" }}>Read Our Latest Blog</h2>
      </div>

      <div className="main-con">
        <div className="container">
          <div className="home-blog blog-page">
            <div className="blog row">
              <div className="col-md-4">
                <div className="item">
                  <a href="/blogs">
                    <img
                      src="path/to/image.jpg"
                      alt="Sample Alt Text"
                      style={{ width: "100%", height: "250px" }}
                      className="img-fluid"
                      fetchpriority="high"
                    />
                  </a>
                  <p className="title">Sample Blog Title</p>
                  <small style={{ color: "#666a6f" }}>
                    Date - October 9, 2024
                  </small>
                  <p className="des">
                    This is a sample description of the blog content, which is
                    shortened to show only the first 100 characters . . .
                  </p>
                  <hr />
                  <a href="/blogs" className="theme-btn">
                    read more
                  </a>
                </div>
              </div>

              <div className="col-md-4">
                <div className="item">
                  <a href="/blog.php/another-blog-url">
                    <img
                      src="path/to/another-image.jpg"
                      alt="Another Alt Text"
                      style={{ width: "100%", height: "250px" }}
                      className="img-fluid"
                      fetchpriority="high"
                    />
                  </a>
                  <p className="title">Another Blog Title</p>
                  <small style={{ color: "#666a6f" }}>
                    Date - October 8, 2024
                  </small>
                  <p className="des">
                    This is a sample description for another blog content, which
                    is also shortened to 100 characters . . .
                  </p>
                  <hr />
                  <a href="/blog.php/another-blog-url" className="theme-btn">
                    read more
                  </a>
                </div>
              </div>


              <div className="col-md-4">
                <div className="item">
                  <a href="/blog.php/another-blog-url">
                    <img
                      src="path/to/another-image.jpg"
                      alt="Another Alt Text"
                      style={{ width: "100%", height: "250px" }}
                      className="img-fluid"
                      fetchpriority="high"
                    />
                  </a>
                  <p className="title">Another Blog Title</p>
                  <small style={{ color: "#666a6f" }}>
                    Date - October 8, 2024
                  </small>
                  <p className="des">
                    This is a sample description for another blog content, which
                    is also shortened to 100 characters . . .
                  </p>
                  <hr />
                  <a href="/blog.php/another-blog-url" className="theme-btn">
                    read more
                  </a>
                </div>
              </div>


              <div className="col-md-4">
                <div className="item">
                  <a href="/blog.php/another-blog-url">
                    <img
                      src="path/to/another-image.jpg"
                      alt="Another Alt Text"
                      style={{ width: "100%", height: "250px" }}
                      className="img-fluid"
                      fetchpriority="high"
                    />
                  </a>
                  <p className="title">Another Blog Title</p>
                  <small style={{ color: "#666a6f" }}>
                    Date - October 8, 2024
                  </small>
                  <p className="des">
                    This is a sample description for another blog content, which
                    is also shortened to 100 characters . . .
                  </p>
                  <hr />
                  <a href="/blog.php/another-blog-url" className="theme-btn">
                    read more
                  </a>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MangoInsights;
