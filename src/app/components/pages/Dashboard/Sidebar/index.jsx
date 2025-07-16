import React, { useState } from 'react';
import { FaBars, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../styles/css/Sidebar.css";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeSection, setActiveSection] = useState('leads');
    const navigate = useNavigate();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const getUserRole = () => {
        return localStorage.getItem("user-role");
    };

    const canAccessLeads = () => {
        const role = getUserRole();
        return role === 'dm' || role === 'superadmin';
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
        {canAccessLeads() && (
            <div
                className={`sidebar-item ${activeSection === 'leads' ? 'active' : ''}`}
                onClick={() => handleNavigation('leads', '/admin/leads/dashboard')}
            >
                <FaUsers className="icon" />
                {isExpanded && <span>Leads Management</span>}
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

export default Sidebar
