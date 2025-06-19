import { useState } from 'react'
import IconsScreen from './screens/icons-screen'
import ConfigScreen from './screens/config-screen'
import GithubScreen from './screens/github-screen'
import Tabs, { Tab } from './components/tabs/tabs'

export default function App() {
  const [tab, setTab] = useState<Tab>('icons')

  let content
  if (tab === 'icons') content = <IconsScreen />
  else if (tab === 'config') content = <ConfigScreen />
  else content = <GithubScreen />

  return (
    <>
      <Tabs current={tab} onSelect={setTab} />
      {content}
    </>
  )
}
