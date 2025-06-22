import { useEffect, useState } from 'react';
import { Base64 } from 'js-base64';

import { useStore } from '../store';
import { IJsonType } from '../../shared/types/typings';
import { generateSFSymbol } from '../../shared/sfSymbol/convertSFSymbol';
import { generateSvgSymbol } from '../../shared/svgSymbol/convertSvgSymbol';
import { generateJsonFile } from '../../shared/jsonFile/convertJsonFile';
import templateUrl from '../../shared/sfSymbol/template.svg';

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
    jsonFile,
    setJsonFile,
  } = useStore();
  const [nodes, setNodes] = useState<SceneNode[]>([]);
  const [sfsymbols, setSFSymbols] = useState<string[]>([]);
  // const [icons, setIcons] = useState([]);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getFontConfig' } }, '*');
    parent.postMessage({ pluginMessage: { type: 'getGithubData' } }, '*');
    window.onmessage = (event) => {
      if (!event.data.pluginMessage) {
        return;
      }

      const { type, files } = event.data.pluginMessage;

      const events = {
        notifySelected: () => {
          setNodes(files);
        },
        setSvgs: async () => {
          if (files.length) {
            // const icons = await exportAllIcons();
            // const zip = new JSZip();

            setSFSymbols(generateSFSymbol(template, files));
            setSvgSymbol(generateSvgSymbol(files));
            setJsonFile(generateJsonFile(files));

            const t1 = generateSFSymbol(template, files);
            const t2 = generateSvgSymbol(files);
            const t3 = generateJsonFile(files);

            console.log('test', t1, t2, t3);

            // figma.notify(`Generated ${files.length} icons`);
          }

          console.log('files', sfsymbols, svgSymbol, jsonFile);
        },
      };

      if (type && type in events) {
        (events as Record<string, () => void>)[type]();
      }
    };
  }, []);

  function toggle(name: keyof typeof outputs) {
    setOutputs({ ...outputs, [name]: !outputs[name] });
  }

  function updateIcons() {
    parent.postMessage({ pluginMessage: { type: 'setSvgs' } }, '*');
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
              value="kotlin"
              checked={outputs.kt}
              onChange={() => toggle('kt')}
            />
            <span className="ml-3 text-gray-700 font-medium">kotlin</span>
          </label>
        </div>

        <div className="flex py-3">
          <button
            onClick={updateIcons}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 flex-1 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Update</span>
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
              <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                <svg width="32" height="32" key={index}>
                  <use xlinkHref={`#${icon.name}`} />
                </svg>
                <div className="font-medium text-gray-800 truncate">
                  <div>{icon.name}</div>
                  {/* <div className="text-sm text-gray-600">{icon.figmaName}</div> */}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
