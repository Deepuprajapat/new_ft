import React from 'react';
import Sidebar from './Sidebar';
import "../../styles/css/Dashboard.css";

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard-container">
      {/* <Header/>  */}
      <div className="content-wrapper">
        <div className="sidebar">
          <Sidebar /> 
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dashboard