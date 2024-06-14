import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from '../components/Spinner';
import WesternZodiac from '../components/WesternZodiac';
import ChineseZodiac from '../components/ChineseZodiac';
import MoonSign from '../components/MoonSign';
import RisingSign from '../components/RisingSign';
import Planets from '../components/Planets';
import Houses from '../components/Houses';
import Aspects from '../components/Aspects';

const ZodiacPage = () => {
  const { user } = useContext(UserContext);
  const [activeReading, setActiveReading] = useState('');
  const [buttonSubMenu, setButtonSubMenu] = useState(false);

  //If someone is not logged in:
  if (!user) {
    return (
      <Spinner
        redirectTo={"/"}
        delay={5000}
        message={"You must first login or create a new account. Redirecting to homepage..."}
      />
    );
  };

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
        </div>
      )}
      <div className='horoscopeResult'>
        {activeReading === 'Eastern' && <ChineseZodiac />}
        {activeReading === 'Sun Sign' && <WesternZodiac />}
        {activeReading === 'Moon Sign' && <MoonSign />}
        {activeReading === 'Rising Sign' && <RisingSign />}
        {activeReading === 'Planets' && <Planets />}
        {activeReading === 'Houses' && <Houses />}
        {activeReading === 'Aspects' && <Aspects />}
      </div>
    </div>
  );
};

export default ZodiacPage;
