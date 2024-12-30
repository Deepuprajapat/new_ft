import React from "react";
import BlogSection from "./BlogSection"; // Import the reusable component

const MangoInsights = () => {
  return (
    <section className="main-body">
      <div className="container">
        <h1>Our Blogs</h1>
        <p>
          <a href="/" className="styled-link">
            Home
          </a>{" "}
          / Blogs
        </p>
        <h2 style={{ textAlign: "center" }}>Read Our Latest Blog</h2>
      </div>
      <div className="main-con">
        <div className="container">
          <BlogSection isSwiper={false} />
        </div>
      </div>
    </section>
  );
};

export default MangoInsights;

