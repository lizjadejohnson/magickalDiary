import React from 'react';

const MoonSign = ({ planets }) => {

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
            <p>Enter Moon reading info here!</p>
          </div>
      </div>
    </>
  );
};

export default MoonSign;
