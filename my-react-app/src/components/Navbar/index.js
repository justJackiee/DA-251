import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      padding: '0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #ccc',
      position: 'relative',
      height: '50px',
      minHeight: '50px',
      maxHeight: '50px',
      overflow: 'visible',
      boxSizing: 'border-box'
    }}>
      {/* Main Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        padding: '0 1rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Left side: Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          position: 'absolute',
          left: '1rem'
        }}>
          {/* Brand / Logo and Text Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Logo */}
            <div style={{
              height: '45px',
              width: '45px',            
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img 
                src="/idCu14vzRC_logos-removebg-preview.png" 
                alt="HRManagement Logo" 
                style={{ 
                  maxHeight: '70px',
                  maxWidth: '70px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }} 
              />
            </div>
            {/* Text */}
            <h2 style={{ 
              margin: 0, 
              color: '#ffffff', 
              fontSize: '1.8rem',
              fontWeight: '700',
              fontFamily: 'Baloo 2, sans-serif',
              letterSpacing: '-0.5px'
            }}>
              HRManagement
            </h2>
          </div>          
        </div>
        
        {/* Center: Desktop Menu */}
        {!isMobile && (
          <div style={{ 
            display: 'flex',
            gap: '3.5rem', 
            alignItems: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <Link to="/dashboard" style={{ 
              textDecoration: 'none', 
              color: '#fc6544', 
              fontSize: '1rem', 
              fontWeight: '650',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              Dashboard
            </Link>
            <a href="/employeemanagement" style={{ 
              textDecoration: 'none', 
              color: '#a8a8a8ff', 
              fontSize: '1rem', 
              fontWeight: '650',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              Employees Management
            </a>
            <a href="/timetracking" style={{ 
              textDecoration: 'none', 
              color: '#a8a8a8ff', 
              fontSize: '1rem', 
              fontWeight: '650',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              Time Tracking
            </a>
            <a href="/contract" style={{ 
              textDecoration: 'none', 
              color: '#a8a8a8ff', 
              fontSize: '1rem', 
              fontWeight: '650',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              Contract
            </a>
            <a href="/payroll" style={{ 
              textDecoration: 'none', 
              color: '#a8a8a8ff', 
              fontSize: '1rem', 
              fontWeight: '650',
              fontFamily: 'Baloo 2, sans-serif'
            }}>
              Payroll
            </a>
          </div>
        )}
        
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
          
          {/* Mobile Hamburger Menu - Always show for testing */}
          <button 
            onClick={toggleMenu}
            style={{ 
              background: 'none',
              border: '2px solid #fc6544',  // Add visible border for testing
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#fc6544',
              borderRadius: '4px',          // Add border radius
              display: isMobile ? 'block' : 'none'  // Explicit display control
            }}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Show when menu is open */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',              // Position right below navbar
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          zIndex: 9999,
          border: '1px solid #e5e7eb',
          borderTop: 'none',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '200px'        // Add minimum height to ensure visibility
        }}>
          <Link to="/dashboard" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Dashboard
          </Link>
          <a href="/employeemanagement" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Employees Management
          </a>
          <a href="/timetracking" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Time Tracking
          </a>
          <a href="/contract" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Contract
          </a>
          <a href="/payroll" style={{ 
            textDecoration: 'none', 
            color: '#374151', 
            fontSize: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontFamily: 'Baloo 2, sans-serif'
          }}>
            Payroll
          </a>
          {/* <button style={{
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
          </button> */}
        </div>
      )}
    </nav>
  );
}