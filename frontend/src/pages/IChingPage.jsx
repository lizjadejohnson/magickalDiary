import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from '../components/Spinner';
import HexagramReading from '../components/HexagramReading';

const IChingPage = () => {
    const { user } = useContext(UserContext);
    const [activeDisplayedReading, setActiveDisplayedReading] = useState('');
    const [iChingData, setIChingData] = useState(null);
    const [userQuestion, setUserQuestion] = useState("");
    const [currentLines, setCurrentLines] = useState([]);
    const [loading, setLoading] = useState(false);

    // If someone is not logged in:
    if (!user) {
        return (
            <Spinner redirectTo={'/'} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />
        );
    };

    const handleUserQuestion = async (event) => {
        event.preventDefault();
        setCurrentLines([]);
        setLoading(true);
        const question = userQuestion;


        // Simulate the casting of coins to determine each line of the hexagram:
        const lines = [];

        //For 6 lines... generate a line, push it to the array, set the state, hasve delays so it doesn't all happen instantly:
        for (let i = 0; i < 6; i++) {
            //Generate line is based on doing authentic coin tosses to calculate whether the line is yin or yang and changing or unchanging:
            const line = generateLine();
            lines.push(line);
            setCurrentLines([...lines]);
            await new Promise(resolve => setTimeout(resolve, 10)); // Add a delay to simulate the process
        }

        //If 6 or 8 its yin, if 7 or 9 its yang. Needed to determine base hexagram type:
        const hexagramLines = lines.map(line => (line === 6 || line === 8) ? 'yin' : 'yang');
        const originalHexagram = await getHexagram(hexagramLines);

        const transformedHexagram = await getHexagram(hexagramLines.map((line, index) => (lines[index] === 6 || lines[index] === 9) ? (line === 'yin' ? 'yang' : 'yin') : line));
        const changingLines = lines.map((line, index) => (line === 6 || line === 9) ? index + 1 : null).filter(index => index !== null);

        setIChingData({
            details: {
                originalLines: lines,
                originalHexagram,
                transformedHexagram,
                changingLines
            }
        });

        setActiveDisplayedReading('Current Hexagram');
        setLoading(false);
    };

    //Heads or tails for 3 coins determines whether the line is yin/yang & changing/unchanging --
    // Each coin toss generates a value: heads (value of 3) or tails (value of 2). Sum the values of the three coin tosses (ranges from 6 to 9).
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
    //For example: 6, 6, 7, 6, 8, 9. Or whatever.
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
            return data.meaning;
        } catch (error) {
            console.error('Error fetching hexagram:', error);
            return null;
        }
    };

    return (
        <div>
            <h1 className='title'>I Ching Reading</h1>
            <div className='button-container'>
                <form onSubmit={handleUserQuestion}>
                    <div>
                        <label>What is your question?</label>
                        <p>💡 Tip: Try not to ask simple 'yes' or 'no' questions. Instead, ask a more open ended question.</p>
                        <input type="text" value={userQuestion} onChange={(event) => setUserQuestion(event.target.value)} required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>

            {loading && <Spinner message={"Casting coins..."} />}

            {/* 6 broken/yin and changing
            7 solid/yang and unchanging
            8 broken/yin and unchanging
            9 solid/yang and changing */}

            <div className='hexagramLines'>
                {[...currentLines].reverse().map((line, index) => (
                    <div key={index} className='line'>
                        {line === 6 ? '⚋⚋' : line === 7 ? '——' : line === 8 ? '⚋⚋' : '——'}
                        {(line === 6 || line === 9) && <span className='dot'>•</span>}
                    </div>
                ))}
            </div>

            <div className='horoscopeResult'>
                {activeDisplayedReading === 'Current Hexagram' && iChingData?.details?.originalHexagram && (
                    <HexagramReading hexagram={iChingData.details.originalHexagram.name} details={iChingData.details.originalHexagram.hexagramAttributes} changingLines={iChingData.details.changingLines} />
                )}
                {activeDisplayedReading === 'Changing Into' && iChingData?.details?.transformedHexagram && (
                    <HexagramReading hexagram={iChingData.details.transformedHexagram.name} details={iChingData.details.transformedHexagram.hexagramAttributes} changingLines={iChingData.details.changingLines} />
                )}
            </div>
        </div>
    );
}



export default IChingPage;
