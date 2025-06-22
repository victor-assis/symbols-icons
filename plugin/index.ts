import { getSerializedSelection } from './serialize';
import template from '../shared/sfSymbol/template.svg';
import { IFormGithub, IJsonType } from '../shared/types/typings';
import { generateExample } from '../shared/example/generateExample';
import { generateSFSymbol } from '../shared/sfSymbol/convertSFSymbol';
import { generateJsonFile } from '../shared/jsonFile/convertJsonFile';
import { generateSvgSymbol } from '../shared/svgSymbol/convertSvgSymbol';

const DEFAULT_VARIATIONS = new Set(['s-ultralight', 's-regular', 's-black']);

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
    setSvgs: async () => {
      const nodes = figma.currentPage.selection;
      void sendSerializedSelection(nodes, 'setSvgs');
    },
    github: async () => {
      await commitToGithub(msg.github as IFormGithub);
    },
  };

  if (msg.type && msg.type in settings) {
    await (settings as Record<string, () => Promise<void> | void>)[msg.type]();
  }

  if (msg.github) {
    await settings.github();
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

const commitToGithub = async (form: IFormGithub): Promise<void> => {
  const {
    outputs,
    githubToken,
    owner,
    repo,
    branch,
    filePath,
    commitMessage,
    pullRequestTitle,
    mainBranch,
  } = form;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  const selection = figma.currentPage.selection;
  const svgs = await getSerializedSelection(selection);

  const files: { path: string; content: string }[] = [];
  let json: IJsonType[] | undefined;

  if (outputs.json || outputs.symbol) {
    json = generateJsonFile(svgs);
  }

  let symbol = '';
  if (outputs.symbol) {
    symbol = generateSvgSymbol(svgs);
  }

  if (outputs.json && json) {
    files.push({
      path: `${filePath}/icons.json`,
      content: JSON.stringify(json, null, 2),
    });
  }

  if (outputs.symbol) {
    files.push({ path: `${filePath}/icons-symbol.svg`, content: symbol });

    if (outputs.example) {
      const exampleJson = json ?? generateJsonFile(svgs);
      const exampleFiles = generateExample(exampleJson, symbol);
      exampleFiles.forEach((f) =>
        files.push({
          path: `${filePath}/example/${f.name}`,
          content: f.content,
        }),
      );
    }
  }

  if (outputs.svg) {
    for (const icon of svgs) {
      files.push({
        path: `${filePath}/svgs/${icon.name}.svg`,
        content: icon.svg,
      });
    }
  }

  if (outputs.sf) {
    const sf = generateSFSymbol(template, svgs, DEFAULT_VARIATIONS, 32);
    sf.forEach((svg, idx) => {
      const name = svgs[idx]?.name ?? `icon-${idx}`;
      files.push({ path: `${filePath}/sfsymbols/${name}.svg`, content: svg });
    });
  }

  for (const file of files) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`;
    let sha: string | undefined;
    const getRes = await fetch(`${url}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    const body = {
      message: commitMessage,
      content: Buffer.from(file.content, 'utf8').toString('base64'),
      branch,
      sha,
    };

    await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
  }

  if (pullRequestTitle && mainBranch && branch !== mainBranch) {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: pullRequestTitle,
        head: branch,
        base: mainBranch,
      }),
    });
  }
};
