import React from 'react'

// import '../styles/css/about.css'
import { aboutUsData } from '../../../utils/about'
const About = () => {
  return (
  
        
        <section className="main-body">
      <div className="container">
        <h1>{aboutUsData.title}</h1>
        <p>
          {aboutUsData.breadcrumb.map((item, index) => (
            <span key={index}>
              <a
                href={item.path}
                target={item.label === "Home" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="styled-link"
              >
                {item.label}
              </a>
              {index < aboutUsData.breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </p>
      </div>

      <div className="main-con">
        <div className='container'>
        <div className="content">
          <div className="row padding_im_about">
            <div className="col-md-6">
              <h2>Our Process</h2>
              {aboutUsData.process.map((item, index) => (
                <p className="p_n" key={index}>
                  <b>{item.title}</b> - {item.description}
                </p>
              ))}
            </div>
            <div className="col-md-6">
              <img
                src={aboutUsData.image.src}
                alt={aboutUsData.image.alt}
                className="responsive-image"
                style={{ width: "100%", height: "400px",borderRadius:'5px'}}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <p className="h2">{aboutUsData.keyTakeaway.title}</p>
              <p className="p_n">{aboutUsData.keyTakeaway.description}</p>
              <p className="h2">{aboutUsData.differentiation.title}</p>
              <ul>
                {aboutUsData.differentiation.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
   

  )
}

export default About