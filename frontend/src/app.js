import './components/Theme.js'

// api imports
import { fetchTrips, fetchTripDetails, fetchTripItems, fetchCategories, fetchTripPlaces } from './services/api.js';
import { saveTrip, savePlace, saveItem, saveCategorie } from './services/api.js';
import { deletePlace, deleteItem, deleteTrip } from './services/api.js';

// render imports
import { renderTripList } from './components/TripList.js';
import { renderTripDetails, renderTripEditForm } from './components/TripDetail.js';
import { renderTripItems, renderItemsEditForm, renderNewCategoryForm } from './components/TripChecklist.js';
import { renderPlacesDetails, renderPlaceEditForm } from './components/TripPlaces.js';

export async function initApp(userId) {
  let currentPlaces = [];
  let currentItems = [];

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
    currentPlaces = await fetchTripPlaces(tripId, userId); // ZMIANA TUTAJ
    renderPlacesDetails(currentPlaces, elements.places);
  }

  async function refreshItemsView(tripId) {
    currentItems = await fetchTripItems(tripId, userId);
    const categories = await fetchCategories(userId);
    renderTripItems(currentItems, categories, elements.checklist);
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

      currentItems = items;
      currentPlaces = places;
      renderTripDetails(details, elements.details);
      renderTripItems(items, categories, elements.checklist);
      renderPlacesDetails(places, elements.places);

      // DODAJ TO DLA MOBILE:
      if (window.innerWidth <= 768) {
        document.body.classList.add('trip-selected');

        document.querySelectorAll('#content section').forEach(s => s.classList.remove('active-section'));
        document.getElementById('trip-details-section').classList.add('active-section');

        document.querySelectorAll('#mobile-tabs button').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="trip-details-section"]')?.classList.add('active');

        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Błąd ładowania:", error);
    }
  }

  // Add new Trip
  // newTripBtn = document.getElementById('add-new-trip');
  elements.sidebar.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.id === 'add-new-trip') {
      const newTrip = {
        title: 'New Trip',
        description: 'opis',
        departureDate: new Date().toISOString(),
        isVisited: false,
        authorId: userId
      }

      const savedTrip = await saveTrip(-1, userId, newTrip);
      handleTripSelection(savedTrip.id);
      const trips = await fetchTrips(userId);
      renderTripList(trips, elements.sidebar, handleTripSelection, savedTrip.id);
      return;
    }
  });

  // Trip Info Events
  elements.details.addEventListener('click', async (e) => {
    const target = e.target;
    if (!['BUTTON', 'INPUT'].includes(target.tagName)) return;

    const tripId = getActiveTripId();

    // 0. Update status
    if (target.type === 'checkbox') {
      const isVisited = target.checked;
      const details = await fetchTripDetails(tripId, userId);

      try {
        await saveTrip(tripId, userId, { ...details, isVisited });
        handleTripSelection(tripId);
        const trips = await fetchTrips(userId);
        renderTripList(trips, elements.sidebar, handleTripSelection, tripId);
      } catch (err) { alert("Błąd zapisu"); }

      return;
    }

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
      await saveTrip(tripId, userId, updatedData);
      handleTripSelection(tripId);
      const trips = await fetchTrips(userId);
      renderTripList(trips, elements.sidebar, handleTripSelection, tripId);
    }

    if (target.id === 'delete-btn') {
      if (confirm("Usunąć?")) {
        await deleteTrip(tripId, userId);
        const savedTrip = await fetchTrips(userId);
        handleTripSelection(savedTrip.id);
        renderTripList(trips, elements.sidebar, handleTripSelection, tripId);
      }
    }
  });


  // === Place add/edit/delete
  elements.places.addEventListener('click', async (e) => {
    const target = e.target;
    if (!['BUTTON', 'INPUT'].includes(target.tagName)) return;

    const tripId = getActiveTripId();
    const placeId = parseInt(target.dataset.id);

    // 0. Update status
    if (target.type === 'checkbox') {
      const isVisited = target.checked;
      const place = currentPlaces.find(p => p.id === placeId);

      try {
        await savePlace(placeId, userId, { ...place, isVisited });
        place.isVisited = isVisited;
        await refreshPlacesView(tripId);
      } catch (err) { alert("Błąd zapisu"); }

      return;
    }
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

  // === Items add/edit/delete
  elements.checklist.addEventListener('click', async (e) => {
    const target = e.target;
    if (!['BUTTON', 'INPUT'].includes(target.tagName)) return;

    const tripId = getActiveTripId();
    const itemId = parseInt(target.dataset.id);
    const categories = await fetchCategories(userId);

    // 0. Update status
    if (target.type === 'checkbox') {
      const isPacked = target.checked;
      const item = currentItems.find(i => i.id === itemId);

      try {
        await saveItem(itemId, userId, { ...item, isPacked });
        item.isPacked = isPacked;
        await refreshItemsView(tripId);
      } catch (err) { alert("Błąd zapisu"); }

      return;
    }

    // 1. Delete
    if (target.id === 'delete-btn') {
      if (confirm("Usunąć?")) {
        await deleteItem(itemId, userId);
        await refreshItemsView(tripId);
      }
      return;
    }

    // 2. Edit
    if (target.id === 'edit-btn') {
      const item = currentItems.find(i => i.id === itemId);
      if (item) renderItemsEditForm(item, target.closest('.item-row'));
      return;
    }

    // 3. Cancel
    if (target.id === 'cancel-btn') {
      renderTripItems(currentItems, categories, elements.checklist);
      return;
    }

    // 4. Save
    if (target.id === 'save-item-btn') {
      const categoryId = target.dataset.categoryId;

      const newItem = {
        title: document.getElementById('edit-item-title').value,
        tripId: parseInt(tripId),
        categoryId: parseInt(categoryId),
        isPacked: false
      };

      try {
        await saveItem(itemId, userId, newItem);
        await refreshItemsView(tripId);
      } catch (err) { alert("Błąd zapisu"); }
      return;
    }

    // 5. Add New Item
    if (target.id === 'add-item') {
      const categoryId = target.dataset.categoryId;
      const newItem = { id: -1, title: "", categoryId: parseInt(categoryId), isPacked: false };
      const row = document.createElement('li');
      row.className = 'item-row new-item-form';
      target.before(row);
      renderItemsEditForm(newItem, row);
      target.style.display = 'none';
      return;
    }

    // 6. Add New Categorie
    if (target.id === 'add-categorie') {
      const row = document.createElement('div');
      row.className = 'categorie-row';
      target.before(row);
      renderNewCategoryForm(categories, row);
      target.style.display = 'none';
      return;
    }

    // 7. Save Categorie
    if (target.id === "save-categorie-btn") {
      const select = document.getElementById('select-category');
      const firstItemTitle = document.getElementById('first-item-title').value;

      let categoryId = select.value;
      let categoryTitle = "";

      if (categoryId === 'new') {
        categoryTitle = document.getElementById('new-category-title').value;
        if (!categoryTitle) return alert("Podaj nazwę nowej kategorii!");

        const newCategory = {
          title: categoryTitle,
          userId: userId
        };

        try {
          const savedCategory = await saveCategorie(-1, userId, newCategory);
          categoryId = savedCategory.id;
        } catch (err) {
          return alert("Błąd podczas tworzenia kategorii");
        }
      }

      if (!categoryId || !firstItemTitle) return alert("Wypełnij wszystkie pola!");

      const newItem = {
        title: firstItemTitle,
        tripId: parseInt(tripId),
        categoryId: parseInt(categoryId),
        isPacked: false
      };

      try {
        await saveItem(itemId, userId, newItem);
        await refreshItemsView(tripId);
      } catch (err) { alert("Błąd zapisu"); }
      return;
    }
  });

  elements.checklist.addEventListener('change', (e) => {
    if (e.target.id === 'select-category') {
      const inputGroup = document.getElementById('new-cat-input-group');
      inputGroup.style.display = (e.target.value === 'new') ? 'block' : 'none';
    }
  });

  // -=== Mobile ===-
  const btnBack = document.getElementById('mobile-btn-back');
  if (btnBack) {
    btnBack.textContent = "← Wróć do listy";
    btnBack.addEventListener('click', () => {
      document.body.classList.remove('trip-selected');
      window.scrollTo(0, 0);
    });
  }

  document.getElementById('mobile-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const tabId = btn.dataset.tab;

    document.querySelectorAll('#content section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('#mobile-tabs button').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-section');
    btn.classList.add('active');
  });

  // Init
  fetchTrips(userId).then(trips => renderTripList(trips, elements.sidebar, handleTripSelection));
}