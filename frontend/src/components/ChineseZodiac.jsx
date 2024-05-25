import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from './Spinner';

const ChineseZodiac = () => {
    const { user } = useContext(UserContext);
    const [chineseZodiac, setChineseZodiac] = useState(null);
    const [error, setError] = useState(null);

    async function getChineseZodiacInfo() {
        try {
            const response = await fetch('http://localhost:3000/zodiac/getChineseZodiacByDOB', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setChineseZodiac(data.chineseZodiacSign);
        } catch (error) {
            console.error("Failed to fetch Chinese Zodiac reading:", error);
            setError(error.message);
            setChineseZodiac(null);
        }
    }

    useEffect(() => {
        if (user) {
            getChineseZodiacInfo();
        }
    }, [user]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!chineseZodiac) {
        return <Spinner redirectTo={'#'} delay={3000} message={"Loading..."}/>
    }

    //Get location of the image:
    const gifPath = `/${chineseZodiac.name.toLowerCase()}.gif`; // Ensure sign name is lowercase to match the file name

    return (
        <div className='horoscopeContainer'>
            <p>Animal: {chineseZodiac.name}</p>
            <p>Element: {chineseZodiac.element}</p>
            <p>Traits: {chineseZodiac.traits.join(', ')}</p>
            <p>Compatibility: {chineseZodiac.compatibility.join(', ')}</p>
            <img className="zodiacgif" src={gifPath} alt={`${chineseZodiac.name} sign`} />
        </div>
    );
};

export default ChineseZodiac;
