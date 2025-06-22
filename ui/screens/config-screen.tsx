import { useState } from 'react'
import { useStore } from '../store'

export default function ConfigScreen() {
  const { sfSize, setSfSize, sfVariations, setSfVariations } = useStore()
  const [custom, setCustom] = useState(String(sfSize))

  const weights = [
    'ultralight',
    'thin',
    'light',
    'regular',
    'medium',
    'semibold',
    'bold',
    'heavy',
    'black'
  ]
  const scales = ['s', 'm', 'l']
  const scaleLabels: Record<string, string> = { s: 'Small', m: 'Medium', l: 'Large' }

  function toggle(value: string) {
    setSfVariations(prev => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustom(e.target.value)
    const v = parseInt(e.target.value, 10)
    if (!Number.isNaN(v)) {
      setSfSize(v)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Settings
        </h2>
      </div>
      <section className="flex flex-col gap-3 px-4 py-4">
        <h3 className="text-md text-gray-700 mb-4">SF Symbols Sizes</h3>
        <div className="overflow-x-automax-h-100 overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-600 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
          <table className="w-full border-collapse border border-gray-400 bg-white text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Variations</th>
                {weights.map(w => (
                  <th key={w} className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scales.map(scale => (
                <tr key={scale}>
                  <td className="border border-gray-300 p-4 text-left font-semibold text-gray-900">
                    {scaleLabels[scale]}
                  </td>
                  {weights.map(w => {
                    const val = `${scale}-${w}`
                    return (
                      <td key={val} className="border border-gray-300 p-4 text-center font-semibold text-gray-900">
                        <input
                          className="form-checkbox h-4 w-4 border-gray-400"
                          name="sf-symbols-sizes"
                          type="checkbox"
                          value={val}
                          checked={sfVariations.has(val)}
                          onChange={() => toggle(val)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[#5c748a] text-sm">
          Only the small sizes are required: Ultralight, Regular, Black. However, you can generate other sizes, this will increase the weight of the file.
        </p>
      </section>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Custom size"
            value={custom}
            onChange={handleSizeChange}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
          />
        </label>
      </div>
    </div>
  )
}
