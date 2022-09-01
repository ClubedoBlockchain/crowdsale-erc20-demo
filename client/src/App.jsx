import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/Demo";
import "./App.css";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <hr />
          <Demo />
          <Toaster></Toaster>
          <hr />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
