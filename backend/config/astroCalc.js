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

    // Adjust formatting to match desired output
    return `${sign} ${degrees}° ${minutes < 10 ? '0' : ''}${minutes}' ${seconds < 10 ? '0' : ''}${seconds}"`;
}

// Function to calculate Local Sidereal Time (LST)
function calculateLST(astroTime, longitude) {
    const gast = Astronomy.SiderealTime(astroTime); // Greenwich Apparent Sidereal Time
    const longitudeInHours = longitude / 15; // Convert longitude to hours
    let lstHours = (gast + longitudeInHours) % 24; // Adjust GAST to local longitude
    if (lstHours < 0) lstHours += 24; // Ensure LST is non-negative
    return lstHours * 15; // Convert hours to degrees for LST
}

// Function to calculate the obliquity of the ecliptic for a given date
function calculateObliquity(year) {
    return 23.439292 - 0.000013 * (year - 2000);
}

// Function to calculate the Ascendant based on LST and observer's latitude
function calculateAscendant(lstDegrees, latitude) {
    const radiansLatitude = latitude * (Math.PI / 180);
    const radiansLST = lstDegrees * (Math.PI / 180);
    const ascendantLongitude = Math.atan2(Math.cos(radiansLST), -Math.sin(radiansLST) * Math.cos(radiansLatitude)) * (180 / Math.PI);
    const normalizedAscendantLongitude = (ascendantLongitude + 360) % 360;
    return formatZodiacPosition(normalizedAscendantLongitude);
}

// Function to calculate the Midheaven / MC based on LST
function calculateMidheaven(lstDegrees, year) {
    const obliquity = calculateObliquity(year);
    const radiansObliquity = obliquity * (Math.PI / 180);
    const lstRadians = lstDegrees * (Math.PI / 180);

    const midheavenRadians = Math.atan(Math.tan(lstRadians) / Math.cos(radiansObliquity));
    let midheavenDegrees = midheavenRadians * (180 / Math.PI);
    if (lstDegrees >= 180) {
        midheavenDegrees += 180;
    }
    midheavenDegrees = (midheavenDegrees + 360) % 360;

    return formatZodiacPosition(midheavenDegrees);
}

// Function to calculate house cusps
function calculateHouseCusps(lstDegrees) {
    const houses = [];
    const houseStartOffsets = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    for (let i = 0; i < 12; i++) {
        let cuspLongitude = (lstDegrees + houseStartOffsets[i]) % 360;
        houses.push({
            house: i + 1,
            position: formatZodiacPosition(cuspLongitude)
        });
    }
    return houses;
}

// Function to calculate aspects between planets
function calculateAspects(planets) {
    const aspects = [];
    const aspectTypes = [
        { name: "Conjunction", angle: 0 },
        { name: "Opposition", angle: 180 },
        { name: "Square", angle: 90 },
        { name: "Trine", angle: 120 },
        { name: "Sextile", angle: 60 }
    ];
    const orb = 8;
    const planetKeys = Object.keys(planets);
    for (let i = 0; i < planetKeys.length; i++) {
        for (let j = i + 1; j < planetKeys.length; j++) {
            const planet1 = planetKeys[i];
            const planet2 = planetKeys[j];
            const pos1 = planets[planet1].longitude;
            const pos2 = planets[planet2].longitude;
            const angle = Math.abs(pos1 - pos2);
            for (const aspect of aspectTypes) {
                if (Math.abs(angle - aspect.angle) <= orb || Math.abs(360 - angle - aspect.angle) <= orb) {
                    aspects.push({
                        planet1,
                        planet2,
                        aspect: aspect.name,
                        angle: angle.toFixed(2)
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
        const birthDateTimeUTC = birthDateTime.toUTC().toJSDate();

        const observer = {
            lat: locationOfBirth.lat,
            lng: locationOfBirth.lng,
            elevation: 0
        };

        const astroTime = new Astronomy.AstroTime(birthDateTimeUTC);
        const lstDegrees = calculateLST(astroTime, observer.lng);

        const year = birthDateTime.year;

        // Calculate Ascendant and Midheaven based on LST and observer's latitude
        const ascendantPosition = calculateAscendant(lstDegrees, observer.lat);
        const midHeavenPosition = calculateMidheaven(lstDegrees, year);

        const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
        const planetaryPositions = {};

        for (const planet of planets) {
            let longitude;
            if (planet === "Sun") {
                const earthVector = Astronomy.HelioVector(Astronomy.Body.Earth, birthDateTimeUTC);
                const eclipticCoordinates = Astronomy.Ecliptic(earthVector);
                longitude = (eclipticCoordinates.elon + 180) % 360;
            } else {
                const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], birthDateTimeUTC, true);
                const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
                longitude = eclipticCoordinates.elon;
            }

            let speed;
            if (planet === "Moon") {
                const futureDateTime = new Date(birthDateTimeUTC.getTime() + 1 * 24 * 3600 * 1000);
                const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
                const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
                const futureLongitude = futureEclipticCoordinates.elon;
                speed = (futureLongitude - longitude + 360) % 360;
            } else {
                const futureDateTime = new Date(birthDateTimeUTC.getTime() + 30 * 24 * 3600 * 1000);
                const futureGeoVector = Astronomy.GeoVector(Astronomy.Body[planet], futureDateTime, true);
                const futureEclipticCoordinates = Astronomy.Ecliptic(futureGeoVector);
                const futureLongitude = futureEclipticCoordinates.elon;
                speed = ((futureLongitude - longitude + 360) % 360) / (30 * 24);
            }

            const formattedPosition = formatZodiacPosition(longitude);
            planetaryPositions[planet] = {
                longitude: longitude % 360, // Ensure longitude is within 0° to 360° range
                speed: planet === "Moon" ? `${speed.toFixed(4)}°/day` : `${(speed * 24).toFixed(4)}°/hr`,
                formattedPosition: formattedPosition
            };

            console.log(`${planet}: ${formattedPosition}, Speed: ${planetaryPositions[planet].speed}`);
        }

        // Calculate and format Ascendant and Midheaven positions
        planetaryPositions["Ascendant"] = {
            formattedPosition: ascendantPosition
        };

        planetaryPositions["Midheaven"] = {
            formattedPosition: midHeavenPosition
        };

        // Calculate and format house cusps
        planetaryPositions["Houses"] = calculateHouseCusps(lstDegrees);

        // Calculate and format aspects between planets
        planetaryPositions["Aspects"] = calculateAspects(planetaryPositions);

        return planetaryPositions;

    } catch (error) {
        console.error("Error fetching planetary positions:", error);
        throw error;
    }
}

module.exports = {
    getPlanetaryPositions
};
