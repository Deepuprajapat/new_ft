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
                style={{ justifyContent: "start", alignItems: "flex-start" }}
              >
                <div
                  className="col-md-8 blog-container"
                  style={{ padding: "25px" }}
                >
                  <div className="blog-content">
                    {blogData ? (
                      <>
                        <div className="col-md-12">
                          <p id="blog-title">{blogData.headings}</p>
                          <small>
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
                              height: 'auto',
                              objectFit: 'cover',
                              maxWidth: '800px', 
                              maxHeight: '550px', 
                              display: 'block',
                              margin: '0 auto',
                            }}
                          />
                        </div>
                        <div
                          className="content"
                          style={{
                            marginTop: "10px",
                            fontFamily: "Arial, sans-serif",
                            lineHeight: "1.6",
                            fontSize: "16px",
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
        /* Fixed size for all images */
        .content img {
          width: 776px; /* Set width to 776px */
          height: 409px; /* Set height to 409px */
          object-fit: cover; /* Maintain aspect ratio with cropping if needed */
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
                    fontSize: "20px",
                    margin: "0",
                    color: "#000",
                    fontWeight: "400",
                    marginLeft: "39px",
                    marginTop: "40px",
                    marginBottom: "17px",
                  }}
                >
                  <h2>Recent Posts</h2>
                  <div className="blogs-links">
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {recentPosts
                        .slice()
                        .reverse()
                        .map((post) => (
                          <li
                            key={post.id}
                            style={{
                              borderBottom: "1px solidrgb(54, 50, 50)",
                              padding: "7px 0",
                              cursor: "pointer",
                            }}
                            onClick={() => handlePostClick(post.blogUrl)}
                          >
                            <span
                              style={{
                                color: "black",
                                fontSize: "15px",
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
              <div className="comments col-md-12" style={{ padding: "25px" }}>
                <h3>Leave Comments</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    placeholder="Name :"
                    value={formData.username}
                    onChange={handleChange}
                    style={{ marginBottom: "19px" }}
                    required
                  />
                  <input
                    className="form-control"
                    type="email"
                    name="useremail"
                    placeholder="Email :"
                    value={formData.useremail}
                    onChange={handleChange}
                    style={{ marginBottom: "19px" }}
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
                    style={{ marginBottom: "19px" }}
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
                      padding: "11px 18px",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      width: "auto",
                      maxWidth: "100%",
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
