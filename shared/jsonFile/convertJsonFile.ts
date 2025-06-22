import { IJsonType, ISerializedSVG } from '../types/typings';
import { slugify } from '../utils/slugify';

export function generateJsonFile(files: ISerializedSVG[]) {
  const json: IJsonType[] = [];

  files.forEach((file: ISerializedSVG) => {
    const blob = new Blob([file.svg], { type: 'image/svg+xml' });
    const svg = new File([blob], `${file.name}.svg`, {
      type: 'image/svg+xml',
    });

    json.push({
      id: file.id,
      svg: file.svg,
      svgFile: svg,
      name: slugify(file.name),
      figmaName: file.name,
    });
  });

  return json;
}
