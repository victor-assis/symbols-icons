import { getSerializedSelection } from './serialize';

figma.showUI(__html__, { width: 490, height: 840 });

figma.ui.onmessage = async (msg) => {
  const settings = {
    OnLoad: () => {
      if (figma.currentPage.selection.length > 0) {
        sendSelectedNode();
      }
    },
    setSvgs: async () => {
      const nodes = figma.currentPage.selection;
      void sendSerializedSelection(
        nodes,
        'setSvgs',
        // msg.hasLigatura,
        // msg.fontsConfig,
      );
    },
  };

  if (msg.type in settings) {
    (settings as Record<string, () => void>)[msg.type]();
  }
};

figma.on('selectionchange', () => sendSelectedNode());

const sendSelectedNode = () => {
  const nodes = figma.currentPage.selection
    .map((node) => {
      try {
        let vector: SceneNode[] = [];
        if (
          node.type === 'FRAME' ||
          node.type === 'COMPONENT' ||
          node.type === 'INSTANCE'
        ) {
          vector = (
            node as FrameNode | ComponentNode | InstanceNode
          ).findChildren((child: SceneNode) => child.type === 'VECTOR');
        }
        return vector.length ? vector : node;
      } catch {
        return node;
      }
    })
    .flat();

  void sendSerializedSelection(nodes, 'setSvgs');

  figma.ui.postMessage({
    type: 'notifySelected',
    files: nodes,
  });
};

const sendSerializedSelection = async (
  selection: readonly SceneNode[],
  type: string,
): Promise<void> => {
  const svgs = await getSerializedSelection(selection);

  figma.ui.postMessage({
    type,
    files: svgs,
  });
};
