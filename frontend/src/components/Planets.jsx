import React from 'react';
import { PlanetaryMeaning } from '../../utilities/ephemerisHelper.jsx';

const planetsInfo = [
  {
    name: 'The Sun ☉',
    meaning: 'Core identity, ego, and the self. The Sun is the central point of the chart and signifies your main character traits and personal drive. It represents your conscious mind and the essence of who you are.'
  },
  {
    name: 'The Moon ☽︎',
    meaning: 'Emotions, instincts, and subconscious. The Moon reflects your inner world, emotional responses, and how you nurture yourself and others. It’s linked to your past, childhood, and how you feel safe and secure.'
  },
  {
    name: 'Mercury ☿',
    meaning: 'Communication, intellect, and reasoning. Mercury governs how you think, process information, and express yourself. It influences your learning style and the way you interact with others.'
  },
  {
    name: 'Venus ♀',
    meaning: 'Love, beauty, and values. Venus influences your approach to relationships, your aesthetic preferences, and what you value in life. It’s associated with your sense of pleasure, attraction, and harmony.'
  },
  {
    name: 'Mars ♂',
    meaning: 'Action, energy, and desire. Mars drives your ambition, sexual energy, and how you assert yourself. It’s connected to your physical vitality, courage, and how you handle conflict and challenges.'
  },
  {
    name: 'Jupiter ♃',
    meaning: 'Growth, expansion, and abundance. Jupiter signifies your search for meaning, luck, and how you seek to grow and expand your horizons. It’s linked to optimism, faith, and wisdom.'
  },
  {
    name: 'Saturn ♄',
    meaning: 'Discipline, structure, and responsibility. Saturn represents your boundaries, limitations, and areas where you need to put in effort and discipline. It’s associated with long-term goals, perseverance, and maturity.'
  },
  {
    name: 'Uranus ⛢',
    meaning: 'Innovation, rebellion, and change. Uranus influences your sense of individuality, your desire for freedom, and how you bring about change. It’s linked to sudden insights and unconventional thinking.'
  },
  {
    name: 'Neptune ♆',
    meaning: 'Imagination, dreams, and spirituality. Neptune governs your ideals, intuition, and connection to the mystical and spiritual realms. It’s associated with creativity, compassion, and illusion.'
  },
  {
    name: 'Pluto ♇',
    meaning: 'Transformation, power, and rebirth. Pluto signifies deep change, regeneration, and how you deal with power dynamics. It’s linked to your ability to undergo profound personal transformation and to confront your inner depths.'
  },
  {
    name: 'Lilith ⚸',
    meaning: 'Hidden emotions, primal instincts, and repressed desires. Lilith represents the dark, often unconscious side of our nature. It signifies where we may feel shame or rejection, and how we deal with our deeper, more instinctual urges.'
  },
  {
    name: 'N Node ☊',
    meaning: 'Life path, growth, and destiny. The North Node represents the lessons we are here to learn and the direction we are encouraged to grow towards. It signifies our future and where we can find the most fulfillment by stepping out of our comfort zones.'
  },
  {
    name: 'The Ascendant (Rising Sign) ↗',
    meaning: 'Outer personality and how you present yourself to the world. The Ascendant is the sign that was rising on the eastern horizon at the time of your birth. It influences your physical appearance, demeanor, and how others perceive you. It also sets the stage for the entire birth chart by determining the house cusps.'
  },
];

const Planets = ({ planets }) => {
  return (
    <div>
      {planetsInfo.map(({ name, meaning }, index) => {
        const planetKey = name.split(' ')[1].replace(/[♀♂♃♄⛢♆♇⚸☊]/g, '');
        const planetData = planets[planetKey];
        return (
          <div key={index} className='zodiaccard-container'>
            <h3 className='zodiaccard-header'>
              {name}: {planetData?.formattedPosition ?? 'N/A'}
            </h3>
            <div className='zodiaccard-body'>
              <div className='zodiaccard-section-highlight'>
                <p>{meaning}</p>
              </div>
              <PlanetaryMeaning planet={planetKey} planets={planets} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Planets;
