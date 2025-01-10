import React from "react";
import BlogSection from "./BlogSection"; 
import { Helmet } from "react-helmet";
const MangoInsights = () => {
  return (
    <> <Helmet>
    <title>Blogs | Mango Insights</title> 
   <meta name="description" content="Read our latest blogs to be updated. Our motto is to share our knowledge and experiences so that you make the right choice with your property investments." /> 
    <link rel="canonical" href="https://www.investmango.com/mango-insights" />
    </Helmet>
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
    </>
  );
};

export default MangoInsights;

