import React, { useContext, useState, useEffect } from 'react';
import apiUrl from '../src/config'; // Adjust path as needed
import { UserContext } from './UserContext';
import Spinner from '../src/components/Spinner';

export async function getEphemerisData(setState) {
  try {
    const response = await fetch(`${apiUrl}/zodiac/getEphemerisData`, {
      credentials: 'include' // Include credentials (cookies)
    });
    const data = await response.json();

    if (data && data.planets) {
      setState(data.planets); // Set state with the fetched planetary data
    } else {
      setState(null); // Set state to null if no data is returned
      console.error("Expected 'planets' data but got:", data);
    }
  } catch (error) {
    console.error("Failed to fetch ephemeris data:", error);
    setState(null); // Set state to null on error to avoid undefined errors in rendering
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function PlanetaryMeaning({ planet, planets }) {
  const { user } = useContext(UserContext);
  const [meaning, setMeaning] = useState(null);
  const [cuspMeaning, setCuspMeaning] = useState(null);
  const [error, setError] = useState(null);

  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  useEffect(() => {
    async function fetchMeaning() {
      if (planets && planets[planet]) {
        const formattedPosition = planets[planet].formattedPosition;
        const signData = formattedPosition.split(' ');
        const sign = signData[0];
        const isCusp = formattedPosition.includes('cusp');

        let cuspSign = null;
        if (isCusp) {
          const nextSignSymbol = signData[5].replace('(', '');
          const nextSignIndex = zodiacSigns.findIndex(sign => sign.includes(nextSignSymbol));
          cuspSign = nextSignIndex >= 0 ? zodiacSigns[nextSignIndex] : null;
        }

        try {
          const response = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=${planet}&sign=${encodeURIComponent(sign)}`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setMeaning(data.meaning);

          if (isCusp && cuspSign) {
            const cuspResponse = await fetch(`${apiUrl}/zodiac/getPlanetaryMeaning?planet=${planet}&sign=${encodeURIComponent(cuspSign)}`, {
              credentials: 'include',
            });

            if (!cuspResponse.ok) {
              throw new Error(`HTTP error! Status: ${cuspResponse.status}`);
            }

            const cuspData = await cuspResponse.json();
            setCuspMeaning(cuspData.meaning);
          }
        } catch (error) {
          console.error(`Failed to fetch ${planet} meaning:`, error);
          setError(error.message);
        }
      }
    }

    fetchMeaning();
  }, [planets, planet]);

  if (!planets) {
    return (
      <Spinner
        redirectTo={"/edit-profile"}
        delay={5000}
        message={`To access Ephemeris data, you must have accurate time and location of birth saved. Redirecting to edit profile page...`}
      />
    );
  }

  const planetData = planets[planet];


  const renderMeaning = (meaning) => {
    return meaning.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  return (
    <div className='zodiaccard-container'>
      <h3 className='zodiaccard-header'>{planetData ? planetData.formattedPosition : `No ${planet} data available.`}</h3>
      <div className='zodiaccard-body'>
        {meaning ? renderMeaning(meaning).map((paragraph, index) => (
          <div key={index}>{paragraph}</div>
        )) : <p>No meaning available for this {planet} sign.</p>}
        {cuspMeaning && (
          <div className='zodiaccard-section-highlight'>
            <h3>Cusp sign: {planets[planet].formattedPosition.split(' ')[5].replace('(', '').replace(')', '')} {planets[planet].formattedPosition.split(' ')[6].replace('(', '').replace(')', '')}</h3>
            {renderMeaning(cuspMeaning).map((paragraph, index) => (
              <div key={index}>{paragraph}</div>
            ))}
          </div>
        )}
        <br />
      </div>
      {error && (
        <div className='error'>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}