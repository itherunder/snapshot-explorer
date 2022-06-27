import './App.css';
import { SnapshotSearch, SnapshotHeader } from './components';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SnapshotHeader />
      </header>
      <body className='App-body'>
        <SnapshotSearch />
      </body>
    </div>
  );
}

export default App;
