import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import './FollowingUsers.css';
import UserList from '../../Components/UserList';

const FollowingUsersPage = () => { 
    const [searchTerm, setSearchTerm] = useState('');

    const getToken = () => {
        const name = 'authToken=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }

    const token = getToken();

    return (
        <MainLayout>
            <div>
                <input
                    type="text"
                    placeholder="Search by user name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <UserList token={token} searchTerm={searchTerm} />
            </div>
        </MainLayout>
    );
};

export default FollowingUsersPage;
