import logo from './logo.svg';
import './App.css';
import { NavbarWithSolidBackground } from './components/NavbarWithSolidBackground';
import { ThemeProvider, Typography, Button } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <NavbarWithSolidBackground />
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
