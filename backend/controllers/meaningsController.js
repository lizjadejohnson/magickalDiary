const Meaning = require('../models/meaning')


//Note that the methods are referenced in our main index.js file!

// -----Get ALL Meanings (GET):
const fetchAllMeanings = async (req, res) => {
    try {
        //1. Get all meanings from the DB:
        const meanings = await Meaning.find();

        //2. Send the meanings back as a response:
        res.json({meanings})

    } catch (error) {
        console.error('Error fetching all meanings:', error);
        res.status(500).json({ message: 'An error occurred while fetching meanings', error: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////

// -----Get specific meaning by ID (GET):
const fetchMeaning = async (req, res) => {
    try {
        const meaningID = req.params.id;
        const meaning = await Meaning.findById(meaningID);
        if (!meaning) {
            return res.status(404).json({ message: 'Meaning not found' });
        }
        res.json({ meaning });
    } catch (error) {
        console.error('Error fetching meaning:', error);
        res.status(500).json({ message: 'An error occurred while fetching the meaning', error: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////


// Get Meaning by hexagram lines (GET)
//Used in i ching reading creation:
const fetchMeaningByLines = async (req, res) => {
    try {
        const { lines } = req.body; // Assuming lines are sent in the body as an array
        const meaning = await Meaning.findOne({ 'hexagramAttributes.lines': lines });
        if (!meaning) {
            return res.status(404).json({ message: 'Meaning not found' });
        }
        res.json({ meaning });
    } catch (error) {
        console.error('Error fetching meaning by lines:', error);
        res.status(500).json({ message: 'An error occurred while fetching the meaning', error: error.message });
    }
};



//////////////////////////////////////////////////////////////////////////////

module.exports = {
    fetchAllMeanings,
    fetchMeaning,
    fetchMeaningByLines
}