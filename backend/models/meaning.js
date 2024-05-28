const mongoose = require("mongoose")
const meaningSchema = new mongoose.Schema({
//This is the typical naming convention. Because we're in our meaning file its meaningSchema. If it were a 
//file called todo we might call it todoSchema, etc.

    type: { type: String, required: true }, //Specifies the category ("Zodiac", "Iching", "Tarot" etc.)
    name: { type: String, required: true }, //Name of the sign/hexagram/tarot card etc.
    description: String, //General meaning/description
    image: String, //path to an image file if applicable.
    
    //Additional attributes relevant to the type (e.g., planet alignments for zodiac, lines for iching).
    hexagramAttributes: {
        lines: [String], // The lines that make up the basic hexagram structure
    	number: Number,
    	nicknames: [String],
    	above: String,
    	below: String,
    	judgment: String,
    	hexagramImage: String,
    	commentary: String,
        changingLines: {
            changingLine1: String, // Meanings for each changing line in the hexagram
            changingLine2: String,
            changingLine3: String,
            changingLine4: String,
            changingLine5: String,
            changingLine6: String,
        }

    }  // Additional attributes relevant to the type
});




const Meaning = mongoose.model("Meaning", meaningSchema)

module.exports = Meaning
