import React from "react";
import { Navbar as MTNavbar, Typography, Button } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <MTNar className="px-4 py-2 flex items-center justify-between">
            <Typography
                as={NavLink}
                to="/home"
                variant="h6"
                className="mr-4 cursor-pointer py-1.5"
            >
                Home
            </Typography>
            <div className="flex gap-6">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/employeemanagement">Employee Management</NavLink>
                <NavLink to="/timetracking">Time Tracking</NavLink>
                <NavLink to="/contract">Contract</NavLink>
                <NavLink to="/settings">Settings</NavLink>
            </div>
            <Button size="sm" variant="gradient" as={NavLink} to="/signin">
                Sign In
            </Button>
        </MTNar>
    );
};

export default Navbar;