import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove the authentication cookie
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // If you had any global or Context-based states related to the user, reset them here

        // Redirect to the login page
        navigate('/login');  // Assuming the route to your Login component is '/login'
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
};

export default Logout;
