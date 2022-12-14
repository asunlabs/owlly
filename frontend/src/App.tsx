import { SlackContextProvider } from './context/DefaultState';
import { HashRouter, Routes, Route } from 'react-router-dom';
import EnvNotifier from './pages/bot/EnvNotifier';
import { Layout } from './pages/Layout';
import { SlackConfig } from './pages/account/SlackConfig';
import { FaucetGetter } from './pages/automation/FaucetGetter';
import { Login } from './pages/account/Login';
import { App_ } from './_App';
import './App.css';
import { Contact } from './pages/help/Contact';

function App() {
  return (
    <div id="app">
      <HashRouter>
        <SlackContextProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<App_ />} />
              <Route path="account/login" element={<Login />} />
              <Route path="account/slack" element={<SlackConfig />} />
              <Route path="bot/faucet-getter" element={<FaucetGetter />} />
              <Route path="bot/env-notifier" element={<EnvNotifier />} />
              <Route path="help/contact" element={<Contact />} />
            </Routes>
          </Layout>
        </SlackContextProvider>
      </HashRouter>
    </div>
  );
}

export default App;
