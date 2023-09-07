import React, { useState, useEffect } from 'react';
import './UserList.css';

const UserList = ({ loggedInUserId, searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Exclude the logged-in user
                const filteredUsers = data
                    .filter(user => user.id !== loggedInUserId)
                    .filter(user => user.userName.toLowerCase().startsWith(searchTerm.toLowerCase()))
    
                setUsers(filteredUsers);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [loggedInUserId, searchTerm]);
    
    console.log('loggedInUserId:', loggedInUserId); // for testing 
    const handleFollow = (userId) => {
        fetch(`http://localhost:5000/api/users/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followerId: loggedInUserId })
        })
        .then(() => setFollowing([...following, userId]))
        .catch(error => console.error('Error following user:', error));
    };
    

    const handleUnfollow = (userId) => {
        fetch(`http://localhost:5000/api/users/unfollow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followerId: loggedInUserId })
        })
        .then(() => setFollowing(following.filter(id => id !== userId)))
        .catch(error => console.error('Error unfollowing user:', error));
    };

    return (
        <div>
            <h2>All Users</h2>
            {users.map(user => (
                <div key={user.id} className="user-entry">
                    <span className="username">{user.userName}</span>
                    {following.includes(user.id) ? 
                    <button onClick={() => handleUnfollow(user.id)}>Unfollow</button> : 
                    <button onClick={() => handleFollow(user.id)}>Follow</button>
                }
                </div>
            ))}
        </div>
    );
};

export default UserList;
