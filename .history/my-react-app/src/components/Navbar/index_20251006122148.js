import React, { useState, useEffect } from 'react';

export function HRNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{
      backgroundColor: '#06007c',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #ccc',
      position: 'relative'
    }}>
      {/* Main Navigation Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Left side: Brand + Navigation Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#ffffffff', 
            fontSize: '1.5rem', 
            fontWeight: '600',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Píckmink
          </h2>
          
          {/* Desktop Menu - Hidden on mobile */}
          {!isMobile && (
            <div style={{ 
              display: 'flex',
              gap: '2rem', 
              alignItems: 'center' 
            }}>
              <a href="#" style={{ 
                textDecoration: 'none', 
                color: '#fc6544', 
                fontSize: '1rem', 
                fontWeight: '650',
                fontFamily: 'Baloo 2, sans-serif'
              }}>
                Dashboard
              </a>
              <a href="#" style={{ 
                textDecoration: 'none', 
                color: '#a8a8a8ff', 
                fontSize: '1rem', 
                fontWeight: '650',
                fontFamily: 'Baloo 2, sans-serif'
              }}>
                Employees Management
              </a>
              <a href="#" style={{ 
                textDecoration: 'none', 
                color: '#a8a8a8ff', 
                fontSize: '1rem', 
                fontWeight: '650',
                fontFamily: 'Baloo 2, sans-serif'
              }}>
                Time Tracking
              </a>
              <a href="#" style={{ 
                textDecoration: 'none', 
                color: '#a8a8a8ff', 
                fontSize: '1rem', 
                fontWeight: '650',
                fontFamily: 'Baloo 2, sans-serif'
              }}>
                Contract
              </a>
            </div>
          )}
        </div>
        
        {/* Right side: Button and Mobile Menu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Desktop Button - Hidden on mobile */}
          {/* {!isMobile && (
            <button style={{
              backgroundColor: '#374151',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              GET STARTED
            </button>
          )} */}
          
          {/* Mobile Hamburger Menu - Only visible on mobile */}
          {isMobile && (
            <button 
              onClick={toggleMenu}
              style={{ 
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                color: '#fc6544'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown - Only shown when menu is open on mobile */}
      {isMobile && isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          zIndex: 1000,
          border: '1px solid #e5e7eb',
          borderTop: 'none'
        }}>
          <a href="#" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Dashboard
          </a>
          <a href="#" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Employees Management
          </a>
          <a href="#" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Time Tracking
          </a>
          <a href="#" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Contract
          </a>
          <button style={{
            backgroundColor: '#374151',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '1rem',
            marginBottom: '0.5rem',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            GET STARTED
          </button>
        </div>
      )}
    </nav>
  );
}