import React from 'react';
import {PlanetaryMeaning} from '../../utilities/ephemerisHelper.jsx';

const MoonSign = ({ planets }) => (
  <div>
    <div className='zodiaccard-container'>
      <h2 className='zodiaccard-header'>Moon Sign ☽︎</h2>
      <div className='zodiaccard-body'>
        <p>Emotions, instincts, and subconscious.</p>
        <p>The Moon reflects your inner world, emotional responses, and how you nurture yourself and others. It’s linked to your past, childhood, and how you feel safe and secure.</p>
      </div>
    </div>
    <PlanetaryMeaning planet="Moon" planets={planets} />
  </div>
);

export default MoonSign;
