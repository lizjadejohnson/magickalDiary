const DiaryEntry = require('../models/diaryEntry');
const User = require('../models/user');

const mongoose = require("mongoose");

// Note that the methods are referenced in our main index.js file!

///////////////////////////////////////////////////////////////////////////////////////

// -----Get ALL Diary Entries for a user (GET):
const fetchAllDiaryEntries = async (req, res) => {
    const userId = req.user._id;

    try {
        console.log("Fetching all diary entries for user:", req.user._id);
        const diaryEntries = await DiaryEntry.find({ user: userId });

        res.json({ diaryEntries });

    } catch (error) {
        console.error("Error fetching diary entries:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////////////

// -----Get specific Diary Entry by ID (GET):
const fetchDiaryEntry = async (req, res) => {
    const diaryEntryId = req.params.id;
    const userId = req.user._id;

    try {
        const diaryEntry = await DiaryEntry.findOne({ _id: diaryEntryId, user: userId })
        //Important: Here we are telling Mongoos to populate the details.meanings field
        //(which contains object IDs) with the actual documents from the meanings collection that these IDs refer to!
            .populate('details.meanings')
            .populate('details.changingMeaning');

        if (!diaryEntry) {
            return res.status(404).json({ message: 'Diary entry not found.' });
        }
        res.json({ diaryEntry: diaryEntry });
    } catch (error) {
        console.error("Error fetching diary entry:", error);
        res.status(500).json({ message: 'An error occurred while fetching the diary entry.', error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////////////

// -----Create a Diary Entry (POST):
const createDiaryEntry = async (req, res) => {
    console.log(`BODY: ${req.body}`);
    const { type, details, commentary, tags } = req.body;
    const userId = req.user._id;

    try {

        const diaryEntry = new DiaryEntry({
            user: userId,
            type,
            details,
            commentary,
            tags
        });
        await diaryEntry.save();

        // Add the diary entry to the user's diaryEntries array
        await User.findByIdAndUpdate(userId, { $push: { diaryEntries: diaryEntry._id } });

        res.json({ diaryEntry: diaryEntry });

    } catch (error) {
        console.error("Error creating diary entry:", error);
        res.status(500).json({ message: 'An error occurred while creating the diary entry.', error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////////////

// -----Update a specific Diary Entry (PUT):
const updateDiaryEntry = async (req, res) => {
    const diaryEntryId = req.params.id;
    const { question, commentary, tags } = req.body;
    const userId = req.user._id;

    try {
        const diaryEntry = await DiaryEntry.findOne({ _id: diaryEntryId, user: userId });

        if (!diaryEntry) {
            return res.status(404).json({ message: 'Entry not found / you do not have permission to update this entry.' });
        }

        // Update the question if changed:
        if (question) {
            diaryEntry.details.question = question;
        }

        //Add tags if present:
        if (tags) {
            diaryEntry.tags = tags.split(',').map(tag => tag.trim());
        }

        // Add commentary if present:
        if (commentary) {
            diaryEntry.commentary = commentary;
        }

        await diaryEntry.save();
        res.json({ diaryEntry: diaryEntry });

    } catch (error) {
        console.error("Error updating diary entry:", error);
        res.status(500).json({ message: 'An error occurred while updating the diary entry.', error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////////////

// -----Delete a specific Diary Entry (DELETE):
const deleteDiaryEntry = async (req, res) => {
    const diaryEntryId = req.params.id;
    const userId = req.user._id;

    try {
        const deletedDiaryEntry = await DiaryEntry.findOneAndDelete({ _id: diaryEntryId, user: userId });
        if (!deletedDiaryEntry) {
            return res.status(404).json({ message: 'Diary entry not found or you do not have permission to delete this entry.' });
        }
        res.json({ message: "Diary entry deleted" });
    } catch (error) {
        console.error("Error deleting diary entry:", error);
        res.status(500).json({ message: 'An error occurred while attempting to delete the entry.', error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    fetchAllDiaryEntries,
    fetchDiaryEntry,
    createDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
};
