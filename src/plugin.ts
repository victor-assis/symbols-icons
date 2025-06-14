import JSZip from 'jszip';
import { Base64 } from 'js-base64';
import { generateSFSymbol } from './shared/convertSFSymbol';
import templateUrl from './shared/template.svg';

const ICON_WIDTH = 32;
const ICON_HEIGHT = 32;

function bytesToString(bytes: Uint8Array): string {
  return Base64.decode(Base64.fromUint8Array(bytes));
}

const templateData = templateUrl.split(',')[1];
const templateBytes = Base64.toUint8Array(templateData);
const template = bytesToString(templateBytes);

figma.showUI(__html__, { width: 490, height: 840 });

interface IconData {
  name: string;
  svg: string;
}

function findAllIconNodes(): SceneNode[] {
  return figma.currentPage.findAll((node) => {
    if ('width' in node && 'height' in node) {
      return node.width === ICON_WIDTH && node.height === ICON_HEIGHT;
    }
    return false;
  });
}

async function exportAllIcons(): Promise<IconData[]> {
  const nodes = findAllIconNodes();
  if (nodes.length) {
    figma.currentPage.selection = nodes;
  }
  const icons = await Promise.all(
    nodes.map(async (node) => {
      const bytes = await node.exportAsync({ format: 'SVG' });
      const svg = bytesToString(bytes);
      return { name: node.name, svg };
    }),
  );
  return icons;
}

async function sendPreview() {
  const icons = await exportAllIcons();
  figma.ui.postMessage({ type: 'preview-icons', icons });
}

sendPreview();

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-icons') {
    const icons = await exportAllIcons();
    const zip = new JSZip();
    for (const icon of icons) {
      try {
        const converted = generateSFSymbol(template, icon.svg);
        zip.file(`${icon.name}.svg`, converted);
      } catch (err) {
        console.error(err);
      }
    }
    const data = await zip.generateAsync({ type: 'base64' });
    figma.ui.postMessage({ type: 'zip', data });
    figma.notify(`Generated ${icons.length} icons`);
  }
};
