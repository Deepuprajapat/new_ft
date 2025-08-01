import React, { useState, useEffect } from "react";
import {
  // getAllBlogByUrl,
  getAllBlogById,
  getAllBlog,
  checkPhoneNumberExists,
  submitLead,
} from "../../apis/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/css/blog.css";
import swal from "sweetalert";
import { Helmet } from "react-helmet";
import BlogModal from "./BlogModal";
import IconButton from "@mui/material/IconButton";

const Blogs = () => {
  const [blogData, setBlogData] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    usermobile: "",
    usermsg: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { blogUrl } = useParams();
  const location = useLocation();
  const blogId = location.state?.blogId;
  const [schema, setSchema] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [modalInitialData, setModalInitialData] = useState(null);

  const refreshBlogData = async (id = blogId) => {
    try {
      let response;
      if (id) {
        response = await getAllBlogById(id);
      }
      if (response) {
        const data = response.data || response;
        setBlogData(data);
        if (Array.isArray(data.schema) && data.schema.length > 0) {
          try {
            const rawSchema = data.schema[0]
              .replace(/<script[^>]*>/g, "")
              .replace(/<\/script>/g, "")
              .trim();
            const parsedSchema = JSON.parse(rawSchema);
            setSchema(parsedSchema);
          } catch (error) {
            console.error("Error parsing schema JSON:", error);
          }
        }
      } else {
        navigate("*");
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      navigate("*");
    }
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        let response;

        if (blogId) {
          response = await getAllBlogById(blogId);
        }
        // else if (blogUrl) {
        //   response = await getAllBlogByUrl(blogUrl);
        // }

        if (response) {
          const data = response.data || response;
          setBlogData(data);

          if (Array.isArray(data.schema) && data.schema.length > 0) {
            try {
              const rawSchema = data.schema[0]
                .replace(/<script[^>]*>/g, "")
                .replace(/<\/script>/g, "")
                .trim();

              const parsedSchema = JSON.parse(rawSchema);
              setSchema(parsedSchema);
            } catch (error) {
              console.error("Error parsing schema JSON:", error);
            }
          }
        } else {
          navigate("*");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        navigate("*");
      }
    };
    const getAuthToken = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; authToken=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return localStorage.getItem("auth-token") || localStorage.getItem("x-auth-token");
    };
  

    const fetchRecentPosts = async () => {
      try {
        const response = await getAllBlog(true); // Pass true to get public blogs without auth
        // Show only 20 most recent posts
        const top20Posts = (response.data.blogs || []).slice(-20).reverse();
        setRecentPosts(top20Posts);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchBlogData();
    fetchRecentPosts();
  }, [blogUrl, blogId]);

  const handlePostClick = (postUrl, postId) => {
    navigate(`/blogs/${postUrl}`, { state: { blogId: postId } });
    window.scrollTo(0, 0); // Scroll to top of page
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const metakeywords = blogData?.metaKeywords || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const phoneExists = await checkPhoneNumberExists(formData.usermobile);
      if (phoneExists) {
        swal(
          "Oops!",
          "You are already registered with this phone number.",
          "error"
        );
      } else {
        const updatedFormData = {
          ...formData,
          projectName: ["BlogPage"],
          source: "ORGANIC",
        };
        await submitLead(updatedFormData);
        swal("Success!", "Form submitted successfully!", "success").then(() => {
          navigate("/thankYou");
        });

        setFormData({
          username: "",
          useremail: "",
          usermobile: "",
          message: "",
        });
      }
    } catch (error) {
      swal("Error", "An error occurred. Please try again.", "error");
    }
  };

  // Function to check for auth token (same as in ProtectedRoute)
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return (
      localStorage.getItem("auth-token") || localStorage.getItem("x-auth-token")
    );
  };

  const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
  };

  return (
    <>
      <Helmet>
        <title>
          {blogData?.seo_meta_info?.title ||
            (Array.isArray(blogData?.blog_content?.title)
              ? blogData.blog_content.title.join(" ")
              : blogData?.blog_content?.title) ||
            "Default Title"}
        </title>

        <meta
          name="keywords"
          content={
            blogData?.seo_meta_info?.keywords ||
            (Array.isArray(blogData?.metaKeywords)
              ? blogData.metaKeywords.join(", ")
              : "default keyword")
          }
        />

        <meta
          name="description"
          content={
            blogData?.seo_meta_info?.description ||
            blogData?.subHeadings ||
            "Default description"
          }
        />

        {schema && (
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        )}

        {blogData?.seo_meta_info?.canonical && (
          <link rel="canonical" href={blogData.seo_meta_info.canonical} />
        )}
      </Helmet>

      <section className="main-body">
        <div className="main-con">
          <div className="container">
            <div className="content">
              <div
                className="row d-flex"
                style={{
                  justifyContent: "start",
                  alignItems: "flex-start",
                  flexDirection: window.innerWidth <= 991 ? "column" : "row",
                  gap: window.innerWidth <= 991 ? 24 : 0,
                  marginTop: 10,
                }}
              >
                {/* Blog Main Content */}
                <div
                  className="col-md-8 blog-container"
                  style={{
                    padding: window.innerWidth <= 480 ? "12px 0" : "25px",
                    width: window.innerWidth <= 991 ? "100%" : "66.666%",
                    maxWidth: "100%",
                  }}
                >
                  <div className="blog-content">
                    {blogData ? (
                      <>
                        <div className="col-md-12">
                          <p
                            id="blog-title"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                            >
                              {blogData.blog_content.title}
                            </span>
                            {isAuthenticated() && (
                              <IconButton
                                aria-label="Edit Blog"
                                size="small"
                                onClick={() => {
                                  const d = blogData;
                                  setModalMode("edit");
                                  setModalInitialData({
                                    slug: d.slug || "",
                                    blog_content: {
                                      title: d.blog_content?.title || "",
                                      description:
                                        d.blog_content?.description || "",
                                      image: d.blog_content?.image || "",
                                      image_alt: d.blog_content?.image_alt || "",
                                    },
                                    seo_meta_info: {
                                      blog_schema: Array.isArray(
                                        d.seo_meta_info?.blog_schema
                                      )
                                        ? d.seo_meta_info.blog_schema[0] || ""
                                        : d.seo_meta_info?.blog_schema || "",
                                      canonical: d.seo_meta_info?.canonical || "",
                                      title: d.seo_meta_info?.title || "",
                                      keywords: d.seo_meta_info?.keywords || "",
                                    },
                                  });
                                  setModalOpen(true);
                                }}
                                style={{
                                  marginLeft: 6,
                                  padding: 4,
                                  verticalAlign: "middle",
                                }}
                              >
                                <img
                                  src="/images/editlogo.png"
                                  alt="Edit"
                                  style={{
                                    width: 20,
                                    height: 20,
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                  }}
                                />
                              </IconButton>
                            )}
                          </p>
                          <small>
                            Date -{" "}
                            {new Date(blogData?.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </small>
                        </div>
                        <div>
                          <img
                            className="img-fluid blog-image"
                            src={blogData.blog_content.image || ""}
                            alt={
                              blogData.blog_content.image_alt || "Blog Image"
                            }
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "auto",
                              objectFit: "cover",
                              maxWidth: "800px",
                              maxHeight: "550px",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        </div>
                        <div
                          className="content"
                          style={{
                            marginTop: "10px",
                            fontFamily: "Arial, sans-serif",
                            lineHeight: "1.6",
                            fontSize: window.innerWidth <= 480 ? 15 : 16,
                            color: "#333",
                            wordWrap: "break-word",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `
                               <style>
        .content p {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .content ul {
          margin-bottom: 15px;
          padding-left: 20px;
        }
        .content li {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .content th, .content td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .content th {
          background-color: #f4f4f4;
        }
        .content a {
          color: #2067d1;
          text-decoration: none;
        }
        .content a:hover {
          text-decoration: underline;
        }
        .content h4 {
          font-size: 18px;
          margin-top: 20px;
        }
        .content img {
          width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
          max-width: 100vw !important;
          max-height: 60vw !important;
        }
      </style>
                              ${blogData.blog_content.description}
                            `,
                          }}
                        />
                      </>
                    ) : (
                      <p>Loading blog content...</p>
                    )}
                  </div>
                </div>

                {/* ✅ Recent Posts Section */}
                <div
                  className="recent-posts col-md-4"
                  style={{
                    fontSize: window.innerWidth <= 480 ? 16 : 20,
                    margin: 0,
                    color: "#000",
                    fontWeight: 400,
                    marginLeft: window.innerWidth <= 991 ? 0 : 39,
                    marginTop: window.innerWidth <= 991 ? 24 : 40,
                    marginBottom: 17,
                    width: window.innerWidth <= 991 ? "100%" : "33.333%",
                    maxWidth: "100%",
                  }}
                >
                  <h2 style={{ fontSize: window.innerWidth <= 480 ? 18 : 24, textAlign: window.innerWidth <= 480 ? "center" : "left", marginBottom: 12 }}>Recent Posts</h2>
                  <div className="blogs-links">
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {recentPosts.map((post) => (
                        <li
                          key={post.id}
                          onClick={() =>
                            handlePostClick(post.slug, post.id)
                          }
                          style={{
                            // borderBottom: "1px solid rgb(54, 50, 50)",
                            padding: "7px 0",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            {post.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments col-md-12" style={{ padding: window.innerWidth <= 480 ? "12px 0" : "25px", width: "100%", maxWidth: "100%" }}>
                <h3 style={{ fontSize: window.innerWidth <= 480 ? 18 : 22, textAlign: window.innerWidth <= 480 ? "center" : "left", marginBottom: 16 }}>Leave Comments</h3>
                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 600, margin: window.innerWidth <= 480 ? "0 auto" : "0" }}>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    placeholder="Name :"
                    value={formData.username}
                    onChange={handleChange}
                    style={{ marginBottom: "19px", fontSize: window.innerWidth <= 480 ? 14 : 16, padding: window.innerWidth <= 480 ? "8px" : "12px" }}
                    required
                  />
                  <input
                    className="form-control"
                    type="email"
                    name="useremail"
                    placeholder="Email :"
                    value={formData.useremail}
                    onChange={handleChange}
                    style={{ marginBottom: "19px", fontSize: window.innerWidth <= 480 ? 14 : 16, padding: window.innerWidth <= 480 ? "8px" : "12px" }}
                    required
                  />
                  <input
                    className="form-control"
                    type="text"
                    name="usermobile"
                    placeholder="Phone :"
                    value={formData.usermobile}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setFormData({ ...formData, usermobile: value });
                    }}
                    style={{ marginBottom: "19px", fontSize: window.innerWidth <= 480 ? 14 : 16, padding: window.innerWidth <= 480 ? "8px" : "12px" }}
                    required
                    maxLength="10"
                  />
                  <textarea
                    className="form-control"
                    name="message"
                    placeholder="Leave Comments :"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      marginBottom: "19px",
                      resize: "none",
                      overflowY: "auto",
                      fontSize: window.innerWidth <= 480 ? 14 : 16,
                      padding: window.innerWidth <= 480 ? "8px" : "12px",
                    }}
                    required
                  ></textarea>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {success && <p style={{ color: "green" }}>{success}</p>}
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2067d1",
                      color: "white",
                      padding: window.innerWidth <= 480 ? "14px 0" : window.innerWidth <= 991 ? "12px 0" : "11px 18px",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: window.innerWidth <= 480 ? 17 : window.innerWidth <= 991 ? 16 : 16,
                      width: window.innerWidth <= 480 ? "100%" : window.innerWidth <= 991 ? "80%" : "auto",
                      maxWidth: "100%",
                      display: "block",
                      margin: window.innerWidth <= 480 ? "0 auto" : undefined,
                      boxShadow: window.innerWidth <= 480 ? "0 2px 8px rgba(32,103,209,0.07)" : undefined,
                      transition: "background 0.2s",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          .blog-image {
            width: 100% !important;
            height: auto !important;
            max-width: 100vw !important;
            max-height: 60vw !important;
            object-fit: contain !important;
          }
        }
      `,
        }}
      />
      <BlogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={modalInitialData}
        mode={modalMode}
        onSuccess={() => {
          setModalOpen(false);
          refreshBlogData();
        }}
      />
    </>
  );
};

export default Blogs;
