//import React from 'react';
import React, { useState, useEffect } from "react";
import { getAllBlogByUrl } from "../../apis/api";
import { useParams } from "react-router-dom";
import "../styles/css/blog.css";

const Blogs = () => {
  const [blogData, setBlogData] = useState(null);
  const { blogUrl } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      if (blogUrl) {
        try {
          const data = await getAllBlogByUrl(blogUrl);
          console.log("Fetched project data:", data);
          setBlogData(data);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };
    fetchData();
  }, [blogUrl]);

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Our Blog</h1> <span>Home / Our Blog</span>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="content">
              <div className="row d-flex">
                {/* Left Column */}
                <div className="col-md-8">
                  <div className="col-md-12">
                    <p id="blog-title">
                      Villa vs Apartment: What's the Better Choice?
                    </p>
                  </div>
                  <small>{blogData?.schema[4]}</small>
                  <br />
                  <div style={{ marginRight: "33px" }}>
                    <img
                      className="img-fluid"
                      src="https://www.investmango.com/img/mango-insights/villa-vs-apartment-whats-the-better-choice.jpg"
                      alt="Villa vs Apartment"
                      fetchpriority="high"
                    />
                  </div>
                  <div className="content" style={{ marginTop: "10px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Beatae necessitatibus ut ipsa reiciendis qui dolore quasi
                    delectus praesentium sed! Vitae excepturi deserunt repellat
                    sed officiis, minus voluptate nemo eum magni!
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-4">
                  <h2
                    style={{
                      fontSize: "24px",
                      margin: 0,
                      color: "#000",
                      fontWeight: 400,
                      marginLeft: "39px",
                      marginTop: "40px",
                      marginBottom: "17px",
                    }}
                  >
                    Recent Posts
                  </h2>
                  <div className="blogs-links">
                    <div
                      style={{ width: "95%", marginLeft: "39px" }}
                      id="blogs-links"
                    >
                      <ul
                        style={{ listStyleType: "none", padding: 0, margin: 0 }}
                      >
                        <li
                          style={{
                            borderBottom: "1px solid #e7e7e7",
                            display: "block",
                            padding: "7px 0",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >Low-Rise Flats in Greater Noida – Our Top Picks for You
                          </a>
                        </li>
                        <li
                          style={{
                            borderBottom: "1px solid #e7e7e7",
                            display: "block",
                            padding: "7px 0",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >Low-Rise Flats in Greater Noida – Our Top Picks for You
                          </a>
                        </li>
                        <li
                          style={{
                            borderBottom: "1px solid #e7e7e7",
                            display: "block",
                            padding: "7px 0",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >Low-Rise Flats in Greater Noida – Our Top Picks for You
                          </a>
                        </li>
                        <li
                          style={{
                            borderBottom: "1px solid #e7e7e7",
                            display: "block",
                            padding: "7px 0",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >Low-Rise Flats in Greater Noida – Our Top Picks for You
                          </a>
                        </li>
                        <li
                          style={{
                            borderBottom: "1px solid #e7e7e7",
                            display: "block",
                            padding: "7px 0",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >Low-Rise Flats in Greater Noida – Our Top Picks for You
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="comments col-md-12" style={{ padding: "25px" }}>
              <h3>Leave Comments</h3>
              <form id="sendtodata" action="api.php" method="POST">
                <input
                  name="username"
                  id="username_side"
                  className="form-control"
                  type="text"
                  placeholder="Name :"
                  style={{ marginBottom: "19px" }}
                />
                <input
                  name="useremail"
                  id="useremail_side"
                  className="form-control"
                  type="text"
                  placeholder="Email :"
                  style={{ marginBottom: "19px" }}
                />
                <div className="d-flex phone_num">
                  <select
                    name="dial_code"
                    id="dial_code"
                    style={{ width: "74px" }}
                    className="form-control"
                  >
                    <option value="91">+91</option>
                    <option value="61">+61</option>
                    <option value="852">+852</option>
                    <option value="968">+968</option>
                    <option value="974">+974</option>
                    <option value="65">+65</option>
                    <option value="971">+971</option>
                    <option value="44">+44</option>
                    <option value="1">+1</option>
                    <option value="27">+27</option>
                    <option value="60">+60</option>
                    <option value="64">+64</option>
                    <option value="66">+66</option>
                    <option value="966">+966</option>
                    <option value="31">+31</option>
                    <option value="973">+973</option>
                    <option value="54">+54</option>
                    <option value="43">+43</option>
                    <option value="880">+880</option>
                    <option value="32">+32</option>
                    <option value="55">+55</option>
                    <option value="86">+86</option>
                    <option value="385">+385</option>
                    <option value="42">+42</option>
                    <option value="45">+45</option>
                    <option value="1809">+1809</option>
                    <option value="20">+20</option>
                    <option value="358">+358</option>
                    <option value="679">+679</option>
                    <option value="33">+33</option>
                    <option value="49">+49</option>
                    <option value="30">+30</option>
                    <option value="592">+592</option>
                    <option value="36">+36</option>
                    <option value="62">+62</option>
                    <option value="353">+353</option>
                    <option value="972">+972</option>
                    <option value="39">+39</option>
                    <option value="81">+81</option>
                    <option value="962">+962</option>
                    <option value="82">+82</option>
                    <option value="965">+965</option>
                    <option value="853">+853</option>
                    <option value="52">+52</option>
                    <option value="212">+212</option>
                    <option value="47">+47</option>
                    <option value="48">+48</option>
                    <option value="351">+351</option>
                    <option value="40">+40</option>
                    <option value="7">+7</option>
                    <option value="34">+34</option>
                    <option value="46">+46</option>
                    <option value="41">+41</option>
                    <option value="1868">+1868</option>
                    <option value="216">+216</option>
                    <option value="90">+90</option>
                    <option value="84">+84</option>
                    <option value="91">+91</option>
                    <option value="61">+61</option>
                    <option value="852">+852</option>
                    <option value="968">+968</option>
                    <option value="974">+974</option>
                    <option value="65">+65</option>
                    <option value="971">+971</option>
                    <option value="44">+44</option>
                    <option value="1">+1</option>
                    <option value="27">+27</option>
                    <option value="60">+60</option>
                    <option value="64">+64</option>
                    <option value="66">+66</option>
                    <option value="966">+966</option>
                    <option value="31">+31</option>
                    <option value="973">+973</option>
                    <option value="54">+54</option>
                    <option value="43">+43</option>
                    <option value="880">+880</option>
                    <option value="32">+32</option>
                    <option value="55">+55</option>
                    <option value="86">+86</option>
                    <option value="385">+385</option>
                    <option value="42">+42</option>
                    <option value="45">+45</option>
                    <option value="1809">+1809</option>
                    <option value="20">+20</option>
                    <option value="358">+358</option>
                    <option value="679">+679</option>
                    <option value="33">+33</option>
                    <option value="49">+49</option>
                    <option value="30">+30</option>
                    <option value="592">+592</option>
                    <option value="36">+36</option>
                    <option value="62">+62</option>
                    <option value="353">+353</option>
                    <option value="972">+972</option>
                    <option value="39">+39</option>
                    <option value="81">+81</option>
                    <option value="962">+962</option>
                    <option value="82">+82</option>
                    <option value="965">+965</option>
                    <option value="853">+853</option>
                    <option value="52">+52</option>
                    <option value="212">+212</option>
                    <option value="47">+47</option>
                    <option value="48">+48</option>
                    <option value="351">+351</option>
                    <option value="40">+40</option>
                    <option value="7">+7</option>
                    <option value="34">+34</option>
                    <option value="46">+46</option>
                    <option value="41">+41</option>
                    <option value="1868">+1868</option>
                    <option value="216">+216</option>
                    <option value="90">+90</option>
                    <option value="84">+84</option>
                  </select>
                  <input
                    name="usermobile"
                    id="usermobile_side"
                    maxLength="10"
                    className="form-control"
                    required
                    type="text"
                    placeholder="Phone :"
                    style={{ marginBottom: "19px" }}
                  />
                </div>
                <textarea
                  name="usermsg"
                  className="form-control"
                  placeholder="Leave Comments :"
                  rows="6"
                  style={{ marginBottom: "19px" }}
                ></textarea>
                <button
                  type="submit"
                  name="send"
                  id="reachus"
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    lineHeight: "42px",
                    fontWeight: 700,
                    color: "#2067d1",
                    border: "1px solid #2067d1",
                    textTransform: "uppercase",
                    letterSpacing: "0.10em",
                    display: "inline-block",
                    verticalAlign: "middle",
                    padding: "11px 18px",
                    lineHeight: 1.3,
                    cursor: "pointer",
                    borderRadius: 0,
                    textDecoration: "none",
                  }}
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
