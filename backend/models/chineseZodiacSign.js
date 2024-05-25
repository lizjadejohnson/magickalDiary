const mongoose = require('mongoose');

const chineseZodiacSignSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    element: { type: String, required: true },
    traits: [{ type: String }],
    compatibility: [{ type: String }]
}, { collection: 'chineseZodiacSigns' });

chineseZodiacSignSchema.statics.determineChineseZodiacSign = async function(dob) {
    //Reformat DOB
    const birthYear = new Date(dob).getFullYear();

    //Determine sign based on birth year:
    const zodiacStartYear = 1924; // Only going as far back as 1924. Rat starts off the cycle in 1924! 🐀
    const animals = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];
    
    const yearDiff = birthYear - zodiacStartYear;
    const animalIndex = yearDiff % 12;

    const zodiacSignName = animals[animalIndex]; //Set sign based on the above definitions

    // Find the matching zodiac sign from the database:
    const zodiacSign = await this.findOne({
        name: zodiacSignName
    });

    if (!zodiacSign) {
        throw new Error('Chinese Zodiac sign not found');
    }

    return zodiacSign;
};

const ChineseZodiacSign = mongoose.model('ChineseZodiacSign', chineseZodiacSignSchema);

module.exports = ChineseZodiacSign;
