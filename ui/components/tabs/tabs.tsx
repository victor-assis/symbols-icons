export type Tab = 'icons' | 'config' | 'github'

interface TabsProps {
  current: Tab
  onSelect: (tab: Tab) => void
}

export default function Tabs(props: TabsProps) {
  const base =
    'flex-1 text-xs px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2'
  const active = 'bg-blue-600 text-white'
  const inactive = 'bg-gray-200 text-gray-800'

  return (
    <div className="fixed bottom-0 left-0 w-full flex gap-1 bg-gray-100 p-1 border-t border-gray-300">
      <button
        className={`${base} ${props.current === 'icons' ? active : inactive}`}
        onClick={() => props.onSelect('icons')}
      >
        Ícones
      </button>
      <button
        className={`${base} ${props.current === 'config' ? active : inactive}`}
        onClick={() => props.onSelect('config')}
      >
        Configurações
      </button>
      <button
        className={`${base} ${props.current === 'github' ? active : inactive}`}
        onClick={() => props.onSelect('github')}
      >
        GitHub
      </button>
    </div>
  )
}
