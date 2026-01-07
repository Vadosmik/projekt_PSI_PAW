import { deleteUser } from "../services/api";

const btn = document.getElementById('color-theme');

// Funkcja toggle
btn.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab, .form').forEach(el => el.classList.remove('active'));

    tab.classList.add('active');

    const target = tab.getAttribute('data-target');
    document.getElementById(target).classList.add('active');
  });
});

document.getElementById('account').addEventListener("click", () => {
  const loginContainer = document.querySelector('#login-contener');

  const currentDisplay = window.getComputedStyle(loginContainer).display;

  if (currentDisplay === 'flex') {
    loginContainer.style.display = 'none';
  } else {
    loginContainer.style.display = 'flex';
  }
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-btn') {
    sessionStorage.clear();
    window.location.reload();
  }
  if (e.target.id === 'delete-account-btn') {
    if (confirm("Czy na pewno chcesz usunąć konto?")) {
      const uId = sessionStorage.getItem('userId');
      deleteUser(uId).then(() => {
        sessionStorage.clear();
        window.location.reload();
      }).catch(err => alert(err.message));
    }
  }
});