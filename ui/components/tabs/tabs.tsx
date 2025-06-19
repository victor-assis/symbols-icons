import styles from './tabs.module.scss'

export type Tab = 'icons' | 'config' | 'github'

interface TabsProps {
  current: Tab
  onSelect: (tab: Tab) => void
}

export default function Tabs(props: TabsProps) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${props.current === 'icons' ? styles.active : ''}`}
        onClick={() => props.onSelect('icons')}
      >
        Ícones
      </button>
      <button
        className={`${styles.tab} ${props.current === 'config' ? styles.active : ''}`}
        onClick={() => props.onSelect('config')}
      >
        Configurações
      </button>
      <button
        className={`${styles.tab} ${props.current === 'github' ? styles.active : ''}`}
        onClick={() => props.onSelect('github')}
      >
        GitHub
      </button>
    </div>
  )
}
