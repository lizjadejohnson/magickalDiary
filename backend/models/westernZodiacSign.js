const mongoose = require("mongoose")

const westernZodiacSignSchema = new mongoose.Schema({
    "name": String,
    "startDate": String,
    "endDate": String,
    "element": String,
    "quality": String,
    "rulingPlanet": String,
    "symbol": String,
    "traits": [String],
    "compatibility": [String]
}, { collection: 'westernZodiacSigns' });


// Static method to determine the Western Zodiac sign based on DOB
westernZodiacSignSchema.statics.determineZodiacSign = async function(dob) {
    console.log("DOB received:", dob);
    
    // Ensure dob is a Date object
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date format");
    }

    // Extract the month and day from the birthDate
    const month = String(birthDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(birthDate.getUTCDate()).padStart(2, '0');
    const birthDateString = `${month}-${day}`;
    console.log("Formatted birthDateString:", birthDateString);

    // Find the zodiac sign where the birthDateString falls between the startDate and endDate
    const zodiacSigns = await this.find({});
    const zodiacSign = zodiacSigns.find(sign => {
        const { startDate, endDate } = sign;
        if (startDate <= birthDateString && birthDateString <= endDate) {
            return true;
        }
        // Handle cases where the zodiac sign period spans the end of one year and the beginning of the next
        if (startDate > endDate) {
            return birthDateString >= startDate || birthDateString <= endDate;
        }
        return false;
    });

    console.log("Zodiac sign found:", zodiacSign);
    return zodiacSign;
};



const WesternZodiacSign = mongoose.model('WesternZodiacSign', westernZodiacSignSchema);

module.exports = WesternZodiacSign;