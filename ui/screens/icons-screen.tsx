import { useState } from 'react'
import Button from '../components/button/button'

export default function IconsScreen() {
  const [outputs, setOutputs] = useState({ svg: false, symbol: false, sf: false })

  function toggle(name: keyof typeof outputs) {
    setOutputs({ ...outputs, [name]: !outputs[name] })
  }

  const previews = [0, 1, 2]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 text-xs">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={outputs.svg} onChange={() => toggle('svg')} /> SVG
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={outputs.symbol} onChange={() => toggle('symbol')} /> Symbol
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={outputs.sf} onChange={() => toggle('sf')} /> SF Symbol
        </label>
      </div>
      <div className="flex gap-2">
        {previews.map((p) => (
          <svg key={p} width="24" height="24">
            <circle cx="12" cy="12" r="10" className="fill-blue-600" />
          </svg>
        ))}
      </div>
      <Button className="w-full mt-2">Gerar</Button>
    </div>
  )
}
