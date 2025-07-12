import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../utils/cookieUtils';

const AuthNavbar = ({ isLoggedIn, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from cookie and localStorage
    deleteCookie('authToken');
    localStorage.removeItem('authToken');
    
    console.log('User logged out successfully');
    
    // Call the parent's logout handler
    if (onLogout) {
      onLogout();
    }
    
    // Optionally redirect to home page
    window.location.reload();
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: '#2067d1',
      color: 'white',
      padding: '10px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>
          Welcome, User!
        </div>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={() => setShowProfileMenu(true)}
          >
            <i className="fas fa-user" style={{ fontSize: '16px' }}></i>
            Profile
            <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
          </button>
          
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '180px',
                zIndex: 1001,
                marginTop: '5px'
              }}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  User Profile
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Logged in successfully
                </div>
              </div>
              
              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-tachometer-alt" style={{ fontSize: '14px' }}></i>
                  Dashboard
                </button>
                
                <button
                  onClick={() => navigate('/addProject')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-plus" style={{ fontSize: '14px' }}></i>
                  Add Project
                </button>
                
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-sign-out-alt" style={{ fontSize: '14px' }}></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar; 