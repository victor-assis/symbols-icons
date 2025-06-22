/**
 * Utilities to convert exported SVGs into SF Symbols templates.
 */
import { load, CheerioAPI } from 'cheerio';

const DEFAULT_ICON_SIZE = 32;
const ADDITIONAL_SCALING = 1.7;
const MARGIN_LINE_WIDTH = 0.5;
const ADDITIONAL_HORIZONTAL_MARGIN = 4;

const SPACE_BETWEEN_CENTERS = 296.71;
const FONT_SCALES = ['S', 'M', 'L'];
const FONT_WEIGHTS = [
  'Ultralight',
  'Thin',
  'Light',
  'Regular',
  'Medium',
  'Semibold',
  'Bold',
  'Heavy',
  'Black',
];
const SYMBOL_SCALE_ADDITIONS = [
  0.001, 0.002, 0.003, 0.004, 0.04, 0.03, 0.03, 0.06, 0.04,
];
const BASE_SYMBOL_SCALE = 0.775;

/**
 * Read a guide value from the template.
 * Throws an error when the guide is missing or invalid.
 */
function getGuideValue($: CheerioAPI, axis: 'x' | 'y', xmlId: string): number {
  const node = $(`#${xmlId}`);
  if (!node.length) throw new Error(`Guide "${xmlId}" não encontrado`);
  const v1 = node.attr(`${axis}1`);
  const v2 = node.attr(`${axis}2`);
  if (v1 == null || v1 !== v2) throw new Error(`Guia "${xmlId}" inválida`);
  return parseFloat(v1);
}

/**
 * Generate a list of SF Symbol compatible SVGs based on a template.
 *
 * @param template - SVG template with guides.
 * @param icons - Icons exported from Figma.
 * @param selected - Set of selected size/weight combinations.
 * @param size - Desired output size.
 * @returns Array of SF Symbol SVG strings.
 */
export function generateSFSymbol(
  template: string,
  icons: { svg: string }[],
  selected: Set<string>,
  size = DEFAULT_ICON_SIZE,
) {
  const sfSymbols: string[] = [];

  for (const icon of icons) {
    try {
      sfSymbols.push(convertSFSymbol(template, icon.svg, selected, size));
    } catch (err) {
      console.error(err);
    }
  }

  return sfSymbols;
}

/**
 * Internal helper that modifies the template with the icon data.
 */
function convertSFSymbol(
  template: string,
  iconSvg: string,
  selected: Set<string>,
  size: number,
): string {
  const ICON_WIDTH = size;
  const ICON_HEIGHT = size;
  const $tpl = load(template, { xmlMode: true });
  const $icon = load(iconSvg, { xmlMode: true });

  const root = $icon('svg');

  const viewBoxAttr = root.attr('viewBox');
  const [, , vbWidthStr, vbHeightStr] = viewBoxAttr
    ? viewBoxAttr.split(/\s+/)
    : [];
  let vbWidth = parseFloat(vbWidthStr ?? root.attr('width') ?? String(size));
  let vbHeight = parseFloat(vbHeightStr ?? root.attr('height') ?? String(size));

  if (isNaN(vbWidth) || isNaN(vbHeight)) {
    vbWidth = size;
    vbHeight = size;
  }

  const scaleX = ICON_WIDTH / vbWidth;
  const scaleY = ICON_HEIGHT / vbHeight;

  if (scaleX !== 1 || scaleY !== 1) {
    const wrapper = $icon('<g></g>');
    wrapper.attr('transform', `scale(${scaleX} ${scaleY})`);
    root.children().each((_, ch) => {
      wrapper.append($icon(ch).clone());
    });
    root.empty();
    root.append(wrapper);
  }

  root.attr('width', String(ICON_WIDTH));
  root.attr('height', String(ICON_HEIGHT));
  root.attr('viewBox', `0 0 ${ICON_WIDTH} ${ICON_HEIGHT}`);

  const origLeft = getGuideValue($tpl, 'x', 'left-margin');
  const origRight = getGuideValue($tpl, 'x', 'right-margin');
  let baselineY = getGuideValue($tpl, 'y', 'Baseline-M');
  let caplineY = getGuideValue($tpl, 'y', 'Capline-M');

  const scale0 =
    (Math.abs(baselineY - caplineY) / ICON_HEIGHT) * ADDITIONAL_SCALING;
  const centerX = (origLeft + origRight) / 2;

  const scaledW = ICON_WIDTH * scale0;
  const scaledH = ICON_HEIGHT * scale0;

  const horizMargin =
    scaledW / 2 + MARGIN_LINE_WIDTH + ADDITIONAL_HORIZONTAL_MARGIN;
  const adjLeft = centerX - horizMargin;
  const adjRight = centerX + horizMargin;

  $tpl('#left-margin').attr('x1', String(adjLeft)).attr('x2', String(adjLeft));
  $tpl('#right-margin')
    .attr('x1', String(adjRight))
    .attr('x2', String(adjRight));

  const modifiedXml = $tpl.xml();
  const $sym = load(modifiedXml, { xmlMode: true });

  let scaleFactor = BASE_SYMBOL_SCALE;
  const regularIndex = FONT_WEIGHTS.indexOf('Regular');

  for (const fscl of FONT_SCALES) {
    baselineY = getGuideValue($tpl, 'y', `Baseline-${fscl}`);
    caplineY = getGuideValue($tpl, 'y', `Capline-${fscl}`);
    for (let wi = 0; wi < FONT_WEIGHTS.length; wi++) {
      const fw = FONT_WEIGHTS[wi];
      const checkboxId = `${fscl.toLowerCase()}-${fw.toLowerCase()}`;
      const nodeId = `${fw}-${fscl}`;
      const $node = $sym(`#${nodeId}`);
      if (!$node.length) {
        continue;
      }
      if (!selected.has(checkboxId)) {
        $node.remove();
        continue;
      }

      scaleFactor += SYMBOL_SCALE_ADDITIONS[wi];
      const finalScale = scale0 * scaleFactor;

      const idxDiff = wi - regularIndex;
      const tx =
        idxDiff < 0
          ? centerX -
            SPACE_BETWEEN_CENTERS * Math.abs(idxDiff) -
            (scaledW * scaleFactor) / 2
          : centerX +
            SPACE_BETWEEN_CENTERS * Math.abs(idxDiff) -
            (scaledW * scaleFactor) / 2;
      const ty = (baselineY + caplineY) / 2 - (scaledH * scaleFactor) / 2;
      $node.attr(
        'transform',
        `matrix(${finalScale} 0 0 ${finalScale} ${tx} ${ty})`,
      );
      $node.empty();
      $icon('svg')
        .children()
        .each((_, ch) => {
          $node.append($icon(ch).clone());
        });
    }
  }

  return $sym.xml();
}
