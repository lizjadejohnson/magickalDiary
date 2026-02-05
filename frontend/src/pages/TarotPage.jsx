import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import apiUrl from '../config';
import { saveAsDiaryEntry } from '../../utilities/saveAsDiaryEntry';

const TarotPage = () => {
    const { user } = useContext(UserContext);
    const [userQuestion, setUserQuestion] = useState("");
    const [drawnCards, setDrawnCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [spreadType, setSpreadType] = useState("three-card"); // Options: "single", "three-card", "celtic-cross"
    const navigate = useNavigate();

    // If someone is not logged in:
    if (!user) {
        return (
            <Spinner redirectTo={"/"} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />
        );
    }

    const newTarotReading = async (event) => {
        event.preventDefault();
        setLoading(true);
        setDrawnCards([]);

        const question = userQuestion;

        // Determine number of cards based on spread type
        const cardCount = spreadType === "single" ? 1 : spreadType === "three-card" ? 3 : 10;

        // Fetch all available tarot cards
        const allCards = await getAllTarotCards();
        
        if (!allCards || allCards.length === 0) {
            console.error('Failed to retrieve tarot cards');
            setLoading(false);
            return;
        }

        // Draw random cards without replacement
        const cards = [];
        const availableCards = [...allCards];
        
        for (let i = 0; i < cardCount; i++) {
            // Random card selection
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const selectedCard = availableCards[randomIndex];
            
            // Random orientation (upright or reversed)
            const isReversed = Math.random() < 0.5;
            
            cards.push({
                cardId: selectedCard._id,
                name: selectedCard.name,
                isReversed: isReversed,
                position: i + 1
            });

            // Remove selected card from available pool
            availableCards.splice(randomIndex, 1);
            
            setDrawnCards([...cards]);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Create reading data object
        const newReading = {
            question,
            spreadType,
            cards: cards.map(card => ({
                meaning: card.cardId,
                isReversed: card.isReversed,
                position: card.position
            }))
        };

        // Save the new reading as a diary entry
        const savedEntry = await saveAsDiaryEntry('Tarot', newReading, '', []);

        setLoading(false);

        if (savedEntry) {
            navigate(`/reading/${savedEntry._id}`);
        } else {
            console.error('Reading was not saved!');
        }
    };

    const getAllTarotCards = async () => {
        try {
            const response = await fetch(`${apiUrl}/meanings/tarot/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!data.meanings) {
                throw new Error('Tarot cards not found');
            }

            return data.meanings;

        } catch (error) {
            console.error('Error fetching tarot cards:', error);
            return null;
        }
    };

    const getSpreadPositionName = (position) => {
        if (spreadType === "single") return "Your Card";
        
        if (spreadType === "three-card") {
            const positions = ["Past", "Present", "Future"];
            return positions[position - 1];
        }
        
        // Celtic Cross positions
        const celticPositions = [
            "Present",
            "Challenge",
            "Past",
            "Future",
            "Above",
            "Below",
            "Advice",
            "External Influences",
            "Hopes/Fears",
            "Outcome"
        ];
        return celticPositions[position - 1];
    };

    return (
        <div className='tarotPage'>
            <h1 className='title'>Tarot Reading</h1>
            <form onSubmit={newTarotReading}>
                <label>What is your question?</label>
                <p className='text-tip' style={{ textAlign: 'center' }}>💡 Tip: Focus on open-ended questions that invite reflection and guidance.</p>
                <br />
                <input 
                    id="tarot-question-field" 
                    type="text" 
                    value={userQuestion} 
                    onChange={(event) => setUserQuestion(event.target.value)} 
                    required 
                />
                <br />
                <label>Choose a spread:</label>
                <select value={spreadType} onChange={(event) => setSpreadType(event.target.value)}>
                    <option value="single">Single Card</option>
                    <option value="three-card">Three Card (Past, Present, Future)</option>
                    <option value="celtic-cross">Celtic Cross (10 Cards)</option>
                </select>
                <br />
                <br />
                <button type="submit">Draw Cards</button>
            </form>

            {/* Display drawn cards */}
            <div className='drawn-cards-container'>
                {drawnCards.map((card, index) => (
                    <div key={index} className='tarot-card-preview'>
                        <p className='card-position'>{getSpreadPositionName(card.position)}</p>
                        <div className={`card ${card.isReversed ? 'reversed' : 'upright'}`}>
                            <p className='card-name'>{card.name}</p>
                            <p className='card-orientation'>{card.isReversed ? '(Reversed)' : '(Upright)'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <Spinner message={"Drawing cards..."} />}
        </div>
    );
}

export default TarotPage;