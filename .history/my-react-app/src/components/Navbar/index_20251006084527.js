import React from "react";
import {
    Nav,
    NavLink,
    NavMenu,
    NavBtn,
    NavBtnLink,
    MobileNav,
    Typography,
    IconButton
} from @material-tailwind/react;

const Navbar = () => {
    return (
        <>
            <Nav>
                <Bar>
                    <NavMenu>
                        <NavLink to="/home" activeStyle>
                            Home
                        </NavLink>
                        <NavLink to="/dashboard" activeStyle>
                            Dashboard
                        </NavLink>
                        <NavLink to="/employeemanagement" activeStyle>
                            Employee Management
                        </NavLink>
                        <NavLink to="/timetracking" activeStyle>
                            Time Tracking
                        </NavLink>
                        <NavLink to="/contract" activeStyle>
                            Contract
                        </NavLink>
                        <NavLink to="/settings" activeStyle>
                            Settings
                        </NavLink>
                        <NavBtn>
                            <NavBtnLink to="/signin">Sign In</NavBtnLink>
                        </NavBtn>
                    
                    </NavMenu>
                </Bar>
                
            </Nav>
        </>
    );
};

export default Navbar;