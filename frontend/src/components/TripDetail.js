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
    </div>
  `;
}

export function renderTripItems(items, categories, container) {
  // 1. Grupowanie przedmiotów po categoryId
  const groupedItems = items.reduce((acc, item) => {
    const catId = item.categoryId || "other";
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {});

  // 2. Mapowanie kategorii na nazwy (używamy przekazanej tablicy categories)
  const getCategoryName = (id) => {
    const category = categories.find(c => c.id == id);
    return category ? category.title : "Inne";
  };

  container.innerHTML = `
    <div class="info-header">
      <h3>Check List</h3>
    </div>
    <div class="checklist-content">
      ${Object.keys(groupedItems).map(catId => `
        <div class="category-block">
          <h4>${getCategoryName(catId)}</h4>
          <ul class="items-list">
            ${groupedItems[catId].map(item => `
              <li class="item-row">
                <label>
                  <input type="checkbox" ${item.isPacked ? 'checked' : ''} data-id="${item.id}">
                  <span class="item-name">${item.title}</span> 
                </label>
                <div class="extra-option">
                  <button class="edit-btn" id="edit-btn" data-id="${item.id}">edit</button>
                  <button class="delete-btn" id="delete-btn" data-id="${item.id}">×</button>
                </div>
              </li>
            `).join('')}
          </ul>
          <button class="btn new-btn" data-category="${catId}">+ Dodaj przedmiot</button>
        </div>
      `).join('')}
      <button class="btn new-btn">+ Nowa kategoria</button>
    </div>
  `;
}

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