import { SlackContextProvider, WailsResponseContextProvider } from './context/Context';
import { HashRouter, Routes, Route } from 'react-router-dom';
import EnvNotifier from './pages/bot/EnvNotifier';
import { Layout } from './pages/Layout';
import { SlackConfig } from './pages/account/SlackConfig';
import { FaucetGetter } from './pages/bot/FaucetGetter';
import { Login } from './pages/account/Login';
import { App_ } from './App_';
import './App.css';
import { Contact } from './pages/help/Contact';
import { ToastContainer } from 'react-toastify';
import { PageNotFound } from './pages/Page404';

function App() {
  return (
    <div id="app">
      <HashRouter>
        <WailsResponseContextProvider>
          <SlackContextProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<App_ />} />
                <Route path="account/login" element={<Login />} />
                <Route path="account/slack" element={<SlackConfig />} />
                <Route path="bot/faucet-getter" element={<FaucetGetter />} />
                <Route path="bot/env-notifier" element={<EnvNotifier />} />
                <Route path="help/contact" element={<Contact />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Layout>
            {/* render toast only once */}
            <ToastContainer />
          </SlackContextProvider>
        </WailsResponseContextProvider>
      </HashRouter>
    </div>
  );
}

export default App;
