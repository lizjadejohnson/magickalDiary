const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

// Function to format zodiac position based on degree
function formatZodiacPosition(degree) {
    const zodiacSigns = ["Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"];
    const signIndex = Math.floor(degree / 30);
    const sign = zodiacSigns[signIndex];
    const inSignDegree = degree % 30;
    const degrees = Math.floor(inSignDegree);
    const minutes = Math.floor((inSignDegree - degrees) * 60);
    const seconds = Math.round((((inSignDegree - degrees) * 60) - minutes) * 60); // Round seconds to the nearest whole number
    return `${sign} ${degrees}° ${minutes}' ${seconds}"`;
}

// Function to calculate Local Sidereal Time (LST)
function calculateLST(birthDateTime, longitude) {
    const gast = Astronomy.SiderealTime(birthDateTime);  // Gets the Greenwich Apparent Sidereal Time
    const longitudeInHours = longitude / 15;  // Converts longitude to hours
    let lstHours = (gast + longitudeInHours) % 24;  // Adjusts GAST to local longitude
    const lstDegrees = lstHours * 15;  // Converts hours to degrees
    return lstDegrees;  // Returns LST in degrees
}

// Function to calculate the Ascendant based on LST and observer's latitude
function calculateAscendant(lstDegrees, latitude) {
  const zodiacSigns = ["Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"];
    
    // Calculate Ascendant longitude
    let ascendantLongitude = lstDegrees + 90; // Adjust for Ascendant offset
    if (ascendantLongitude >= 360) {
        ascendantLongitude -= 360;
    }

    // Calculate Ascendant sign and degree within the sign
    const ascendantSignIndex = Math.floor(ascendantLongitude / 30);
    const ascendantSign = zodiacSigns[ascendantSignIndex];
    const inSignDegree = ascendantLongitude % 30;
    const degrees = Math.floor(inSignDegree);
    const minutes = Math.floor((inSignDegree - degrees) * 60);
    const seconds = Math.round((((inSignDegree - degrees) * 60) - minutes) * 60); // Round seconds to the nearest whole number

    // Ensure rounding is accurate
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    if (minutes === 60) {
        minutes = 0;
        degrees += 1;
    }

    return `${ascendantSign} ${degrees}° ${minutes < 10 ? '0' : ''}${minutes}' ${seconds < 10 ? '0' : ''}${seconds}"`;
}

// Async function to fetch planetary positions
async function getPlanetaryPositions(dob, timeOfBirth, locationOfBirth) {
    try {
        const birthDateTime = DateTime.fromISO(`${dob}T${timeOfBirth}:00`, { zone: locationOfBirth.zone }).toUTC().toJSDate();
        const observer = {
            lat: locationOfBirth.lat,
            lng: locationOfBirth.lng,
            elevation: 0 // assuming elevation is 0 for simplicity
        };

        const lstDegrees = calculateLST(birthDateTime, observer.lng);
        const ascendantPosition = calculateAscendant(lstDegrees, observer.lat);

        console.log(`Birth DateTime (UTC): ${birthDateTime}`);
        console.log(`Local Sidereal Time (degrees): ${lstDegrees}`);
        console.log(`Calculated Ascendant Position: ${ascendantPosition}`);

        // Array of planets to calculate positions for
        const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
        const planetaryPositions = {};

        // Iterate through each planet and calculate its position
        for (const planet of planets) {
            let longitude;

            if (planet === "Sun") {
                // Calculate heliocentric longitude for Sun
                const earthVector = Astronomy.HelioVector(Astronomy.Body.Earth, birthDateTime);
                const eclipticCoordinates = Astronomy.Ecliptic(earthVector);
                longitude = (eclipticCoordinates.elon + 180) % 360; // Adjust for heliocentric perspective
            } else {
                // Calculate geocentric longitude for other planets and Moon
                const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], birthDateTime, true);
                const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
                longitude = eclipticCoordinates.elon;
            }

            let speed;
            if (planet === "Moon") {
                // Calculate Moon's speed in degrees per day
                const futureDateTime = new Date(birthDateTime.getTime() + 1 * 24 * 3600 * 1000); // One day later
                const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
                const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
                const futureLongitude = futureEclipticCoordinates.elon;
                speed = (futureLongitude - longitude + 360) % 360; // Speed in degrees per day for the Moon
            } else {
                // Calculate other planets' speed in degrees per hour
                const futureDateTime = new Date(birthDateTime.getTime() + 30 * 24 * 3600 * 1000); // One month later
                const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
                const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
                const futureLongitude = futureEclipticCoordinates.elon;
                speed = ((futureLongitude - longitude + 360) % 360) / (30 * 24); // Speed in degrees per hour for other planets
            }

            // Format position and speed
            const formattedPosition = formatZodiacPosition(longitude);
            planetaryPositions[planet] = {
                longitude: longitude % 360, // Ensure longitude is within 0 to 360 degrees
                speed: planet === "Moon" ? `${speed.toFixed(4)}°/day` : `${(speed * 24).toFixed(4)}°/hr`,
                formattedPosition: formattedPosition
            };

            console.log(`${planet}: ${formattedPosition}, Speed: ${planetaryPositions[planet].speed}`);
        }

        planetaryPositions["Ascendant"] = {
            formattedPosition: ascendantPosition
        };

        console.log(`Ascendant: ${ascendantPosition}`);

        // Return object with planetary positions including Ascendant
        return planetaryPositions;
    } catch (error) {
        console.error("Error fetching planetary positions:", error);
        throw error;
    }
}

// Example usage
getPlanetaryPositions("1989-01-31", "08:59", { lat: 44.9597376, lng: -93.3702186, zone: "America/Chicago" })
    .then(positions => console.log(positions))
    .catch(error => console.error(error));

module.exports = {
    getPlanetaryPositions
};
