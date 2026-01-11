// ==== Render ====
export function renderTripDetails(details, container) {
  container.innerHTML = `
    <div class="info-header">
      <div>
        <p id="trip-id" hidden> ${details.id} </p>
        <h3>${details.title}</h3>
        <p> ${details.departureDate}</p>
      </div>
      <input type="checkbox" ${details.isVisited ? 'checked' : ''} data-id="${details.id}">
    </div>
    <div class="info-description">
      <h4>Opis</h4>
      <p>${details.description || "Brak opisu dla tej wycieczki."}</p>
    </div>
    <div class="edit-actions">
      <button class="edit-btn" id="edit-btn" data-trip-id=${details.id}>edit</button>
      <button class="edit-btn" style="color: #ff6a6aff;" id="delete-btn" data-trip-id=${details.id}>delete</button>
    </div>
  `;
}

// ==== Edit ====
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
        <textarea id="edit-description" class="input-edit" placeholder="opis...">${details.description || ""}</textarea>
      </div>
      <div class="edit-actions">
        <button class="edit-btn" id="save-trip-btn" data-id="${details.id}">Save</button>
        <button class="edit-btn" id="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}