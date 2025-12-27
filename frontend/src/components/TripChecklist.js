// ==== Render ====
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
          </ul>
          <button class="btn new-btn" data-category="${catId}">+ Dodaj przedmiot</button>
        </div>
      `).join('')}
      <button class="btn new-btn">+ Nowa kategoria</button>
    </div>
  `;
}

// ==== Edit ====
export function renderItemsEditForm(items, categories, container) { 

}