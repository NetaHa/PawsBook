import React from 'react';
import HamburgerMenu from '../Components/HamburgerMenu/HamburgerMenu';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <HamburgerMenu />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
