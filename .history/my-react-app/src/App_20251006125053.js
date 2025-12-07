import logo from './logo.svg';
import './App.css';
import { HRNavbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { useState, useEffect } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple routing based on URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Listen for navigation changes
  useEffect(() => {
    const handleNavigation = (e) => {
      if (e.target.closest('a')) {
        e.preventDefault();
        const href = e.target.closest('a').getAttribute('href');
        if (href === '/dashboard') {
          setCurrentPage('dashboard');
          window.history.pushState({}, '', '/dashboard');
        }
      }
    };

    document.addEventListener('click', handleNavigation);
    return () => document.removeEventListener('click', handleNavigation);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      default:
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 style={{ fontFamily: 'Baloo 2, sans-serif', color: '#06007c' }}>
                Welcome to HR Management System
              </h1>
              <p style={{ fontFamily: 'Baloo 2, sans-serif', color: '#666' }}>
                Click on Dashboard in the navigation to get started!
              </p>
            </header>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <HRNavbar />
      {renderPage()}
    </div>
  );
}

export default App;
