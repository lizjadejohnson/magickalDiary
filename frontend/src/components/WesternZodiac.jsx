import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from './Spinner';


const WesternZodiac = () => {
    const { user } = useContext(UserContext);

    const [userZodiac, setUserZodiac] = useState(null);

    const [error, setError] = useState(null);

    async function getZodiacInfo() {
        try {
            console.log("Fetching Western Zodiac sign");
            const response = await fetch('http://localhost:3000/zodiac/getWesternZodiacByDOB', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data);
            setUserZodiac(data);
        } catch (error) {
            console.error("Failed to fetch reading:", error);
            setError(error.message);
            setUserZodiac(null);
        }
    }
    
    
    useEffect(() => {
        if (user) { // Only fetch reading if there is a logged-in user
          getZodiacInfo();
        }
      }, [user]);  // Depend on user to refetch when user state changes

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userZodiac) {
        return <Spinner redirectTo={'#'} delay={3000} message={"Loading..."}/>
    }
    
    //Get location of the image:
    const gifPath = `/${userZodiac.name.toLowerCase()}.gif`; // Ensure sign name is lowercase to match the file name

    // Helper function to format date to "MM-DD"
    const formatDate = (dateStr) => {
        const [month, day] = dateStr.split("-");
        const date = new Date(0);
        date.setUTCMonth(month - 1); // month is 0-based in Date
        date.setUTCDate(day);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className='horoscopeContainer'>
            <p>Sign: {userZodiac.name}</p>
            <p>Date Range: {formatDate(userZodiac.startDate)} - {formatDate(userZodiac.endDate)}</p>
            <p>Element: {userZodiac.element}</p>
            <p>Quality: {userZodiac.quality}</p>
            <p>Ruling Planet: {userZodiac.rulingPlanet}</p>
            <p>Traits: {userZodiac.traits.join(', ')}</p>
            <p>Symbol: {userZodiac.symbol}</p>
            <p>Compatibility: {userZodiac.compatibility.join(', ')}</p>
            <img className="zodiacgif" src={gifPath} alt={`${userZodiac.name} sign`} />
        </div>
    );
};

export default WesternZodiac
