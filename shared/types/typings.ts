export interface IJsonType {
  id: string;
  svg: string;
  name: string;
  figmaName: string;
  tags?: string[];
}

export interface ISerializedSVG {
  name: string;
  id: string;
  svg: string;
  tags?: string[];
}

export interface OutputGithubConfig {
  path: string;
  owner: string;
  repo: string;
  mainBranch: string;
}

export interface IFormGithub {
  outputs: {
    svg: boolean;
    symbol: boolean;
    example: boolean;
    sf: boolean;
    kt: boolean;
    json: boolean;
  };
  githubToken: string;
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  commitMessage: string;
  pullRequestTitle: string;
  mainBranch: string;
  overrides: {
    svg: OutputGithubConfig;
    symbol: OutputGithubConfig;
    example: OutputGithubConfig;
    sf: OutputGithubConfig;
    json: OutputGithubConfig;
  };
  exampleFiles: ExampleFile[];
  svgSymbol: string;
  sfSymbols: string[];
  jsonFile: IJsonType[];
  filesName: string;
  svgs?: ISerializedSVG[];
}

export interface Outputs {
  svg: boolean;
  symbol: boolean;
  example: boolean;
  sf: boolean;
  kt: boolean;
  json: boolean;
}

export interface Store {
  outputs: Outputs;
  setOutputs: React.Dispatch<React.SetStateAction<Outputs>>;
  svgSymbol: string;
  setSvgSymbol: React.Dispatch<React.SetStateAction<string>>;
  sfSymbols: string[];
  setSFSymbols: React.Dispatch<React.SetStateAction<string[]>>;
  jsonFile: IJsonType[];
  setJsonFile: React.Dispatch<React.SetStateAction<IJsonType[]>>;
  filesName: string;
  setFilesName: React.Dispatch<React.SetStateAction<string>>;
  sfSize: number;
  setSfSize: React.Dispatch<React.SetStateAction<number>>;
  sfVariations: Set<string>;
  setSfVariations: React.Dispatch<React.SetStateAction<Set<string>>>;
  githubForm: IFormGithub;
  setGithubForm: React.Dispatch<React.SetStateAction<IFormGithub>>;
  exampleFiles: ExampleFile[];
  setExampleFiles: React.Dispatch<React.SetStateAction<ExampleFile[]>>;
  alertMessage: string;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
}

export type Tab = 'icons' | 'config' | 'github';

export interface TabsProps {
  current: Tab;
  onSelect: (tab: Tab) => void;
}

export interface ExampleFile {
  name: string;
  content: string;
}
