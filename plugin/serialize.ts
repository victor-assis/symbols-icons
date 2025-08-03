import { ISerializedSVG } from '../shared/types/typings';
import { convertFillRule } from '../shared/utils/convertFillRule';
/**
 * Serialize a list of nodes from the current selection into SVG strings.
 *
 * @param selection - Nodes to export.
 * @returns Promise resolving with the serialized SVG objects.
 */

export const getSerializedSelection = async (
  selection: readonly SceneNode[],
): Promise<ISerializedSVG[]> =>
  await Promise.all(selection.map((node) => serialize(node)));

/**
 * Export a single node as SVG and return its metadata.
 *
 * @param node - Node to serialize.
 * @returns Serialized SVG information.
 */
const serialize = async (node: SceneNode): Promise<ISerializedSVG> => {
  const svg: string = await node
    .exportAsync({ format: 'SVG' })
    .then((res) => String.fromCharCode(...res))
    .catch((err) => {
      console.error(err);
      return '';
    });

  const fixedSvg = convertFillRule(svg) as string;

  return {
    name: node.name,
    id: node.id,
    svg: fixedSvg,
    tags: (() => {
      try {
        const data = node.getPluginData('tags');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    })(),
  };
};
