export async function saveAsDiaryEntry(type, details) {
    try {
        //Save the reading type as a tag as well by default:
        const tags = [type];
        const response = await fetch('http://localhost:3000/diaryEntries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, details, tags }),
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
