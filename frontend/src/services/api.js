const API_URL = 'http://localhost:8080/api';

export async function fetchTrips() {
  try {
    const response = await fetch(`${API_URL}/trips?userId=2`);
    if (!response.ok) throw new Error('Problem z pobraniem wycieczek');
    return await response.json();
  } catch (error) {
    console.error("Błąd API:", error);
    return [];
  }
}