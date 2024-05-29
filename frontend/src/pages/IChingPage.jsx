import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {saveAsDiaryEntry} from '../../utilities/saveAsDiaryEntry';

const IChingPage = () => {
    const { user } = useContext(UserContext);
    const [userQuestion, setUserQuestion] = useState("");
    const [currentLines, setCurrentLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // If someone is not logged in:
    if (!user) {
        return (
            <Spinner redirectTo={'/'} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />
        );
    };


    const newIChingReading = async (event) => {
        event.preventDefault();

        //Set state as loading while 'casting'
        setLoading(true);

        //Reset to empty at start:
        setCurrentLines([]);

        const question = userQuestion;


        // Simulate the casting of coins to determine each line of the hexagram:
        const lines = [];

        //For each of the 6 lines... generate a line, push it to the array, set the state, hasve delays so it doesn't all happen instantly:
        for (let i = 0; i < 6; i++) {
            //Generate line is based on doing authentic coin tosses to calculate whether the line is yin or yang and changing or unchanging:
            const line = generateLine();

            //We push the raw sums to "lines" (e.g. 7 6 8 8 6 9):
            lines.push(line);
            setCurrentLines([...lines]);
            await new Promise(resolve => setTimeout(resolve, 700)); // Add a delay to simulate the process
        }

        //We determine the base hexagram type:
            //If 6 or 8 its yin, if 7 or 9 its yang.
            //More on this later, but for determining base type it doesn't matter whether its changing or not.
            //So just yin or yang are needed to determine base hexagram type:
        const hexagramLines = lines.map(line => (line === 6 || line === 8) ? 'yin' : 'yang');

            //Pass in the string of "yin yin  yang yang yin" or whatever in hexagramLines to getHexagram. This finds the match in the meanings database.
        const originalHexagram = await getHexagram(hexagramLines);

        if (!originalHexagram || !originalHexagram._id) {
            console.error('Failed to retrieve valid hexagram data');
            setLoading(false);
            return; // Exit if hexagram is invalid, been having trouble because theres so many and i havent added them all yet lmao
        }

        //We save which lines were changing lines:
        const changingLines = lines.map((line, index) => (line === 6 || line === 9) ? index + 1 : null).filter(index => index !== null);

        //Transform the changing lines into their *changed* lines, so we can get the changing into hex:
        const changedLines = lines.map(line => {
            if (line === 6) return 7;
            if (line === 9) return 8;
            return line;
        });

        //Similar to the original, we'll need to store these as string so we can find which hexagram its changing into
        const changingHexagramLines = changedLines.map(line => (line === 6 || line === 8) ? 'yin' : 'yang');
        const changingHexagram = await getHexagram(changingHexagramLines);

        //Create reading data object, these get entered into the details for our diaryEntry:
        //We only need to save data unique to this reading (our question, the lines, and the changing lines. We refrence a meaning)
        const newReading = {
            question,
            originalLines: lines,
            meanings: [originalHexagram._id],
            changingLines,
            changingMeaning: changingHexagram ? changingHexagram._id : null //Store the changing hexagram if there is one!
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Save the new reading as a diary entry, set loading back to false, and navigate to the reading page for the entry just created!!
        const savedEntry = await saveAsDiaryEntry('I Ching', newReading);

        setLoading(false);

        if (savedEntry) {
        navigate(`/reading/${savedEntry._id}`);

        } else {
            console.error('Reading was not saved!');
        }
    };

    //i ching line calculations:
    //Heads or tails for 3 coins determines whether the line is yin/yang & changing/unchanging --
    // Each coin toss generates a value: heads (a value of 3) or tails (a value of 2).
    //You then sum the values of the three coin tosses (sums range from 6 to 9).
        // 6 (Old Yin): Changing broken line (⚋ becomes a solid line in the transformed hexagram)
        // 7 (Young Yang): Solid line (—)
        // 8 (Young Yin): Broken line (⚋)
        // 9 (Old Yang): Changing solid line (— becomes a broken line in the transformed hexagram)

    const generateLine = () => {
        const coin1 = Math.random() < 0.5 ? 2 : 3;
        const coin2 = Math.random() < 0.5 ? 2 : 3;
        const coin3 = Math.random() < 0.5 ? 2 : 3;
        const sum = coin1 + coin2 + coin3;
        return sum;
    };

    //Check which hexagram is the result based on the sum of each line that got pushed to the array.
    //For example:"yin yin yang yang yin" or whatever.
    const getHexagram = async (lines) => {
        try {
            const response = await fetch('http://localhost:3000/meanings/by-lines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lines })
            });

            const data = await response.json();

            if (!data.meaning) {
                throw new Error('Meaning not found');
            }

            console.log("Hexagram fetched:", data.meaning);
            return data.meaning;

        } catch (error) {
            console.error('Error fetching hexagram:', error);
            return null;
        }
    };

    //This code is for displaying the hexagram visually:
    const renderLine = (line) => {
        if (line === 6) return <div className="line yin changing"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 7) return <div className="line yang"></div>;
        if (line === 8) return <div className="line yin"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 9) return <div className="line yang changing"></div>;
        return null;
    };

    return (
        <div className='iChingPage'>
            <h1 className='title'>I Ching Reading</h1>
            <form onSubmit={newIChingReading}>
                <label>What is your question?</label>
                <p>💡 Tip: Try not to ask simple 'yes' or 'no' questions. Instead, ask a more open ended question.</p>
                <input id="iching-question-field" type="text" value={userQuestion} onChange={(event) => setUserQuestion(event.target.value)} required />
                <br />
                <button type="submit">Submit</button>
            </form>
            {/* To display the hexagram visually while casting and make the lines get populated from bottom to top: */}
            <div className='line-container'>
                {[...currentLines].reverse().map((line, index) => (
                    <div key={index}>
                        {renderLine(line)}
                    </div>
                ))}
            </div>
            {loading && <Spinner message={"Casting coins..."} />}
            
        </div>
    );
}



export default IChingPage;
