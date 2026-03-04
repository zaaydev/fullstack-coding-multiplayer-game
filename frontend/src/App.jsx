import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./components/auth/sign-up";
import LoginPage from "./components/auth/login";
import { useEffect } from "react";
import { usePlayerStore } from "./store/player-auth-store";
import LobbyPage from "./pages/lobby";
import GameplayPage from "./pages/auth/gameplay";
import RoomPage from "./pages/auth/game-room";
import ScorePage from "./pages/auth/scores-page";
import ViewCodePage from "./pages/ViewCode";

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
          <Route path="/" element={<LobbyPage />} />
          <Route
            path="/room"
            element={playerAuth ? <RoomPage /> : <LoginPage />}
          />
  
          {/* Auth Routes */}
          <Route
            path="/signup"
            element={playerAuth ? <LobbyPage /> : <SignupPage />}
          />
          <Route
            path="/login"
            element={playerAuth ? <LobbyPage /> : <LoginPage />}
          />

          {/* Gameplay Routes */}
          <Route
            path="/gameplay/:roomid"
            element={playerAuth ? <GameplayPage /> : <LoginPage />}
          />
          <Route
            path="/scores/:roomid"
            element={playerAuth ? <ScorePage /> : <LoginPage />}
          />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
