import React from 'react';

const HexagramReading = ({ hexagram, details, changingLines }) => {
    return (
        <div className='horoscopeContainer'>
            <h2>Hexagram: {hexagram}</h2>
            <p>Description: {details?.description}</p>
            <p>Number: {details?.number}</p>
            <p>Above: {details?.above}</p>
            <p>Below: {details?.below}</p>
            <p>Judgment: {details?.judgment}</p>
            <p>Hexagram Image: {details?.hexagramImage}</p>
            <p>Commentary: {details?.commentary}</p>
            <h3>Changing Lines:</h3>
            {Array.isArray(changingLines) && changingLines.length > 0 ? (
                changingLines.map((line, index) => (
                    <p key={index}>Line {line}: {details?.changingLines[`changingLine${line}`]}</p>
                ))
            ) : (
                <p>No changing lines.</p>
            )}
        </div>
    );
}

export default HexagramReading;
