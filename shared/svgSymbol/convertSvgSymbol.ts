import { load } from 'cheerio';
import { ISerializedSVG } from '../types/typings';
import { slugify } from '../utils/slugify';

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
