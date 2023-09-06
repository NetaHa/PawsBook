import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import './FollowingUsers.css';
import UserList from '../../Components/UserList'; // Adjust the path if they're not in the same directory

const FollowingUsersPage = ({ loggedInUserId }) => { 
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <MainLayout>
            <div>
                <input
                    type="text"
                    placeholder="Search by user name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <UserList loggedInUserId={loggedInUserId} searchTerm={searchTerm} />
            </div>
        </MainLayout>
    );
};

export default FollowingUsersPage;
