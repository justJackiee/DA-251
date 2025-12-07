import logo from './logo.svg';
import React from 'react';
import './App.css';
import { NavBar } from './components/Navbar';
import TimeTracking from './pages/timetracking';
import Dashboard from './pages/dashboard';
import Contract from './pages/contract';
import EmployeeManagement from './pages/employeemanagement';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
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
