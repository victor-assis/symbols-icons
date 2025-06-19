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
    <form onSubmit={handleSubmit}>
      <input
        value={repo}
        onChange={e => setRepo(e.target.value)}
        placeholder='Repositório'
        style={{ width: '100%', marginBottom: '0.25rem' }}
      />
      <input
        value={branch}
        onChange={e => setBranch(e.target.value)}
        placeholder='Branch'
        style={{ width: '100%', marginBottom: '0.25rem' }}
      />
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder='Mensagem'
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <Button type='submit' style={{ width: '100%' }}>
        Commitar
      </Button>
    </form>
  )
}
