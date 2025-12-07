import logo from './logo.svg';
import './App.css';
import { HRNavbar } from './components/Navbar';

function App() {
  return (
    <div className="App">
      <HRNavbar />
      
      
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
