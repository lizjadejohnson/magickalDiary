const mongoose = require('mongoose');

// Define the schema
const planetarySignSchema = new mongoose.Schema({
    sign: { type: String, required: true },
    planet: { type: String, required: true },
    meaning: { type: String, required: true }
}, { collection: 'planetarySigns' }); // Specify the collection name explicitly

// Define the static method
planetarySignSchema.statics.determineSignAndPlanet = async function(sign, planet) {
    const signAndPlanet = await this.findOne({ sign, planet });

    if (!signAndPlanet) {
        throw new Error('Sign and planet combination not found');
    }

    return signAndPlanet.meaning;
};

// Create the model
const PlanetarySign = mongoose.model("PlanetarySign", planetarySignSchema);

module.exports = PlanetarySign;
