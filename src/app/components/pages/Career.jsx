import React, { useState } from 'react';
//import Footer from './Footer'; // Ensure you create a Footer component in the specified path
//import './Career.css'; // Import your CSS file for styling

const Career = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    userposition: '',
    username: '',
    usermobile: '',
    useremail: '',
    userdob: '',
    userexp: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period: '',
    fileToUpload: null,
  });

  // State to manage accordion sections
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fileToUpload') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch('/api/career', { // Replace with your actual API endpoint
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        // Reset form
        setFormData({
          userposition: '',
          username: '',
          usermobile: '',
          useremail: '',
          userdob: '',
          userexp: '',
          current_ctc: '',
          expected_ctc: '',
          notice_period: '',
          fileToUpload: null,
        });
      } else {
        alert('There was an error submitting your application.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your application.');
    }
  };

  // Handle accordion toggle
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Job openings data
  const jobOpenings = [
    {
      title: 'Sales Manager - Lucknow Location',
      details: {
        why: [
          'Performance and Salary review in six months',
          'Attractive incentives and mobility across regions (global)',
          'Fast track growth.',
          'Unlimited Incentives',
          'Fastest Growing Cross Border Real Estate Platform',
          'Diversified role',
          'Multiple International Scope through Internal Job promotions',
        ],
        description: [
          'Acquiring knowledge on different projects and understanding the complete project',
          'Making calls to the prospective clients and briefing them about the different investment options',
          'Sending mails to the clients along with project layout, price list and project PPT, as per the discussion',
          'Keeping a regular follow up with the client through mails and calls',
          'Conducting site visits',
          'Producing innovative ideas and sales strategies to meet objectives',
          'Develop and increase business by following up on potential leads with face-to-face presentation and meetings with clients and providing them the utmost customer service',
          'Ensures to submit consistent property sales plans every month or quarterly for corporate sales',
          'Selling and negotiating skills and Demonstration and Presentation skills',
        ],
        skills: [
          'Bike or Car Mandatory',
          'Willingness to travel in specific location of Gurgaon',
          'An empathic communicator with pleasant personality',
          'Self-driven, well groomed, results-oriented professional with a positive outlook',
          'Structured and process oriented',
          'Zeal for multitasking',
          'Comprehensive towards Facts and Figures',
        ],
      },
    },
    {
      title: 'Sales Manager - Gurgaon Location',
      details: {
        why: [
          'Performance and Salary review in six months',
          'Attractive incentives and mobility across regions (global)',
          'Fast track growth.',
          'Unlimited Incentives',
          'Fastest Growing Cross Border Real Estate Platform',
          'Diversified role',
          'Multiple International Scope through Internal Job promotions',
        ],
        description: [
          'Acquiring knowledge on different projects and understanding the complete project',
          'Making calls to the prospective clients and briefing them about the different investment options',
          'Sending mails to the clients along with project layout, price list and project PPT, as per the discussion',
          'Keeping a regular follow up with the client through mails and calls',
          'Conducting site visits',
          'Producing innovative ideas and sales strategies to meet objectives',
          'Develop and increase business by following up on potential leads with face-to-face presentation and meetings with clients and providing them the utmost customer service',
          'Ensures to submit consistent property sales plans every month or quarterly for corporate sales',
          'Selling and negotiating skills and Demonstration and Presentation skills',
        ],
        skills: [
          'Bike or Car Mandatory',
          'Willingness to travel in specific location of Gurgaon',
          'An empathic communicator with pleasant personality',
          'Self-driven, well groomed, results-oriented professional with a positive outlook',
          'Structured and process oriented',
          'Zeal for multitasking',
          'Comprehensive towards Facts and Figures',
        ],
      },
    },
  ];

  return (
    <div>
      <section className="main-body">
        <div className="container">
          <h1>Career</h1>
          <p>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="styled-link"
            >
              Home
            </a>{' '}
            / Career
          </p>
        </div>

        <div className="main-con">
          <div className="container">
            <div className="content" style={{ padding: '20px 0px 60px' }}>
              <div className="row padding_im_about align-self-center">
                <div className="col-md-4">
                  <h2 style={{ fontWeight: 700 }}>We want you</h2>
                  <h5 style={{ fontSize: '65px', fontWeight: 800, lineHeight: '60px' }}>
                    Come and Join Us
                  </h5>
                  <p id="topform">Don’t Hesitate to Contact with us for any kind of information</p>
                  <form id="contactForm" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Applying For :"
                        name="userposition"
                        value={formData.userposition}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name :"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone No. :"
                        name="usermobile"
                        value={formData.usermobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email :"
                        name="useremail"
                        value={formData.useremail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Date of Birth :"
                        name="userdob"
                        value={formData.userdob}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Work Experience :"
                        name="userexp"
                        value={formData.userexp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Current CTC :"
                        name="current_ctc"
                        value={formData.current_ctc}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Expected CTC :"
                        name="expected_ctc"
                        value={formData.expected_ctc}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Notice Period :"
                        name="notice_period"
                        value={formData.notice_period}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="file"
                        name="fileToUpload"
                        id="CustomFile"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="theme-btn">
                        SEND
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-6">
                  <img
                    style={{ width: '100%' }}
                    src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/a88e788f-a24a-498c-b72d-0e9913e3b300/public"
                    alt="career"
                    className="img-fluid"
                    loading="eager" // Replaced 'fetchpriority' with 'loading'
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div>
                    <div className="theme_sec">
                      <h5 className="h4">Current Openings</h5>
                    </div>

                    {/* Accordion Sections */}
                    {jobOpenings.map((job, index) => (
                      <div key={index} className="accordion-section">
                        <button
                          className={`accordion ${activeAccordion === index ? 'active' : ''}`}
                          onClick={() => toggleAccordion(index)}
                          aria-expanded={activeAccordion === index}
                          aria-controls={`panel-${index}`}
                        >
                          {job.title} <i className="fa fa-angle-down"></i>
                        </button>
                        <div
                          id={`panel-${index}`}
                          className={`panel ${activeAccordion === index ? 'show' : ''}`}
                        >
                          <br />
                          <h5>Why Invest Mango?</h5>
                          <ul>
                            {job.details.why.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                          <h5>Job Description</h5>
                          <ul>
                            {job.details.description.map((desc, i) => (
                              <li key={i}>{desc}</li>
                            ))}
                          </ul>
                          <h5>Desired Skills</h5>
                          <ul>
                            {job.details.skills.map((skill, i) => (
                              <li key={i}>{skill}</li>
                            ))}
                          </ul>
                          <a className="theme-btn" href="#topform">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default Career;
