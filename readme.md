# Symbols Icons

A Figma plugin to export selected vector layers as a set of icons. The plugin can
output several formats such as:

- individual SVG files
- an SVG sprite using `<symbol>` elements
- JSON metadata describing each icon
- SF Symbols compatible SVGs
- an optional HTML demo showing all icons

## Development

Install the dependencies and start both the plugin and UI in watch mode:

```bash
npm install
npm run dev
```

The compiled plugin will be placed in `dist/` and can be loaded into Figma for
development.

To create a production build run:

```bash
npm run build
```

## Example page

The `shared/example` folder contains a small demo used when exporting the
`example` option. Open `index.html` in a browser to preview your icons. Each icon
includes a button that copies its name to the clipboard.
