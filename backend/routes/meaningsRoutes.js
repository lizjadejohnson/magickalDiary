const express = require('express');
const router = express.Router();
const meaningsController = require('../controllers/meaningsController')
const authenticate = require('../config/jwtAuth.js');

//-------------------------TODO ROUTES-------------------------
// -----Get ALL Meanings (GET):
router.get("/", authenticate, meaningsController.fetchAllMeanings)


// -----Get specific Meanings by ID (GET):
router.get("/:id", authenticate, meaningsController.fetchMeaning)

// Get Meaning by the hexagram lines (POST)
router.post("/by-lines", authenticate, meaningsController.fetchMeaningByLines);




module.exports = router;