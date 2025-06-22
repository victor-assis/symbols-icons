/* eslint-env browser */
/* global document */

async function loadSymbols() {
  const res = await fetch('icons-symbol.svg');
  const text = await res.text();
  document.getElementById('symbols-container').innerHTML = text;
}

async function loadIcons() {
  const res = await fetch('icons.json');
  const icons = await res.json();
  const list = document.getElementById('icons-list');
  list.innerHTML = '';
  icons.forEach((icon) => {
    const li = document.createElement('li');
    li.innerHTML = `\
      <svg class="icon"><use href="#${icon.name}"></use></svg>\
      <span>${icon.name}</span>\
      <button class="copy-btn" data-name="${icon.name}">Copy</button>`;
    li.querySelector('button').addEventListener('click', (e) => {
      const name = e.currentTarget.getAttribute('data-name');
      navigator.clipboard.writeText(name);
      e.currentTarget.textContent = 'Copied!';
      setTimeout(() => {
        e.currentTarget.textContent = 'Copy';
      }, 1000);
    });
    list.appendChild(li);
  });
}

document.getElementById('format').addEventListener('change', (e) => {
  document.getElementById('icons-list').className = e.target.value;
});

loadSymbols();
loadIcons();
document.getElementById('icons-list').className = 'grid';
