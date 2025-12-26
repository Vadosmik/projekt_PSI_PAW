import './style.css'
import './components/Theme.js'
import { fetchTrips } from './services/api.js';
import { renderTripList } from './components/TripList.js'

const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('content');

const trips = await fetchTrips();
renderTripList(trips, sidebar);