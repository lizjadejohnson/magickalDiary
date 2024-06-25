import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import apiUrl from '../config';

const renderMeaning = (meaning) => {
    return meaning.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

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
        <MoonSign planets={planets} />
      ) : (
        <div className='zodiaccard-container'>
          <h3 className='zodiaccard-header'>Moon Sign ☽︎</h3>
          <div className='zodiaccard-body'>
            <p>To access Moon sign and other detailed ephemeris data, <Link to="/edit-profile">please provide</Link> accurate time and location of birth.</p>
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

const MoonSign = ({ planets }) => {
  const { user } = useContext(UserContext);
  const [moonMeaning, setMoonMeaning] = useState(null);
  const [cuspMeaning, setCuspMeaning] = useState(null);
  const [error, setError] = useState(null);

  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  useEffect(() => {
    async function fetchMoonMeaning() {
      if (planets && planets['Moon']) {
        const formattedPosition = planets['Moon'].formattedPosition;
        const moonSignData = formattedPosition.split(' ');
        const moonSign = moonSignData[0];
        const isCusp = formattedPosition.includes('cusp');

        let cuspSign = null;
        if (isCusp) {
          const nextSignSymbol = moonSignData[5].replace('(', '');
          const nextSignIndex = zodiacSigns.findIndex(sign => sign.includes(nextSignSymbol));
          cuspSign = nextSignIndex >= 0 ? zodiacSigns[nextSignIndex] : null;
        }

        try {
          const response = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=Moon&sign=${encodeURIComponent(moonSign)}`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setMoonMeaning(data.meaning);

          if (isCusp && cuspSign) {
            const cuspResponse = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=Moon&sign=${encodeURIComponent(cuspSign)}`, {
              credentials: 'include',
            });

            if (!cuspResponse.ok) {
              throw new Error(`HTTP error! Status: ${cuspResponse.status}`);
            }

            const cuspData = await cuspResponse.json();
            setCuspMeaning(cuspData.meaning);
          }
        } catch (error) {
          console.error("Failed to fetch moon meaning:", error);
          setError(error.message);
        }
      }
    }

    fetchMoonMeaning();
  }, [planets]);


  const moonData = planets['Moon'];

  return (
    <div className='zodiaccard-container'>
      <h3 className='zodiaccard-header'>{moonData ? moonData.formattedPosition : 'No Moon data available.'}</h3>
      <div className='zodiaccard-body'>
        <p>{moonMeaning ? renderMeaning(moonMeaning) : 'No meaning available for this Moon sign.'}</p>
        {cuspMeaning && (
          <div className='zodiaccard-section-highlight'>
            <h3>Cusp sign: {planets['Moon'].formattedPosition.split(' ')[5].replace('(', '').replace(')', '')} {planets['Moon'].formattedPosition.split(' ')[6].replace('(', '').replace(')', '')}</h3>
            <p>{renderMeaning(cuspMeaning)}</p>
          </div>
        )}
        <br />
      </div>
    </div>
  );
};

export default WesternZodiac;
