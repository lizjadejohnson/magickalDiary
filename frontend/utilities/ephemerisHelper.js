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

export function formatZodiacPosition(degree) {
  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const signIndex = Math.floor(degree / 30);
  const sign = zodiacSigns[signIndex];
  const inSignDegree = degree % 30;
  const degrees = Math.floor(inSignDegree);
  const minutes = Math.floor((inSignDegree - degrees) * 60);
  const seconds = Math.floor((((inSignDegree - degrees) * 60) - minutes) * 60);
  return `${sign}, ${degrees}°${minutes}'${seconds}"`;
}


//WORKING!!!