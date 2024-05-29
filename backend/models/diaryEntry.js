const mongoose = require("mongoose");

// Define the schema for a diary entry
const diaryEntrySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Thetype of the entry (e.g., "Tarot", "Iching", "Text")
    type: {
        type: String,
        required: true
    },
    

    // Object containing details specific to the entry type, like for example cvhanging lines from the iching etc
    details: {
        question: String,
        originalLines: [Number], // The lines they got in their hexagram
        meanings: [{ //Referencing the meaning database
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meaning'
        }],
        changingLines: [Number],
        changingMeaning: { //The changing meaning references the meaning object of the hex theirs in changing into
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meaning'
        }
    },
    //Ability for user to add commentary to the reading:
    commentary: {
        type: String,
        default: ""
    },

    // Allow users to add custom tags. Offer tag filtering....
    tags: {
        type: [String],
        default: []
    } 
}, { collection: 'diaryEntries', timestamps: true });

// Create a model named "DiaryEntry" and explicitly set the collection name to "diaryEntries"
const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema, "diaryEntries");

// Export the model
module.exports = DiaryEntry;