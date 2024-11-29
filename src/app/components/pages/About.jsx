import React from 'react'
import '../styles/css/about.css'

const About = () => {
  return (
    <div>
        
      <section class="main-body">
      <div className="container">
          <h1>About Us</h1>
          <p>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="styled-link"
            >
              Home
            </a>{' '}
            / About Us
          </p>
        </div>
        <div class="containerMain" >
            <div class="content"    >
                <div class="row padding_im_about" >
                    <div class="col-md-6" style={{marginTop:'72px'}}>
                        <h2><p class="h2">Our Process</p></h2>
                        <p  class="p_n"><b>1. INQUIRY</b> - When we receive the 'inquiry' then as per the need of the property and location  likewise we lend options.</p>
                        <p class="p_n"><b>2. INQUIRY ANALYSIS BY THE PORTFOLIO MANAGER</b> - Your ‘Assigned Portfolio Manager’ will sit down with you and understand your requirements with Real estate investing.</p>
                        <p class="p_n"><b>3. PLAN-UP SITE VISIT</b>- After deciding on the Location and Developer we plan for you the site visit on the choice of your property (commercial or a residential) at your favorable location.</p>
                        <p class="p_n"><b>4. CLOSURE MEETING</b> - When the decision ought to be taken on choosing the best property in Noida, sec 150 Noida or Greater Noida West you just need to sit with your Portfolio Manager and look into the documents that all are needed. Worry not, we give follow-up Service to our dear customers as our objective is just not about adding a number of customers but building a relationship.</p>
                    </div>
                    <div class="col-md-6">
                   <img src="https://imagedelivery.net/MbjggtGD4dFDFpyznW77nA/3c8604aa-75a9-4cce-53e5-a0b6542ce900/public" alt="About Invest Mango" class="responsive-image" fetchpriority="high" style={{width: '100%',height: '400px'}}/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12" >
                        <p class="h2">Key Takeaway</p>
                        <p class="p_n">Our experience is in fostering long-term relationships with our renowned investors and purchasers through seamless services, seeing possibilities at the right time, and taking full advantage of them. We work incredibly hard to give YOU the lifestyle of the "Platinum" class that you've been yearning to!</p>
                        <p class="h2">HOW WE ARE DIFFERENT?</p>
                        <ul>
                        <li>We don't deal with Developers, instead we deal with the 'project' in particular.</li>
                        <li>Being the Portfolio Management Company we know all the INs and OUTs of the real estate industry.</li> 
                        <li>Qualitative Analysis to deliver our services in a best-organized way to our clientele.</li>
                        <li>Flawless Management of your funds, allocating them to the most fiercely growing areas.</li> 
                        <li>Consultancy is provided to reach the most and get the ‘best in return’.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    {/* </div> */}
    </section>
    </div>

  )
}

export default About