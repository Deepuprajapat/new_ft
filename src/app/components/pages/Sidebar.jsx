// Sidebar.js
import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaChartLine, FaBars } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import "../styles/css/Sidebar.css";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeSection, setActiveSection] = useState('home');
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    const toggleSettingsMenu = () => setIsSettingsExpanded(!isSettingsExpanded);

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </div>
            <div className="sidebar-content">
                <div
                    className={`sidebar-item ${activeSection === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveSection('home')}
                >
                    <FaHome className="icon" />
                    {isExpanded && <span>Home</span>}
                </div>
                <div
                    className={`sidebar-item ${activeSection === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveSection('profile')}
                >
                    <FaUser className="icon" />
                    {isExpanded && <span>Profile</span>}
                </div>
                <div
                    className={`sidebar-item ${activeSection === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveSection('analytics')}
                >
                    <FaChartLine className="icon" />
                    {isExpanded && <span>Analytics</span>}
                </div>
                <div
                    className="sidebar-item"
                    onClick={toggleSettingsMenu}
                >
                    <FaCog className="icon" />
                    {isExpanded && (
                        <span>
                            Settings {isSettingsExpanded ? <MdExpandLess /> : <MdExpandMore />}
                        </span>
                    )}
                </div>
                {isSettingsExpanded && isExpanded && (
                    <div className="sub-menu">
                        <div
                            className={`sidebar-item sub-item ${activeSection === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveSection('general')}
                        >
                            General
                        </div>
                        <div
                            className={`sidebar-item sub-item ${activeSection === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveSection('security')}
                        >
                            Security
                        </div>
                    </div>
                    
                )}
                <div
                    className={`sidebar-item ${activeSection === 'Logout' ? 'active' : ''}`}
                    onClick={() => setActiveSection('Logout')}
                >
                    <FaChartLine className="icon" />
                    {isExpanded && <span>Logout</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
