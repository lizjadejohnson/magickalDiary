const mongoose = require("mongoose");

// Define the schema for a diary entry
const diaryEntrySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // The type of the entry (e.g., "Tarot", "I Ching", "Text")
    type: {
        type: String,
        required: true
    },
    
    // Make details flexible for different reading types
    details: mongoose.Schema.Types.Mixed,
    
    
    // Ability for user to add commentary to the reading:
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