import { initApp } from './app.js';
import { login, register } from "./services/api.js";

let userId = sessionStorage.getItem('userId');

const loginContainer = document.querySelector('#login-contener');
const appContainer = document.querySelector('#app');
const formContener = document.querySelector('.form-contener');
const logoutDiv = document.querySelector('.logout');

const username = document.getElementById('username');

function checkAuth() {
  if (userId && userId !== "null") {
    // ZALOGOWANY
    if (appContainer) appContainer.style.display = 'block';
    if (loginContainer) loginContainer.style.display = 'none';

    // Wewnątrz okna konta: ukrywamy formularze, pokazujemy przycisk wyloguj
    if (formContener) formContener.style.display = 'none';
    if (logoutDiv) logoutDiv.style.display = 'block';

    username.innerHTML = sessionStorage.getItem('username');

    initApp(userId);
  } else {
    // NIEZALOGOWANY
    if (appContainer) appContainer.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'flex';

    if (formContener) formContener.style.display = 'block';
    if (logoutDiv) logoutDiv.style.display = 'none';

    username.innerHTML = '';
  }
}

function setupAuthListeners() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // OBSŁUGA LOGOWANIA
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      username: document.getElementById('login-username').value,
      password: document.getElementById('login-password').value.trim()
    };

    try {
      const result = await login(userData);
      if (result.id) {
        sessionStorage.setItem('userId', result.id);
        sessionStorage.setItem('username', result.username);
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  // OBSŁUGA REJESTRACJI
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      email: document.getElementById('register-email').value,
      password: document.getElementById('register-password').value.trim(),
      username: document.getElementById('register-username').value
    };

    try {
      await register(userData);
      alert("Konto utworzone! Możesz się zalogować.");
      document.querySelector('[data-target="login-form"]').click();
    } catch (err) {
      alert(err.message);
    }
  });
}

setupAuthListeners();
checkAuth();