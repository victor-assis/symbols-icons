import { IFormGithub } from '../shared/types/typings';

interface CommitGroup {
  githubToken: string;
  owner: string;
  repo: string;
  branch: string;
  commitMessage: string;
  pullRequestTitle: string;
  mainBranch: string;
  files: { path: string; content: string }[];
}

async function commitGroup({
  githubToken,
  owner,
  repo,
  branch,
  commitMessage,
  pullRequestTitle,
  mainBranch,
  files,
}: CommitGroup) {
  let branchSHA;

  const checkBranchResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  );

  if (checkBranchResponse.status === 404) {
    const checkMainBranch = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${mainBranch}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${githubToken}`,
        },
      },
    );

    const shaMainBranch = (await checkMainBranch.json()).object.sha;

    const newBranch = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${githubToken}`,
        },
        body: JSON.stringify({
          ref: `refs/heads/${branch}`,
          sha: shaMainBranch,
        }),
      },
    );

    branchSHA = (await newBranch.json()).object.sha;
  } else {
    branchSHA = (await checkBranchResponse.json()).object.sha;
  }

  const changes = await Promise.all(
    files.map(async (file) => {
      const blob = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${githubToken}`,
          },
          body: JSON.stringify({
            content: fileToBase64(file.content),
          }),
        },
      );

      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: (await blob.json()).sha,
      };
    }),
  );

  const getBaseTree = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  );

  const createTree = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${githubToken}`,
      },
      body: JSON.stringify({
        base_tree: (await getBaseTree.json()).sha,
        tree: changes,
      }),
    },
  );

  const createCommit = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${githubToken}`,
      },
      body: JSON.stringify({
        message: commitMessage,
        parents: [branchSHA],
        tree: (await createTree.json()).sha,
      }),
    },
  );

  const updateBranch = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `token ${githubToken}`,
      },
      body: JSON.stringify({
        sha: (await createCommit.json()).sha,
      }),
    },
  );

  if (updateBranch.status !== 200) {
    console.error('Erro ao criar o arquivo:', (await createTree.json()).message);
    return;
  }

  await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: {
      Authorization: `token ${githubToken}`,
    },
    body: JSON.stringify({
      title: pullRequestTitle,
      head: branch,
      base: mainBranch,
    }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fileToBase64 = (file: any) => {
  if (file instanceof Uint8Array) {
    return Buffer.from(file).toString('base64');
  }

  return file;
};

export const commitToGithub = async (
  githubData: IFormGithub,
): Promise<void> => {
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
    exampleFiles,
    svgSymbol,
    sfSymbols,
    jsonFile,
    filesName,
    svgs,
    overrides,
  } = githubData;

  try {
    const groups: Record<string, CommitGroup> = {};

    function addFile(
      key: keyof typeof overrides,
      relativePath: string,
      content: string,
    ) {
      const cfg = overrides[key];
      const o = cfg.owner || owner;
      const r = cfg.repo || repo;
      const p = cfg.path || filePath;
      const m = cfg.mainBranch || mainBranch;
      const groupKey = `${o}|${r}|${p}|${m}`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          githubToken,
          owner: o,
          repo: r,
          branch,
          commitMessage,
          pullRequestTitle,
          mainBranch: m,
          files: [],
        };
      }
      groups[groupKey].files.push({ path: `${p}/${relativePath}`, content });
    }

    if (outputs.json) {
      addFile('json', `${filesName}.json`, JSON.stringify(jsonFile, null, 2));
    }

    if (outputs.symbol) {
      addFile('symbol', `${filesName}-defs.svg`, svgSymbol);
    }

    if (outputs.svg && svgs) {
      svgs.forEach((icon) => {
        addFile('svg', `svgs/${icon.name}.svg`, icon.svg);
      });
    }

    if (outputs.sf && svgs) {
      sfSymbols.forEach((symbol, idx) => {
        addFile(
          'sf',
          `${svgs[idx].name}/${svgs[idx].name}.svg`,
          symbol,
        );
        addFile(
          'sf',
          `${svgs[idx].name}/Contents.json`,
          JSON.stringify(
            {
              info: { author: 'xcode', version: 1 },
              symbols: [
                { filename: `${svgs[idx].name}.svg`, idiom: 'universal' },
              ],
            },
            null,
            2,
          ),
        );
      });
    }

    if (outputs.example) {
      exampleFiles.forEach((f: { name: string; content: string }) => {
        addFile('example', f.name, f.content);
      });
    }

    for (const key of Object.keys(groups)) {
      await commitGroup(groups[key]);
    }
  } catch (error) {
    console.error('Erro ao comitar arquivo e abrir PR:', error);
  }
};
