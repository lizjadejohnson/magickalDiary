import React from 'react';

const HexagramReading = ({ data }) => {
    const { details, createdAt, tags } = data;
    const originalHexagram = details.meanings[0];

    const renderLine = (line) => {
        if (line === 6) return <div className="line yin changing"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 7) return <div className="line yang"></div>;
        if (line === 8) return <div className="line yin"><div className="segment"></div><div className="segment"></div></div>;
        if (line === 9) return <div className="line yang changing"></div>;
        return null;
    };

    return (
        <div className='horoscopeContainer'>
            <h2>Meditation/Question: {details.question}</h2>
            <p>Timestamp: {new Date(createdAt).toLocaleString()}</p>

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
        </div>
    );
}

export default HexagramReading;
