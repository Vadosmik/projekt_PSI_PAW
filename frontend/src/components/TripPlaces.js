// ==== Render Listy Miejsc ====
export function renderPlacesDetails(places, container) {
  const sortedPlaces = [...places].sort((a, b) => a.isVisited - b.isVisited);
  
  container.innerHTML = `
    <div class="places-header">
      <h3>Places to visit</h3>
    </div>
    <div class="places-description">
      <ul class="places-list">
        ${sortedPlaces.map(item => `
          <li class="place-row" data-id="${item.id}">
            <div class="place-main">
              <label class="place-checkbox-label">
                <input type="checkbox" 
                       class="place-checkbox" 
                       ${item.isVisited ? 'checked' : ''} 
                       data-id="${item.id}">
                <div class="place-info">
                  <span class="place-title">${item.title}</span>
                  <p class="place-desc">${item.description || "Brak opisu"}</p>
                </div>
              </label>
              <div class="extra-option">
                <button class="edit-btn" id="edit-btn" data-id="${item.id}">edit</button>
                <button class="delete-btn" id="delete-btn" data-id="${item.id}">×</button>
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
      <button class="btn new-btn" id="add-place">+ Dodaj nowe miejsce</button>
    </div>
  `;
}

// ==== Render Formularza Edycji ====
export function renderPlaceEditForm(place, container) {
  const isNew = place.id === -1;

  container.innerHTML = `
    <div class="edit-form">
      <div class="form-group">
        <label for="edit-place-title">Nazwa miejsca</label>
        <input type="text" id="edit-place-title" value="${place.title || ''}" class="input-edit" placeholder="Gdzie chcesz iść?">
      </div>
      <div class="form-group">
        <label for="edit-place-description">Opis</label>
        <textarea id="edit-place-description" class="input-edit" placeholder="Co tam ciekawego?">${place.description || ""}</textarea>
      </div>
      <div class="edit-actions">
        <button class="edit-btn" id="save-place-btn" data-id="${place.id}"> ${isNew ? 'Dodaj' : 'Zapisz'} </button> <!-- class save-btn -->
        <button class="edit-btn"  id="cancel-btn"  data-id="${place.id}"> Anuluj </button> <!-- class cancel-btn -->
      </div>
    </div>
  `;

  setTimeout(() => document.getElementById('edit-place-title')?.focus(), 0);
}