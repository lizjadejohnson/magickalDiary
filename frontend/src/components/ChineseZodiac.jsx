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

    // Mapping over all the userZodiac properties explicity (we are wanting to change a lot of names, etc):
    const zodiacDetails = {
        "Animal": chineseZodiac.name,
        "Element": chineseZodiac.element,
        "Traits": chineseZodiac.traits.join(', '),
        "Compatibility": chineseZodiac.compatibility.join(', ')
    };

    return (
        //Returning a map of the zodiacDetails so that we can more easily style/modify:
        <div className='horoscopeContainer'>
        
            {Object.entries(zodiacDetails).map(([key, value]) => (
                <p key={key} className="zodiac-detail"><span className="zodiac-key">{key}:</span> {value}</p>
            ))}
            <img className="zodiacgif" src={gifPath} alt={`${chineseZodiac.name} sign`} />

        </div>
    );
};

export default ChineseZodiac;
