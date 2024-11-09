import React from 'react'

const Video = () => {
  return (
    <div>About
    <section class="main-body">

      <div class="container" style={{marginTop:'50px'}}>
          <h1>Our Videos</h1>
         </div>
  
      <div classNameName=' '  style={{display:'flex' ,gap:'20px',padding:'20px'}}>
      <div className="card"  style={{width: '24rem'}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
<div className="card" style={{width: '24rem'}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
<div className="card" style={{width:' 24rem'}}>
  <img src="..." className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Card title</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
      </div>
      </section>
    </div>

  )
}

export default Video