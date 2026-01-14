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
                        
                    
                    </NavMenu>
                </Bar>
                
            </Nav>
        </>
    );
};

export default Navbar;