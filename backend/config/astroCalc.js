const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

function formatZodiacPosition(degree) {
  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const signIndex = Math.floor(degree / 30);
  const sign = zodiacSigns[signIndex];
  const inSignDegree = degree % 30;
  const degrees = Math.floor(inSignDegree);
  const minutes = Math.floor((inSignDegree - degrees) * 60);
  const seconds = Math.floor((((inSignDegree - degrees) * 60) - minutes) * 60);
  return `${sign}, ${degrees}°${minutes}'${seconds}"`;
}


async function getPlanetaryPositions(dob, timeOfBirth, locationOfBirth) {
  try {
    const birthDateTime = DateTime.fromISO(`${dob}T${timeOfBirth}:00`, { zone: locationOfBirth.zone }).toUTC().toJSDate();
    const observer = new Astronomy.Observer(locationOfBirth.lat, locationOfBirth.lng, 0);

    const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
    const planetaryPositions = {};

    for (const planet of planets) {
      let longitude;

      if (planet === "Sun") {
        const earthVector = Astronomy.HelioVector(Astronomy.Body.Earth, birthDateTime);
        const eclipticCoordinates = Astronomy.Ecliptic(earthVector);
        longitude = (eclipticCoordinates.elon + 180) % 360; // Adjust for heliocentric perspective
      } else {
        const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], birthDateTime, true);
        const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
        longitude = eclipticCoordinates.elon;
      }

      let speed;
      if (planet === "Moon") {
        const futureDateTime = new Date(birthDateTime.getTime() + 1 * 24 * 3600 * 1000); // One day later
        const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
        const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
        const futureLongitude = futureEclipticCoordinates.elon;
        speed = (futureLongitude - longitude + 360) % 360; // Speed in degrees per day for the Moon
      } else {
        const futureDateTime = new Date(birthDateTime.getTime() + 30 * 24 * 3600 * 1000); // One month later
        const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
        const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
        const futureLongitude = futureEclipticCoordinates.elon;
        speed = ((futureLongitude - longitude + 360) % 360) / (30 * 24); // Speed in degrees per hour for other planets
      }

      const formattedPosition = formatZodiacPosition(longitude);

      planetaryPositions[planet] = {
        longitude: longitude % 360, // Ensure longitude is within 0 to 360 degrees
        speed: planet === "Moon" ? `${speed.toFixed(4)}°/day` : `${(speed * 24).toFixed(4)}°/hr`, // Speed per hour for others, per day for Moon
        formattedPosition: formattedPosition
      };

      console.log(`${planet}: ${formattedPosition}, Speed: ${planetaryPositions[planet].speed}`);
    }

    return planetaryPositions;
  } catch (error) {
    console.error("Error fetching planetary positions:", error);
    throw error;
  }
}

module.exports = {
  getPlanetaryPositions
};
//ACTUALLY WORKING!!!!!!!!!