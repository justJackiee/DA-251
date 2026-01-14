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
                        <NavLink to="/services" activeStyle>
                            Services
                        </NavLink>
                        <NavLink to="/about" activeStyle>
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