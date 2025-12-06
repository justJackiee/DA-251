import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Simple HTML test without Material Tailwind */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ccc'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>
          Material Tailwind
        </h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
            Home
          </a>
          <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
            About
          </a>
          <button style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Get Started
          </button>
        </div>
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
