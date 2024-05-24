const express = require('express');
const router = express.Router();
const diaryEntriesController = require("../controllers/diaryEntriesController.js");
const authenticate = require('../config/jwtAuth.js');

//-------------------------DIARY ENTRIES ROUTES-------------------------

// -----Get ALL Diary Entries (GET):-----
router.get("/", authenticate, diaryEntriesController.fetchAllDiaryEntries)

// -----Get specific Diary Entry by ID (GET):-----
router.get("/:id", authenticate, diaryEntriesController.fetchDiaryEntry)

// -----Create a Diary Entry (POST):-----
router.post("/", authenticate, diaryEntriesController.createDiaryEntry)

// -----Update a specific Diary Entry (PUT):-----
router.put("/:id", authenticate, diaryEntriesController.updateDiaryEntry)

// -----Delete a specific Diary Entry (DELETE):-----
router.delete("/:id", authenticate, diaryEntriesController.deleteDiaryEntry)

// Define a protected route
router.get("/protected/data", authenticate, (req, res) => {
    res.json({ message: 'This is protected data', user: req.user._id });
});

module.exports = router;