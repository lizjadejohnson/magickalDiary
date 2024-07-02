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

    // Adjust for cusp
    const nextSignIndex = (signIndex + 1) % 12;
    const nextSign = zodiacSigns[nextSignIndex];
    const cusp = degrees >= 29;

    // Adjust formatting to match desired output
    return `${sign} ${degrees}° ${minutes < 10 ? '0' : ''}${minutes}' ${seconds < 10 ? '0' : ''}${seconds}" ${cusp ? `(${nextSign} cusp)` : ''}`;
}


// Function to calculate the obliquity of the ecliptic for a given AstroTime
function calculateObliquity(astroTime) {
    const T = (astroTime.ut / 36525);
    const epsilon0 = 84381.4060 +
                     T * (-46.836769 +
                     T * (-0.0001831 +
                     T * (0.00200340 +
                     T * (-0.000000576 +
                     T * (-0.0000000434 +
                     T * (0.00000013))))));

    return epsilon0 / 3600;
}


// Function to calculate the Ascendant based on LST and observer's latitude
function calculateAscendant(lst, latitude, obliquity) {
    const lstRad = lst * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;
    const obliquityRad = obliquity * Math.PI / 180;

    const ascendant = Math.atan2(Math.cos(lstRad), -(Math.sin(obliquityRad) * Math.tan(latRad) + Math.cos(obliquityRad) * Math.sin(lstRad)));
    let ascDegrees = ascendant * 180 / Math.PI;
    if (ascDegrees < 0) ascDegrees += 360;

    return ascDegrees;
}


// Function to calculate the Midheaven (MC) based on LST
function calculateMidheaven(lst, obliquity) {
    const lstRad = lst * Math.PI / 180;
    const obliquityRad = obliquity * Math.PI / 180;
    const mcRad = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obliquityRad));
    let mcDegrees = mcRad * 180 / Math.PI;
    if (mcDegrees < 0) mcDegrees += 360;
    return mcDegrees;
}


function calculateIntermediateHouseCusp(mc, asc, fraction, latitude) {
    const radiansLatitude = latitude * Math.PI / 180;
    const radiansMC = mc * Math.PI / 180;
    const radiansASC = asc * Math.PI / 180;

    const tanMC = Math.tan(radiansMC);
    const tanLat = Math.tan(radiansLatitude);

    const term1 = Math.atan(tanMC * Math.sin(radiansLatitude) / Math.cos(radiansLatitude));
    const term2 = Math.atan((Math.tan(radiansASC) - tanLat * Math.sin(radiansMC)) / (Math.cos(radiansMC) * Math.cos(radiansLatitude)));

    const cusp = term1 + fraction * (term2 - term1);

    return (cusp * 180 / Math.PI + 360) % 360;
}

function calculatePlacidusHouses(lstDegrees, latitude, obliquity) {
    const radiansLatitude = latitude * Math.PI / 180;
    const radiansObliquity = obliquity * Math.PI / 180;

    const ascendant = calculateAscendant(lstDegrees, latitude, obliquity);
    const midheaven = calculateMidheaven(lstDegrees, obliquity);

    const houses = Array(12).fill(0);
    houses[0] = ascendant;
    houses[3] = (midheaven + 180) % 360;
    houses[6] = (ascendant + 180) % 360;
    houses[9] = midheaven;

    houses[1] = calculateIntermediateHouseCusp(houses[9], houses[0], 1 / 3, latitude);
    houses[2] = calculateIntermediateHouseCusp(houses[9], houses[0], 2 / 3, latitude);
    houses[10] = calculateIntermediateHouseCusp(houses[0], houses[6], 1 / 3, latitude);
    houses[11] = calculateIntermediateHouseCusp(houses[0], houses[6], 2 / 3, latitude);

    houses[4] = (houses[10] + 180) % 360;
    houses[5] = (houses[11] + 180) % 360;
    houses[7] = (houses[1] + 180) % 360;
    houses[8] = (houses[2] + 180) % 360;

    return houses.map((position, index) => ({
        house: index + 1,
        position: formatZodiacPosition(position)
    }));
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
        console.log(`zone: ${locationOfBirth.zone}`)

        const birthDateTimeUTC = birthDateTime.toUTC().toJSDate();
        console.log(`birthDateTimeUTC: ${birthDateTimeUTC}`)

        const utcDateTime = birthDateTime.toUTC();
        console.log(`utcDateTime: ${utcDateTime}`)


        const observer = { lat: locationOfBirth.lat, lng: locationOfBirth.lng, elevation: 0 };
        console.log(`Latitude: ${observer.lat}`);


        const astroTime = Astronomy.MakeTime(birthDateTimeUTC);
        console.log(`astroTime: ${astroTime}`)


        const gast = Astronomy.SiderealTime(astroTime.date);
        console.log(`GAST: ${gast}`);


        let lst = (gast * 15 + observer.lng) % 360;
        if (lst < 0) lst += 360;
        console.log(`LST before Ascendant calculation: ${lst}`);


        const obliquity = calculateObliquity(astroTime);
        console.log(`Obliquity: ${obliquity}`);


        const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
        const planetaryPositions = {};

        for (const planet of planets) {
            let longitude;
            if (planet === "Sun") {
                const sunPosition = Astronomy.SunPosition(astroTime);
                longitude = sunPosition.elon;
            } else if (planet === "Moon") {
                const moonPosition = Astronomy.GeoMoon(astroTime);
                const eclipticCoordinates = Astronomy.Ecliptic(moonPosition);
                longitude = eclipticCoordinates.elon;
            } else {
                const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], astroTime, true);
                const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
                longitude = eclipticCoordinates.elon;
            }
            const formattedPosition = formatZodiacPosition(longitude);
            planetaryPositions[planet] = { longitude: longitude % 360, formattedPosition: formattedPosition };
        }

        console.log(`LST Degrees: ${lst}`);
        console.log(`Obliquity: ${obliquity}`);
        console.log(`Observer Latitude: ${observer.lat}`);
        console.log(`Observer Longitude: ${observer.lng}`);

        console.log(`UTC Time: ${astroTime.date.toISOString()}`);
        console.log(`Julian Day: ${astroTime.tt}`);

        console.log(`LST in hours: ${lst / 15}`);


        const ascendantDegrees = calculateAscendant(lst, observer.lat, obliquity);
        planetaryPositions["Ascendant"] = { longitude: ascendantDegrees, formattedPosition: formatZodiacPosition(ascendantDegrees) };
        console.log(`Calculated Ascendant: ${ascendantDegrees} / ${formatZodiacPosition(ascendantDegrees)}`);

        const midheavenDegrees = calculateMidheaven(lst, obliquity);
        console.log(`Calculated MidHeaven: ${midheavenDegrees} / ${formatZodiacPosition(midheavenDegrees)}`);
        planetaryPositions["Midheaven"] = { longitude: midheavenDegrees, formattedPosition: formatZodiacPosition(midheavenDegrees) };

        planetaryPositions["Houses"] = calculatePlacidusHouses(lst, observer.lat, obliquity);

        planetaryPositions["Aspects"] = calculateAspects(planetaryPositions);

        return planetaryPositions;
    } catch (error) {
        console.error("Error fetching planetary positions:", error);
        throw error;
    }
}

module.exports = { getPlanetaryPositions };
