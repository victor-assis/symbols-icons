import { load } from 'cheerio';
import { ISerializedSVG } from '../types/typings';
import { slugify } from '../utils/slugify';

export function parsePathData(d: string): string {
  return d
    .replace(/([MLHVCSQTAZmlhvcsqtaz])/g, '\n$1 ')
    .trim()
    .split('\n')
    .map((cmd) => {
      const [command, ...args] = cmd.trim().split(/[\s,]+/);
      const floatArgs = args.map((n) => parseFloat(n));
      switch (command) {
        case 'M':
          return `moveTo(${floatArgs[0]}f, ${floatArgs[1]}f)`;
        case 'L':
          return `lineTo(${floatArgs[0]}f, ${floatArgs[1]}f)`;
        case 'H':
          return `horizontalLineTo(${floatArgs[0]}f)`;
        case 'V':
          return `verticalLineTo(${floatArgs[0]}f)`;
        case 'Z':
        case 'z':
          return 'close()';
        default:
          return `/* Unsupported command: ${command} */`;
      }
    })
    .join('\n            ');
}

export function svgToCompose(svg: string, name = 'MyIcon'): string {
  const $ = load(svg);
  const svgNode = $('svg');
  const path = $('path').attr('d') || '';
  const width = parseFloat(svgNode.attr('width') || '24');
  const height = parseFloat(svgNode.attr('height') || '24');
  const vbParts = (svgNode.attr('viewBox') || `0 0 ${width} ${height}`).split(/\s+/);
  const vbWidth = parseFloat(vbParts[2]) || width;
  const vbHeight = parseFloat(vbParts[3]) || height;

  return `val ${name.replace(/[-\s]/g, '_')} = ImageVector.Builder(
    name = \"${name}\",
    defaultWidth = ${width}.dp,
    defaultHeight = ${height}.dp,
    viewportWidth = ${vbWidth}f,
    viewportHeight = ${vbHeight}f
).apply {
    path(
        fill = SolidColor(Color.Black),
        stroke = null,
        strokeLineWidth = 0.0f,
        pathFillType = PathFillType.NonZero
    ) {
            ${parsePathData(path)}
    }
}.build()`;
}

function toPascalCase(name: string): string {
  return slugify(name)
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

export function generateComposeFile(
  icons: ISerializedSVG[],
  objectName = 'Icons',
  packageName = 'com.example.icons',
): { name: string; content: string } {
  const defs = icons
    .map((icon) => svgToCompose(icon.svg, toPascalCase(icon.name)))
    .join('\n\n    ');

  const content = `package ${packageName}

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

object ${objectName} {
    ${defs.replace(/\n/g, '\n    ')}
}`;

  return { name: `${objectName}.kt`, content };
}

