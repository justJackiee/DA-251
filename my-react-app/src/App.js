import logo from './logo.svg';
import './App.css';

import Login from './pages/login';
import { HRNavbar } from './components/Navbar';
import CustomScrollbar from './components/schollbar';
import Pagination from './components/pagination'
import Dashboard from './pages/dashboard';
import EmployeeManagement from './pages/employeemanagement'; // modify to test CEmployeeTable
import ProfileDetails from "./components/EmployeeProfileDetails/ProfileDetails";
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  DropdownButton,
} from "./components/button";
import PayrollPage from './pages/payroll';


import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";
import TimeTracking from "./pages/timetracking";

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="h-screen flex flex-col">
        <HRNavbar />
        
        <Routes>
          <Route path="/dashboard" element={
             <>
            <Dashboard />
            <Pagination />
          </>
            } />
          <Route path="/employeemanagement" element={<h1>Employee Management Page</h1>} />
          <Route path="/contract" element={<h1>Contract Page</h1>} />
          <Route path="/timetracking" element={<h1>Time Tracking Page</h1>} />
          <Route path="/pagination" element={<Pagination />}/>
          <Route path="/" element={
       
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 style={{ fontFamily: 'Baloo 2, sans-serif', color: '#06007c' }}>
                  Welcome to HR Management System
                </h1>
                <p style={{ fontFamily: 'Baloo 2, sans-serif', color: '#666' }}>
                  Click on Dashboard in the navigation to get started!
                </p>
              </header>
           
          } />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
