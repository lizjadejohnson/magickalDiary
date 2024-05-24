const mongoose = require("mongoose");

// Define the schema for a diary entry
const diaryEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    }, // Type of the entry (e.g., "Tarot", "Iching", "Zodiac", "Text")
    details: {
        type: Object,
        required: true
    }, // Object containing details specific to the entry type
    comments: [ // Array of comments on the diary entry
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
    tags: {
        type: [String],
        default: []
    } // Include the entry type as default, allow users to add custom tags. Offer tag filtering.
}, { collection: 'diaryEntries', timestamps: true });

// Create a model named "DiaryEntry" and explicitly set the collection name to "diaryEntries"
const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema, "diaryEntries");

// Export the model
module.exports = DiaryEntry;