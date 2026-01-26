import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GameLobby from './pages/GameLobby'
import GamePlay from './pages/GamePlay'
import CodeEditor from './components/CodeEditor'

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<GameLobby />} />
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/editor" element={<CodeEditor />} />

        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
