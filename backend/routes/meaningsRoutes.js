const express = require('express');
const router = express.Router();
const meaningsController = require('../controllers/meaningsController')


//-------------------------TODO ROUTES-------------------------
// -----Get ALL Todos (GET):
router.get("/", meaningsController.fetchAllMeanings)


// -----Get specific Todos by ID (GET):
router.get("/:id", meaningsController.fetchMeaning)


module.exports = router;