export function renderTripList(trips, container) {
  container.innerHTML = '<h3>Twoje wycieczki</h3>';

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

  container.appendChild(list);
}