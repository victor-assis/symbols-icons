import { useState } from 'react'

export default function ConfigScreen() {
  const sizes = [16, 24, 32, 48]
  const [selected, setSelected] = useState<number[]>([])
  const [custom, setCustom] = useState('')

  function toggle(size: number) {
    setSelected(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  return (
    <div className="flex flex-col gap-2 text-xs">
      <table className="w-full">
        <tbody>
          {sizes.map((s) => (
            <tr key={s} className="h-5">
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(s)}
                  onChange={() => toggle(s)}
                />
              </td>
              <td>{s}px</td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="number"
        placeholder="Tamanho"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        className="w-full border rounded px-1 py-0.5"
      />
    </div>
  )
}
