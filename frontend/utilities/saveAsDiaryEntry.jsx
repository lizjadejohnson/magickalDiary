export async function saveAsDiaryEntry(type, details) {
    try {
        const response = await fetch('http://localhost:3000/diaryEntries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, details }),
            credentials: 'include'
        });
        const data = await response.json();
        console.log('Diary entry saved successfully!');

    } catch (error) {
        console.error('Error saving diary entry:', error);
        console.log('Failed to save diary entry. Please try again.');
    }
}
