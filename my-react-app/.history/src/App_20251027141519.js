import React from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import logo from './logo.svg';
import './App.css';

import { HRNavbar } from './components/Navbar';
import CustomScrollbar from './components/schollbar';
import Pagination from './components/pagination'
import Dashboard from './pages/dashboard';
import EmployeeManagement from './pages/employeemanagement'; // modify to test CEmployeeTable
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  DropdownButton,
} from "./components/button";

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="h-screen flex flex-col">
        <HRNavbar />
        
        <main className="flex-1 relative">
          <PrimaryButton text="Save" onClick={() => alert("Saved!")} />
          <SecondaryButton text="Cancel" onClick={() => alert("Cancelled!")} />
          <IconButton icon={<FaSearch />} label="Search" onClick={() => alert("Searching...")} />
          <IconButton icon={<FaTrash />} label="Delete" onClick={() => alert("Deleted!")} />
          <DropdownButton
            label="Select Report"
            options={[
              { label: "Monthly Report", onClick: () => alert("Monthly selected") },
              { label: "Yearly Report", onClick: () => alert("Yearly selected") },
            ]}
          />

          <CustomScrollbar>
            {/* <div className="p-4 md:p-8"> dùng để canh lề (margin)*/}
            <div className="p-4 md:p-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employeemanagement" element={<EmployeeManagement />} />
                <Route path="/contract" element={<h1>Contract Page</h1>} />
                <Route path="/timetracking" element={<h1>Time Tracking Page</h1>} />
                <Route path="/" element={
                  <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>Welcome to HR Management System</h1>
                    <p>Click on Dashboard in the navigation to get started!</p>
                  </header>
                } />
              </Routes>
            </div>
          </CustomScrollbar>
        </main>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
