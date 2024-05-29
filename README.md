**SUMMARY**
<br />
Project Summary: This is a magickal diary application. It was completed to satisfy the capstone project for the full-stack MERN software engineering program at Per Scholas.
It has a complete frontend and backend which connects to a Mongo DB server. It features user context support with JWT and Bcrypt.
This project is intended to be used as a magickal diary. It currently features full user support, western and Chinese zodiac readings, notes, the ability to comment on readings, and I Ching readings.
Tarot readings will be implemented in the near future.

Aside from the user/notes structure, most future development will be a continuation of the sort of thing happening with the I Ching.
For example, once tarot readings are implemented, the card meanings will also be stored in the meaningts database whereas tarot readings will be stored in the diaryEntries database etc.
Long-term plans include the creation of a fully operational table of correspondences ( a la 777) and will have database references in place so that users will be able to see all related correspondences (for example, the corresponding tarot card to their astrology sign, and so on).
<br />


**INSTRUCTIONS**
<br />
Ensure that you remember to npm install all dependencies on the front and backend.

Server info: Backend: 3000 Frontend: 5000 Proxy (setup on the backend package.json): 3000 VISIT http://localhost:5000/

npm run dev spins up the front and backend servers.

.env: Remember to create a new .env file in the backend directory! It should look like:

PORT=3000 DB_URL=mongodb+srv://MONGOUSERNAME:YOURCLUSERPASSWORD.STRING.mongodb.net/DBNAME JWT_SECRET=WHATEVERYOUWANTYOURSECRETKEYTOBE
