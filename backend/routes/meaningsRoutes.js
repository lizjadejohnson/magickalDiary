const express = require('express');
const router = express.Router();
const meaningsController = require('../controllers/meaningsController')


//-------------------------TODO ROUTES-------------------------
// -----Get ALL Meanings (GET):
router.get("/", meaningsController.fetchAllMeanings)


// -----Get specific Meanings by ID (GET):
router.get("/:id", meaningsController.fetchMeaning)

// Get Meaning by the hexagram lines (POST)
router.post("/by-lines", meaningsController.fetchMeaningByLines);




module.exports = router;