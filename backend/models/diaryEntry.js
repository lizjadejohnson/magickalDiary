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
    
    // Details specific to the entry type
    details: {
        question: String,
        
        // I Ching specific fields
        originalLines: [Number],
        meanings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meaning'
        }],
        changingLines: [Number],
        changingMeaning: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meaning'
        },
        
        // Tarot specific fields
        spreadType: String,
        cards: [{
            meaning: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Meaning'
            },
            isReversed: Boolean,
            position: Number
        }]
    },
    
    // Ability for user to add commentary to the reading:
    commentary: {
        type: String,
        default: ""
    },

    // Allow users to add custom tags
    tags: {
        type: [String],
        default: []
    } 
}, { collection: 'diaryEntries', timestamps: true });

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema, "diaryEntries");

module.exports = DiaryEntry;