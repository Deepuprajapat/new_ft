// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllBlog } from "../../apis/api";
// import axios from "axios";

// const MangoInsights = () => {
//   const [blogs, setBlogs] = useState([]);
//   const navigate = useNavigate(); 
//   const handleReadMore = (blogUrl) => {
//     navigate(`/blogs/${blogUrl.toLowerCase().replace(/\s+/g, "-")}`);
//   };

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       const data = await getAllBlog();
//       setBlogs(data.content || []);
//     };
//     fetchBlogs();
//   }, []);

//   return (
//     <section className="main-body">
//       <div className="container">
//         <h1>Our Blogs</h1>
//         <p>
//           <a
//             href="http://localhost:3000/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="styled-link"
//           >
//             Home
//           </a>{" "}
//           / Blogs
//         </p>
//         <h2 style={{ textAlign: "center" }}>Read Our Latest Blog</h2>
//       </div>

//       <div className="main-con">
//         <div className="container">
//           <div className="home-blog blog-page">
//             <div className="blog row">
//               {blogs.map((blog) => (
//                 <div key={blog.id} className="col-md-4">
//                   <div className="item">
//                     <a href={`/blogs/${blog.blogUrl}`}>
//                       <img
//                         src={blog?.images[0] || "path/to/default-image.jpg"}
//                         alt={blog.alt || "Blog Image"}
//                         style={{ width: "100%", height: "250px" }}
//                         className="img-fluid"
//                         fetchpriority="high"
//                       />
//                     </a>
//                     <p className="title">{blog.headings}</p>
//                     <small style={{ color: "#666a6f" }}>
//                       Date - {new Date(blog.createdDate).toLocaleDateString()}
//                     </small>
//                     <p className="des">
//                       {blog.description.slice(0, 100)} . . .
//                     </p>
//                     <hr />
//                     {/* <a href={`/blogs/${blog.blogUrl}`} className="theme-btn">
//                       read more
//                     </a> */}
//                     <button onClick={() => handleReadMore(blog.blogUrl)} className="theme-btn">
//                       more details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MangoInsights;


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

