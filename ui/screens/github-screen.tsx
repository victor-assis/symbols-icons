import { useState } from 'react'

export default function GithubScreen() {
  const [repo, setRepo] = useState('')
  const [branch, setBranch] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    parent.postMessage(
      { pluginMessage: { github: { repo, branch, message } } },
      '*'
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-x-hidden">
      <div>
        <div className="flex items-center bg-gray-50 p-4 pb-2 justify-between">
          <div className="text-[#101518] flex size-12 shrink-0 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </div>
          <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            GitHub
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4">
          <input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Repository"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
          />
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c748a] p-[15px] text-base font-normal leading-normal"
          />
          <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
            Commit
          </button>
        </form>
      </div>
    </div>
  )
}
