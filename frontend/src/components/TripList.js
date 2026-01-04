export function renderTripList(trips, container, onSelectTrip, whoActive) {
  container.innerHTML = '<h3>Twoje wycieczki</h3>';

  const list = document.createElement('ul');
  list.className = 'trip-menu-list';

  if (!trips || trips.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = `
          <button class="btn new-btn" id="add-new-trip">Dodaj pierwszą!</button>
        `;
    list.appendChild(li);

    container.appendChild(list);
    return;
  }

  trips.forEach(trip => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="btn ${trip.id === Number(whoActive) ? 'active' : ''} " data-id="${trip.id}">
      ${trip.title} 
      </button>
      `;

    li.querySelector('button').addEventListener('click', () => {
      
        list.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        li.querySelector('button').classList.add('active');
        onSelectTrip(trip.id);
    });

    list.appendChild(li);
  });

  const li = document.createElement('li');
  li.innerHTML = `
      <button class="btn new-btn" id="add-new-trip">
      Dodaj nową!
      </button>
      `;
  list.appendChild(li);

  container.appendChild(list);
}