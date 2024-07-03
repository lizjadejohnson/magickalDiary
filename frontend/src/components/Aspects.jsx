import React from 'react';

const aspectDescriptions = [
  { title: 'Conjunction ☌ (0°):', description: 'Planets are close together, blending energies.' },
  { title: 'Opposition ☍ (180°):', description: 'Planets are opposite each other, creating tension.' },
  { title: 'Square □ (90°):', description: 'Planets are at a challenging angle, causing friction.' },
  { title: 'Trine △ (120°):', description: 'Planets are harmoniously connected, facilitating ease.' },
  { title: 'Sextile ✶ (60°):', description: 'Planets are at a supportive angle, encouraging cooperation.' },
];

const Aspects = ({ planets }) => {
  return (
    <>
      <div className='zodiaccard-container'>
        <h2 className='zodiaccard-header'>The Aspects:</h2>
        <div className='zodiaccard-body'>
          <p>Aspects are the angles between planets, indicating how they interact with each other. Major aspects include:</p>
          {aspectDescriptions.map(({ title, description }, index) => (
            <div key={index}>
              <h4 className='zodiaccard-header-nobg'>{title}</h4>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
      {planets.Aspects && planets.Aspects.length > 0 && (
        <div>
          {planets.Aspects.map(({ planet1, aspect, aspectSymbol, planet2, orb }, index) => (
            <div key={index} className='zodiaccard-container'>
              <h3 className='zodiaccard-header'>{`${planet1} - ${planet2}`}</h3>
              <div className='zodiaccard-body'>
                <div><span className='bold'>Aspect:</span> {aspect} {aspectSymbol}</div>
                <div><span className='bold'>Orb:</span> {orb}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Aspects;
