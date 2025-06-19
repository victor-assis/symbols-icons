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
    <div>
      <table style={{ width: '100%', fontSize: '0.6rem' }}>
        <tbody>
          {sizes.map(s => (
            <tr key={s}>
              <td>
                <input
                  type='checkbox'
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
        type='number'
        placeholder='Tamanho'
        value={custom}
        onChange={e => setCustom(e.target.value)}
        style={{ width: '100%', marginTop: '0.5rem' }}
      />
    </div>
  )
}
