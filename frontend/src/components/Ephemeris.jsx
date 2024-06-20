import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from './Spinner';
import { getEphemerisData, formatZodiacPosition } from '../../utilities/ephemerisHelper'; // Updated import


const Ephemeris = () => {
    const { user } = useContext(UserContext);
    const [planets, setPlanets] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // State to manage loading state


    useEffect(() => {
        if (user) {
            if (!user.timeOfBirth || !user.locationOfBirth) {
                // If required user data is missing, set error state and stop loading
                setError("To access Ephemeris data, you must have accurate time and location of birth saved.");
                setLoading(false);
                return;
            }
    
            // Fetch ephemeris data if all required user data is available
            getEphemerisData(setPlanets)
                .then(() => setLoading(false)) // Set loading to false once data is fetched
                .catch(err => {
                    setError(err.message);
                    setLoading(false); // Stop loading state in case of error
                });
        }
    }, [user]);


    // Check if there's an error to display
    if (error) {
        return <Spinner redirectTo='/edit-profile' delay={3000} message={error} />;
    }

    // Check if data is still loading
    if (loading) {
        return <Spinner redirectTo={'#'} delay={3000} message={"Loading..."} />;
    }

    // Check if planets data is available
    if (!planets) {
        return <div>Error: Failed to load ephemeris data.</div>; // Handle case where planets are still not loaded
    }


    return (
        <div className='ephemeris-container'>
            <div className='ephemeris-results'>
                <h2>Planetary Positions</h2>
                {Object.entries(planets).map(([planet, position]) => (
                    <div key={planet} className='planet-position'>
                        <p><strong>{planet}:</strong> {position.longitude.toFixed(2)}°, Speed: {planet === "Moon" ? position.speed.toFixed(4) + "°/day" : position.speed.toFixed(4) + "°/hr"}</p>
                        <div className='detailed-position'>
                            <strong>{planet}:</strong> {formatZodiacPosition(position.longitude)}
                        </div>
                    </div>
                ))}
            </div>
            <div className='astrology-explanation'>
                <h2>What Does It Mean?</h2>
                <p>Each zodiac sign spans 30° from 0° through 360°. The signs are:</p>
                <ul>
                    <li>Aries: 0° - 29.99°</li>
                    <li>Taurus: 30° - 59.99°</li>
                    <li>Gemini: 60° - 89.99°</li>
                    <li>Cancer: 90° - 119.99°</li>
                    <li>Leo: 120° - 149.99°</li>
                    <li>Virgo: 150° - 179.99°</li>
                    <li>Libra: 180° - 209.99°</li>
                    <li>Scorpio: 210° - 239.99°</li>
                    <li>Sagittarius: 240° - 269.99°</li>
                    <li>Capricorn: 270° - 299.99°</li>
                    <li>Aquarius: 300° - 329.99°</li>
                    <li>Pisces: 330° - 359.99°</li>
                </ul>
                <p>To provide a full astrological chart, not only is your date of birth needed but the time and location as well.</p>
                <p>A tool called an Ephemeris is used to calculate the exact positions of celestial bodies at specific locations and times.</p>
                <p>We are thankful to be using ephemeris information provided by AstronomyEngine in this project.</p>
                <p>The astrology sign most people are familiar with is your sun sign. This is the sign people mean when they ask "What's your sign?". It refers to the location of the sun when you were born.</p>
                <p>But other celestial bodies help make up your chart as well!</p>
                <p>The reason you only need your date of birth to calculate your sun sign is because different celestial bodies move at different speeds.</p>
                <p>So, as we said, signs span 30°. To calculate your sun sign, you want to see what degree the sun was when you were born. if your sun is at 305° then your traditional sun sign would fall within the range of Aquarius.</p>
                <p>The sun has a speed of 0.0406°/hr but the moon, by contrast, is a whopping 13.8239°/day! So clearly, more information is needed than just the date of birth.</p>
                <p>Additionally, it is customary to provide a summary such as: Your Moon is at the following degree(s): 29°♏ 12' 05" </p>
                <p>The 29° in the example, refers to the degree of the sign your moon is in. As they span 30 degrees each, a sign at 15° would place it in the middle whereas 29° would typically be considered a cusp.</p>
                <p>A cusp occurs when a celestial body (like the Sun or a planet) is positioned very close to the boundary between two zodiac signs. Typically, this boundary is considered to be around 29° of one sign transitioning into 0° of the next sign. Some astrologers extend this to be more like 26°-29° but 1° is considered a traditionally 'cusp'.</p>
                <p>Astrologically, the 29th degree is often seen as a critical degree, carrying heightened energy and significance. It can amplify the traits and characteristics associated with the sign, sometimes to an extreme or finalizing effect.</p>
                <p>Following the same example, the 12' refers to the minutes past the degree of that sign (e.g. 12 minutes past it hitting 29°).</p>
                <p>The seconds indicate how many seconds past the specified minute (e.g. 5 seconds past the 12th minute that it passed hitting 29°). </p>
            </div>
        </div>
    );
};
export default Ephemeris;