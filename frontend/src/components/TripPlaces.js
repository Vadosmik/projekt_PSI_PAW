// ==== Render ====
export function renderPlacesDetails(places, container) {
  container.innerHTML = `
  <div class="places-header">
    <h3>Place to visit</h3>
  </div>
  <div class="places-description">
    <ul class="places-list">
      ${places.map(item => `
        <li class="place-row">
          <div class="place-main">
            <label class="place-checkbox-label">
              <input type="checkbox" ${item.isVisited ? 'checked' : ''} data-id="${item.id}">
              <div class="place-info">
                <span class="place-title">${item.title}</span>
                <p class="place-desc">${item.description || ""}</p>
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

// ==== Edit ====
export function renderPlaceEditForm(place, container) {
  // Containerem tutaj będzie konkretny <li> lub div, który edytujemy
  container.innerHTML = `
    <div class="edit-form">
      <div class="form-group">
        <label>Nazwa miejsca</label>
        <input type="text" id="edit-place-title" value="${place.title}" class="input-edit">
      </div>
      <div class="form-group">
        <label>Opis</label>
        <textarea id="edit-place-description" class="input-edit">${place.description || ""}</textarea>
      </div>
      <div class="edit-actions">
        <button class="edit-btn" id="save-place-btn" data-id="${place.id}" data-trip-id="${place.tripId}">Save</button>
        <button class="edit-btn" id="cancel-place-edit-btn" data-trip-id="${place.tripId}">Cancel</button>
      </div>
    </div>
  `;
}