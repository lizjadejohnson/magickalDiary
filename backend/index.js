require("dotenv").config()  //Allows .env


const express = require("express")
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require("cors");

//Pulls Mongoose connection into main application
const connectToDb = require("./config/connectToDb")

const app = express()

const PORT = process.env.PORT || 3000;
//User port specified in env or 3000


// ---------Importing our Route documents--------------
const notesRoutes = require('./routes/notesRoutes.js');
const meaningsRoutes = require('./routes/meaningsRoutes.js');
const usersRoutes = require('./routes/usersRoutes.js');
const diaryEntryRoutes = require('./routes/diaryEntriesRoutes');
const zodiacReadingsRoutes = require('./routes/zodiacReadingsRoutes.js');


// --------------Middlewares--------------
app.use(express.json()) //Express doesn't naturally convert our data to json
app.use(cookieParser());

/// Add all FRONTEND domains (no backends):
app.use(cors({
    origin: ['http://localhost:5000','https://magickal-diary.onrender.com'],
    credentials: true
  }));


connectToDb()
//This initializes our connectToDb function
// ---------------------------------------------reQs
// ---------------------------------------------Routing




//-----Objective: We want to establish CRUD routes for our Notes model-----
//Always use res.json as opposed to res.send when responding back to the client with json data
//These routes are defined in our controllers>xxxxxController.js file, notice how the methods are specified.
//Specific routes are defined in the routes/xxxRoutes.js docs

// ------------------------- USE OUR ROUTES -------------------------
app.use("/api/notes", notesRoutes);
app.use("/api/meanings", meaningsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/diaryEntries", diaryEntryRoutes);
app.use("/api/zodiac", zodiacReadingsRoutes);



// Serve static files from the React app build
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Fallback to index.html for SPA
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
// });

// -------------------------------- [Databse Connection]------------------------------
app.listen(PORT, () => {
    console.log(`Express server listening on port number ${PORT}`)
})