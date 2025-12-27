export function renderTripList(trips, container, onSelectTrip) {
  container.innerHTML = '<h3>Twoje wycieczki</h3>';

  const list = document.createElement('ul');
  list.className = 'trip-menu-list';

  if (!trips || trips.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = `
                <button class="btn new-btn">Dodaj pierwszą!</button>
        `;
    list.appendChild(li);

    container.appendChild(list);
    return;
  }

  trips.forEach(trip => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="btn" data-id="${trip.id}">
      ${trip.title} 
      </button>
      `;

    li.querySelector('button').addEventListener('click', () => {
        onSelectTrip(trip.id);
    });

    list.appendChild(li);
  });

  const li = document.createElement('li');
  li.innerHTML = `
      <button class="btn new-btn">
      Dodaj nową!
      </button>
      `;
  list.appendChild(li);

  container.appendChild(list);
}