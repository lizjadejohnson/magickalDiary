import { useState } from "react";

//This dictates how a reading is displayed when it has the type of "I Ching"
//This is determined by the ReadingPage.jsx Page.


const HexagramReading = ({ data }) => {

    //data of the diaryEntry model. createdAt timestamp, tags, comments,etc.
    //The details contain the specific about the unique reading like the lines they got, which lines were changing etc.
    //It also contains a reference to the meanings database so we can pull the meaning from there using this info.

    const { details, createdAt } = data;

    //The meanings array is an array to future proof cases where there is more than 1 meaning.
    //For our purposes here, we need the first and only meaning reference [0] which is the original hexagram received.
    //In other cases, we could refer to more than 1 meaning reference.
    const originalHexagram = details.meanings[0];

    //Grabs the data for the hexagram theirs is changing into as well:
    const changingHexagram = details.changingMeaning;

    // Sets the view being displayed:
    const [view, setView] = useState('current'); // State is either 'current' or 'changing'. Its current by default

    //Toggles the view to its opposite on button click:
    const handleToggleView = () => {
        setView(view === 'current' ? 'changing' : 'current');
    };

    //This is for displaying the hexagram visually:
    const renderLine = (line) => {
        if (line === 6) return <div className="line yin changing"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 7) return <div className="line yang"></div>;
        if (line === 8) return <div className="line yin"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 9) return <div className="line yang changing"></div>;
        return null;
    };

    // Lines for the hexagram display to show the changing into sign lines / transformed lines:
    const changedLines = details.originalLines.map(line => {
        if (line === 6) return 7; // Changing Yin to Yang
        if (line === 9) return 8; // Changing Yang to Yin
        return line;
    });

    const renderHexagramView = (hexagram, lines) => (
        <>
            <h2>Meditation/Question:</h2>
            <h3>{details.question}</h3>
            <p>Entry Created: {new Date(createdAt).toLocaleString()}</p>
            
            {/* Visual display of the lines, reverse maps the lines so that they display from bottom to top */}
             {/* Lines is passed in as a variable so that we see the changing and unchanging hexagram depedning */}
            <div className='line-container'>
                {[...lines].reverse().map((line, index) => (
                    <div key={index}>
                        {renderLine(line)}
                    </div>
                ))}
            </div>

            <h2>Hexagram: {hexagram.name}</h2>
            <p>{hexagram.description}</p>
            <p><span className='bold'>Hexagram Number:</span> {hexagram.hexagramAttributes.number}</p>
            <p><span className='bold'>Nicknames:</span> {hexagram.hexagramAttributes.nicknames.join(', ')}</p>
            <p><span className='bold'>Above:</span> {hexagram.hexagramAttributes.above}</p>
            <p><span className='bold'>Below:</span> {hexagram.hexagramAttributes.below}</p>
            <p><span className='bold'>Judgment:</span> {hexagram.hexagramAttributes.judgment}</p>
            <p><span className='bold'>Hexagram Image:</span> {hexagram.hexagramAttributes.hexagramImage}</p>
            <p><span className='bold'>Commentary:</span> {hexagram.hexagramAttributes.commentary}</p>
            {view === 'current' && details.changingLines.length > 0 && (
                <>
                    <br />
                    <h2>Changing Lines Received:</h2>
                    {details.changingLines.map(line => (
                        <p key={line}><span className='bold'>Line {line}:</span> {hexagram.hexagramAttributes.changingLines[`changingLine${line}`]}</p>
                    ))}
                    <br/>
                    <p>The changing lines received on your current hexagram ({hexagram.name}) indicates that it is transforming into the hexagram {details.changingMeaning.name}:</p>
                    <br />
                </>
            )}
        </>
    );


    return (
        <div className='horoscopeContainer'>
            {view === 'current'
                ? renderHexagramView(originalHexagram, details.originalLines)
                : renderHexagramView(changingHexagram, changedLines)}
                {details.changingLines.length > 0 && (
                    <button onClick={handleToggleView}>
                        {view === 'current' ? 'Read Changing-Into Hexagram' : 'Read Original Hexagram'}
                    </button>
                )}
        </div>
    );
}

export default HexagramReading;
