import { useState } from 'react'
import Button from '../components/button/button'

export default function IconsScreen() {
  const [outputs, setOutputs] = useState({ svg: false, symbol: false, sf: false })

  function toggle(name: keyof typeof outputs) {
    setOutputs({ ...outputs, [name]: !outputs[name] })
  }

  const previews = [0, 1, 2]

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <label>
          <input type='checkbox' checked={outputs.svg} onChange={() => toggle('svg')} /> SVG
        </label>
        <label>
          <input type='checkbox' checked={outputs.symbol} onChange={() => toggle('symbol')} /> Symbol
        </label>
        <label>
          <input type='checkbox' checked={outputs.sf} onChange={() => toggle('sf')} /> SF Symbol
        </label>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {previews.map(p => (
          <svg key={p} width='24' height='24'>
            <circle cx='12' cy='12' r='10' fill='var(--figma-color-bg-brand)' />
          </svg>
        ))}
      </div>
      <Button style={{ width: '100%', marginTop: '0.5rem' }}>Gerar</Button>
    </div>
  )
}
