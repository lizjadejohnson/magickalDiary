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


**INSTRUCTIONS FOR RUNNING LOCALLY**
<br />
Ensure that you remember to install all dependencies for the root/frontend/backend. In the root directory run:
npm run build


Server info: Backend: 3000 Frontend: 5000 Proxy (setup on the backend package.json): 3000 VISIT http://localhost:5000/

"npm run dev" from the root directory will spin up the front and backend servers thanks to concurrently.

**ENV INFO**
<br />
Remember to create a new .env file of your own in the backend directory! It should look something like:
<br />
PORT=3000
<br />
DB_URL=mongodb+srv://MONGOUSERNAME:YOURCLUSERPASSWORD.STRING.mongodb.net/DBNAME
<br />
JWT_SECRET=WHATEVERYOUWANTYOURSECRETKEYTOBE
<br />

You will also need to create 2 frontend env files:
<br />
In the frontend folder, make a file called .env that contains:
<br />
VITE_API_URL=http://localhost:3000
<br />
And add another file in the frontend called .env.production that contains:
<br />
VITE_API_URL=the-url-to-your-deployed-site
<br />

The current project is setup so that Concurrently runs the backend and frontend locally with npm run dev and if you have a Render setup you can run it in production with npm start and npm run build. The Render site is not required to run locally following all previous instructions.
<br />

From here, you can follow the rest of the instructions to launch a Render app.
<br />

**RENDER INFO**
<br />
1. First, ensure you have followed all previous instructions to have Concurrently and all the package.json's set up correctly.
2. Create / log in to a Render account: https://dashboard.render.com/
    <br />
    a. Click the New + button.
    <br />
    b. Choose Web Service
    <br />
    c. Build from a GitHub repository
    <br />
    d. Set region, leave branch as master, leave root directory blank, leave runtime as Node, etc.
    <br />
    e. Change the "build command" to: npm run build
    <br />
    f. Change the "start command" to: npm start
    <br />
    g. Add the environment variables from the backend .env (it allows you to copy and paste for ease) as well as the new VITE_API_URL=the-url-to-your-deployed-site
    <br />
    (*Note: We do not need to add the local host env variable because it doesn't apply to our production site.)
    <br />
3. Add your Render page to your CORS configuration in your backend's index.js:
<br />
        app.use(cors({
            <br />
            origin: ['http://localhost:5000', 'https://the-url-to-your-deployed-site.com'],
            <br />
            credentials: true
            <br />
        }));
        <br />
4. Be sure to add your Render site to your Mongo whitelist - In Mongo:
<br />
    a. Access Network Access Settings:
    <br />
    b. In the left-hand navigation, click on "Network Access" under the "Security" section.
    <br />
    c. Click the "Add IP Address" button.
    <br />
    d. Add each IP address provided by Render. You can access these in your Render project by selecting the "Connect" button in the upper right. It provided me with 3 different outbound IP addresses.
<br />

    Again, in Render you will start with npm start and build with npm run build. Locally, you will start with npm run dev.
<br />

At this point, you should have a fully functional frontend, backend, local development and production site using Render.