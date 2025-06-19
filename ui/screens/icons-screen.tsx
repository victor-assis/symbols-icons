import { useState } from 'react'

export default function IconsScreen() {
  const [outputs, setOutputs] = useState({ svg: false, symbol: false, sf: false })

  function toggle(name: keyof typeof outputs) {
    setOutputs({ ...outputs, [name]: !outputs[name] })
  }

  const tickSvg =
    "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,21,24)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')"

  const previews = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuClECe-pPZGiO592NhOM3wy-7HZJuUQH9Z6bmkLexRZfUmjKT5sB24_XJUv3NKehRwDXABwBTw7vNWnyuAh0493GfV3UwxNqztN9L9cqJpnyakxyps1wsSdg08NDk0IdAc9NhjjzB0mGJ24kdkAfx3JwkETWvAAmeyM68By4ixEVigMqUYX6Bn0jnkL4VaXJPozV4jyEZeGPoriK1SAwNnt6jF11vPDDPmbN9UmYv5-MLQTapBvjXuVaPORXbyT4ronvLa8J_AJVLJZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBFhgGLmb72P3woTyrH3fFBS55Ke2_6SaxDD_cftOQUHD-P_7nf49Z-OCmm3sBArZiv6PcJIi3_FFeYJbtTEHgnHJl1tcBJ_3UV8OZy2MmfT0YaH3PlQDAm3t_xwHsYs_JoM7enoKqZ3CKG13_KDncdjzoW-hs2Fm06OhTaZQkRNGyNh5tc-no50q1um7Hmea59yMM5lc7c3gJIi3_ju8d9EE3naMkjwqa1zIc4jMsQqwBwn4Zo-zuohd0FZ3JdaJ_Kl6fivqgbu-Yn',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJsq9j7NpAQ3hGtwvJjEsAxAou_ehsxgGWAZsP6hcMXG_JDNIMSgcjf4txvJO4eql1_djWZD88ciajESY7HJ6PmYM6qGt26Nsx5EtIf4FBTYw-0hokon8RrZcU6FPUPFATlE3TOOfOiBnSwjkAo-nUuPU4fa3QPRSjFhUs3dZ4z78j-Fgg8t9abiE-4JxP50wBYb31mH0telXGqDtJorz1qWEQbD6mt8FQP4mc7z6CrYmhfWX5ArW59LXfqVAjyG2jBTCCLFz9DN6e',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDGwH7WSz1x5fWR4KZr8s1XTjxFl6IQ_SiKG97GlMs6O6NA0VC7I_tVH1Ugbx73wRRlTk-XgnCdgKyIxXEsL2T5TstpQfJ7uq-H-wKduPL8Qx_nWFTOtLmhZ5KLeqBSn7s-yOhUxrq1Dv5I6V3EhUBDSxalMVaDgXbtef0f2ceBhbq9a0DGc9eH69eSjnW9_ydp00YlF3d0EswqMC28dKKgHIcRCmGn0qmiK55t06CWrIbPqgkHwNWTugLqR84H_rPTpZaHc_qDbwH-'
  ]

  return (
    <div
      className="flex flex-col justify-between h-full bg-gray-50 overflow-x-hidden"
      style={{ '--checkbox-tick-svg': tickSvg } as React.CSSProperties}
    >
      <div>
        <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
          <div className="text-[#101518] flex size-12 shrink-0 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </div>
          <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Export Icons
          </h2>
        </div>
        <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Select Format
        </h3>
        <div className="px-4">
          <label className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              checked={outputs.svg}
              onChange={() => toggle('svg')}
              className="h-5 w-5 rounded border-[#d4dce2] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dce2] focus:outline-none"
            />
            <p className="text-[#101518] text-base font-normal leading-normal">SVG</p>
          </label>
          <label className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              checked={outputs.symbol}
              onChange={() => toggle('symbol')}
              className="h-5 w-5 rounded border-[#d4dce2] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dce2] focus:outline-none"
            />
            <p className="text-[#101518] text-base font-normal leading-normal">Symbol</p>
          </label>
          <label className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              checked={outputs.sf}
              onChange={() => toggle('sf')}
              className="h-5 w-5 rounded border-[#d4dce2] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dce2] focus:outline-none"
            />
            <p className="text-[#101518] text-base font-normal leading-normal">SF Symbol</p>
          </label>
        </div>
        <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Preview
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          {previews.map((src) => (
            <div key={src} className="flex flex-col gap-3">
              <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style={{ backgroundImage: `url(${src})` }}></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex px-4 py-3">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Generate</span>
        </button>
      </div>
    </div>
  )
}
