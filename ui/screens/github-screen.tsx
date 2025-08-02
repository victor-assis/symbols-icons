import { useEffect, useState } from 'react';
import { useStore, defaultGithubForm } from '../store';
import { IFormGithub } from '../../shared/types/typings';

export default function GithubScreen() {
  const {
    githubForm,
    setGithubForm,
    svgSymbol,
    sfSymbols,
    jsonFile,
    exampleFiles,
    filesName,
    setAlertMessage,
  } = useStore();
  const { outputs } = githubForm;
  const {
    githubToken,
    owner,
    repo,
    branch,
    filePath,
    commitMessage,
    pullRequestTitle,
    mainBranch,
    overrides,
  } = githubForm;

  const outputLabels: Record<keyof typeof overrides, string> = {
    svg: 'SVG',
    symbol: 'Symbol',
    example: 'Example',
    sf: 'SF Symbol',
    kt: 'Kotlin',
    json: 'JSON',
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [showToken, setShowToken] = useState(false);

  function toggleAccordion(name: keyof typeof outputs) {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function toggle(name: keyof typeof outputs) {
    const newOutputs = { ...outputs, [name]: !outputs[name] };
    setGithubForm({ ...githubForm, outputs: newOutputs });
  }

  function updateOverride(
    output: keyof typeof overrides,
    field: keyof typeof overrides.svg,
    value: string,
  ) {
    setGithubForm({
      ...githubForm,
      overrides: {
        ...overrides,
        [output]: { ...overrides[output], [field]: value },
      },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const newForm: IFormGithub = {
      outputs,
      githubToken,
      owner,
      repo,
      branch,
      filePath,
      commitMessage,
      pullRequestTitle,
      mainBranch,
      overrides,
      exampleFiles,
      svgSymbol,
      sfSymbols,
      jsonFile,
      filesName,
    };
    setGithubForm(newForm);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'githubCommit',
          github: {
            ...newForm,
            ...{ svgSymbol, sfSymbols, jsonFile, exampleFiles, filesName },
          },
        },
      },
      '*',
    );
    parent.postMessage(
      {
        pluginMessage: {
          type: 'saveGithubData',
          data: newForm,
        },
      },
      '*',
    );
  }

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getGithubData' } }, '*');
    window.onmessage = (event) => {
      if (!event.data.pluginMessage) return;
      const { type, data } = event.data.pluginMessage;
      if (type === 'commitDone') {
        setLoading(false);
        setAlertMessage('Commit done!');
      }
      if (type === 'githubData') {
        if (!data) return;
        const mergedOverrides = Object.fromEntries(
          Object.entries(defaultGithubForm.overrides).map(([key, cfg]) => [
            key,
            {
              ...cfg,
              ...(data.overrides?.[
                key as keyof typeof defaultGithubForm.overrides
              ] ?? {}),
            },
          ]),
        ) as typeof defaultGithubForm.overrides;

        setGithubForm({
          ...defaultGithubForm,
          ...data,
          overrides: mergedOverrides,
        });
      }
    };
  }, []);

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'saveGithubData',
          data: {
            outputs,
            githubToken,
            owner,
            repo,
            branch,
            filePath,
            commitMessage,
            pullRequestTitle,
            mainBranch,
            overrides,
          },
        },
      },
      '*',
    );
  }, [
    outputs,
    githubToken,
    owner,
    repo,
    branch,
    filePath,
    commitMessage,
    pullRequestTitle,
    mainBranch,
    overrides,
  ]);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          GitHub
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-3">
          {Object.keys(outputLabels).map((key) => {
            const k = key as keyof typeof overrides;
            const label = outputLabels[k];
            return (
              <details key={k} open={open[k]} className="border rounded-lg bg-white shadow-sm">
                <summary className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleAccordion(k)}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
                      type="checkbox"
                      checked={outputs[k as keyof typeof outputs]}
                      onChange={() => toggle(k as keyof typeof outputs)}
                    />
                    <span className="ml-3 text-gray-700 font-medium">{label}</span>
                  </label>
                </summary>
                <div className="flex flex-col gap-2 p-4 border-t">
                  <input
                    value={overrides[k].path}
                    onChange={(e) => updateOverride(k, 'path', e.target.value)}
                    placeholder="Path"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-10 placeholder:text-[#5c748a] p-[10px] text-base font-normal leading-normal"
                  />
                  <input
                    value={overrides[k].owner}
                    onChange={(e) => updateOverride(k, 'owner', e.target.value)}
                    placeholder="Owner"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-10 placeholder:text-[#5c748a] p-[10px] text-base font-normal leading-normal"
                  />
                  <input
                    value={overrides[k].repo}
                    onChange={(e) => updateOverride(k, 'repo', e.target.value)}
                    placeholder="Repo"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-10 placeholder:text-[#5c748a] p-[10px] text-base font-normal leading-normal"
                  />
                  <input
                    value={overrides[k].mainBranch}
                    onChange={(e) => updateOverride(k, 'mainBranch', e.target.value)}
                    placeholder="Main Branch"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-10 placeholder:text-[#5c748a] p-[10px] text-base font-normal leading-normal"
                  />
                </div>
              </details>
            );
          })}
        </div>
        <div className="relative">
          <input
            type={showToken ? 'text' : 'password'}
            value={githubToken}
            onChange={(e) =>
              setGithubForm({ ...githubForm, githubToken: e.target.value })
            }
            placeholder="Token"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] pr-12 text-base font-normal leading-normal"
          />
          <button
            type="button"
            onClick={() => setShowToken((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#007bff]"
          >
            {showToken ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="text-[#5c748a] text-sm">
          For more information access:{' '}
          <a
            className="text-[#007bff] hover:underline"
            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
            target="_blank"
          >
            Github token
          </a>
        </p>
        <input
          value={owner}
          onChange={(e) =>
            setGithubForm({ ...githubForm, owner: e.target.value })
          }
          placeholder="Owner"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={repo}
          onChange={(e) =>
            setGithubForm({ ...githubForm, repo: e.target.value })
          }
          placeholder="Repo"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={branch}
          onChange={(e) =>
            setGithubForm({ ...githubForm, branch: e.target.value })
          }
          placeholder="Branch"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={filePath}
          onChange={(e) =>
            setGithubForm({ ...githubForm, filePath: e.target.value })
          }
          placeholder="File Path"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={commitMessage}
          onChange={(e) =>
            setGithubForm({ ...githubForm, commitMessage: e.target.value })
          }
          placeholder="CommitMessage"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={pullRequestTitle}
          onChange={(e) =>
            setGithubForm({ ...githubForm, pullRequestTitle: e.target.value })
          }
          placeholder="Pull Request Title"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <input
          value={mainBranch}
          onChange={(e) =>
            setGithubForm({ ...githubForm, mainBranch: e.target.value })
          }
          placeholder="Main Branch"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
        >
          {loading ? <span className="truncate">Committing...</span> : 'Commit'}
        </button>
      </form>
    </div>
  );
}
