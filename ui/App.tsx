import { useEffect, useState } from 'react';
import Tabs from './components/tabs';
import Alert from './components/alert';
import { Tab } from '../shared/types/typings';
import IconsScreen from './screens/icons-screen';
import { GlobalProvider, useStore } from './store';
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
      <InnerApp screens={screens} tab={tab} onSelect={setTab} />
    </GlobalProvider>
  );
}

function InnerApp({
  screens,
  tab,
  onSelect,
}: {
  screens: Record<Tab, JSX.Element>;
  tab: Tab;
  onSelect: (tab: Tab) => void;
}) {
  const { alertMessage, setAlertMessage } = useStore();
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-auto p-4">{screens[tab]}</div>
      <Tabs current={tab} onSelect={onSelect} />
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
      )}
    </div>
  );
}
