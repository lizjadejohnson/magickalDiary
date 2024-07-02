import React from 'react';
import Spinner from './Spinner';

const Ephemeris = ({ planets }) => {

  if (!planets) {
    return (
      <Spinner
        redirectTo={"/edit-profile"}
        delay={5000}
        message={"To access Ephemeris data, you must have accurate time and location of birth saved. Redirecting to edit profile page..."}
      />
    );
  }

  return (
    <div className='ephemeris-container'>
      <div className='ephemeris-results'>
        <h2>Your Astrological Birth Chart:</h2>
        <div className='basic-planetary-info'>
          {Object.entries(planets ?? {}).map(([planet, position]) => (
            planet !== "Houses" && planet !== "Aspects" && (
              <div key={planet} className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>{planet}</h3>
                <div className='zodiaccard-body'>
                  <div><span className='bold'>Sign:</span> {position?.formattedPosition ?? 'N/A'}</div>
                  {planet !== 'Ascendant' && planet !== 'Midheaven' &&(<div><span className='bold'>Longitude:</span> {position?.longitude?.toFixed(2)}°</div>)}
                </div>
              </div>
            )
          ))}
        </div>
        <br />
        {planets.Houses && planets.Houses.length > 0 && (
          <div className='houses'>
            <h2>House Cusps:</h2>
            {planets.Houses.map(({ house, position }) => (
              <div key={house} className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>House {house}</h3>
                <div className='zodiaccard-body'>
                  <div><span className='bold'>Position:</span> {position}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <br />
        {planets.Aspects && planets.Aspects.length > 0 && (
          <div className='aspects'>
            <h2>Aspects:</h2>
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
      </div>
      <br />
      <div className='astrology-explanation'>
        <h2>What Does It Mean?</h2>
              <div className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>Basic Calculations:</h3>
                <div className='zodiaccard-body'>
                  <p>To provide a complete astrological birth chart, your date, time, and location of birth are essential. Each zodiac sign spans 30° of the celestial circle:</p>
                  <ul className='zodiaccard-section-highlight'>
                    <li>Aries: 0° - 29.99°</li>
                    <li>Taurus: 30° - 59.99°</li>
                    <li>Gemini: 60° - 89.99°</li>
                    <li>Cancer: 90° - 119.99°</li>
                    <li>Leo: 120° - 149.99°</li>
                    <li>Virgo: 150° - 179.99°</li>
                    <li>Libra: 180° - 209.99°</li>
                    <li>Scorpio: 210° - 239.99°</li>
                    <li>Sagittarius: 240° - 269.99°</li>
                    <li>Capricorn: 270° - 299.99°</li>
                    <li>Aquarius: 300° - 329.99°</li>
                    <li>Pisces: 330° - 359.99°</li>
                  </ul>
                  <p>A tool called an Ephemeris is used to calculate the exact positions of celestial bodies at specific locations and times.</p>
                  <p>We are thankful to be using ephemeris information provided by <a href="https://github.com/cosinekitty/astronomy/tree/master">AstronomyEngine</a> in this project.</p>
                  <p>The astrology sign most people are familiar with is your sun sign. This is the sign people mean when they ask "What's your sign?". It refers to the location of the sun when you were born.</p>
                  <p>But other celestial bodies help make up your chart as well!</p>
                  <p>The reason you only need your date of birth to calculate your sun sign, for example, is because different celestial bodies move at different speeds.</p>
                  <p>So, as we said, signs span 30°. To calculate your sun sign, you would want to see what degree the sun was when you were born. if your sun is at 305° then your traditional sun sign would fall within the range of Aquarius.</p>
                  <p>For instance, the sun moves slowly, while the moon moves more quickly. Therefore, accurate birth time and location are crucial for a precise chart interpretation.</p>
                  <p>It is customary to provide a summary such as: Your Moon is in scorpio ♏ 29° 12' 05" </p>
                  <p>The 29° in the example, refers to the degree of the sign your moon is in. As they span 30 degrees each, a sign at 15° would place it solidly in the middle of the sign, whereas 29° would typically be considered a cusp.</p>
                  <p>A cusp occurs when a celestial body (like the Sun or a planet) is positioned very close to the boundary between two zodiac signs. Typically, this boundary is considered to be around 29° of one sign transitioning into 0° of the next sign. Some astrologers extend this to be more like 26°-29° but 1° is considered a traditionally 'cusp'.</p>
                  <p>Astrologically, the 29th degree is often seen as a critical degree, carrying heightened energy and significance. It can amplify the traits and characteristics associated with the sign, sometimes to an extreme or finalizing effect.</p>
                  <p>Following the same example, the 12' refers to the minutes past the degree of that sign (e.g. 12 minutes past it hitting 29°).</p>
                  <p>The seconds indicate how many seconds past the specified minute (e.g. 5 seconds past the 12th minute that it passed hitting 29°). </p>
                </div>
              </div>
              <div className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>The Planets:</h3>
                <div className='zodiaccard-body'>
                  <h4>The Sun ☉</h4>
                  <p>Core identity, ego, and the self. The Sun is the central point of the chart and signifies your main character traits and personal drive. It represents your conscious mind and the essence of who you are.</p>
                  <h4>The Moon ☽︎</h4>
                  <p>Emotions, instincts, and subconscious. The Moon reflects your inner world, emotional responses, and how you nurture yourself and others. It’s linked to your past, childhood, and how you feel safe and secure.</p>
                  <h4>Mercury ☿</h4>
                  <p>Communication, intellect, and reasoning. Mercury governs how you think, process information, and express yourself. It influences your learning style and the way you interact with others.</p>
                  <h4>Venus ♀</h4>
                  <p>Love, beauty, and values. Venus influences your approach to relationships, your aesthetic preferences, and what you value in life. It’s associated with your sense of pleasure, attraction, and harmony.</p>
                  <h4>Mars ♂</h4>
                  <p>Action, energy, and desire. Mars drives your ambition, sexual energy, and how you assert yourself. It’s connected to your physical vitality, courage, and how you handle conflict and challenges.</p>
                  <h4>Jupiter ♃</h4>
                  <p>Growth, expansion, and abundance. Jupiter signifies your search for meaning, luck, and how you seek to grow and expand your horizons. It’s linked to optimism, faith, and wisdom.</p>
                  <h4>Saturn ♄</h4>
                  <p>Discipline, structure, and responsibility. Saturn represents your boundaries, limitations, and areas where you need to put in effort and discipline. It’s associated with long-term goals, perseverance, and maturity.</p>
                  <h4>Uranus ⛢</h4>
                  <p>Innovation, rebellion, and change. Uranus influences your sense of individuality, your desire for freedom, and how you bring about change. It’s linked to sudden insights and unconventional thinking.</p>
                  <h4>Neptune ♆</h4>
                  <p>Imagination, dreams, and spirituality. Neptune governs your ideals, intuition, and connection to the mystical and spiritual realms. It’s associated with creativity, compassion, and illusion.</p>
                  <h4>Pluto ♇</h4>
                  <p>Transformation, power, and rebirth. Pluto signifies deep change, regeneration, and how you deal with power dynamics. It’s linked to your ability to undergo profound personal transformation and to confront your inner depths.</p>
                  <h4>Lilith ⚸</h4>
                  <p>Hidden emotions, primal instincts, and repressed desires. Lilith represents the dark, often unconscious side of our nature. It signifies where we may feel shame or rejection, and how we deal with our deeper, more instinctual urges.</p>
                  <h4>N Node ☊</h4>
                  <p>Life path, growth, and destiny. The North Node represents the lessons we are here to learn and the direction we are encouraged to grow towards. It signifies our future and where we can find the most fulfillment by stepping out of our comfort zones.</p>
                  <h4>The Ascendant (Rising Sign) ↗</h4>
                  <p>Outer personality and how you present yourself to the world. The Ascendant is the sign that was rising on the eastern horizon at the time of your birth. It influences your physical appearance, demeanor, and how others perceive you. It also sets the stage for the entire birth chart by determining the house cusps.</p>
                </div>
              </div>
              <div className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>The Houses:</h3>
                <div className='zodiaccard-body'>
                  <p>The natal chart is divided into 12 houses, each representing different areas of life. The houses are determined by the time and place of birth.</p>
                  <h4>House I (Ascendant):</h4>
                  <p>Self-identity and appearance.</p>
                  <h4>House II:</h4>
                  <p>Finances, values, and possessions.</p>
                  <h4>House III:</h4>
                  <p>Communication, siblings, and local travel.</p>
                  <h4>House IV (IC):</h4>
                  <p>Home, family, and roots.</p>
                  <h4>House V:</h4>
                  <p>Creativity, romance, and children.</p>
                  <h4>House VI:</h4>
                  <p>Work, health, and daily routines.</p>
                  <h4>House VII (Descendant):</h4>
                  <p>Partnerships and relationships.</p>
                  <h4>House VIII:</h4>
                  <p>Transformation, sex, and shared resources.</p>
                  <h4>House IX:</h4>
                  <p>Higher learning, travel, and philosophy.</p>
                  <h4>House X (MC or Midheaven):</h4>
                  <p>Career, public life, and reputation.</p>
                  <h4>House XI:</h4>
                  <p>Friendships, groups, and aspirations.</p>
                  <h4>House XII:</h4>
                  <p>Subconscious, secrets, and endings.</p>
                </div>
              </div>
              <div className='zodiaccard-container'>
                <h3 className='zodiaccard-header'>The Aspects:</h3>
                <div className='zodiaccard-body'>
                  <p>Aspects are the angles between planets, indicating how they interact with each other. Major aspects include:</p>
                  <h4>Conjunction ☌ (0°):</h4>
                  <p>Planets are close together, blending energies.</p>
                  <h4>Opposition ☍ (180°):</h4>
                  <p>Planets are opposite each other, creating tension.</p>
                  <h4>Square □ (90°):</h4>
                  <p>Planets are at a challenging angle, causing friction.</p>
                  <h4>Trine △ (120°):</h4>
                  <p>Planets are harmoniously connected, facilitating ease.</p>
                  <h4>Sextile ✶ (60°):</h4>
                  <p>Planets are at a supportive angle, encouraging cooperation.</p>
                </div>
              </div>
            </div>
        </div>
  );
};

export default Ephemeris;