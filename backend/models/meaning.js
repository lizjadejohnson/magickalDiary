const mongoose = require("mongoose")

const meaningSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    image: String,
    
    hexagramAttributes: {
        lines: [String],
        number: Number,
        nicknames: [String],
        above: String,
        below: String,
        judgment: String,
        hexagramImage: String,
        commentary: String,
        changingLines: {
            changingLine1: String,
            changingLine2: String,
            changingLine3: String,
            changingLine4: String,
            changingLine5: String,
            changingLine6: String,
        }
    },

    //TAROT
    tarotAttributes: {
        suit: String, // "Cups", "Wands", "Swords", "Pentacles", or null for Major Arcana
        arcana: String, // "Major" or "Minor"
        number: Number, // Card number (0-21 for Major, 1-14 for Minor)
        astrology: String, //Astrological correspondence
        element: String, //Elemental correspondence
        uprightkeywords: [String], // Keywords associated with the upright card
        reversedkeywords: [String], // Keywords associated with the reversed card
        uprightMeaning: String, // Detailed upright interpretation
        reversedMeaning: String, // Detailed reversed interpretation
    }
});

const Meaning = mongoose.model("Meaning", meaningSchema)
module.exports = Meaning