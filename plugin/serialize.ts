import { ISerializedSVG } from '../shared/types/typings';

export const getSerializedSelection = async (
  selection: readonly SceneNode[],
): Promise<ISerializedSVG[]> => await Promise.all(selection.map(serialize));

const serialize = async (node: SceneNode): Promise<ISerializedSVG> => {
  const svg: string = await node
    .exportAsync({ format: 'SVG' })
    .then((res) => String.fromCharCode(...res))
    .then((rawSvg) => fixSvgSizeAndViewBox(rawSvg, 32, 32))
    .catch((err) => {
      console.error(err);
      return '';
    });

  return {
    name: node.name,
    id: node.id,
    svg,
  };
};

const fixSvgSizeAndViewBox = (svg: string, width = 32, height = 32): string => {
  let updatedSvg = svg;

  // Garante que a tag <svg ...> está presente
  const svgTagMatch = updatedSvg.match(/<svg([^>]*)>/);
  if (!svgTagMatch) return updatedSvg;

  const attrs = svgTagMatch[1];

  // Garante xmlns
  const hasXmlns = /xmlns=/.test(attrs);
  let newAttrs = attrs;
  if (!hasXmlns) newAttrs += ` xmlns="http://www.w3.org/2000/svg"`;

  // Substitui/insere width e height
  newAttrs = newAttrs
    .replace(/width="[^"]*"/, '') // remove se existir
    .replace(/height="[^"]*"/, '') // remove se existir
    .trim();
  newAttrs += ` width="${width}" height="${height}"`;

  // Insere viewBox, assume origem (0,0)
  const hasViewBox = /viewBox=/.test(attrs);
  if (!hasViewBox) {
    newAttrs += ` viewBox="0 0 ${width} ${height}"`;
  } else {
    // opcional: forçar o novo viewBox
    newAttrs = newAttrs.replace(
      /viewBox="[^"]*"/,
      `viewBox="0 0 ${width} ${height}"`,
    );
  }

  updatedSvg = updatedSvg.replace(/<svg[^>]*>/, `<svg ${newAttrs}>`);
  return updatedSvg;
};
