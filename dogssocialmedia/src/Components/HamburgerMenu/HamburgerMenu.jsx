import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

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
                     <Link to="/FeedPage">Feed </Link>
                     <Link to="/FollowingUsersPage">Following Users</Link>
                     <Link to="/DogsTipsPage">Tips</Link>
                     <Link to="/DogParksPage">Parks</Link>
                     <Link to="/ReadMe">ReadMe</Link>
                     {isAdmin && <Link to="/AdminPage">Admin</Link>}
                     <Link to="/Logout">Logout</Link>
                    </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
