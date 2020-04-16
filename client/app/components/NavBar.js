import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const HorizontalNavBar = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
`;

const HorizontalNavItem = styled(NavLink)`
    float: left;
    dispaly: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
`;

const NavBar = () => {
    return(
        <div>
            <HorizontalNavBar>
                <HorizontalNavItem to='/'>Home</HorizontalNavItem>
                <HorizontalNavItem to='/recurring'>Recurring Jobs</HorizontalNavItem>
                <HorizontalNavItem to='/admin'>Admin Panel</HorizontalNavItem>
            </HorizontalNavBar>
        </div>
    );
}

export default NavBar;