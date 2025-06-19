import { useState } from 'react'

export default function ConfigScreen() {
  const options = ['Small', 'Medium', 'Large', 'Extra Large', 'Custom']
  const [selected, setSelected] = useState<string[]>([])
  const [custom, setCustom] = useState('')

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )
  }

  const tickSvg =
    "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,21,24)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')"

  return (
    <div
      className="flex flex-col h-full bg-gray-50 overflow-x-hidden"
      style={{ '--checkbox-tick-svg': tickSvg } as React.CSSProperties}
    >
      <div>
        <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
          <div className="text-[#101518] flex size-12 shrink-0 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
            </svg>
          </div>
          <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Settings
          </h2>
        </div>
        <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          SF Symbols
        </h2>
        <div className="px-4">
          {options.map((name) => (
            <label key={name} className="flex gap-x-3 py-3 flex-row">
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => toggle(name)}
                className="h-5 w-5 rounded border-[#d4dce2] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dce2] focus:outline-none"
              />
              <p className="text-[#101518] text-base font-normal leading-normal">{name}</p>
            </label>
          ))}
        </div>
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
    </div>
  )
}
