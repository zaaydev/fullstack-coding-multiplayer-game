import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CodeEditor from "./components/CodeEditor";
import SignupPage from "./components/auth/sign-up";
import LoginPage from "./components/auth/login";
import GamePlay from "./pages/auth/GamePlay";
import GameLobby from "./pages/auth/GameLobby";
import { useEffect } from "react";
import { usePlayerStore } from "./store/player-auth-store";

function App() {
  const { playerAuth, checkAuthOnRefresh, isCheckingAuth } = usePlayerStore();

  useEffect(() => {
    checkAuthOnRefresh();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby" element={<GameLobby />} />
          <Route path="/gameplay" element={<GamePlay />} />
          <Route path="/editor" element={<CodeEditor />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
