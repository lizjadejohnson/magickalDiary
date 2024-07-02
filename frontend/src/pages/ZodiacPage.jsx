import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from '../components/Spinner';
import WesternZodiac from '../components/WesternZodiac';
import ChineseZodiac from '../components/ChineseZodiac';
import MoonSign from '../components/MoonSign';
import RisingSign from '../components/RisingSign';
import Planets from '../components/Planets';
import Houses from '../components/Houses';
import Aspects from '../components/Aspects';
import Ephemeris from '../components/Ephemeris';
import { getEphemerisData } from '../../utilities/ephemerisHelper.jsx'; // Import the helper function

const ZodiacPage = () => {
  const { user } = useContext(UserContext);
  const [activeReading, setActiveReading] = useState('');
  const [buttonSubMenu, setButtonSubMenu] = useState(false);
  const [planets, setPlanets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (!user.timeOfBirth || !user.locationOfBirth) {
        setError("To access Ephemeris data, you must have accurate time and location of birth saved.");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          await getEphemerisData(setPlanets, user); // Fetch ephemeris data
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch ephemeris data.");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <Spinner
        redirectTo={"/"}
        delay={5000}
        message={"You must first login or create a new account. Redirecting to homepage..."}
      />
    );
  }



  if (loading) {
    return <Spinner redirectTo="#" delay={3000} message={"Loading..."} />;
  }

  const handleWesternZodiacClick = () => {
    setButtonSubMenu(true);
    setActiveReading('Sun Sign');
  };

  const handleSetWesternSubType = (subType) => {
    setActiveReading(subType);
  };

  const handleEasternZodiacClick = () => {
    setActiveReading('Eastern');
    setButtonSubMenu(false);
  };

  return (
    <div>
      <h1 className='title'>Zodiac Readings</h1>
      <div className='button-container'>
        <button onClick={handleEasternZodiacClick}>Chinese Zodiac</button>
        <button onClick={handleWesternZodiacClick}>Western Zodiac</button>
      </div>

      {buttonSubMenu && (
        <div className='sub-menu'>
          <button onClick={() => handleSetWesternSubType('Sun Sign')}>Sun Sign ☀️</button>
          <button onClick={() => handleSetWesternSubType('Moon Sign')}>Moon Sign 🌘</button>
          <button onClick={() => handleSetWesternSubType('Rising Sign')}>Rising Sign 📈</button>
          <button onClick={() => handleSetWesternSubType('Planets')}>Planets 🌍</button>
          <button onClick={() => handleSetWesternSubType('Houses')}>Houses 🏠</button>
          <button onClick={() => handleSetWesternSubType('Aspects')}>Aspects 🪞</button>
          <button onClick={() => handleSetWesternSubType('Ephemeris')}>Full Chart 🌌</button>
        </div>
      )}
      <div className='horoscopeResult'>
        {activeReading === 'Eastern' && <ChineseZodiac />}
        {activeReading === 'Sun Sign' && <WesternZodiac planets={planets} />}
        {activeReading === 'Moon Sign' && <MoonSign planets={planets} />}
        {activeReading === 'Rising Sign' && <RisingSign planets={planets} />}
        {activeReading === 'Planets' && <Planets planets={planets} />}
        {activeReading === 'Houses' && <Houses planets={planets} />}
        {activeReading === 'Aspects' && <Aspects planets={planets} />}
        {activeReading === 'Ephemeris' && <Ephemeris planets={planets} />}
      </div>
    </div>
  );
};

export default ZodiacPage;
