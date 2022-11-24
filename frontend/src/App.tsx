import { SlackContextProvider } from './context/DefaultState';
import EnvNotifier from './pages/bot/EnvNotifier';

function App() {
  return (
    <div id="app">
      <SlackContextProvider>
        <EnvNotifier />
      </SlackContextProvider>
    </div>
  );
}

export default App;
