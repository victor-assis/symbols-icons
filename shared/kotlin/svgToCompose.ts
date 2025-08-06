import { load } from 'cheerio';
import { parseSVG, makeAbsolute, CommandMadeAbsolute } from 'svg-path-parser';
import { slugify } from '../utils/slugify';
import { ISerializedSVG } from '../types/typings';

export function parsePathData(d: string): string {
  const commands = makeAbsolute(parseSVG(d));
  return commands
    .map((c: CommandMadeAbsolute) => {
      switch (c.code) {
      case 'M':
        return `moveTo(${c.x}f, ${c.y}f)`;
      case 'L':
        return `lineTo(${c.x}f, ${c.y}f)`;
      case 'H':
        return `horizontalLineTo(${c.x}f)`;
      case 'V':
        return `verticalLineTo(${c.y}f)`;
      case 'C':
        return `curveTo(${c.x1}f, ${c.y1}f, ${c.x2}f, ${c.y2}f, ${c.x}f, ${c.y}f)`;
      case 'S':
        return `reflectiveCurveTo(${c.x2}f, ${c.y2}f, ${c.x}f, ${c.y}f)`;
      case 'Q':
        return `quadTo(${c.x1}f, ${c.y1}f, ${c.x}f, ${c.y}f)`;
      case 'T':
        return `reflectiveQuadTo(${c.x}f, ${c.y}f)`;
      case 'A':
        return `arcTo(${c.rx}f, ${c.ry}f, ${c.xAxisRotation}f, ${c.largeArc}, ${c.sweep}, ${c.x}f, ${c.y}f)`;
      case 'Z':
        return 'close()';
      default:
        return `/* Unsupported command: ${c.code} */`;
      }
    })
    .join('\n            ');
}

function parseColor(color = '#000'): string {
  const c = color.toLowerCase();
  if (c === 'none') return 'Color.Transparent';
  if (c === 'black') return 'Color.Black';
  if (c === 'white') return 'Color.White';
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((h) => h + h)
        .join('');
    }
    return `Color(0xFF${hex.toUpperCase()})`;
  }
  return 'Color.Black';
}

export function svgToCompose(svg: string, name = 'MyIcon'): string {
  const $ = load(svg);
  const svgNode = $('svg');
  const width = parseFloat(svgNode.attr('width') || '24');
  const height = parseFloat(svgNode.attr('height') || '24');
  const vbParts = (svgNode.attr('viewBox') || `0 0 ${width} ${height}`).split(/\s+/);
  const vbWidth = parseFloat(vbParts[2]) || width;
  const vbHeight = parseFloat(vbParts[3]) || height;

  const paths = $('path')
    .toArray()
    .map((p) => {
      const d = $(p).attr('d') || '';
      const fill = parseColor($(p).attr('fill') || '#000');
      return `path(
        fill = SolidColor(${fill}),
        stroke = null,
        strokeLineWidth = 0.0f,
        pathFillType = PathFillType.NonZero
    ) {
            ${parsePathData(d)}
    }`;
    })
    .join('\n    ');

  return `val ${name.replace(/[-\\s]/g, '_')} = ImageVector.Builder(
    name = "${name}",
    defaultWidth = ${width}.dp,
    defaultHeight = ${height}.dp,
    viewportWidth = ${vbWidth}f,
    viewportHeight = ${vbHeight}f
).apply {
    ${paths}
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
  packageName = 'com.example.icons',
): { name: string; content: string }[] {
  return icons.map((icon) => {
    const name = toPascalCase(icon.name);
    const def = svgToCompose(icon.svg, name);
    const content = `package ${packageName}

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

${def}`;

    return { name: `${name}.kt`, content };
  });
}

