import JSZip from 'jszip';
import { Base64 } from 'js-base64';
import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { IJsonType } from '../../shared/types/typings';
import templateUrl from '../../shared/sfSymbol/template.svg';
import { generateExample } from '../../shared/example/generateExample';
import { generateSFSymbol } from '../../shared/sfSymbol/convertSFSymbol';
import { generateJsonFile } from '../../shared/jsonFile/convertJsonFile';
import { generateSvgSymbol } from '../../shared/svgSymbol/convertSvgSymbol';

function bytesToString(bytes: Uint8Array): string {
  return Base64.decode(Base64.fromUint8Array(bytes));
}

const templateData = templateUrl.split(',')[1];
const templateBytes = Base64.toUint8Array(templateData);
const template = bytesToString(templateBytes);

export default function IconsScreen() {
  const {
    outputs,
    setOutputs,
    svgSymbol,
    setSvgSymbol,
    sfSymbols,
    setSFSymbols,
    jsonFile,
    setJsonFile,
    sfSize,
    setSfSize,
    sfVariations,
    setSfVariations,
    filesName,
    exampleFiles,
    setExampleFiles,
    setFilesName,
    setGithubForm,
  } = useStore();
  const [nodes, setNodes] = useState<SceneNode[]>([]);
  const [loading, setLoading] = useState(false);
  function handleTagChange(index: number, value: string) {
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length);
    const updated = [...jsonFile];
    updated[index] = { ...updated[index], tags };
    setJsonFile(updated);
    parent.postMessage(
      { pluginMessage: { type: 'setTags', id: updated[index].id, tags } },
      '*',
    );
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadOutputs(
    json: IJsonType[],
    symbol: string,
    sfSvgs: string[],
  ) {
    const zip = new JSZip();
    if (outputs.json) {
      zip.file(`${filesName}.json`, JSON.stringify(json, null, 2));
    }
    if (outputs.symbol) {
      zip.file(`${filesName}-defs.svg`, symbol);

      if (outputs.example) {
        const example = zip.folder('example');
        exampleFiles.forEach((f: { name: string; content: string }) => {
          example?.file(f.name, f.content);
        });
      }
    }
    if (outputs.svg) {
      const svgsFolder = zip.folder('svgs');
      json.forEach((icon) => {
        svgsFolder?.file(`${icon.name}.svg`, icon.svg);
      });
    }
    if (outputs.sf) {
      const sfFolder = zip.folder('sfsymbols');

      sfSvgs.forEach((svg, idx) => {
        const name = json[idx]?.name ?? `icon-${idx}`;
        const sfIconFolder = sfFolder?.folder(`${name}.symbolset`);
        sfIconFolder?.file(`${name}.svg`, svg);
        sfIconFolder?.file(
          'Contents.json',
          JSON.stringify(
            {
              info: {
                author: 'xcode',
                version: 1,
              },
              symbols: [
                {
                  filename: `${name}.svg`,
                  idiom: 'universal',
                },
              ],
            },
            null,
            2,
          ),
        );
      });
    }
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, `${filesName}.zip`);
  }

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getSymbolConfig' } }, '*');
    parent.postMessage({ pluginMessage: { type: 'getGithubData' } }, '*');
    window.onmessage = (event) => {
      if (!event.data.pluginMessage) {
        return;
      }

      const { type, files, data } = event.data.pluginMessage;

      const events = {
        notifySelected: () => {
          setNodes(files);
        },
        setSvgs: async () => {
          if (files.length) {
            setSFSymbols(
              generateSFSymbol(template, files, sfVariations, sfSize),
            );
            setSvgSymbol(generateSvgSymbol(files));
            setJsonFile(generateJsonFile(files));
          }
        },
        fontConfig: () => {
          if (!data) return;
          if (data.outputs) setOutputs(data.outputs);
          if (typeof data.sfSize === 'number') setSfSize(data.sfSize);
          if (data.sfVariations)
            setSfVariations(new Set<string>(data.sfVariations));
          if (data.filesName) setFilesName(data.filesName);
        },
        githubData: () => {
          if (data) setGithubForm(data);
        },
      };

      if (type && type in events) {
        (events as Record<string, () => void>)[type]();
      }
    };

    if (jsonFile && svgSymbol) {
      setExampleFiles(generateExample(jsonFile, svgSymbol));
    }
  }, [jsonFile, svgSymbol]);

  function toggle(name: keyof typeof outputs) {
    setOutputs({ ...outputs, [name]: !outputs[name] });
  }

  async function updateIcons() {
    if (loading) return;
    setLoading(true);
    await downloadOutputs(jsonFile, svgSymbol, sfSymbols);

    parent.postMessage(
      { pluginMessage: { type: 'setSvgs', size: sfSize } },
      '*',
    );
    parent.postMessage(
      {
        pluginMessage: {
          type: 'saveSymbolConfig',
          data: {
            outputs,
            sfSize,
            sfVariations: Array.from(sfVariations),
            filesName,
          },
        },
      },
      '*',
    );
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Export Icons
        </h2>
      </div>

      <section className="flex flex-col gap-3 px-4 py-4">
        <h3 className="text-md text-gray-700 mb-4">Select Format</h3>
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
              checked={outputs.kt}
              onChange={() => toggle('kt')}
              disabled
            />
            <span className="ml-3 text-gray-400 font-medium">
              kotlin - coming soon
            </span>
          </label>
        </div>

        <div className="flex py-3">
          <button
            onClick={updateIcons}
            disabled={loading}
            className="flex items-center justify-center overflow-hidden rounded-full h-10 flex-1 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="truncate">Generating...</span>
            ) : (
              <span className="truncate">Generate</span>
            )}
          </button>
        </div>

        {!nodes || nodes.length === 0 ? (
          <div
            className="flex items-center p-4 mb-4 text-gray-700 border-t-4 border-blue-300 bg-blue-50 dark:border-blue-800"
            role="alert"
          >
            <div className="ms-3 text-sm font-medium">
              No selected icon found!
            </div>
          </div>
        ) : (
          <>
            <div
              className="flex items-center p-4 mb-4 text-gray-700 border-t-4 border-blue-300 bg-blue-50 dark:border-blue-800"
              role="alert"
            >
              <div className="ms-3 text-sm font-medium">{`selected ${
                nodes.length
              } vector${nodes.length > 1 ? 's' : ''}`}</div>
            </div>
          </>
        )}

        <h3 className="text-md text-gray-700 mb-4">Preview</h3>

        <div dangerouslySetInnerHTML={{ __html: svgSymbol ?? '' }} />
        <div className="grid grid-cols-2 gap-3">
          {jsonFile &&
            jsonFile.map((icon: IJsonType, index: number) => (
              <div
                className="flex flex-col items-start gap-2 p-4 border border-gray-300 rounded-lg"
                key={index}
              >
                <div className="flex items-center gap-4 w-full">
                  <svg width={sfSize} height={sfSize}>
                    <use xlinkHref={`#${icon.name}`} />
                  </svg>
                  <div className="font-medium text-gray-800 truncate">
                    <div>{icon.name}</div>
                  </div>
                </div>
                <input
                  className="form-input w-full rounded border border-gray-300 text-sm p-1"
                  placeholder="tags (comma separated)"
                  value={icon.tags?.join(', ') || ''}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
