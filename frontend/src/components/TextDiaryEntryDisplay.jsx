import { useState } from "react";

//This dictates how a reading is displayed when it has the type of "Text"
//This is determined by the ReadingPage.jsx Page.


const TextDiaryEntryDisplay = ({ data }) => {

    //data of the diaryEntry model. createdAt timestamp, tags, comments,etc.
    //The details contain the specific about the unique reading like the lines they got, which lines were changing etc.
    //It also contains a reference to the meanings database so we can pull the meaning from there using this info.

    const { details, createdAt } = data;

    return (
        <div className='textEntryContainer'>
            <h2>Meditation/Question/Title:</h2>
            <h3>{details.question}</h3>
            <p>Entry Created: {new Date(createdAt).toLocaleString()}</p>
        </div>
    );
}

export default TextDiaryEntryDisplay;
