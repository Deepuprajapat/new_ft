import React, { useState, useEffect } from "react";
import {
  getAllBlogByUrl,
  getAllBlog,
  checkPhoneNumberExists,
  submitLead,
} from "../../apis/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const blogId = location.state?.blogId;
  const [schema, setSchema] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        let response;

        if (blogUrl) {
          response = await getAllBlogByUrl(blogUrl);
        } else if (blogId) {
          // If we have blogId but no blogUrl, we need to get the blog URL first
          // For now, we'll try to use the blogId as the URL
          response = await getAllBlogByUrl(blogId);
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

    const fetchRecentPosts = async () => {
      try {
        const response = await getAllBlog(); // Don't pass 0, 20
        // Show only 20 most recent posts
        const top20Posts = (response || []).slice(-20).reverse();
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
        swal("Oops!", "You are already registered with this phone number.", "error");
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
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
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
                style={{ justifyContent: "start", alignItems: "flex-start" }}
              >
                {/* Blog Main Content */}
                <div
                  className="col-md-8 blog-container"
                  style={{ padding: "25px" }}
                >
                  <div className="blog-content">
                    {blogData ? (
                      <>
                        <div className="col-md-12">
                          <p id="blog-title">{blogData.blog_content.title}</p>
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
                            alt={blogData.blog_content.image_alt || "Blog Image"}
                            loading="lazy"
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
                      {recentPosts.map((post) => (
                        <li
                          key={post.id}
                          onClick={() => handlePostClick(post.blog_url, post.id)}
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
    </>
  );
};

export default Blogs;
