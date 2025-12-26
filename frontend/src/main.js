import './components/Theme.js'
import { fetchTrips } from './services/api.js';
import { renderTripList } from './components/TripList.js'

const sidebar = document.getElementById('trip-list-container');
const mainContent = document.getElementById('content');

const trips = await fetchTrips(2);
renderTripList(trips, sidebar);