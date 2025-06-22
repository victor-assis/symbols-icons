import React, { createContext, useContext, useState } from 'react';
import {
  IFormGithub,
  IJsonType,
  Outputs,
  Store,
} from '../shared/types/typings';

const defaultOutputs: Outputs = {
  svg: true,
  symbol: true,
  example: true,
  sf: true,
  kt: true,
  json: true,
};

const defaultGithubForm: IFormGithub = {
  outputs: { ...defaultOutputs },
  githubToken: '',
  owner: '',
  repo: '',
  branch: '',
  filePath: '',
  commitMessage: '',
  pullRequestTitle: '',
  mainBranch: '',
};

const GlobalContext = createContext<Store | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [outputs, setOutputs] = useState<Outputs>(defaultOutputs);
  const [svgSymbol, setSvgSymbol] = useState('');
  const [jsonFile, setJsonFile] = useState<IJsonType[]>([]);
  const [filesName, setFilesName] = useState('icons-symbol');
  const [sfSize, setSfSize] = useState<number>(32);
  const [sfVariations, setSfVariations] = useState<Set<string>>(
    new Set(['s-ultralight', 's-regular', 's-black']),
  );
  const [githubForm, setGithubForm] = useState<IFormGithub>(defaultGithubForm);

  return (
    <GlobalContext.Provider
      value={{
        outputs,
        setOutputs,
        svgSymbol,
        setSvgSymbol,
        jsonFile,
        setJsonFile,
        filesName,
        setFilesName,
        sfSize,
        setSfSize,
        sfVariations,
        setSfVariations,
        githubForm,
        setGithubForm,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error('useStore must be used within GlobalProvider');
  }
  return ctx;
}
