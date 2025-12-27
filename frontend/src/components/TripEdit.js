export function renderTripEditForm(details, container) {
  container.innerHTML = `
    <p id="trip-id" hidden> ${details.id} </p>
    <div class="edit-form">
      <div class="form-group">
        <label>Tytuł</label>
        <input type="text" id="edit-title" value="${details.title}" class="input-edit">
      </div>
      <div class="form-group">
        <label>Data</label>
        <input type="date" id="edit-date" value="${details.departureDate}" class="input-edit">
      </div>
      <div class="form-group">
        <label>Opis</label>
        <textarea id="edit-description" class="input-edit">${details.description || ""}</textarea>
      </div>
      <div class="edit-actions">
        <button class="edit-btn" id="save-trip-btn" data-id="${details.id}">Save</button>
        <button class="edit-btn" id="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}

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