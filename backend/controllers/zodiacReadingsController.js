const WesternZodiacSign = require('../models/westernZodiacSign')
const ChineseZodiacSign = require('../models/chineseZodiacSign')
const PlanetarySign = require('../models/planetarySign')
const { getPlanetaryPositions } = require('../config/astroCalc');




const getWesternZodiacByDOB = async (req, res) => {
    try {
        console.log("Fetching Western Zodiac sign for user:", req.user._id);
        const dob = new Date(req.user.dob);  // Ensure this is a Date object
        console.log("DOB received:", dob);

        const zodiacSign = await WesternZodiacSign.determineZodiacSign(dob);

        if (!zodiacSign) {
            console.log("No Zodiac sign found for DOB:", dob);
            return res.status(404).json({ message: "Western Zodiac sign not found" });
        }

        res.json(zodiacSign);

    } catch (error) {
        console.error("Error fetching Western Zodiac sign:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getChineseZodiacByDOB = async (req, res) => {
    try {
        console.log("Fetching Chinese Zodiac reading for user:", req.user.dob);
        const dob = req.user.dob;
        console.log("DOB received:", dob);

        const chineseZodiacSign = await ChineseZodiacSign.determineChineseZodiacSign(dob);

        if (!chineseZodiacSign) {
            console.log("No Zodiac sign found for DOB:", dob);
            return res.status(404).json({ message: "Chinese Zodiac sign not found" });
        }
        
        res.json({ chineseZodiacSign });
    } catch (error) {
        console.error("Error calculating Chinese zodiac:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getEphemerisData = async (req, res) => {
    try {
      const { dob, timeOfBirth, locationOfBirth } = req.user;
      console.log(`Received user data: DOB=${dob}, TimeOfBirth=${timeOfBirth}, Location=${JSON.stringify(locationOfBirth)}`);
      const planets = await getPlanetaryPositions(dob, timeOfBirth, locationOfBirth);
      res.json({ planets });
    } catch (error) {
      console.error(`Error in getEphemerisData: ${error.message}`);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  const getPlanetaryMeaning = async (req, res) => {
    const { planet, sign } = req.query;
    try {
      const planetarySign = await PlanetarySign.findOne({
        planet: { $regex: new RegExp(planet, 'i') },
        sign: { $regex: new RegExp(sign, 'i') }
      });
  
      if (!planetarySign) {
        console.log(`No planetary sign found for planet: ${planet}, sign: ${sign}`); // Log if not found
        return res.status(404).json({ message: 'Planetary sign not found' });
      }
  
      res.json({ meaning: planetarySign.meaning });
    } catch (error) {
      console.error(`Error fetching planetary meaning: ${error.message}`);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


module.exports = {
    getWesternZodiacByDOB,
    getChineseZodiacByDOB,
    getEphemerisData,
    getPlanetaryMeaning
}