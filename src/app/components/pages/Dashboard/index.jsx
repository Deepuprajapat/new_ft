import React from 'react';
import Header from '../../Header';
import Sidebar from '../Sidebar';
import "../../styles/css/Dashboard.css";
import { Outlet } from 'react-router-dom';

const index = () => {
  return (
    <div className="dashboard-container">
      {/* <Header/>  */}
      <div className="content-wrapper">
        <div className="sidebar">
          <Sidebar /> 
        </div>
        <div className="main-content">
          <Outlet /> 
        </div>
      </div>
    </div>
  )
}

export default index