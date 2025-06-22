import { useState } from 'react';

export default function ConfigScreen() {
  // const options = ['Small', 'Medium', 'Large', 'Extra Large', 'Custom']
  // const [selected, setSelected] = useState<string[]>([])
  const [custom, setCustom] = useState('');

  // function toggle(name: string) {
  //   setSelected(prev =>
  //     prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
  //   )
  // }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Settings
        </h2>
      </div>
      <section className="flex flex-col gap-3 px-4 py-4">
        <h3 className="text-md text-gray-700 mb-4">SF Symbols Sizes</h3>
        <div
          className="overflow-x-automax-h-100 overflow-y-auto
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-200
  dark:[&::-webkit-scrollbar-track]:bg-neutral-600
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400"
        >
          <table className="w-full border-collapse border border-gray-400 bg-white text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Variations
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Ultralight
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Thin
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Light
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Regular
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Medium
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Semibold
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Bold
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Heavy
                </th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Black
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Small
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    checked
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-ultralight"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-thin"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-light"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    checked
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-regular"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-medium"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-semibold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-bold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-heavy"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    checked
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="s-black"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Medium
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-ultralight"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-thin"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-light"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-regular"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-medium"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-semibold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-bold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-heavy"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="m-black"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                  Large
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-ultralight"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-thin"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-light"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-regular"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-medium"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-semibold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-bold"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-heavy"
                  />
                </td>
                <td className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                  <input
                    className="form-checkbox h-4 w-4 border-gray-400"
                    name="sf-symbols-sizes"
                    type="checkbox"
                    value="l-black"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[#5c748a] text-sm">
          Only the small sizes are required: Ultralight, Regular, Black.
          However, you can generate other sizes, this will increase the weight
          of the file.
        </p>
      </section>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Custom size"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
          />
        </label>
      </div>
    </div>
  );
}
