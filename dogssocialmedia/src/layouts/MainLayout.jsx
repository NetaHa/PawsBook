import React from 'react';
import HamburgerMenu from '../Components/HamburgerMenu/HamburgerMenu';
import DarkMode from '../Components/DarkMode/DarkMode';  
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <HamburgerMenu />
            <DarkMode />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
