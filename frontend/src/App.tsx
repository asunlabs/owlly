import { WailsResponseContextProvider } from './context/Context';
import { HashRouter, Routes, Route } from 'react-router-dom';
import EnvNotifier from './pages/bot/EnvNotifier';
import { Layout } from './pages/Layout';
import { Login } from './pages/account/Login';
import { App_ } from './App_';
import './App.css';
import { Contact } from './pages/help/Contact';
import { ToastContainer } from 'react-toastify';
import { PageNotFound } from './pages/Page404';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div id="app">
      <HashRouter>
        <WailsResponseContextProvider>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Owlly</title>
            <link rel="canonical" href="http://mysite.com/example" />
            <script type="text/javascript" src="https://payhip.com/payhip.js"></script>
          </Helmet>
          <Layout>
            <Routes>
              <Route path="/" element={<App_ />} />
              <Route path="account/login" element={<Login />} />
              <Route path="bot/env-notifier" element={<EnvNotifier />} />
              <Route path="help/contact" element={<Contact />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
          {/* render toast only once */}
          <ToastContainer />
        </WailsResponseContextProvider>
      </HashRouter>
    </div>
  );
}

export default App;
