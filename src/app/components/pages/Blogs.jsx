import React, { useState, useEffect } from "react";
import {
  getAllBlogByUrl,
  getAllBlog,
  checkPhoneNumberExists,
  submitLead,
} from "../../apis/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/css/blog.css";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

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
  const [schema, setSchema] = useState(null); // Store processed schema
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchBlogData = async () => {
      if (blogUrl) {
        try {
          const data = await getAllBlogByUrl(blogUrl);
          setBlogData(data);
          // Process schema if available
          // Process schema if available and in correct format
          if (Array.isArray(data.schema) && data.schema.length > 0) {
            try {
              const rawSchema = data.schema[0] // Get first schema entry
                .replace(/<script[^>]*>/g, "") // Remove opening <script> tag
                .replace(/<\/script>/g, "") // Remove closing </script> tag
                .trim();

              const parsedSchema = JSON.parse(rawSchema); // Convert string to JSON object
              setSchema(parsedSchema);
            } catch (error) {
              console.error("Error parsing schema JSON:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching blog data:", error);
          navigate("*");
        }
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const response = await getAllBlog(0, 20); // Fetch top 20 highlights
        setRecentPosts(response.content || []);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchBlogData();
    fetchRecentPosts();
  }, [blogUrl]);

  // Function to handle click and navigate
  const handlePostClick = (postUrl) => {
    navigate(`/blogs/${postUrl}`);
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const metakeywords = blogData?.metaKeywords || [];
  // Handle form submission with phone validation
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
          projectName: ["BlogPage"], // Static field
          source: "ORGANIC", // Static field
        };
        await submitLead(updatedFormData);
        swal("Success!", "Form submitted successfully!", "success").then(() => {
          navigate("/thankYou"); // Redirect after clicking "OK"
        });

        // Reset form data
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
  return (
    <>
      <Helmet>
        <title>
          {Array.isArray(blogData?.headings)
            ? blogData.headings.join(" ")
            : blogData?.headings || "Default Title"}
        </title>
        <meta
          name="keywords"
          content={
            Array.isArray(metakeywords?.length > 0)
              ? metakeywords?.join(", ")
              : "default keyword"
          }
        />

        <meta
          name="description"
          content={blogData?.subHeadings || "Default description"}
        />
        {/* {Array.isArray(blogData?.schema)? blogData?.schema.join(" "):blogData?.schema|| "default schema"} */}
        {/* Inject Schema if available */}
        {schema && (
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        )}
        {blogData?.canonical && (
          <link rel="canonical" href={blogData.canonical} />
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
                          <p id="blog-title" style={{ fontSize: window.innerWidth <= 480 ? 22 : 30, fontWeight: 500, color: "black", marginBottom: 8, marginTop: 10, textAlign: window.innerWidth <= 480 ? "center" : "left" }}>{blogData.headings}</p>
                          <small style={{ display: "block", marginBottom: 12, textAlign: window.innerWidth <= 480 ? "center" : "left" }}>
                            Date -
                            {new Date(blogData.createdDate).toLocaleDateString(
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
                            src={blogData.images[0] || ""}
                            alt={blogData.alt || "Blog Image"}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: window.innerWidth <= 480 ? 'auto' : 'auto',
                              objectFit: 'cover',
                              maxWidth: window.innerWidth <= 991 ? '100%' : '800px',
                              maxHeight: window.innerWidth <= 991 ? '60vw' : '550px',
                              display: 'block',
                              margin: '0 auto',
                              borderRadius: 8,
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
      ${blogData.description}
    `,
                          }}
                        ></div>
                      </>
                    ) : (
                      <p>Loading blog content...</p>
                    )}
                  </div>
                </div>

                {/* Recent Posts Section */}
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
                      {recentPosts
                        .slice()
                        .reverse()
                        .map((post) => (
                          <li
                            key={post.id}
                            style={{
                              borderBottom: "1px solid #e0e0e0",
                              padding: "7px 0",
                              cursor: "pointer",
                            }}
                            onClick={() => handlePostClick(post.blogUrl)}
                          >
                            <span
                              style={{
                                color: "black",
                                fontSize: window.innerWidth <= 480 ? 14 : 15,
                                fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              {post.headings}
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
                      // Allow only digits and limit to 10 digits
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .blog-image {
            width: 100% !important;
            height: auto !important;
            max-width: 100vw !important;
            max-height: 60vw !important;
            object-fit: contain !important;
          }
        }
      ` }} />
    </>
  );
};

export default Blogs;
