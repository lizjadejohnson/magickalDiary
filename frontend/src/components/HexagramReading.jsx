import React from 'react';

//This dictates how a reading is displayed when it has the type of "I Ching"
//This is determined by the ReadingPage.jsx Page.


const HexagramReading = ({ data }) => {

    //data of the diaryEntry model. createdAt timestamp, tags, comments,etc.
    //The details contain the specific about the unique reading like the lines they got, which lines were changing etc.
    //It also contains a reference to the meanings database so we can pull the meaning from there using this info.

    const { details, commentary, tags, createdAt } = data;

    //The meanings array is an array to future proof cases where there is more than 1 meaning.
    //For our purposes here, we need the first and only meaning reference [0] which is the original hexagram received.
    //In other cases, we could refer to more than 1 meaning reference.
    const originalHexagram = details.meanings[0];

    //This is for displaying the hexagram visually:
    const renderLine = (line) => {
        if (line === 6) return <div className="line yin changing"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 7) return <div className="line yang"></div>;
        if (line === 8) return <div className="line yin"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 9) return <div className="line yang changing"></div>;
        return null;
    };

    return (
        <div className='horoscopeContainer'>
            <h2>Meditation/Question:</h2>
            <h3>{details.question}</h3>
            <p>Entry Created: {new Date(createdAt).toLocaleString()}</p>
            <br />
            
            {/* Visual depiction of the hexagram after casting: We need to reverse the order of the lines so that the first line appears on the bottom: */}
            <div className='line-container'>
                {[...details.originalLines].reverse().map((line, index) => (
                    <div key={index}>
                        {renderLine(line)}
                    </div>
                ))}
            </div>

            <h2>Hexagram: {originalHexagram.name}</h2>
            <h2>{originalHexagram.description}</h2>
            <p>Hexagram Number: {originalHexagram.hexagramAttributes.number}</p>
            <p>Above: {originalHexagram.hexagramAttributes.above}</p>
            <p>Below: {originalHexagram.hexagramAttributes.below}</p>
            <p>Judgment: {originalHexagram.hexagramAttributes.judgment}</p>
            <p>Hexagram Image: {originalHexagram.hexagramAttributes.hexagramImage}</p>
            <p>Commentary: {originalHexagram.hexagramAttributes.commentary}</p>
            <br />
            <h2>Changing Lines:</h2>
            {details.changingLines.length > 0 ? (
                details.changingLines.map(line => (
                    <p key={line}>Line {line}: {originalHexagram.hexagramAttributes.changingLines[`changingLine${line}`]}</p>
                ))
            ) : (
                <p>No changing lines received.</p>
            )}
            <br />
        </div>
    );
}

export default HexagramReading;
