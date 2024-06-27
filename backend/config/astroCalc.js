const { DateTime } = require('luxon');
const Astronomy = require('astronomy-engine');

// Function to format zodiac position based on degree
function formatZodiacPosition(degree) {
    const zodiacSigns = ["Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"];
    const signIndex = Math.floor(degree / 30);
    const sign = zodiacSigns[signIndex];
    const inSignDegree = degree % 30;
    const degrees = Math.floor(inSignDegree);
    const minutesDecimal = (inSignDegree - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);
    return `${sign} ${degrees}° ${minutes < 10 ? '0' : ''}${minutes}' ${seconds < 10 ? '0' : ''}${seconds}"`;
}

// Function to calculate Local Sidereal Time (LST)
function calculateLST(astroTime, longitude) {
    const gst = Astronomy.SiderealTime(astroTime); // Greenwich Sidereal Time in hours
    console.log(`gst: ${gst}`)
    const longitudeInHours = longitude / 15; // Convert longitude to hours
    let lstHours = (gst + longitudeInHours) % 24; // Adjust GST to local longitude
    if (lstHours < 0) lstHours += 24; // Ensure LST is non-negative
    console.log(lstHours)
    return lstHours * 15; // Convert hours to degrees for LST
}

// Function to calculate the obliquity of the ecliptic for a given Julian Date
function calculateObliquity(julianDate) {
    const t = (julianDate - 2451545.0) / 36525;
    return 23.439292 - 0.0130042 * t - 0.00000016 * t * t + 0.000000504 * t * t * t;
}

// Function to calculate the Ascendant based on LST and observer's latitude
function calculateAscendant(lstDegrees, latitude) {
    const radiansLatitude = latitude * (Math.PI / 180);
    const radiansLST = lstDegrees * (Math.PI / 180);
    const ascendantLongitude = Math.atan2(Math.cos(radiansLST), -Math.sin(radiansLST) * Math.cos(radiansLatitude)) * (180 / Math.PI);
    return (ascendantLongitude + 360) % 360;
}

// Function to calculate the Midheaven (MC) based on LST
function calculateMidheaven(lstDegrees, obliquity) {
    const radiansObliquity = obliquity * (Math.PI / 180);
    const lstRadians = lstDegrees * (Math.PI / 180);
    const midheavenRadians = Math.atan(Math.tan(lstRadians) / Math.cos(radiansObliquity));
    let midheavenDegrees = midheavenRadians * (180 / Math.PI);
    if (lstDegrees >= 180) {
        midheavenDegrees += 180;
    }
    return (midheavenDegrees + 360) % 360;
}

// Helper function to calculate house cusps using Placidus method
function calculatePlacidusHouses(lstDegrees, latitude, obliquity) {
    const houses = [];
    const radiansLatitude = latitude * (Math.PI / 180);
    const radiansLST = lstDegrees * (Math.PI / 180);
    const radiansObliquity = obliquity * (Math.PI / 180);

    const ascendantLongitude = calculateAscendant(lstDegrees, latitude);
    const midheavenDegrees = calculateMidheaven(lstDegrees, obliquity);

    function calculateIntermediateHouseCusps(angle) {
        const houseCusps = [];
        for (let i = 1; i <= 6; i++) {
            const intermediateAngle = angle + (i * 30);
            const intermediateRadians = intermediateAngle * (Math.PI / 180);
            const intermediateLongitude = Math.atan2(Math.sin(intermediateRadians), Math.cos(intermediateRadians) * Math.sin(radiansObliquity) + Math.tan(radiansLatitude) * Math.cos(radiansObliquity)) * (180 / Math.PI);
            houseCusps.push((intermediateLongitude + 360) % 360);
        }
        return houseCusps;
    }

    const intermediateCusps = calculateIntermediateHouseCusps(radiansLST);
    houses.push({ house: 1, position: formatZodiacPosition(ascendantLongitude) });
    houses.push({ house: 2, position: formatZodiacPosition(intermediateCusps[0]) });
    houses.push({ house: 3, position: formatZodiacPosition(intermediateCusps[1]) });
    houses.push({ house: 4, position: formatZodiacPosition(midheavenDegrees) });
    houses.push({ house: 5, position: formatZodiacPosition(intermediateCusps[2]) });
    houses.push({ house: 6, position: formatZodiacPosition(intermediateCusps[3]) });
    houses.push({ house: 7, position: formatZodiacPosition((ascendantLongitude + 180) % 360) });
    houses.push({ house: 8, position: formatZodiacPosition(intermediateCusps[4]) });
    houses.push({ house: 9, position: formatZodiacPosition(intermediateCusps[5]) });
    houses.push({ house: 10, position: formatZodiacPosition(midheavenDegrees) });
    houses.push({ house: 11, position: formatZodiacPosition((midheavenDegrees + 30) % 360) });
    houses.push({ house: 12, position: formatZodiacPosition((midheavenDegrees + 60) % 360) });
    return houses;
}

// Function to calculate aspects between planets
function calculateAspects(planets) {
    const aspects = [];
    const aspectTypes = [
        { name: "Conjunction ☌", angle: 0 },
        { name: "Opposition ☍", angle: 180 },
        { name: "Square ◻", angle: 90 },
        { name: "Trine △", angle: 120 },
        { name: "Sextile 🞶", angle: 60 }
    ];
    const orb = 8;
    const planetKeys = Object.keys(planets);

    // Helper function to format degrees, minutes, and seconds
    function formatDegreesMinutes(degrees) {
        let deg = Math.floor(degrees);
        let minDecimal = (degrees - deg) * 60;
        let min = Math.floor(minDecimal);
        let sec = Math.round((minDecimal - min) * 60);
        return `${deg}° ${min < 10 ? '0' : ''}${min}' ${sec < 10 ? '0' : ''}${sec}"`;
    }

    for (let i = 0; i < planetKeys.length; i++) {
        for (let j = i + 1; j < planetKeys.length; j++) {
            const planet1 = planetKeys[i];
            const planet2 = planetKeys[j];
            const pos1 = planets[planet1].longitude;
            const pos2 = planets[planet2].longitude;
            const angle = Math.abs(pos1 - pos2);
            for (const aspect of aspectTypes) {
                if (Math.abs(angle - aspect.angle) <= orb || Math.abs(360 - angle - aspect.angle) <= orb) {
                    const aspectAngle = formatDegreesMinutes(angle);
                    const orbValue = Math.abs(angle - aspect.angle).toFixed(2);
                    const minuteValue = Math.floor(orbValue * 60);
                    const value = (pos1 - pos2).toFixed(2); // Calculate the difference in degrees for value
                    aspects.push({
                        planet1,
                        planet2,
                        aspect: aspect.name,
                        angle: aspectAngle,
                        orb: `${orbValue}°`,
                        minute: `${minuteValue}'`,
                        value: value
                    });
                }
            }
        }
    }
    return aspects;
}

// Async function to fetch planetary positions
async function getPlanetaryPositions(dob, timeOfBirth, locationOfBirth) {
    try {
        const birthDateTime = DateTime.fromISO(`${dob}T${timeOfBirth}:00`, { zone: locationOfBirth.zone });
        console.log(`birthDateTime: ${birthDateTime}`)
        const birthDateTimeUTC = birthDateTime.toUTC().toJSDate();
        console.log(`birthDateTimeUTC: ${birthDateTimeUTC}`)
        const observer = { lat: locationOfBirth.lat, lng: locationOfBirth.lng, elevation: 0 };

        const astroTime = new Astronomy.AstroTime(birthDateTimeUTC);
        console.log(`astroTime: ${astroTime}`)
        const julianDate = astroTime.ut + 2451545.0;
        console.log(`julianDate: ${julianDate}`)

        const lstDegrees = calculateLST(birthDateTimeUTC, observer.lng);
        console.log(`LST Degrees: ${lstDegrees}`);
        
        const obliquity = calculateObliquity(julianDate);
        console.log(`Obliquity: ${obliquity}`);

        const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
        const planetaryPositions = {};

        for (const planet of planets) {
            let longitude;
            if (planet === "Sun") {
                const sunPosition = Astronomy.SunPosition(birthDateTimeUTC);
                longitude = sunPosition.elon;
            } else if (planet === "Moon") {
                const moonPosition = Astronomy.GeoMoon(birthDateTimeUTC);
                const eclipticCoordinates = Astronomy.Ecliptic(moonPosition);
                longitude = eclipticCoordinates.elon;
            } else {
                const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], birthDateTimeUTC, true);
                const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
                longitude = eclipticCoordinates.elon;
            }
            const formattedPosition = formatZodiacPosition(longitude);
            planetaryPositions[planet] = { longitude: longitude % 360, formattedPosition: formattedPosition };
            console.log(`${planet}: ${formattedPosition}`);
        }

        const ascendantDegrees = calculateAscendant(lstDegrees, observer.lat);
        planetaryPositions["Ascendant"] = { formattedPosition: formatZodiacPosition(ascendantDegrees) };

        const midheavenDegrees = calculateMidheaven(lstDegrees, obliquity);
        planetaryPositions["Midheaven"] = { formattedPosition: formatZodiacPosition(midheavenDegrees) };

        planetaryPositions["Houses"] = calculatePlacidusHouses(lstDegrees, observer.lat, obliquity);

        planetaryPositions["Aspects"] = calculateAspects(planetaryPositions);

        return planetaryPositions;
    } catch (error) {
        console.error("Error fetching planetary positions:", error);
        throw error;
    }
}

module.exports = { getPlanetaryPositions };
