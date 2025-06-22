import { IJsonType } from '../types/typings';

export interface ExampleFile {
  name: string;
  content: string;
}

export function generateExample(
  json: IJsonType[],
  symbol: string,
): ExampleFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Icons Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Icons Demo</h1>
  <div id="symbols" style="display:none">${symbol}</div>
  <div class="format">
    <label for="format">Format:</label>
    <select id="format">
      <option value="list">List</option>
      <option value="grid">Grid</option>
    </select>
  </div>
  <ul id="icons" class="list"></ul>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `body{font-family:sans-serif;margin:20px;}\n#icons.list li{display:flex;align-items:center;margin-bottom:8px;}\n#icons.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px;padding:0;}\n#icons li{list-style:none;}\n.icon{width:40px;height:40px;margin-right:8px;}\n.format{margin-bottom:16px;}`;

  const names = json.map((i) => ({ name: i.name }));
  const js = `/* eslint-env browser */\n/* global document */\nconst icons=${JSON.stringify(
    names,
  )};\nfunction load(){const list=document.getElementById('icons');list.innerHTML='';icons.forEach(icon=>{const li=document.createElement('li');li.innerHTML='<svg class="icon"><use href="#'+icon.name+'"></use></svg><span>'+icon.name+'</span>';list.appendChild(li);});}document.getElementById('format').addEventListener('change',e=>{document.getElementById('icons').className=e.target.value;});load();`;

  return [
    { name: 'index.html', content: html },
    { name: 'style.css', content: css },
    { name: 'script.js', content: js },
    { name: 'icons.json', content: JSON.stringify(json, null, 2) },
    { name: 'icons-symbol.svg', content: symbol },
  ];
}
