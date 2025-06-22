import React, { createContext, useContext, useState } from 'react';
import { IFormGithub, IJsonType } from '../shared/types/typings';

interface Outputs {
  svg: boolean;
  symbol: boolean;
  sf: boolean;
  kt: boolean;
}

interface Store {
  outputs: Outputs;
  setOutputs: React.Dispatch<React.SetStateAction<Outputs>>;
  svgSymbol: string;
  setSvgSymbol: React.Dispatch<React.SetStateAction<string>>;
  jsonFile: IJsonType[];
  setJsonFile: React.Dispatch<React.SetStateAction<IJsonType[]>>;
  sfSize: number;
  setSfSize: React.Dispatch<React.SetStateAction<number>>;
  sfVariations: Set<string>;
  setSfVariations: React.Dispatch<React.SetStateAction<Set<string>>>;
  githubForm: IFormGithub;
  setGithubForm: React.Dispatch<React.SetStateAction<IFormGithub>>;
}

const defaultOutputs: Outputs = { svg: true, symbol: true, sf: true, kt: true };

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
  const [sfSize, setSfSize] = useState<number>(32);
  const [sfVariations, setSfVariations] = useState<Set<string>>(
    new Set(['s-ultralight', 's-regular', 's-black'])
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
