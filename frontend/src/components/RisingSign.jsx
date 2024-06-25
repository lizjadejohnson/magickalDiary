import React from 'react';
import {PlanetaryMeaning} from '../../utilities/ephemerisHelper.jsx';

const RisingSign = ({ planets }) => (
  <div>
    <div className='zodiaccard-container'>
      <h2 className='zodiaccard-header'>Ascendant (Rising Sign) ↗</h2>
      <div className='zodiaccard-body'>
        <p>Outer personality and how you present yourself to the world.</p>
        <p>The Ascendant is the sign that was rising on the eastern horizon at the time of your birth. It influences your physical appearance, demeanor, and how others perceive you. It also sets the stage for the entire birth chart by determining the house cusps.</p>
      </div>
    </div>
    <PlanetaryMeaning planet="Ascendant" planets={planets} />
  </div>
);

export default RisingSign;