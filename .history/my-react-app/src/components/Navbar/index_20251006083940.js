import React from "react";
import {
    Nav,
    NavLink,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";

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
                        <NavLink to="/emplo" activeStyle>
                            About
                        </NavLink>
                        <NavLink to="/contact" activeStyle>
                            Contact
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