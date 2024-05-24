const mongoose = require("mongoose")
const meaningSchema = new mongoose.Schema({
//This is the typical naming convention. Because we're in our meaning file its meaningSchema. If it were a 
//file called todo we might call it todoSchema, etc.

    type: String, //Specifies the category ("Zodiac", "Iching", "Tarot" etc.)
    name: String, //Name of the sign/hexagram/tarot card etc.
    description: String, //Detailed meaning/description
    image: String, //path to an image file if applicable.
    attributes: { }  //Additional attributes relevant to the type (e.g., planet alignments for zodiac, lines for iching).
});




const Meaning = mongoose.model("Meaning", meaningSchema)

module.exports = Meaning
