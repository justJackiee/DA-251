import logo from './logo.svg';
import './App.css';
import { ThemeProvider, Typography, Button } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        {/* Simple test navbar with inline styles */}
        <nav style={{
          backgroundColor: '#ffffff',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" color="blue-gray">
            Material Tailwind
          </Typography>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Typography as="a" href="#" variant="small" color="blue-gray">
              Home
            </Typography>
            <Typography as="a" href="#" variant="small" color="blue-gray">
              About
            </Typography>
            <Button color="blue" size="sm">
              Get Started
            </Button>
          </div>
        </nav>
        
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h4" color="blue-gray">
            Test Material Tailwind
          </Typography>
          <Button color="blue" style={{ marginTop: '10px' }}>
            Test Button
          </Button>
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
    </ThemeProvider>
  );
}

export default App;
