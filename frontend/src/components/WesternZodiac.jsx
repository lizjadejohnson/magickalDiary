import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from './Spinner';
import apiUrl from '../config';

const WesternZodiac = ({ planets }) => {
    const { user } = useContext(UserContext);

    const [userZodiac, setUserZodiac] = useState(null);

    const [error, setError] = useState(null);

    async function getZodiacInfo() {
        try {
            
            const response = await fetch(`${apiUrl}/zodiac/getWesternZodiacByDOB`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
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
        return new Date(Date.UTC(2000, month - 1, day)).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        }); //Was having timezone issues!!!
    };
    // Mapping over all the userZodiac properties explicity (we are wanting to change a lot of names, etc):
    const zodiacDetails = {
        "Sign": userZodiac.name,
        "Date Range": `${formatDate(userZodiac.startDate)} - ${formatDate(userZodiac.endDate)}`,
        "Element": userZodiac.element,
        "Modality": userZodiac.quality,
        "Ruling Planet": userZodiac.rulingPlanet,
        "Traits": userZodiac.traits.join(', '),
        "Symbol": userZodiac.symbol,
        "Compatibility": userZodiac.compatibility.join(', ')
    };
    const sunData = planets['Sun'];
    return (
        <>
            <div className='zodiaccard-container'>
                <h2 className='zodiaccard-header'>Sun Sign ☉</h2>
                <div className='zodiaccard-body'>
                    <p>Core identity, ego, and the self.</p>
                    <p>The Sun is the central point of the chart and signifies your main character traits and personal drive. It represents your conscious mind and the essence of who you are.</p>
                </div>
            </div>
            <div className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>{sunData ? sunData.formattedPosition : 'No Sun data available.'}</h3>
                <div className='zodiaccard-body'>
                    {Object.entries(zodiacDetails).map(([key, value]) => (
                        <p key={key} className="zodiac-detail"><span className="zodiac-key">{key}:</span> {value}</p>
                    ))}
                    <img className="zodiacgif" src={gifPath} alt={`${userZodiac.name} sign`} />
                </div>
            </div>
        </>
    );
};

export default WesternZodiac
