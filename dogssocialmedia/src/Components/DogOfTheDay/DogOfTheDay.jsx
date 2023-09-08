import React, { useState, useEffect } from 'react';
import './DogOfTheDay.css';

const DogOfTheDay = () => {
    const [dogImage, setDogImage] = useState('');

    useEffect(() => {
        console.log('Checking last updated timestamp...');
        const lastUpdated = localStorage.getItem('dogOfDayTimestamp');
        const now = new Date().getTime();
        console.log('Last updated:', lastUpdated);

        if (!lastUpdated || now - lastUpdated > 24 * 60 * 60 * 1000) {
            console.log('Fetching new image path from API...');
            fetch('http://localhost:5000/api/randomDogImage')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Image Path from API:', data.imagePath);
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
            // If there's no need to fetch a new image, use the cached one
            const cachedImagePath = localStorage.getItem('dogOfDayImage');
            setDogImage(cachedImagePath);
        }

    }, []);  // eslint-disable-next-line react-hooks/exhaustive-deps

    return (
        <div className="dog-of-the-day-container">
            <h2>Dog of the Day</h2>
            {dogImage && <img src={`http://localhost:5000/${dogImage}`} alt="Dog of the Day" />}
        </div>
    );
};

export default DogOfTheDay;
