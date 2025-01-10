import React from 'react'
import faq from '../../../utils/faq';
import Accordion from './Accordion';
import { Helmet } from 'react-helmet';
const Faq = () => {
    const midIndex = Math.ceil(faq.length / 2);
    const firstHalf = faq.slice(0, midIndex);
    const secondHalf = faq.slice(midIndex);
  return (
    <div>
 <Helmet>
<title>FAQs | Invest Mango</title> 
<meta name="description" content="Our FAQs are there to help you know about our services and have an understanding of your 'Property Investments." /> 
<link rel="canonical" href="https://www.investmango.com/faq" />
</Helmet>
    <section className="main-body">
        <div className="container">
            <h1>FAQs</h1>
            <p><a href="https://www.investmango.com/" target="_blank" rel="noopener" className="styled-link">Home</a> / FAQs</p>
            <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
        </div>
        <div className="main-con">
            <div className="container">
                <div className="content faqs">
                    <div className="row">
                        <div className="col-md-6">
                        <Accordion data={firstHalf} />
                        </div>
                        <div className="col-md-6">
                        <Accordion data={secondHalf} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

      
    </div>
  )
}

export default Faq
