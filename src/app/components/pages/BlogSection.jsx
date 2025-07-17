import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { sliderSettings } from "../../../utils/common";
import { getAllBlog } from "../../apis/api";
import BlogModal from "./BlogModal";
import "../styles/css/blogCard.css";
import Loading from "../Loader"; 

const BlogSection = ({ isSwiper }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlog();
      const sortedBlogs = (response.data.blogs || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0" }}>
        <button
          style={{ background: "#2067d1", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", fontWeight: 700, cursor: "pointer" }}
          onClick={() => setModalOpen(true)}
        >
          Add Blog
        </button>
      </div>
      {isSwiper ? (
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
      )}
      <BlogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={null}
        mode="add"
        onSuccess={() => {
          setModalOpen(false);
          fetchBlogs();
        }}
      />
    </>
  );
};

const BlogCard = ({ blog, stripHtml, formatDate }) => (
  <div className="itemm">
    <Link to={`/blogs/${blog.blog_url}`} state={{ blogId: blog.id }}>
      <img
        src={blog?.image || "path/to/default-image.jpg"}
        alt={blog.alt || "Blog Image"}
        loading="lazy"
        style={{ width: "100%", height: "250px" }}
        className="img-fluid"
        fetchpriority="high"
      />
    </Link>
    <p className="title">{blog.title}</p>
    <small style={{ color: "#666a6f" }}>Date - {formatDate(blog.created_at)}</small>
    <p className="des">{stripHtml(blog.description).slice(0, 100)} . . .</p>
    <hr />
    <Link to={`/blogs/${blog.blog_url}`} state={{ blogId: blog.id }} className="theme-btn">
      Read More
    </Link>
  </div>
);

export default BlogSection;
