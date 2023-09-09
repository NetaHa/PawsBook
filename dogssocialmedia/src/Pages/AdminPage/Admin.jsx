import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import axios from 'axios';

const AdminScreen = () => {
    const [users, setUsers] = useState([]);
    const [removedUsers, setRemovedUsers] = useState([]);

    // Load the initial feature state from localStorage, if present
    const initialFeatures = JSON.parse(localStorage.getItem('features')) || {
        DarkMode: true,
        DogOfTheDay: false,
    };
    const [features, setFeatures] = useState(initialFeatures);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const toggleFeature = (feature) => {
        const updatedFeatureState = {
            ...features,
            [feature]: !features[feature]
        };

        setFeatures(updatedFeatureState);

        // Save the updated features state to localStorage
        localStorage.setItem('features', JSON.stringify(updatedFeatureState));

        const event = new CustomEvent('featureToggled', {
            detail: { featureName: feature, enabled: updatedFeatureState[feature] }
        });
        window.dispatchEvent(event);
    };

    const removeUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            // Filter out the removed user from the users state
            const updatedUsers = users.filter(user => String(user.id) !== String(userId));
            setUsers(updatedUsers);
            setRemovedUsers(prev => [...prev, userId]);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return (
        <MainLayout>
            <div className="adminScreen">
                <h1>Admin Dashboard</h1>

                <section>
                    <h2>Users Activity</h2>
                    <ul>
                        {Array.isArray(users) && users.map(user => (
                            <li key={user.id}>
                                {user.userName} - Activities: 
                                {user.activityHistory && user.activityHistory.length > 0 ? (
                                user.activityHistory.map((activity, index) => (
                                <span key={index}>
                                    {activity.type} ({new Date(activity.timestamp).toLocaleString()})
                                    {index !== user.activityHistory.length - 1 ? ', ' : ''}
                                </span>
                                ))
                                ) : (
                                "None"  
                                )}
                                <button onClick={() => removeUser(user.id)} disabled={removedUsers.includes(user.id)}>
                                {removedUsers.includes(user.id) ? "User Removed" : "Remove User"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Feature Toggles</h2>
                    {Object.entries(features).map(([featureKey, isEnabled]) => (
                        <div key={featureKey}>
                            <label>{featureKey}</label>
                            <button onClick={() => toggleFeature(featureKey)}>
                                {isEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    ))}
                </section>
            </div>
        </MainLayout>
    );
};

export default AdminScreen;
