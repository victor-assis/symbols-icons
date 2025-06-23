/**
 * Entry point for the Symbols Icons Figma plugin.
 * Handles communication between the UI and the Figma API.
 */
import { commitToGithub } from './github';
import { getSerializedSelection } from './serialize';

figma.showUI(__html__, { width: 490, height: 840 });

figma.ui.onmessage = async (msg) => {
  const settings = {
    OnLoad: () => {
      if (figma.currentPage.selection.length > 0) {
        sendSelectedNode();
      }
    },
    getSymbolConfig: async () => {
      const data = await figma.clientStorage.getAsync('symbolConfig');
      figma.ui.postMessage({ type: 'symbolConfig', data });
    },
    saveSymbolConfig: async () => {
      await figma.clientStorage.setAsync('symbolConfig', msg.data);
    },
    getGithubData: async () => {
      const data = await figma.clientStorage.getAsync('githubData');
      figma.ui.postMessage({ type: 'githubData', data });
    },
    saveGithubData: async () => {
      await figma.clientStorage.setAsync('githubData', msg.data);
    },
    setTags: async () => {
      const node = figma.getNodeById(msg.id);
      if (node) {
        try {
          node.setPluginData('tags', JSON.stringify(msg.tags ?? []));
        } catch {
          /* ignore errors */
        }
      }
    },
    setSvgs: async () => {
      const nodes = figma.currentPage.selection;
      void sendSerializedSelection(nodes, 'setSvgs');
    },
    githubCommit: async () => {
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
      await commitToGithub({
        ...msg.github,
        svgs: await getSerializedSelection(nodes),
      });
    },
  };

  if (msg.type && msg.type in settings) {
    await (settings as Record<string, () => Promise<void> | void>)[msg.type]();
  }
};

figma.on('selectionchange', () => sendSelectedNode());

/**
 * Sends the currently selected nodes to the UI.
 */
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

/**
 * Serialize nodes and post them back to the UI.
 */
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
