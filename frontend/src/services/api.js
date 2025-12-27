const API_URL = 'http://localhost:8080/api';

// === Pobieranie dannych
export async function fetchTrips(userId) {
  try {
    const response = await fetch(`${API_URL}/trips?userId=${userId}`);
    if (!response.ok) throw new Error('Problem z pobraniem wycieczek');
    return await response.json();
  } catch (error) {
    console.error("Błąd API:", error);
    return [];
  }
}

export async function fetchCategories(userId) {
  const response = await fetch(`${API_URL}/categories?userId=${userId}`);
  return await response.json();
}

export async function fetchTripDetails(id, userId) {
  const response = await fetch(`${API_URL}/trip/${id}?userId=${userId}`);
  return await response.json();
}

export async function fetchTripItems(tripId, userId) {
  const response = await fetch(`${API_URL}/items?tripId=${tripId}&userId=${userId}`);
  return await response.json();
}

export async function fetchTripPlaces(tripId, userId) {
  const response = await fetch(`${API_URL}/places?tripId=${tripId}&userId=${userId}`);
  return await response.json();
}

// === Update dannych ===
export async function updateTrip(id, userId, tripData) {
  try {
    const response = await fetch(`${API_URL}/trip/${id}?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!response.ok) throw new Error('Błąd podczas aktualizacji');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function savePlace(id, userId, placeData) {
  const isNew = !id || id === "-1" || id === -1;
  const url = isNew
    ? `${API_URL}/place?userId=${userId}`
    : `${API_URL}/place/${id}?userId=${userId}`;

  const response = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(placeData)
  });

  if (!response.ok) throw new Error('Błąd zapisu miejsca');
  return await response.json();
}


// === Delete dannych ===
export async function deletePlace(id, userId) {
  const response = await fetch(`${API_URL}/place/${id}?userId=${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Błąd podczas usuwania');

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return { success: true };
  }

  return await response.json();
}