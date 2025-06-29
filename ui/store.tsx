import React, { createContext, useContext, useState } from 'react';
import { ExampleFile } from '../shared/example/generateExample';
import {
  IFormGithub,
  IJsonType,
  Outputs,
  Store,
} from '../shared/types/typings';

export const defaultOutputs: Outputs = {
  svg: true,
  symbol: true,
  example: true,
  sf: true,
  kt: true,
  json: true,
};

export const defaultGithubForm: IFormGithub = {
  outputs: { ...defaultOutputs },
  githubToken: '',
  owner: '',
  repo: '',
  branch: '',
  filePath: '',
  commitMessage: '',
  pullRequestTitle: '',
  mainBranch: '',
  overrides: {
    svg: { path: '', owner: '', repo: '', mainBranch: '' },
    symbol: { path: '', owner: '', repo: '', mainBranch: '' },
    example: { path: '', owner: '', repo: '', mainBranch: '' },
    sf: { path: '', owner: '', repo: '', mainBranch: '' },
    kt: { path: '', owner: '', repo: '', mainBranch: '' },
    json: { path: '', owner: '', repo: '', mainBranch: '' },
  },
  exampleFiles: [],
  svgSymbol: '',
  sfSymbols: [],
  jsonFile: [],
  filesName: 'icons-symbol',
};

const GlobalContext = createContext<Store | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [outputs, setOutputs] = useState<Outputs>(defaultOutputs);
  const [svgSymbol, setSvgSymbol] = useState('');
  const [sfSymbols, setSFSymbols] = useState<string[]>([]);
  const [jsonFile, setJsonFile] = useState<IJsonType[]>([]);
  const [exampleFiles, setExampleFiles] = useState<ExampleFile[]>([]);
  const [filesName, setFilesName] = useState('icons-symbol');
  const [sfSize, setSfSize] = useState<number>(32);
  const [sfVariations, setSfVariations] = useState<Set<string>>(
    new Set(['s-ultralight', 's-regular', 's-black']),
  );
  const [githubForm, setGithubForm] = useState<IFormGithub>(defaultGithubForm);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <GlobalContext.Provider
      value={{
        outputs,
        setOutputs,
        svgSymbol,
        setSvgSymbol,
        sfSymbols,
        setSFSymbols,
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
        exampleFiles,
        setExampleFiles,
        alertMessage,
        setAlertMessage,
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
