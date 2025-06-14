figma.showUI(__html__, { width: 490, height: 840 });

type MessageType = 'generate-icons' | 'save-settings' | 'commit-icons';

const handlers: Record<MessageType, (msg: any) => void> = {
  'generate-icons': (msg: any) => {
    figma.notify(`Generated icons as ${msg.outputType}`);
  },
  'save-settings': (msg: any) => {
    figma.clientStorage.setAsync('iconSettings', msg.settings);
    figma.notify('Settings saved');
  },
  'commit-icons': (msg: any) => {
    figma.notify(`Committing ${msg.files.length} files...`);
  },
};

figma.ui.onmessage = async (msg: any) => {
  if (typeof msg.type === 'string' && (msg.type as MessageType) in handlers) {
    handlers[msg.type as MessageType](msg);
  }
};
