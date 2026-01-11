const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/api' 
  : `http://${window.location.hostname}:8080/api`;

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

// === Login ===
export async function login(userData) {
  const url = `${API_URL}/login`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!response.ok) throw new Error('Nieprawidłowy login lub hasło');

  return await response.json();
}

// === Register ===
export async function register(userData) {
  const url = `${API_URL}/user`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // username, email, password
    body: JSON.stringify(userData)
  });

  if (!response.ok) throw new Error('Użytkownik o takim adresie e-mail już istnieje');

  return await response.json();
}

// === Update dannych ===
export async function saveTrip(id, userId, tripData) {
  const isNew = !id || id === "-1" || id === -1;

  const url = isNew
    ? `${API_URL}/trip?userId=${userId}`
    : `${API_URL}/trip/${id}?userId=${userId}`;

  const response = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData)
  });

  if (!response.ok) {
    throw new Error(isNew ? 'Błąd podczas tworzenia wycieczki' : 'Błąd podczas aktualizacji wycieczki');
  }

  return await response.json();
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

export async function saveItem(id, userId, itemData) {
  const isNew = !id || id === "-1" || id === -1;
  const url = isNew
    ? `${API_URL}/item?userId=${userId}`
    : `${API_URL}/item/${id}?userId=${userId}`;

  const response = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });

  if (!response.ok) throw new Error('Błąd zapisu miejsca');
  return await response.json();
}

export async function saveCategorie(id, userId, categorieData) {
  const isNew = !id || id === "-1" || id === -1;
  const url = isNew
    ? `${API_URL}/categorie`
    : `${API_URL}/categorie/${id}?userId=${userId}`;

  const response = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categorieData)
  });

  if (!response.ok) throw new Error('Błąd zapisu miejsca');
  return await response.json();
}

// === Delete dannych ===
export async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`, {
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

export async function deleteTrip(id, userId) {
  const response = await fetch(`${API_URL}/trip/${id}?userId=${userId}`, {
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

export async function deleteItem(id, userId) {
  const response = await fetch(`${API_URL}/item/${id}?userId=${userId}`, {
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