/**
 * Convert the list of serialized SVGs into a JSON representation.
 *
 * @param files - Serialized SVG information from the plugin.
 * @returns Array used to generate `icons.json`.
 */
import { slugify } from '../utils/slugify';
import { IJsonType, ISerializedSVG } from '../types/typings';

/**
 * Build the structure for `icons.json` from raw SVGs.
 *
 * @param files - SVG data exported from Figma.
 * @returns JSON ready to be written to disk.
 */
export function generateJsonFile(files: ISerializedSVG[]) {
  const json: IJsonType[] = [];

  files.forEach((file: ISerializedSVG) => {
    json.push({
      id: file.id,
      svg: file.svg,
      name: slugify(file.name),
      figmaName: file.name,
    });
  });

  return json;
}
