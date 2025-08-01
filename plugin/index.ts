/**
 * Entry point for the Symbols Icons Figma plugin.
 * Handles communication between the UI and the Figma API.
 */
import { commitToGithub } from './github';
import { getSerializedSelection } from './serialize';

let useVectorChildren = true;

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
      if (data && typeof data.useVectorChildren === 'boolean') {
        useVectorChildren = data.useVectorChildren;
      }
      figma.ui.postMessage({ type: 'symbolConfig', data });
    },
    saveSymbolConfig: async () => {
      await figma.clientStorage.setAsync('symbolConfig', msg.data);
      if (typeof msg.data.useVectorChildren === 'boolean') {
        useVectorChildren = msg.data.useVectorChildren;
      }
    },
    getGithubData: async () => {
      const data = await figma.clientStorage.getAsync('githubData');
      figma.ui.postMessage({ type: 'githubData', data });
    },
    saveGithubData: async () => {
      await figma.clientStorage.setAsync('githubData', msg.data);
    },
    getTags: async () => {
      const node = figma.getNodeById(msg.id);
      if (node) {
        try {
          const data = node.getPluginData('tags');
          const tags = data ? JSON.parse(data) : [];
          figma.ui.postMessage({ type: 'tags', id: msg.id, tags });
        } catch {
          figma.ui.postMessage({ type: 'tags', id: msg.id, tags: [] });
        }
      }
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
      const nodes = expandSelection(figma.currentPage.selection);
      void sendSerializedSelection(nodes, 'setSvgs');
    },
    githubCommit: async () => {
      const nodes = expandSelection(figma.currentPage.selection);
      await commitToGithub({
        ...msg.github,
        svgs: await getSerializedSelection(nodes),
      });
      figma.ui.postMessage({ type: 'commitDone' });
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
  const nodes = expandSelection(figma.currentPage.selection);
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

const expandSelection = (selection: readonly SceneNode[]): SceneNode[] =>
  selection
    .map((node) => {
      try {
        console.log(useVectorChildren);
        if (
          useVectorChildren &&
          (node.type === 'FRAME' ||
            node.type === 'COMPONENT' ||
            node.type === 'INSTANCE')
        ) {
          const vector = (
            node as FrameNode | ComponentNode | InstanceNode
          ).findChildren((child: SceneNode) => child.type === 'VECTOR');
          return vector.length ? vector : node;
        }
        return node;
      } catch {
        return node;
      }
    })
    .flat();
