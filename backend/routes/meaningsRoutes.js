const express = require('express');
const router = express.Router();
const meaningsController = require('../controllers/meaningsController')
const authenticate = require('../config/jwtAuth.js');

//-------------------------MEANINGS ROUTES-------------------------
// -----Get ALL Meanings (GET):
router.get("/", authenticate, meaningsController.fetchAllMeanings)

// Get all Tarot cards (GET) - MUST BE BEFORE /:id
router.get("/tarot/all", authenticate, meaningsController.fetchAllTarotCards);

// Get Meaning by the hexagram lines (POST)
router.post("/by-lines", authenticate, meaningsController.fetchMeaningByLines);

// -----Get specific Meanings by ID (GET): - MUST BE LAST
router.get("/:id", authenticate, meaningsController.fetchMeaning)

module.exports = router;