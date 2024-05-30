export async function saveAsDiaryEntry(type, details, commentary = '', additionalTags = []) {
    try {
        //Save the reading type as a tag as well by default, in addition to any tags provided:
        const tags = Array.from(new Set([type, ...additionalTags]));

        const bodyData = {
            type,
            details,
            commentary,
            tags
        };

        const response = await fetch('http://localhost:3000/diaryEntries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( bodyData ),
            credentials: 'include'
        });
        const data = await response.json();
        console.log('Diary entry saved successfully!');

        return data.diaryEntry; // Ensure the response contains the saved diary entry
    } catch (error) {
        console.error('Error saving diary entry:', error);
        console.log('Failed to save diary entry. Please try again.');
    }
}
