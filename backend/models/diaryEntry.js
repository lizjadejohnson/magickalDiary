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
        type: Object,
        required: true
    },

    comments: [ // Array of comments made in the diary entry
        {
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            } // Timestamp of when the comment was made
        }
    ],

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