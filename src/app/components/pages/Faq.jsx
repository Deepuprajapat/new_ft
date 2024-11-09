import React from 'react'

const Faq = () => {
  return (
    <div>

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
                            <button className="accordion active"><b>Q.</b> Why choose Invest Mango? </button>
                            <div className="panel" style={{display: 'block'}}>
                                <p className="p_n">Invest Mango works as one team with a common purpose to provide best-in-className services, thoroughly understands the changing needs of its clients...</p>
                            </div>
                            <button className="accordion active"><b>Q.</b> What questions should you ask before investing in a company? </button>
                            <div className="panel"  style={{display: 'block'}}>
                                <div className="text">
                                    <p className="p_n">How good is the management team?</p>
                                    <p className="p_n">What is the current market opportunity?</p>
                                    <p className="p_n">What's the performance of the company both in the past and present?</p>
                                    <p className="p_n">Are there any potential risks?</p>
                                    <p className="p_n">How will my investment be used?</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button className="accordion active"><b>Q.</b> What sector does Invest Mango operate in? </button>
                            <div className="panel"  style={{display: 'block'}}>
                                <div className="text">
                                    <p className="p_n">The real estate sector is where Invest Mango specializes...</p>
                                </div>
                            </div>
                          
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
