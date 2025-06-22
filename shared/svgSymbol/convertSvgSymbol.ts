/**
 * Generate an SVG symbol sprite from a list of exported SVGs.
 * Each icon becomes a <symbol> element identified by a slugified id.
 */
import { load } from 'cheerio';
import { slugify } from '../utils/slugify';
import { ISerializedSVG } from '../types/typings';

/**
 * Build an SVG symbol string containing all icons.
 *
 * @param files - Serialized SVG list.
 * @returns SVG sprite with symbols.
 */
export function generateSvgSymbol(files: ISerializedSVG[]): string {
  const $ = load(
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>',
    { xmlMode: true },
  );
  files.forEach((file: ISerializedSVG) => {
    const svgNode = $(file.svg);
    const symbolNode = $('<symbol></symbol>');
    symbolNode.attr('viewBox', svgNode.attr('viewBox'));
    symbolNode.attr('id', slugify(file.name));
    symbolNode.append(svgNode.html() ?? '');
    $('svg').append(symbolNode);
  });

  return $.html('svg');
}
