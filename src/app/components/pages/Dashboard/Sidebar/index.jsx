import React, { useState } from 'react';
import { FaHome, FaBars, FaUsers, FaSignOutAlt, FaBuilding, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../styles/css/Sidebar.css";

const index = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeSection, setActiveSection] = useState('home');
    const navigate = useNavigate();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const getUserRole = () => {
        return localStorage.getItem("user-role");
    };

    const canAccessLeads = () => {
        const role = getUserRole();
        return role === 'dm' || role === 'superadmin';
    };

    const canManageProjects = () => {
        const role = getUserRole();
        return role === 'superadmin' || role === 'admin';
    };

    const handleNavigation = (section, path) => {
        setActiveSection(section);
        if (path) {
            navigate(path);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-role");
        navigate("/admin");
    };
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
    <div className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
    </div>
    <div className="sidebar-content">
        <div
            className={`sidebar-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/admin/dashboard')}
        >
            <FaHome className="icon" />
            {isExpanded && <span>Dashboard</span>}
        </div>
        
        {canAccessLeads() && (
            <div
                className={`sidebar-item ${activeSection === 'leads' ? 'active' : ''}`}
                onClick={() => handleNavigation('leads', '/admin/leads/dashboard')}
            >
                <FaUsers className="icon" />
                {isExpanded && <span>Leads Management</span>}
            </div>
        )}
        
        {canManageProjects() && (
            <div
                className={`sidebar-item ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => handleNavigation('projects', '/admin/dashboard')}
            >
                <FaBuilding className="icon" />
                {isExpanded && <span>Projects</span>}
            </div>
        )}
        
        {canManageProjects() && (
            <div
                className={`sidebar-item ${activeSection === 'addproject' ? 'active' : ''}`}
                onClick={() => handleNavigation('addproject', '/addproject')}
            >
                <FaPlus className="icon" />
                {isExpanded && <span>Add Project</span>}
            </div>
        )}
        
        <div
            className={`sidebar-item logout-item`}
            onClick={handleLogout}
        >
            <FaSignOutAlt className="icon" />
            {isExpanded && <span>Logout</span>}
        </div>
    </div>
</div>
  )
}

export default index
