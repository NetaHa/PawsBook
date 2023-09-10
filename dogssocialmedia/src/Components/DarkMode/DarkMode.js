import React, { useState, useEffect } from "react"; 
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(JSON.parse(localStorage.getItem('features'))?.DarkMode || false);

    useEffect(() => {
        const handleFeatureToggle = (e) => {
            const { featureName, enabled } = e.detail;
            if (featureName === 'DarkMode') {
                setIsFeatureEnabled(enabled);
            }
        };

        window.addEventListener('featureToggled', handleFeatureToggle);

        return () => {
            window.removeEventListener('featureToggled', handleFeatureToggle);
        };
    }, []);

    const setDarkMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'dark')
    };

    const setLightMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'light')
    };

    const toggleTheme = e => {
        if (e.target.checked) setDarkMode();
        else setLightMode();
    };

    if (!isFeatureEnabled) {
        return null;
    }

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
