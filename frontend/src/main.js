import './components/Theme.js'

import { fetchTrips, fetchTripDetails, fetchTripItems, fetchCategories, fetchTripPlaces } from './services/api.js';
import { updateTrip, savePlace } from './services/api.js';
import { deletePlace } from './services/api.js';

import { renderTripDetails, renderTripItems, renderPlacesDetails } from './components/TripDetail.js';
import { renderTripEditForm, renderPlaceEditForm } from './components/TripEdit.js';
import { renderTripList } from './components/TripList.js';

const sidebar = document.getElementById('trip-list-container');
const detailsContainer = document.getElementById('trip-info-content');
const checklistContainer = document.getElementById('checklist-content');
const placesContainer = document.getElementById('trip-places');

const userId = 1;
let currentPlaces = [];

async function handleTripSelection(id) {
  detailsContainer.innerHTML = '<p class="loader">Ładowanie szczegółów...</p>';
  checklistContainer.innerHTML = '';

  try {
    // Pobieramy wszystko równolegle dla lepszej wydajności
    const [details, items, categories, places] = await Promise.all([
      fetchTripDetails(id, userId),
      fetchTripItems(id, userId),
      fetchCategories(userId),
      fetchTripPlaces(id, userId)
    ]);

    currentPlaces = places;

    // Renderujemy komponenty
    renderTripDetails(details, detailsContainer);
    renderTripItems(items, categories, checklistContainer);
    renderPlacesDetails(places, placesContainer);

  } catch (error) {
    console.error("Błąd podczas ładowania:", error);
    detailsContainer.innerHTML = '<p>Błąd podczas ładowania danych.</p>';
  }
}

// Inicjalizacja listy
const trips = await fetchTrips(userId);
renderTripList(trips, sidebar, handleTripSelection);

// Update Trip Details
detailsContainer.addEventListener('click', async (e) => {
  if (e.target.id === 'edit-btn') {
    const tripId = e.target.dataset.tripId;
    const details = await fetchTripDetails(tripId, userId);
    renderTripEditForm(details, detailsContainer);
  }

  if (e.target.id === 'save-trip-btn') {
    const tripId = e.target.dataset.id;

    const updatedData = {
      title: document.getElementById('edit-title').value,
      departureDate: document.getElementById('edit-date').value,
      description: document.getElementById('edit-description').value,
      isVisited: false
    };

    try {
      await updateTrip(tripId, userId, updatedData);

      const freshDetails = await fetchTripDetails(tripId, userId);
      renderTripDetails(freshDetails, detailsContainer);

      const trips = await fetchTrips(userId);
      renderTripList(trips, sidebar, handleTripSelection);
    } catch (err) {
      alert("Nie udało się zapisać zmian.");
    }
  }

  if (e.target.id === 'cancel-edit-btn') {
    const tripId = document.getElementById('save-trip-btn').dataset.id;
    const details = await fetchTripDetails(tripId, userId);
    renderTripDetails(details, detailsContainer);
  }
});


placesContainer.addEventListener('click', async (e) => {
  const target = e.target;

  if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
    return; 
  }

  const placeId = parseInt(target.dataset.id);
  const tripId = document.getElementById('trip-id').textContent.trim();

  console.log("placeId: " + placeId + " tripId: " + tripId);

  if (target.id === 'edit-btn') {
    const place = currentPlaces.find(p => p.id === placeId);

    if (place) {
      const row = target.closest('.place-row');
      renderPlaceEditForm(place, row);
    } else {
      console.error("Nie znaleziono miejsca o ID:", placeId);
    }
    return;
  }

  if (target.id === 'delete-btn') {
    if (!confirm("Usunąć?")) return;
    await deletePlace(placeId, userId);
    currentPlaces = await fetchTripPlaces(tripId, userId);
    renderPlacesDetails(currentPlaces, placesContainer);
    return;
  }

  if (target.id === 'save-place-btn') {
    const placeData = {
      title: document.getElementById('edit-place-title').value,
      description: document.getElementById('edit-place-description').value,
      tripId: parseInt(tripId),
      isVisited: false,
      img: ""
    };

    try {
      await savePlace(placeId, userId, placeData);
      currentPlaces = await fetchTripPlaces(tripId, userId);
      renderPlacesDetails(currentPlaces, placesContainer);
    } catch (err) {
      alert("Błąd zapisu");
    }
    return;
  }

  if (target.id === 'cancel-place-edit-btn') {
    renderPlacesDetails(currentPlaces, placesContainer);
    return;
  }

  if (target.id === 'add-place') {
    const newPlace = {
      id: -1,
      title: "",
      description: "",
      tripId: parseInt(tripId),
      img: "",
      isVisited: false
    };

    const formWrapper = document.createElement('div');
    formWrapper.className = 'place-row new-place-form';
    formWrapper.style.border = '2px dashed var(--color-accent)'
    formWrapper.style.borderRadius = 'var(--radius-md)'
    target.before(formWrapper);
    
    renderPlaceEditForm(newPlace, formWrapper);
    
    target.style.display = 'none';
    return;
  }
});