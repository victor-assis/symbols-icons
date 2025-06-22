import { slugify } from '../utils/slugify';
import { IJsonType, ISerializedSVG } from '../types/typings';

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
