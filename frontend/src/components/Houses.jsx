import React from 'react';

const houseDescriptions = [
  { house: 1, title: 'House I (Ascendant):', description: 'Self-identity and appearance.' },
  { house: 2, title: 'House II:', description: 'Finances, values, and possessions.' },
  { house: 3, title: 'House III:', description: 'Communication, siblings, and local travel.' },
  { house: 4, title: 'House IV (IC):', description: 'Home, family, and roots.' },
  { house: 5, title: 'House V:', description: 'Creativity, romance, and children.' },
  { house: 6, title: 'House VI:', description: 'Work, health, and daily routines.' },
  { house: 7, title: 'House VII (Descendant):', description: 'Partnerships and relationships.' },
  { house: 8, title: 'House VIII:', description: 'Transformation, sex, and shared resources.' },
  { house: 9, title: 'House IX:', description: 'Higher learning, travel, and philosophy.' },
  { house: 10, title: 'House X (MC or Midheaven):', description: 'Career, public life, and reputation.' },
  { house: 11, title: 'House XI:', description: 'Friendships, groups, and aspirations.' },
  { house: 12, title: 'House XII:', description: 'Subconscious, secrets, and endings.' },
];

const Houses = ({ planets }) => {
  return (
    <div className='zodiaccard-container'>
      <h2 className='zodiaccard-header'>Houses 🏠</h2>
      <div className='zodiaccard-body'>
        <p>The natal chart is divided into 12 houses, each representing different areas of life. The houses are determined by the time and place of birth and begin with your ascendant sign.</p>
        {houseDescriptions.map(({ house, title, description }) => {
          const planetHouse = planets.Houses.find(h => h.house === house);
          return (
            <div key={house} className='zodiaccard-section-highlight margin-bottom'>
              <h2 className='zodiaccard-header-nobg'>{title}</h2>
              <p>{description}</p>
              {planetHouse && (
                <div className='zodiaccard-body'>
                  <div><span className='bold'>Position:</span> {planetHouse.position}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Houses;
