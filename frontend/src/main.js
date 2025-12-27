import './components/Theme.js'

// api imports
import { fetchTrips, fetchTripDetails, fetchTripItems, fetchCategories, fetchTripPlaces } from './services/api.js';
import { updateTrip, savePlace } from './services/api.js';
import { deletePlace } from './services/api.js';

// render imports
import { renderTripList } from './components/TripList.js';
import { renderTripDetails, renderTripEditForm } from './components/TripDetail.js';
import { renderTripItems, renderItemsEditForm } from './components/TripChecklist.js';
import { renderPlacesDetails, renderPlaceEditForm } from './components/TripPlaces.js';

const userId = 1;
let currentPlaces = [];

// DOM Elements
const elements = {
  sidebar: document.getElementById('trip-list-container'),
  details: document.getElementById('trip-info-content'),
  checklist: document.getElementById('checklist-content'),
  places: document.getElementById('place-content')
};

// Dynamiczne pobieranie aktualnego tripId z DOM
const getActiveTripId = () => document.getElementById('trip-id')?.textContent.trim();

async function refreshPlacesView(tripId) {
  currentPlaces = await fetchTripPlaces(tripId, userId);
  renderPlacesDetails(currentPlaces, elements.places);
}

async function handleTripSelection(id) {
  elements.details.innerHTML = '<p class="loader">Ładowanie...</p>';
  elements.checklist.innerHTML = '';

  try {
    const [details, items, categories, places] = await Promise.all([
      fetchTripDetails(id, userId),
      fetchTripItems(id, userId),
      fetchCategories(userId),
      fetchTripPlaces(id, userId)
    ]);

    currentPlaces = places;
    renderTripDetails(details, elements.details);
    renderTripItems(items, categories, elements.checklist);
    renderPlacesDetails(places, elements.places);
  } catch (error) {
    console.error("Błąd ładowania:", error);
  }
}

// Trip Info Events
elements.details.addEventListener('click', async (e) => {
  const target = e.target;
  if (target.tagName !== 'BUTTON') return;

  const tripId = getActiveTripId();

  if (target.id === 'edit-btn' || target.id === 'cancel-btn') {
    const details = await fetchTripDetails(tripId, userId);
    target.id === 'edit-btn'
      ? renderTripEditForm(details, elements.details)
      : renderTripDetails(details, elements.details);
  }

  if (target.id === 'save-trip-btn') {
    const updatedData = {
      title: document.getElementById('edit-title').value,
      departureDate: document.getElementById('edit-date').value,
      description: document.getElementById('edit-description').value,
      isVisited: false
    };
    await updateTrip(tripId, userId, updatedData);
    handleTripSelection(tripId);
    const trips = await fetchTrips(userId);
    renderTripList(trips, elements.sidebar, handleTripSelection);
  }
});


// === Place add/edit/delete
elements.places.addEventListener('click', async (e) => {
  const target = e.target;
  if (!['BUTTON'].includes(target.tagName)) return; // , 'INPUT'

  const tripId = getActiveTripId();
  const placeId = parseInt(target.dataset.id);

  // 1. Delete
  if (target.id === 'delete-btn') {
    if (confirm("Usunąć?")) {
      await deletePlace(placeId, userId);
      await refreshPlacesView(tripId);
    }
  }
  // 2. Edit
  if (target.id === 'edit-btn') {
    const place = currentPlaces.find(p => p.id === placeId);
    if (place) renderPlaceEditForm(place, target.closest('.place-row'));
  }
  // 3. Cancel
  if (target.id === 'cancel-place-edit-btn') {
    renderPlacesDetails(currentPlaces, elements.places);
  }
  // 4. Save
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
      await refreshPlacesView(tripId);
    } catch (err) { alert("Błąd zapisu"); }
  }
  // 5. Add New Place
  if (target.id === 'add-place') {
    const newPlace = { id: -1, title: "", description: "", tripId: parseInt(tripId), isVisited: false };
    const formWrapper = document.createElement('div');
    formWrapper.className = 'place-row new-place-form';
    target.before(formWrapper);
    renderPlaceEditForm(newPlace, formWrapper);
    target.style.display = 'none';
  }
});

// Init
fetchTrips(userId).then(trips => renderTripList(trips, elements.sidebar, handleTripSelection));