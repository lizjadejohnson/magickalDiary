import apiUrl from '../src/config'; // Adjust path as needed

export async function getEphemerisData(setState) {
  try {
    const response = await fetch(`${apiUrl}/zodiac/getEphemerisData`, {
      credentials: 'include' // Include credentials (cookies)
    });
    const data = await response.json();

    if (data && data.planets) {
      setState(data.planets); // Set state with the fetched planetary data
    } else {
      setState(null); // Set state to null if no data is returned
      console.error("Expected 'planets' data but got:", data);
    }
  } catch (error) {
    console.error("Failed to fetch ephemeris data:", error);
    setState(null); // Set state to null on error to avoid undefined errors in rendering
  }
}

//WORKING!!!