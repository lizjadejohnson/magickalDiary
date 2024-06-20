const express = require('express');
const router = express.Router();
const zodiacReadingsController = require('../controllers/zodiacReadingsController.js')
const authenticate = require('../config/jwtAuth.js');


//-------------------------ZODIAC ROUTES-------------------------



// Western Zodiac Reading (GET):
router.get("/getWesternZodiacByDOB", authenticate, zodiacReadingsController.getWesternZodiacByDOB);


// Chinese Zodiac Reading (GET):
router.get("/getChineseZodiacByDOB", authenticate, zodiacReadingsController.getChineseZodiacByDOB);

// Get Ephemeris Data Route (GET):
router.get("/getEphemerisData", authenticate, zodiacReadingsController.getEphemerisData);

// Define a protected route:
router.get("/protected/data", authenticate, (req, res) => {
    res.json({ message: 'This is protected data', user: req.userId });
});

module.exports = router;