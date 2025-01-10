import React, { useState, useEffect } from "react";
import { getAllBlogByUrl, getAllBlog, checkPhoneNumberExists, submitLead } from "../../apis/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/css/blog.css";
import swal from 'sweetalert';
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
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchBlogData = async () => {
      if (blogUrl) {
        try {
          const data = await getAllBlogByUrl(blogUrl);
          setBlogData(data);
        } catch (error) {
          console.error("Error fetching blog data:", error);
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

  // Handle form submission with phone validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const phoneExists = await checkPhoneNumberExists(formData.usermobile);
      if (phoneExists) {
        swal("Oops!", "You are already registered with this phone number.", "error");
      } else {
        await submitLead(formData);
        swal("Success!", "Form submitted successfully!", "success").then(() => {
          navigate('/thankYou');  // Redirect after clicking "OK"
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
    <div>
     <Helmet>
      <title>{blogData.headings || ""}</title>
      <meta name="description" content={blogData.description || ""} />
      <link rel="canonical" href={blogData.canonical || ""} />
      {blogData.schema &&
        blogData.schema.map((schemaItem, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
          />
        ))}
    </Helmet>
      <section className="main-body">
        <div className="main-con">
          <div className="container">
            <div className="content">
              <div
                className="row d-flex"
                style={{ justifyContent: "start", alignItems: "flex-start" }}
              >
                <div className="col-md-8 blog-container">
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
                          />
                        </div>
                        <div
                          className="content"
                          style={{ marginTop: "10px" }}
                          dangerouslySetInnerHTML={{
                            __html: blogData.description,
                          }}
                        ></div>
                      </>
                    ) : (
                      <p>Loading blog content...</p>
                    )}
                  </div>
                </div>

                {/* Recent Posts Section */}
                <div className="recent-posts col-md-4">
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
                              borderBottom: "1px solid #e7e7e7",
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
                    style={{ marginBottom: "19px" }}
                    required
                  />
                  <textarea
                    className="form-control"x
                    name="message"
                    placeholder="Leave Comments :"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ marginBottom: "19px" }}
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
    </div>
  );
};

export default Blogs;
