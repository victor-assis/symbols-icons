import './ui.css';

interface IconData {
  name: string;
  svg: string;
}
const preview = document.querySelector<HTMLDivElement>('#output-preview');
const generateBtn = document.querySelector<HTMLButtonElement>('#generate-btn');

function renderIcons(icons: IconData[]) {
  if (!preview) return;
  preview.innerHTML = '';
  icons.forEach((ic) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col items-center p-4 bg-white rounded-lg shadow-sm';
    wrapper.innerHTML = `<div class="w-8 h-8">${ic.svg}</div><p class="text-gray-600 text-sm">${ic.name}</p>`;
    preview.appendChild(wrapper);
  });
}

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage;
  if (msg.type === 'preview-icons') {
    renderIcons(msg.icons as IconData[]);
  } else if (msg.type === 'zip') {
    const link = document.createElement('a');
    link.href = 'data:application/zip;base64,' + msg.data;
    link.download = 'icons.zip';
    link.click();
  }
};

generateBtn?.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'generate-icons' } }, '*');
});
