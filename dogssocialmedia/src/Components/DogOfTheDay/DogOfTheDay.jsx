import React, { useState, useEffect } from 'react';
import './DogOfTheDay.css';

const DogOfTheDay = () => {
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(JSON.parse(localStorage.getItem('features'))?.DogOfTheDay || false);
    const [dogImage, setDogImage] = useState('');

    useEffect(() => {
        const handleFeatureToggle = (e) => {
            const { featureName, enabled } = e.detail;
            if (featureName === 'DogOfTheDay') {
                setIsFeatureEnabled(enabled);
            }
        };

        window.addEventListener('featureToggled', handleFeatureToggle);

        return () => {
            window.removeEventListener('featureToggled', handleFeatureToggle);
        };
    }, []);

    useEffect(() => {
        if (isFeatureEnabled) {
            const lastUpdated = localStorage.getItem('dogOfDayTimestamp');
            const now = new Date().getTime();

            if (!lastUpdated || now - lastUpdated > 24 * 60 * 60 * 1000) {
                fetch('http://localhost:5000/api/randomDogImage')
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data && data.imagePath) {
                            setDogImage(data.imagePath);
                            localStorage.setItem('dogOfDayTimestamp', now.toString());
                            localStorage.setItem('dogOfDayImage', data.imagePath);
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
            } else {
                const cachedImagePath = localStorage.getItem('dogOfDayImage');
                setDogImage(cachedImagePath);
            }
        }
    }, [isFeatureEnabled]); 

    if (!isFeatureEnabled) {
        return null;  
    }

    return (
        <div className="dog-of-the-day-container">
            <h2>Dog of the Day</h2>
            {dogImage && <img src={`http://localhost:5000/${dogImage}`} alt="Dog of the Day" />}
        </div>
    );
};

export default DogOfTheDay;
