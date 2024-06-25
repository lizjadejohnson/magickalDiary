import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from './Spinner';
import apiUrl from '../config';

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
          // Fetch the main Moon sign meaning
          console.log(`Fetching meaning for Moon sign: ${moonSign}`);
          const response = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=Moon&sign=${encodeURIComponent(moonSign)}`, {
            credentials: 'include' // Include credentials (cookies)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setMoonMeaning(data.meaning);

          // If on the cusp, then also fetch the cusp sign meaning
          if (isCusp && cuspSign) {
            console.log(`Fetching meaning for cusp Moon sign: ${cuspSign}`);
            const cuspResponse = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=Moon&sign=${encodeURIComponent(cuspSign)}`, {
              credentials: 'include'
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

  if (!planets) {
    return (
      <Spinner
        redirectTo={"/edit-profile"}
        delay={5000}
        message={"To access Ephemeris data, you must have accurate time and location of birth saved. Redirecting to edit profile page..."}
      />
    );
  }

  const moonData = planets['Moon'];
  console.log('Moon data:', moonData);


  const renderMeaning = (meaning) => {
    return meaning.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  return (
    <>
      <div className='zodiaccard-container'>
        <h2 className='zodiaccard-header'>Moon Sign ☽︎</h2>
        <div className='zodiaccard-body'>
          <p>Emotions, instincts, and subconscious.</p>
          <p>The Moon reflects your inner world, emotional responses, and how you nurture yourself and others. It’s linked to your past, childhood, and how you feel safe and secure.</p>
        </div>
      </div>
      <div className='zodiaccard-container'>
        <h3 className='zodiaccard-header'>{moonData ? moonData.formattedPosition : 'No Moon data available.'}</h3>
        <div className='zodiaccard-body'>
          {moonMeaning ? renderMeaning(moonMeaning) : <p>No meaning available for this Moon sign.</p>}
          {cuspMeaning && (
            <div className='zodiaccard-section-highlight'>
              <h3>Cusp sign: {planets['Moon'].formattedPosition.split(' ')[5].replace('(', '').replace(')', '')} {planets['Moon'].formattedPosition.split(' ')[6].replace('(', '').replace(')', '')}</h3>
              {renderMeaning(cuspMeaning)}
            </div>
          )}
          <br />
        </div>
      </div>
      {error && (
        <div className='error'>
          <p>Error: {error}</p>
        </div>
      )}
    </>
  );
};

export default MoonSign;