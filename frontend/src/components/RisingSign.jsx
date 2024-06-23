import React from 'react';

const RisingSign = ({ planets }) => {

    if (!planets) {
        return (
            <Spinner
            redirectTo={"/edit-profile"}
            delay={5000}
            message={"To access Ephemeris data, you must have accurate time and location of birth saved. Redirecting to edit profile page..."}
            />
        );
    }

  const risingData = planets['Ascendant'];
  return (
    <>
        <div className='zodiaccard-container'>
            <h2 className='zodiaccard-header'>Ascendant/Rising Sign ↗</h2>
            <div className='zodiaccard-body'>
                <p>Outer personality and how you present yourself to the world.</p>
                <p>The Ascendant is the sign that was rising on the eastern horizon at the time of your birth. It influences your physical appearance, demeanor, and how others perceive you. It also sets the stage for the entire birth chart by determining the house cusps.</p>
            </div>
        </div>
        <div className='zodiaccard-container'>
            <h3 className='zodiaccard-header'>{risingData ? risingData.formattedPosition : 'No rising sign data available.'}</h3>
            <div className='zodiaccard-body'>
                <p>IMPORT RISING SIGN MEANING HERE</p>
            </div>
        </div>
    </>
  );
};

export default RisingSign;
