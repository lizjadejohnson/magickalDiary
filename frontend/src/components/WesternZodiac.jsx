import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import apiUrl from '../config';
import {PlanetaryMeaning} from '../../utilities/ephemerisHelper.jsx';

const WesternZodiac = ({ planets }) => {
  const { user } = useContext(UserContext);
  const [userZodiac, setUserZodiac] = useState(null);
  const [error, setError] = useState(null);

  async function getZodiacInfo() {
    try {
      const response = await fetch(`${apiUrl}/zodiac/getWesternZodiacByDOB`, {
        credentials: 'include',
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
    if (user) {
      getZodiacInfo();
    }
  }, [user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userZodiac) {
    return <Spinner redirectTo={'#'} delay={3000} message={"Loading..."} />;
  }

  const gifPath = `/${userZodiac.name.toLowerCase()}.gif`;

  const formatDate = (dateStr) => {
    const [month, day] = dateStr.split("-");
    return new Date(Date.UTC(2000, month - 1, day)).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const zodiacDetails = {
    "Sign": userZodiac.name,
    "Date Range": `${formatDate(userZodiac.startDate)} - ${formatDate(userZodiac.endDate)}`,
    "Element": userZodiac.element,
    "Modality": userZodiac.quality,
    "Ruling Planet": userZodiac.rulingPlanet,
    "Traits": userZodiac.traits.join(', '),
    "Symbol": userZodiac.symbol,
    "Compatibility": userZodiac.compatibility.join(', '),
  };

  return (
    <>
      <div className='zodiaccard-container'>
        <h2 className='zodiaccard-header'>Sun Sign ☉</h2>
        <div className='zodiaccard-body'>
          <p>Core identity, ego, and the self.</p>
          <p>The Sun is the central point of the chart and signifies your main character traits and personal drive. It represents your conscious mind and the essence of who you are.</p>
          <div>
            {Object.entries(zodiacDetails).map(([key, value]) => (
                <p key={key} className="zodiac-detail"><span className="zodiac-key">{key}:</span> {value}</p>
            ))}
            <img className="zodiacgif" src={gifPath} alt={`${userZodiac.name} sign`} />
          </div>
        </div>
      </div>

      {planets ? (
        <SunSign planets={planets} />
      ) : (
        <div className='zodiaccard-container'>
          <h3 className='zodiaccard-header'>Sun Sign ☉</h3>
          <div className='zodiaccard-body'>
            <p>To access detailed Sun sign and other ephemeris data, <Link to="/edit-profile">please provide</Link> accurate time and location of birth.</p>
          </div>
        </div>
      )}

      {error && (
        <div className='error'>
          <p>Error: {error}</p>
        </div>
      )}
    </>
  );
};

const SunSign = ({ planets }) => (
  <div>
    <PlanetaryMeaning planet="Sun" planets={planets} />
  </div>
);


export default WesternZodiac;