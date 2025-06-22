/**
 * Generate the example HTML files used to preview exported icons.
 */
import { IJsonType } from '../types/typings';

export interface ExampleFile {
  name: string;
  content: string;
}

/**
 * Create an example project containing HTML, CSS and JS for preview.
 *
 * @param json - Icon metadata list.
 * @param symbol - The generated SVG sprite.
 * @returns Files to be written to disk.
 */
export function generateExample(
  json: IJsonType[],
  symbol: string,
): ExampleFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Icon Preview</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Icon Preview</h1>
    <div class="format">
      <label for="format">View as:</label>
      <select id="format">
        <option value="grid">Grid</option>
        <option value="list">List</option>
      </select>
    </div>
  </header>
  <div id="symbols" style="display:none">${symbol}</div>
  <ul id="icons" class="grid"></ul>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `body{font-family:system-ui,sans-serif;margin:20px;background:#f9fafb;color:#1f2937}#icons{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:16px;padding:0}#icons.list{grid-template-columns:1fr}#icons li{list-style:none;background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05)}.icon{width:40px;height:40px}.copy-btn{padding:2px 6px;font-size:12px;border:none;border-radius:4px;background:#e5e7eb;cursor:pointer}.copy-btn:active{background:#d1d5db}`;

  const names = json.map((i) => ({ name: i.name }));
  const js = `/* eslint-env browser */\n/* global document */\nconst icons=${JSON.stringify(
    names,
  )};\nfunction load(){const list=document.getElementById('icons');list.innerHTML='';icons.forEach(icon=>{const li=document.createElement('li');li.innerHTML='<svg class="icon"><use href="#'+icon.name+'"></use></svg><span>'+icon.name+'</span><button class="copy-btn" data-name="'+icon.name+'">Copy</button>';li.querySelector("button").addEventListener("click",e=>{const n=e.currentTarget.getAttribute("data-name");navigator.clipboard.writeText(n);e.currentTarget.textContent="Copied!";setTimeout(()=>{e.currentTarget.textContent="Copy"},1e3)});list.appendChild(li);});}document.getElementById('format').addEventListener('change',e=>{document.getElementById('icons').className=e.target.value});document.getElementById('icons').className='grid';load();`;

  return [
    { name: 'index.html', content: html },
    { name: 'style.css', content: css },
    { name: 'script.js', content: js },
    { name: 'icons.json', content: JSON.stringify(json, null, 2) },
    { name: 'icons-symbol.svg', content: symbol },
  ];
}
