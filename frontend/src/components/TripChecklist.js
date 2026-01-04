// ==== Render ====
export function renderTripItems(items, categories, container) {
  // 1. Grupowanie przedmiotów po categoryId
  const groupedItems = items.reduce((acc, item) => {
    const catId = item.categoryId;
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
    <div class="checklist-header">
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
            <button class="btn new-btn" id="add-item" data-category-id="${catId}">+ Dodaj przedmiot</button>
          </ul>
        </div>
      `).join('')}
      <div class="new-category">
        <button class="btn new-btn" id="add-categorie" >+ Nowa kategoria</button>
      </div>
    </div>
  `;
}

// ==== Edit ====
export function renderItemsEditForm(item, container) {
  const catId = item.categoryId;

  container.innerHTML = `
    <input type="text" id="edit-item-title" value="${item.title}" class="input-edit">
    <div class="extra-option" style="opacity: 1;">
      <button style="padding: 5px;" class="edit-btn" id="save-item-btn" data-id="${item.id}" data-category-id="${catId}">Save</button>
      <button style="padding: 5px;" class="edit-btn" id="cancel-btn">Cancel</button>
    </div>
  `;
}

export function renderNewCategoryForm(categories, container) {
  container.innerHTML = `
    <div class="edit-form">
      <div class="form-group">
        <label>Wybierz kategorię</label>
        <select id="select-category" class="input-edit">
          <option value="">-- Wybierz istniejącą --</option>
          ${categories.map(cat => `
            <option value="${cat.id}">${cat.title}</option>
          `).join('')}
          <option value="new">Nowa kategoria...</option>
        </select>
      </div>
      <div id="new-cat-input-group" style="display: none;" class="form-group">
        <label>Nazwa nowej kategorii</label>
        <input type="text" id="new-category-title" class="input-edit" placeholder="np. Elektronika">
      </div>
      <div class="form-group">
        <label>Pierwszy przedmiot</label>
        <input type="text" id="first-item-title" class="input-edit" placeholder="np. Ładowarka">
      </div>
      <div class="edit-actions">
        <button class="edit-btn" id="save-categorie-btn" data-id="">Save</button>
        <button class="edit-btn" id="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}