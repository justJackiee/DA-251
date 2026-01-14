import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
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
    <div className="App">
      {/* Responsive Navbar */}
      <nav style={{
        backgroundColor: '#ffffff',
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
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem', fontWeight: '600' }}>
            Píckmink
          </h2>
          
          {/* Desktop Menu - Hidden on mobile */}
          {!isMobile && (
            <div style={{ 
              display: 'flex',
              gap: '2rem', 
              alignItems: 'center' 
            }}>
              <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>
                Dashboard
              </a>
              <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>
                Employees Management
              </a>
              <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>
                Blocks
              </a>
              <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>
                Docs
              </a>
              <button style={{
                backgroundColor: '#374151',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                GET STARTED
              </button>
            </div>
          )}

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
                color: '#374151'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
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
              borderBottom: '1px solid #f3f4f6'
            }}>
              Pages
            </a>
            <a href="#" style={{ 
              textDecoration: 'none', 
              color: '#374151', 
              fontSize: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              Account
            </a>
            <a href="#" style={{ 
              textDecoration: 'none', 
              color: '#374151', 
              fontSize: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              Blocks
            </a>
            <a href="#" style={{ 
              textDecoration: 'none', 
              color: '#374151', 
              fontSize: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              Docs
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
              marginBottom: '0.5rem'
            }}>
              GET STARTED
            </button>
          </div>
        )}
      </nav>
      
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h1 style={{ color: '#333' }}>
          Test Page - React is Working!
        </h1>
        <button style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginTop: '10px'
        }}>
          Test Button
        </button>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
