import './App.css';
import { SnapshotSearch, SnapshotHeader } from './components';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SnapshotHeader />
      </header>
      <br/>
      <div className='App-body'>
        <SnapshotSearch />
      </div>
    </div>
  );
}

export default App;
