import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="hamburger-menu">
            <button 
                className="menu-button" 
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {isOpen && (
                     <div className="menu-list">
                     <Link to="/FeedPage">Feed Page</Link>
                     <Link to="/FollowingUsersPage">Following Users Page</Link>
                     <Link to="/Logout">Logout</Link>
                 </div>
            )}
        </div>
    );
};

export default HamburgerMenu;