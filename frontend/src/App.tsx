import { SlackContextProvider } from './context/DefaultState';
import { HashRouter, Routes, Route } from 'react-router-dom';
import EnvNotifier from './pages/bot/EnvNotifier';
import { Layout } from './pages/Layout';

function App() {
  return (
    <div id="app">
      <HashRouter>
        <SlackContextProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="bot/env-notifier" element={<EnvNotifier />} />
          </Routes>
        </SlackContextProvider>
      </HashRouter>
    </div>
  );
}

export default App;
