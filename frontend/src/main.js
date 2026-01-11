import { initApp } from './app.js';
import { login, register, deleteUser } from "./services/api.js";

let userId = sessionStorage.getItem('userId');

const elements = {
  loginContainer: document.querySelector('#login-contener'),
  appContainer: document.querySelector('#app'),
  formContener: document.querySelector('.form-contener'),
  logoutDiv: document.querySelector('.logout'),
  usernameDisplay: document.getElementById('username'),
  logoutBtn: document.getElementById('logout-btn')
};

function checkAuth() {
  const isLoggedIn = userId && userId !== "null" && userId !== "undefined";

  if (isLoggedIn) {
    if (elements.appContainer) elements.appContainer.style.display = 'block';
    if (elements.loginContainer) elements.loginContainer.style.display = 'none';
    if (elements.formContener) elements.formContener.style.display = 'none';
    if (elements.logoutDiv) elements.logoutDiv.style.display = 'block';

    elements.usernameDisplay.innerHTML = sessionStorage.getItem('username') || 'Użytkownik';

    // Inicjalizacja aplikacji
    initApp(userId);
  } else {
    if (elements.appContainer) elements.appContainer.style.display = 'none';
    if (elements.loginContainer) elements.loginContainer.style.display = 'flex';
    if (elements.formContener) elements.formContener.style.display = 'block';
    if (elements.logoutDiv) elements.logoutDiv.style.display = 'none';

    elements.usernameDisplay.innerHTML = '';
  }
}

function setupAuthListeners() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const deleteAccBtn = document.getElementById('delete-account-btn');

  // === OBSŁUGA LOGOWANIA ===
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      username: document.getElementById('login-username').value,
      password: document.getElementById('login-password').value.trim()
    };

    try {
      const result = await login(userData);
      if (result && result.id) {
        sessionStorage.setItem('userId', result.id);
        sessionStorage.setItem('username', result.username);
        userId = result.id;
        checkAuth();
      }
    } catch (err) {
      alert("Błąd logowania: " + err.message);
    }
  });

  // === OBSŁUGA REJESTRACJI ===
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


  // === OBSŁUGA WYLOGOWANIA ===
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.clear();
    userId = null;
    checkAuth();
  });


  // === OBSŁUGA USUWANIA KONTA ===
  deleteAccBtn?.addEventListener('click', async () => {
    if (confirm("Czy na pewno chcesz usunąć konto?")) {
      try {
        const uId = userId;
        await deleteUser(uId);
        sessionStorage.clear();
        userId = null;
        checkAuth();
      } catch (err) {
        alert("Błąd podczas usuwania konta: " + err.message);
      }
    }
  });
}

setupAuthListeners();
checkAuth();