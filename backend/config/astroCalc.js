const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

async function getPlanetaryPositions(dob, timeOfBirth, locationOfBirth) {
  const birthDateTime = DateTime.fromISO(`${dob}T${timeOfBirth}:00Z`).toUTC().toJSDate();
  const observer = new Astronomy.Observer(locationOfBirth.lat, locationOfBirth.lng, 0);

  const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const planetaryPositions = {};

  for (const planet of planets) {
    const result = Astronomy.Equator(planet, birthDateTime, observer, true, true);
    const longitude = (result.ra / 24) * 360; // Convert Right Ascension to degrees

    let futureDateTime;
    
    if (planet === "Moon") {
      // Use a shorter interval for the Moon due to its fast movement
      futureDateTime = new Date(birthDateTime.getTime() + 1 * 24 * 3600 * 1000); // One day later
    } else {
      futureDateTime = new Date(birthDateTime.getTime() + 30 * 24 * 3600 * 1000); // One month later
    }

    const futureResult = Astronomy.Equator(planet, futureDateTime, observer, true, true);
    const futureLongitude = (futureResult.ra / 24) * 360;
  
    let speed;

    if (planet === "Moon") {
      speed = (futureLongitude - longitude) % 360; // Speed in degrees per day for the Moon
    } else {
      speed = ((futureLongitude - longitude) % 360) / (30 * 24); // Speed in degrees per hour for other planets
    }

    planetaryPositions[planet] = {
      longitude: longitude % 360, // Ensure longitude is within 0 to 360 degrees
      speed: planet === "Moon" ? speed : speed // Speed per hour for others, per day for Moon
    };
  }

  return planetaryPositions;
}

module.exports = {
  getPlanetaryPositions
};