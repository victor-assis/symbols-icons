import { useEffect, useState } from 'react';
import { GlobalProvider } from './store';
import Tabs from './components/tabs/tabs';
import { Tab } from '../shared/types/typings';
import IconsScreen from './screens/icons-screen';
import ConfigScreen from './screens/config-screen';
import GithubScreen from './screens/github-screen';

export default function App() {
  const [tab, setTab] = useState<Tab>('icons');

  const screens = {
    icons: <IconsScreen />,
    config: <ConfigScreen />,
    github: <GithubScreen />,
  };

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'OnLoad' } }, '*');
  }, []);

  return (
    <GlobalProvider>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto p-4">{screens[tab]}</div>
        <Tabs current={tab} onSelect={setTab} />
      </div>
    </GlobalProvider>
  );
}
