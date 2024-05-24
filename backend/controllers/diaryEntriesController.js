const DiaryEntry = require('../models/diaryEntry');

// Note that the methods are referenced in our main index.js file!

///////////////////////////////////////////////////////////////////////////////////////

// -----Get ALL Diary Entries (GET):
const fetchAllDiaryEntries = async (req, res) => {
    try {
        console.log("Fetching all diary entries for user:", req.user._id);
        const userId = req.user._id;
        const diaryEntries = await DiaryEntry.find({ user: userId });
        res.json({ diaryEntries: diaryEntries });
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
        const diaryEntry = await DiaryEntry.findOne({ _id: diaryEntryId, user: userId });
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
    const { type, name, description, image, attributes } = req.body;
    const userId = req.user._id;

    try {
        const diaryEntry = await DiaryEntry.create({
            type,
            name,
            description,
            image,
            attributes,
            user: userId
        });
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
    const { type, name, description, image, attributes } = req.body;
    const userId = req.user._id;

    try {
        const updatedDiaryEntry = await DiaryEntry.findOneAndUpdate(
            { _id: diaryEntryId, user: userId },
            { type, name, description, image, attributes },
            { new: true, runValidators: true }
        );

        if (!updatedDiaryEntry) {
            return res.status(404).json({ message: 'Diary entry not found or you do not have permission to update this diary entry.' });
        }

        res.json({ diaryEntry: updatedDiaryEntry });
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
            return res.status(404).json({ message: 'Diary entry not found or you do not have permission to delete this diary entry.' });
        }
        res.json({ message: "Diary entry deleted" });
    } catch (error) {
        console.error("Error deleting diary entry:", error);
        res.status(500).json({ message: 'An error occurred while deleting the diary entry.', error: error.message });
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
