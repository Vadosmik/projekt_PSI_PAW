export function renderTripList(trips, container) {
  container.innerHTML = '<h3>Twoje wycieczki</h3>';
  if (!trips || trips.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <p>Nie masz jeszcze żadnych wycieczek.</p>
                <button id="add-first-trip">Dodaj pierwszą!</button>
            </div>
        `;
    return;
  }

  const list = document.createElement('ul');
  list.className = 'trip-menu-list';

  trips.forEach(trip => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="trip-btn" data-id="${trip.id}">
      ${trip.title} 
      </button>
      `;

    // li.querySelector('button').addEventListener('click', () => {
    //     onSelectTrip(trip.id);
    // });

    list.appendChild(li);
  });

  const li = document.createElement('li');
  li.innerHTML = `
      <button class="trip-btn new-trip-btn">
      Dodaj nową!
      </button>
      `;
  list.appendChild(li);

  container.appendChild(list);
}