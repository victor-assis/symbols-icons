import { useState } from 'react'
import Button from '../components/button/button'

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-xs">
      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="Repositório"
        className="w-full border rounded px-1 py-0.5"
      />
      <input
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        placeholder="Branch"
        className="w-full border rounded px-1 py-0.5"
      />
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mensagem"
        className="w-full border rounded px-1 py-0.5"
      />
      <Button type="submit" className="w-full mt-1">
        Commitar
      </Button>
    </form>
  )
}
