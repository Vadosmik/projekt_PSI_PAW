// ==== Render ====
export function renderTripItems(items, categories, container) {
  // 1. Grupowanie przedmiotów po categoryId
  const groupedItems = items.reduce((acc, item) => {
    const catId = item.categoryId;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {});

  // Sortujemy każdą kategorię z osobna
  Object.keys(groupedItems).forEach(catId => {
    groupedItems[catId].sort((a, b) => a.isPacked - b.isPacked);
  });

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
          <div class="category-title-row">
            <h4>${getCategoryName(catId)}</h4>
          </div>
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
      <div class="new-category-section">
        <button class="btn new-btn" id="add-categorie">+ Nowa kategoria</button>
      </div>
    </div>
  `;
}

// ==== Edit ====
export function renderItemsEditForm(item, container) {
  container.innerHTML = `
    <div style="display: flex; width: 100%; align-items: center; justify-content: space-between;">
      <input type="text" id="edit-item-title" value="${item.title}" class="input-edit" 
             style="flex-grow: 1; margin-right: 10px; height: 32px; padding: 4px 8px;" autofocus>
      
      <div class="extra-option" style="opacity: 1; display: flex; gap: 5px;">
        <button class="edit-btn" id="save-item-btn" data-id="${item.id}" data-category-id="${item.categoryId}" style="white-space: nowrap;">Save</button>
        <button class="edit-btn" id="cancel-btn" style="white-space: nowrap;">Cancel</button>
      </div>
    </div>
  `;

  setTimeout(() => document.getElementById('edit-item-title')?.focus(), 0);
}

export function renderNewCategoryForm(categories, container) {
  container.innerHTML = `
    <div class="edit-form category-form">
      <h4>Dodaj kategorię i pierwszy przedmiot</h4>
      <div class="form-group">
        <select id="select-category" class="input-edit">
          <option value="">-- Wybierz kategorię --</option>
          ${categories.map(cat => `<option value="${cat.id}">${cat.title}</option>`).join('')}
          <option value="new">+ Dodaj nową kategorię</option>
        </select>
      </div>
      
      <div id="new-cat-input-group" style="display: none;" class="form-group">
        <label>Nazwa nowej kategorii</label>
        <input type="text" id="new-category-title" class="input-edit" placeholder="np. Kosmetyki">
      </div>

      <div class="form-group">
        <label>Pierwszy przedmiot w tej kategorii</label>
        <input type="text" id="first-item-title" class="input-edit" placeholder="np. Szczoteczka">
      </div>

      <div class="edit-actions">
        <button class="edit-btn" id="save-categorie-btn">Save</button>
        <button class="edit-btn" id="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}