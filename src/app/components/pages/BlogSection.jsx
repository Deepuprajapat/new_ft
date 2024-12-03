import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { sliderSettings } from "../../../utils/common";
import { Navigation, Pagination } from "swiper/modules";
import { getAllBlog } from "../../apis/api";

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
      <div className="loader-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return isSwiper ? (
    <Swiper
      {...sliderSettings}
      slidesPerView={3}
      spaceBetween={20}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      {blogs.map((blog) => (
        <SwiperSlide key={blog.id}>
          <BlogCard blog={blog} />
        </SwiperSlide>
      ))}
      <SliderButton /> {/* Ensure this is inside the Swiper context */}
    </Swiper>
  ) : (
    <div className="row">
      {blogs.map((blog) => (
        <div key={blog.id} className="col-md-4">
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
};

const BlogCard = ({ blog }) => (
  <div className="item" style={{ padding: '20px' }}>

    <a href={`/blogs/${blog.blogUrl}`}>
      <img
        src={blog?.images[0] || "path/to/default-image.jpg"}
        alt={blog.alt || "Blog Image"}
        style={{ width: "100%", height: "250px" }}
        className="img-fluid"
        fetchpriority="high"
      />
    </a>
    <p className="title">{blog.headings}</p>
    <small style={{ color: "#666a6f" }}>
      Date - {new Date(blog.createdDate).toLocaleDateString()}
    </small>
    <p className="des">{blog.description.slice(0, 100)} . . .</p>
    <hr />
    <a href={`/blogs/${blog.blogUrl}`} className="theme-btn">
      Read More
    </a>
  </div>
);

const SliderButton = () => {
  const swiper = useSwiper();

  return (
    <div className="r-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};

export default BlogSection;
