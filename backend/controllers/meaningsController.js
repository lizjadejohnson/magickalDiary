const Meaning = require('../models/meaning')


//Note that the methods are referenced in our main index.js file!

// -----Get ALL Meanings (GET):
const fetchAllMeanings = async (req, res) => {

    //1. Get all meanings from the DB:
    const meanings = await Meaning.find();

    //2. Send the meanings back as a response:
    res.json({meanings: meanings})
}

//////////////////////////////////////////////////////////////////////////////

// -----Get specific meaning by ID (GET):
const fetchMeaning = async (req, res) => {

    //1. Get our ID off the URL:
    const meaningID = req.params.id

    //2. Find the specific meaning using that ID:
    const meaning = await Meaning.findById(meaningID)

    //3. Send response with that meaning item as the payload
    res.json({meaning: meaning})
}


//////////////////////////////////////////////////////////////////////////////

module.exports = {
    fetchAllMeanings,
    fetchMeaning,
}