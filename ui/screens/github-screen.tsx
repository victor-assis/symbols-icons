import { useEffect, useState } from 'react';
import { useStore } from '../store';
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
  } = githubForm;

  const [loading, setLoading] = useState(false);

  function toggle(name: keyof typeof outputs) {
    const newOutputs = { ...outputs, [name]: !outputs[name] };
    setGithubForm({ ...githubForm, outputs: newOutputs });
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
    window.onmessage = (event) => {
      if (!event.data.pluginMessage) return;
      if (event.data.pluginMessage.type === 'commitDone') {
        setLoading(false);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          GitHub
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
              name="outputType"
              type="checkbox"
              value="svg"
              checked={outputs.svg}
              onChange={() => toggle('svg')}
            />
            <span className="ml-3 text-gray-700 font-medium">SVG</span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
              name="outputType"
              type="checkbox"
              value="symbol"
              checked={outputs.symbol}
              onChange={() => toggle('symbol')}
            />
            <span className="ml-3 text-gray-700 font-medium">Symbol</span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
              name="outputType"
              type="checkbox"
              value="sf"
              checked={outputs.sf}
              onChange={() => toggle('sf')}
            />
            <span className="ml-3 text-gray-700 font-medium">SF Symbol</span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
              name="outputType"
              type="checkbox"
              value="json"
              checked={outputs.json}
              onChange={() => toggle('json')}
            />
            <span className="ml-3 text-gray-700 font-medium">JSON</span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400 focus:ring-teal-500"
              name="outputType"
              type="checkbox"
              value="example"
              checked={outputs.example}
              onChange={() => toggle('example')}
            />
            <span className="ml-3 text-gray-700 font-medium">Example</span>
          </label>
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-not-allowed flex-1 bg-gray-100 shadow-sm opacity-50 select-none">
            <input
              className="form-radio h-5 w-5 text-teal-600 border-gray-400"
              name="outputType"
              type="checkbox"
              value="kotlin"
              // checked={outputs.kt}
              onChange={() => toggle('kt')}
              disabled
            />
            <span className="ml-3 text-gray-400 font-medium">
              kotlin - coming soon
            </span>
          </label>
        </div>
        <input
          value={githubToken}
          onChange={(e) =>
            setGithubForm({ ...githubForm, githubToken: e.target.value })
          }
          placeholder="Token"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
        />
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
