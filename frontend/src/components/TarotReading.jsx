import { useState } from "react";

// This dictates how a reading is displayed when it has the type of "Tarot"
// This is determined by the ReadingPage.jsx Page.

const TarotReading = ({ data }) => {
    const { details, createdAt } = data;
    const [selectedCard, setSelectedCard] = useState(0); // Index of currently viewed card

    const getSpreadPositionName = (position) => {
        if (details.spreadType === "single") return "Your Card";
        
        if (details.spreadType === "three-card") {
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

    const currentCardData = details.cards[selectedCard];
    const cardMeaning = currentCardData.meaning; // This is the populated meaning object

    return (
        <div className='tarotContainer'>
            <h2>Question/Intention:</h2>
            <h3>{details.question}</h3>
            <p>Entry Created: {new Date(createdAt).toLocaleString()}</p>
            <p><span className='bold'>Spread Type:</span> {
                details.spreadType === "single" ? "Single Card" :
                details.spreadType === "three-card" ? "Three Card (Past, Present, Future)" :
                "Celtic Cross"
            }</p>

            <br />

            {/* Card Navigation */}
            {details.cards.length > 1 && (
                <div className='card-navigation'>
                    <h3>Select a card to view:</h3>
                    <div className='card-buttons'>
                        {details.cards.map((card, index) => (
                            <div key={index} className='card-button-container'>
                                {card.meaning.image && (
                                    <div className={card.isReversed ? 'card-thumbnail-wrapper reversed' : 'card-thumbnail-wrapper'}>
                                        <img 
                                            src={card.meaning.image} 
                                            alt={card.meaning.name}
                                            className='card-thumbnail'
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedCard(index)}
                                    className={selectedCard === index ? 'active' : ''}
                                >
                                    {getSpreadPositionName(card.position)}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <br />

            {/* Current Card Display */}
            <div className='card-display'>
                <h2>Position: {getSpreadPositionName(currentCardData.position)}</h2>
                <h2>{cardMeaning.name}</h2>
                <p className='card-orientation'>
                    <span className='bold'>Orientation:</span> {currentCardData.isReversed ? 'Reversed' : 'Upright'}
                </p>
                
                {cardMeaning.image && (
                    <div className={currentCardData.isReversed ? 'tarot-card-wrapper reversed' : 'tarot-card-wrapper'}>
                        <img 
                            src={cardMeaning.image} 
                            alt={cardMeaning.name}
                            className='tarot-card-image'
                        />
                    </div>
                )}

                <br />

                <h3>General Meaning:</h3>
                <p>{cardMeaning.description}</p>

                {cardMeaning.tarotAttributes && (
                    <>
                        {cardMeaning.tarotAttributes.suit && (
                            <p><span className='bold'>Suit:</span> {cardMeaning.tarotAttributes.suit}</p>
                        )}
                        
                        {cardMeaning.tarotAttributes.arcana && (
                            <p><span className='bold'>Arcana:</span> {cardMeaning.tarotAttributes.arcana}</p>
                        )}

                        {cardMeaning.tarotAttributes.number !== undefined && (
                            <p><span className='bold'>Number:</span> {cardMeaning.tarotAttributes.number}</p>
                        )}

                        {cardMeaning.tarotAttributes.astrology && (
                            <p><span className='bold'>Astrology:</span> {cardMeaning.tarotAttributes.astrology}</p>
                        )}

                        {cardMeaning.tarotAttributes.element && (
                            <p><span className='bold'>Element:</span> {cardMeaning.tarotAttributes.element}</p>
                        )}

                        {cardMeaning.tarotAttributes.uprightkeywords && cardMeaning.tarotAttributes.uprightkeywords.length > 0 && (
                            <p><span className='bold'>Upright Keywords:</span> {cardMeaning.tarotAttributes.uprightkeywords.join(', ')}</p>
                        )}

                        {cardMeaning.tarotAttributes.reversedkeywords && cardMeaning.tarotAttributes.reversedkeywords.length > 0 && (
                            <p><span className='bold'>Reversed Keywords:</span> {cardMeaning.tarotAttributes.reversedkeywords.join(', ')}</p>
                        )}

                        {cardMeaning.tarotAttributes.uprightMeaning && (
                            <>
                                <h3>Upright Meaning:</h3>
                                <p>{cardMeaning.tarotAttributes.uprightMeaning}</p>
                            </>
                        )}

                        {cardMeaning.tarotAttributes.reversedMeaning && (
                            <>
                                <h3>Reversed Meaning:</h3>
                                <p>{cardMeaning.tarotAttributes.reversedMeaning}</p>
                            </>
                        )}


                    </>
                )}
            </div>


        </div>
    );
}

export default TarotReading;