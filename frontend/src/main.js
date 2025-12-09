import './style.css'
// import { nazwaJakChceUzyc } from './gdzie/plik'

document.querySelector('#app').innerHTML = `
<h1> Hello My App </h1>
<button id="color-theme">Zmień motyw</button>
`

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