import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { sliderSettings } from "../../../utils/common";
import { getAllBlog } from "../../apis/api";
import "../styles/css/blogCard.css";
import Loading from "../Loader"; 

const BlogSection = ({ isSwiper }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlog();
        setBlogs(response.content || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
     <Loading isFullScreen={false} />
    );
  }

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');  // Removes HTML tags
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  return isSwiper ? (
    <Swiper {...sliderSettings}>
      {blogs.map((blog) => (
        <SwiperSlide key={blog.id}>
          <BlogCard blog={blog} stripHtml={stripHtml} formatDate={formatDate} />
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <div className="row">
      {blogs.map((blog) => (
        <div key={blog.id} className="col-md-4" style={{ marginBottom: '63px' }}>
          <BlogCard blog={blog} stripHtml={stripHtml} formatDate={formatDate} />
        </div>
      ))}
    </div>
  );
};

const BlogCard = ({ blog, stripHtml, formatDate }) => (
  <div className="itemm">
    <a href={`/blogs/${blog.blogUrl}`}>
      <img
        src={blog?.images[0] || "path/to/default-image.jpg"}
        alt={blog.alt || "Blog Image"}
        loading="lazy"
        style={{ width: "100%", height: "250px" }}
        className="img-fluid"
        fetchpriority="high"
      />
    </a>
    <p className="title">{blog.headings}</p>
    <small style={{ color: "#666a6f" }}>Date - {formatDate(blog.createdDate)}</small>
    <p className="des">{stripHtml(blog.description).slice(0, 100)} . . .</p>
    <hr />
    <a href={`/blogs/${blog.blogUrl}`} className="theme-btn">
      Read More
    </a>
  </div>
);




export default BlogSection;
