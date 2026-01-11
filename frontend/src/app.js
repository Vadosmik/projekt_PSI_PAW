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
  if (window.appInitialized) return; 
  window.appInitialized = true;

  // 1. Centralny stan aplikacji
  const state = {
    userId,
    currentPlaces: [],
    currentItems: [],
    getActiveTripId: () => document.getElementById('trip-id')?.textContent.trim()
  };

  // 2. DOM Elements
  const elements = {
    sidebar: document.getElementById('trip-list-container'),
    details: document.getElementById('trip-info-content'),
    checklist: document.getElementById('checklist-content'),
    places: document.getElementById('place-content')
  };

  // --- FUNKCJE POMOCNICZE (ODŚWIEŻANIE WIDOKU) ---
  const refreshUI = {
    sidebar: async () => {
      const trips = await fetchTrips(state.userId);
      renderTripList(trips, elements.sidebar, actions.selectTrip, state.getActiveTripId());
    },

    details: async (tripId) => {
      const details = await fetchTripDetails(tripId, state.userId);
      state.currentDetails = details;
      renderTripDetails(details, elements.details);
    },

    places: async (tripId) => {
      state.currentPlaces = await fetchTripPlaces(tripId, state.userId);
      renderPlacesDetails(state.currentPlaces, elements.places);
    },

    items: async (tripId) => {
      const [items, categories] = await Promise.all([
        fetchTripItems(tripId, state.userId),
        fetchCategories(state.userId)
      ]);
      state.currentItems = items;
      state.categories = categories;
      renderTripItems(items, categories, elements.checklist);
    }
  };

  const setupMobileView = () => {
    if (window.innerWidth <= 868) {
      document.body.classList.add('trip-selected');

      // 1. Pokaż sekcję info jako domyślną po kliknięciu
      document.querySelectorAll('#content section').forEach(s => s.classList.remove('active-section'));
      document.getElementById('trip-details-section').classList.add('active-section');

      // 2. Aktywuj odpowiedni tab w dolnej nawigacji
      document.querySelectorAll('#mobile-tabs button').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-tab="trip-details-section"]')?.classList.add('active');

      window.scrollTo(0, 0);
    }
  };

  // niemnogo nie ponimaju
  // --- AKCJE (LOGIKA BIZNESOWA) --- 
  const actions = {
    selectTrip: async (id) => {
      elements.details.innerHTML = '<p class="loader">Ładowanie...</p>';
      try {
        await Promise.all([
          refreshUI.details(id),
          refreshUI.items(id),
          refreshUI.places(id)
        ]);

        setupMobileView();

      } catch (e) { console.error(e); }
    },

    addNewTrip: async () => {
      // === TRIPS ===
      const newTripData = {
        title: 'New Trip',
        description: '',
        departureDate: new Date().toISOString(),
        isVisited: false,
        authorId: state.userId
      };
      const savedTrip = await saveTrip(-1, state.userId, newTripData);
      await refreshUI.sidebar();
      await actions.selectTrip(savedTrip.id);
    },

    updateTrip: async (tripId, updatedData) => {
      await saveTrip(tripId, state.userId, updatedData);
      await refreshUI.sidebar();
      await refreshUI.details(tripId);
    },

    deleteTrip: async (tripId) => {
      if (!confirm("Usunąć wycieczkę?")) return;
      await deleteTrip(tripId, state.userId);
      await refreshUI.sidebar();
      // Czyścimy widok
      elements.details.innerHTML = '<p>Wybierz wycieczkę</p>';
      elements.checklist.innerHTML = '';
      elements.places.innerHTML = '';
    },

    // === PLACES ===
    updatePlace: async (placeId, updatedData) => {
      await savePlace(placeId, state.userId, updatedData);
      await refreshUI.places(state.getActiveTripId());
    },

    deletePlace: async (placeId) => {
      if (!confirm("Usunąć miejsce?")) return;
      await deletePlace(placeId, state.userId);
      await refreshUI.places(state.getActiveTripId());
    },

    // === ITEMS ===
    updateItem: async (itemId, updatedData) => {
      await saveItem(itemId, state.userId, updatedData);
      await refreshUI.items(state.getActiveTripId());
    },

    deleteItem: async (itemId) => {
      if (!confirm("Usunąć przedmiot?")) return;
      await deleteItem(itemId, state.userId);
      await refreshUI.items(state.getActiveTripId());
    },

    handleSaveCategory: async () => {
      const select = document.getElementById('select-category');
      const newCatTitle = document.getElementById('new-category-title').value.trim();
      const firstItem = document.getElementById('first-item-title').value.trim();
      const tripId = state.getActiveTripId();

      let categoryId = select.value;

      // WALIDACJA
      if (categoryId === 'new' && !newCatTitle) {
        alert("Wpisz nazwę nowej kategorii!");
        return;
      }
      if (!firstItem) {
        alert("Wpisz nazwę pierwszego przedmiotu!");
        return;
      }
      if (!categoryId) {
        alert("Wybierz kategorię lub stwórz nową!");
        return;
      }

      try {
        if (categoryId === 'new') {
          const savedCat = await saveCategorie(-1, state.userId, { title: newCatTitle, userId: state.userId })
          categoryId = savedCat.id;
        }

        await saveItem(-1, state.userId, {
          title: firstItem,
          categoryId: parseInt(categoryId),
          tripId: parseInt(tripId),
          isPacked: false
        });

        await refreshUI.items(tripId);
      } catch (error) {
        console.error("Błąd podczas zapisywania:", error);
        alert("Nie udało się zapisać. Spróbuj ponownie.");
      }
    }
  };

  // --- EVENT LISTENERS ---
  // === 0. Sidebar (Lista wycieczek i Nowa wycieczka) ===
  elements.sidebar.addEventListener('click', async (e) => {
    e.stopImmediatePropagation();
    const { target } = e;
    
    // Obsługa przycisku "Nowa wycieczka"
    if (target.id === 'add-new-trip') {
      await actions.addNewTrip();
      return;
    }
  });

  // === 1. Trip Details ===
  elements.details.addEventListener('click', async (e) => {
    const { target } = e;
    const tripId = state.getActiveTripId();
    if (!tripId) return;

    const handlers = {
      'edit-btn': () => renderTripEditForm(state.currentDetails, elements.details),
      'cancel-btn': () => renderTripDetails(state.currentDetails, elements.details),
      'delete-btn': () => actions.deleteTrip(tripId),
      'save-trip-btn': () => {
        const updatedData = {
          ...state.currentDetails,
          title: document.getElementById('edit-title').value,
          departureDate: document.getElementById('edit-date').value,
          description: document.getElementById('edit-description').value,
        };
        actions.updateTrip(tripId, updatedData);
      }
    };

    if (target.type === 'checkbox') {
      actions.updateTrip(tripId, { ...state.currentDetails, isVisited: target.checked });
      return;
    }

    handlers[target.id]?.();
  });

  // === 2. Items (Checklist) ===
  elements.checklist.addEventListener('click', async (e) => {
    const { target } = e;
    const tripId = state.getActiveTripId();

    // 1. Obsługa globalnych przycisków (Add Category)
    if (target.id === 'add-categorie') {
      const row = document.createElement('div');
      row.className = 'categorie-row';
      target.before(row);
      renderNewCategoryForm(state.categories || [], row);
      target.style.display = 'none';
      return;
    }

    if (target.id === 'save-categorie-btn') {
      await actions.handleSaveCategory();
      return;
    }

    // 2. Obsługa przycisku Cancel
    if (target.id === 'cancel-btn') {
      await refreshUI.items(tripId);
      return;
    }

    // 3. Obsługa Add Item (nowy przedmiot)
    if (target.id === 'add-item') {
      const catId = target.dataset.categoryId;
      const newItem = { id: -1, title: "", categoryId: parseInt(catId), isPacked: false };
      const row = document.createElement('li');
      row.className = 'item-row new-item-form';
      target.before(row);
      renderItemsEditForm(newItem, row);
      target.style.display = 'none';
      return;
    }

    // 4. Obsługa akcji wymagających konkretnego ID przedmiotu
    const itemId = parseInt(target.dataset.id);
    if (target.dataset.id === undefined) return;

    const item = state.currentItems.find(i => i.id === itemId);
    if (!item && itemId !== -1) return;

    const handlers = {
      'edit-btn': () => renderItemsEditForm(item, target.closest('.item-row')),
      'delete-btn': () => actions.deleteItem(itemId),
      'save-item-btn': async () => {
        const row = target.closest('.item-row');
        const input = row.querySelector('#edit-item-title');
        const tripId = state.getActiveTripId();

        const currentId = parseInt(target.dataset.id);
        const catId = parseInt(target.dataset.categoryId);

        const itemData = {
          title: input.value,
          tripId: parseInt(tripId),
          categoryId: catId,
          isPacked: false
        };

        if (currentId !== -1) {
          const item = state.currentItems.find(i => i.id === currentId);
          itemData.isPacked = item ? item.isPacked : false;
        }

        await saveItem(currentId, state.userId, itemData);
        await refreshUI.items(tripId);
      }
    };

    if (target.type === 'checkbox') {
      actions.updateItem(itemId, { ...item, isPacked: target.checked });
      return;
    }

    handlers[target.id]?.();
  });

  elements.checklist.addEventListener('change', (e) => {
    if (e.target.id === 'select-category') {
      const newCatGroup = document.getElementById('new-cat-input-group');
      if (newCatGroup) {
        newCatGroup.style.display = e.target.value === 'new' ? 'block' : 'none';
      }
    }
  });

  // === 3. Places ===
  elements.places.addEventListener('click', async (e) => {
    const { target } = e;
    const tripId = state.getActiveTripId();

    // 3. Obsługa Add Place (nowe miejsce)
    if (target.id === 'add-place') {
      const newPlace = { id: -1, title: "", description: "", tripId: parseInt(tripId), isVisited: false };
      const formWrapper = document.createElement('div');
      formWrapper.className = 'place-row new-place-form';
      target.before(formWrapper);
      renderPlaceEditForm(newPlace, formWrapper);
      target.style.display = 'none';
      return;
    }

    const placeId = parseInt(target.dataset.id);
    if (!placeId) return;

    const place = state.currentPlaces.find(p => p.id === placeId);

    const handlers = {
      'edit-btn': () => renderPlaceEditForm(place, target.closest('.place-row')),
      'cancel-btn': () => refreshUI.places(state.getActiveTripId()),
      'delete-btn': () => actions.deletePlace(placeId),
      'save-place-btn': async () => {
        const row = target.closest('.edit-form');
        const updatedData = {
          title: row.querySelector('#edit-place-title').value,
          description: row.querySelector('#edit-place-description').value,
          tripId: parseInt(tripId),
          isVisited: place ? place.isVisited : false
        };

        await actions.updatePlace(placeId, updatedData);
      }
    };

    if (target.type === 'checkbox') {
      actions.updatePlace(placeId, { ...place, isVisited: target.checked });
      return;
    }

    handlers[target.id]?.();
  });

  // === MOBILE ===

  // 1. Obsługa przycisku powrotu na mobile
  const btnBack = document.getElementById('mobile-btn-back');
  if (btnBack) {
    btnBack.textContent = "← Wróć do listy";
    btnBack.addEventListener('click', () => {
      document.body.classList.remove('trip-selected');
      window.scrollTo(0, 0);
    });
  }

  // 2. Obsługa przełączania zakładek na dole (mobile tabs)
  document.getElementById('mobile-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const tabId = btn.dataset.tab;

    // Przełączanie widoczności sekcji
    document.querySelectorAll('#content section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(tabId)?.classList.add('active-section');

    // Wizualna zmiana aktywnego przycisku
    document.querySelectorAll('#mobile-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  refreshUI.sidebar();
}