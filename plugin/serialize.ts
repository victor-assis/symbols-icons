import { ISerializedSVG } from '../shared/types/typings';

export const getSerializedSelection = async (
  selection: readonly SceneNode[],
): Promise<ISerializedSVG[]> =>
  await Promise.all(selection.map((node) => serialize(node)));

const serialize = async (node: SceneNode): Promise<ISerializedSVG> => {
  const svg: string = await node
    .exportAsync({ format: 'SVG' })
    .then((res) => String.fromCharCode(...res))
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
