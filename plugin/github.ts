import { IFormGithub } from '../shared/types/typings';

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
  } = githubData;

  let branchSHA;

  try {
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

    const files: { path: string; content: string }[] = [];

    if (outputs.json) {
      files.push({
        path: `${filePath}/${filesName}.json`,
        content: JSON.stringify(jsonFile, null, 2),
      });
    }

    if (outputs.symbol) {
      files.push({
        path: `${filePath}/${filesName}-defs.svg`,
        content: svgSymbol,
      });
    }

    if (outputs.svg && svgs) {
      svgs.forEach((icon) => {
        files.push({
          path: `${filePath}/svgs/${icon.name}.svg`,
          content: icon.svg,
        });
      });
    }

    if (outputs.sf && svgs) {
      sfSymbols.forEach((symbol, idx) => {
        files.push({
          path: `${filePath}/${svgs[idx].name}/${svgs[idx].name}.svg`,
          content: symbol,
        });
        files.push({
          path: `${filePath}/${svgs[idx].name}/Contents.json`,
          content: JSON.stringify(
            {
              info: {
                author: 'xcode',
                version: 1,
              },
              symbols: [
                {
                  filename: `${svgs[idx].name}.svg`,
                  idiom: 'universal',
                },
              ],
            },
            null,
            2,
          ),
        });
      });
    }

    if (outputs.example) {
      exampleFiles.forEach((f: { name: string; content: string }) => {
        files.push({
          path: `${filePath}/${f.name}`,
          content: f.content,
        });
      });
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
      console.error(
        'Erro ao criar o arquivo:',
        (await createTree.json()).message,
      );
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
  } catch (error) {
    console.error('Erro ao comitar arquivo e abrir PR:', error);
  }
};
