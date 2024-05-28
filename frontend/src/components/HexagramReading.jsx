import React from 'react';

const HexagramReading = ({ data }) => {
    const { details, createdAt, tags } = data;
    const originalHexagram = details.meanings[0];


    return (
        <div className='horoscopeContainer'>
            <h2>Meditation/Question: {details.question}</h2>
            <p>Timestamp: {new Date(createdAt).toLocaleString()}</p>
            <h2>Hexagram: {originalHexagram.name}</h2>
            <p>Description: {originalHexagram.description}</p>
            <p>Hexagram Number: {originalHexagram.hexagramAttributes.number}</p>
            <p>Above: {originalHexagram.hexagramAttributes.above}</p>
            <p>Below: {originalHexagram.hexagramAttributes.below}</p>
            <p>Judgment: {originalHexagram.hexagramAttributes.judgment}</p>
            <p>Hexagram Image: {originalHexagram.hexagramAttributes.hexagramImage}</p>
            <p>Commentary: {originalHexagram.hexagramAttributes.commentary}</p>
            <h3>Changing Lines:</h3>
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
