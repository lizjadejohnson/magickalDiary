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

// Function to calculate the house cusps using the Placidus system
function calculatePlacidusHouses(ascendantDegrees, midheavenDegrees, observerLat, obliquity, ramc) {
    const houses = new Array(12);
    const latRad = observerLat * Math.PI / 180;
    const obliquityRad = obliquity * Math.PI / 180;

    // Step 1: Set MC and ASC
    houses[9] = midheavenDegrees;
    houses[0] = ascendantDegrees;

    // Step 2: Determine house cusp intervals
    const H11 = (ramc + 30) % 360;
    const H12 = (ramc + 60) % 360;
    const H2 = (ramc + 120) % 360;
    const H3 = (ramc + 150) % 360;

    // Step 3: Set Semi-arc ratios
    const F11 = 1 / 3;
    const F12 = 2 / 3;
    const F2 = 2 / 3;
    const F3 = 1 / 3;

    function computeCusp(H, F, latRad, obliquityRad) {
        let D = Math.asin(Math.sin(obliquityRad) * Math.sin(H * Math.PI / 180)) * 180 / Math.PI;
        let R = 0;
        
        for (let i = 0; i < 10; i++) {  // Iterative refinement
            const A = F * Math.asin(Math.tan(latRad) * Math.tan(D * Math.PI / 180));
            const M = Math.atan2(Math.sin(A), Math.cos(H * Math.PI / 180) * Math.tan(D * Math.PI / 180));
            R = Math.atan2(Math.tan(H * Math.PI / 180) * Math.cos(M), Math.cos(M + obliquityRad)) * 180 / Math.PI;
            
            const newD = Math.asin(Math.sin(obliquityRad) * Math.sin(R * Math.PI / 180)) * 180 / Math.PI;
            
            if (Math.abs(newD - D) < 0.0001) break;  // Convergence check
            D = newD;
        }

        return (R + 360) % 360;  // Ensure positive value
    }

    // Compute intermediate house cusps
    houses[10] = computeCusp(H11, F11, latRad, obliquityRad);
    houses[11] = computeCusp(H12, F12, latRad, obliquityRad);
    houses[1] = computeCusp(H2, F2, latRad, obliquityRad);
    houses[2] = computeCusp(H3, F3, latRad, obliquityRad);

    // Compute opposite cusps
    houses[4] = (houses[10] + 180) % 360;
    houses[5] = (houses[11] + 180) % 360;
    houses[6] = (houses[0] + 180) % 360;
    houses[7] = (houses[1] + 180) % 360;
    houses[8] = (houses[2] + 180) % 360;
    houses[3] = (houses[9] + 180) % 360;

    // Format the house positions
    return houses.map((position, index) => ({
        house: index + 1,
        position: formatZodiacPosition(position)
    }));
}

// Function to calculate aspects between planets
function calculateAspects(planets) {
    const aspects = [];
    const aspectTypes = [
        { name: "Conjunction", symbol: "☌", angle: 0 },
        { name: "Opposition", symbol: "☍", angle: 180 },
        { name: "Square", symbol: "◻", angle: 90 },
        { name: "Trine", symbol: "△", angle: 120 },
        { name: "Sextile", symbol: "🞶", angle: 60 }
    ];
    const orb = 8;
    const planetKeys = Object.keys(planets);

    function formatOrb(degrees) {
        const wholeDegrees = Math.floor(Math.abs(degrees));
        const minutes = Math.round((Math.abs(degrees) - wholeDegrees) * 60);
        return `${wholeDegrees}° ${minutes < 10 ? '0' : ''}${minutes}'`;
    }

    for (let i = 0; i < planetKeys.length; i++) {
        for (let j = i + 1; j < planetKeys.length; j++) {
            const planet1 = planetKeys[i];
            const planet2 = planetKeys[j];
            const pos1 = planets[planet1].longitude;
            const pos2 = planets[planet2].longitude;
            let angle = (pos2 - pos1 + 360) % 360;
            if (angle > 180) angle = 360 - angle;

            for (const aspect of aspectTypes) {
                if (Math.abs(angle - aspect.angle) <= orb) {
                    const orbValue = angle - aspect.angle;
                    let value = pos2 - pos1;
                    if (value > 180) value -= 360;
                    if (value <= -180) value += 360;
                    
                    // Adjust value based on aspect type
                    if (aspect.angle === 180) value = -value; // For opposition
                    if (aspect.angle === 90 && value > 0) value = -value; // For square
                    
                    aspects.push({
                        planet1,
                        aspect: aspect.name,
                        aspectSymbol: aspect.symbol,
                        planet2,
                        orb: formatOrb(Math.abs(orbValue)),
                    });
                }
            }
        }
    }
    return aspects;
}

function calculateMeanLilith(astroTime) {
    const periods = 3000; // Number of days to average over a year
    const interval = 3; // Interval of 1 day

    let sumLongitude = 0;

    for (let i = 0; i < periods; i++) {
        let timeOffset = astroTime.AddDays(-i * interval);
        let apsis = Astronomy.SearchLunarApsis(timeOffset);
        while (apsis.kind !== Astronomy.ApsisKind.Apocenter) {
            apsis = Astronomy.NextLunarApsis(apsis);
        }
        const moonPosition = Astronomy.GeoMoon(apsis.time);
        const eclipticCoordinates = Astronomy.Ecliptic(moonPosition);
        let longitude = eclipticCoordinates.elon;
        if (longitude < 0) longitude += 360;

        sumLongitude += longitude;
    }

    const meanLongitude = sumLongitude / periods;
    return meanLongitude;
}

// Async function to fetch planetary positions
async function getPlanetaryPositions(dob, timeOfBirth, locationOfBirth) {
    try {
        const birthDateTime = DateTime.fromISO(`${dob}T${timeOfBirth}:00`, { zone: locationOfBirth.zone });
        console.log(`birthDateTime: ${birthDateTime}`);
        console.log(`zone: ${locationOfBirth.zone}`);

        const birthDateTimeUTC = birthDateTime.toUTC().toJSDate();
        console.log(`birthDateTimeUTC: ${birthDateTimeUTC}`);

        const observer = { lat: locationOfBirth.lat, lng: locationOfBirth.lng, elevation: 0 };
        console.log(`Latitude: ${observer.lat}`);
        console.log(`Longitude: ${observer.lng}`);

        const astroTime = Astronomy.MakeTime(birthDateTimeUTC);
        console.log(`astroTime: ${astroTime}`);

        const julianDay = astroTime.tt;
        console.log(`Julian Day: ${julianDay}`);

        const gast = Astronomy.SiderealTime(astroTime.date);
        console.log(`GAST: ${gast}`);

        let lst = (gast * 15 + observer.lng) % 360;
        if (lst < 0) lst += 360;
        console.log(`LST before Ascendant calculation: ${lst}`);
        console.log(`LST in hours: ${lst / 15}`);

        const obliquity = calculateObliquity(astroTime);
        console.log(`Obliquity: ${obliquity}`);

        const ramc = lst;  // RAMC is the same as LST in degrees
        console.log(`RAMC: ${ramc}`);

        const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Lilith", "N Node"];
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
            } else if (planet === "Lilith") {
                longitude = calculateMeanLilith(astroTime)

            } else if (planet === "N Node") {
                const nodeEvent = Astronomy.SearchMoonNode(astroTime);
                const nodeTime = Astronomy.MakeTime(nodeEvent.time.date);
                const moonPosition = Astronomy.GeoMoon(nodeTime);
                const eclipticCoordinates = Astronomy.Ecliptic(moonPosition);
                longitude = eclipticCoordinates.elon;

            } else {
                const geoVector = Astronomy.GeoVector(Astronomy.Body[planet], astroTime, true);
                if (!geoVector) throw new Error(`Failed to get GeoVector for ${planet}`);
                const eclipticCoordinates = Astronomy.Ecliptic(geoVector);
                if (isNaN(eclipticCoordinates.elon)) throw new Error(`Invalid ecliptic coordinates for ${planet}`);
                longitude = eclipticCoordinates.elon;
            }
            const formattedPosition = formatZodiacPosition(longitude);
            planetaryPositions[planet] = { longitude: longitude % 360, formattedPosition: formattedPosition };
        }

        const ascendantDegrees = calculateAscendant(lst, observer.lat, obliquity);
        planetaryPositions["Ascendant"] = { longitude: ascendantDegrees, formattedPosition: formatZodiacPosition(ascendantDegrees) };
        console.log(`Calculated Ascendant: ${ascendantDegrees} / ${formatZodiacPosition(ascendantDegrees)}`);

        const midheavenDegrees = calculateMidheaven(lst, obliquity);
        console.log(`Calculated MidHeaven: ${midheavenDegrees} / ${formatZodiacPosition(midheavenDegrees)}`);
        planetaryPositions["Midheaven"] = { longitude: midheavenDegrees, formattedPosition: formatZodiacPosition(midheavenDegrees) };

        planetaryPositions["Houses"] = calculatePlacidusHouses(ascendantDegrees, midheavenDegrees, observer.lat, obliquity, ramc);

        planetaryPositions["Aspects"] = calculateAspects(planetaryPositions);
        return planetaryPositions;
    } catch (error) {
        console.error("Error fetching planetary positions:", error);
        throw error;
    }
}

module.exports = { getPlanetaryPositions };
