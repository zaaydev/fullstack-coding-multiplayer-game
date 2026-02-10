import React from "react";
import { Users, Code, Zap } from "lucide-react";
import { usePlayerStore } from "../../store/player-auth-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameLobby() {
  const { playerAuth, checkAuthOnRefresh, isCheckingAuth } = usePlayerStore();
  const navigate = useNavigate();

  if (isCheckingAuth) return <div>Checking auth...</div>;
  if (!playerAuth) return navigate("/login");

  const gameInfo = {
    level: "Basic",
    id: "123",
    language: "JavaScript",
  };

  const players = [
    {
      name: "Adarsh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adarsh",
    },
    {
      name: "Sahil",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil",
    },
    {
      name: "Aman",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
    },
  ];

  const handleStart = () => {
    console.log("Game starting...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#262624] via-[#1a1a19] to-[#09090B] text-white">
      {/* Header */}
      <header className="bg-[#09090B]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold">CodeBattle</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{players.length} Players</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Game Information Card */}
        <div className="bg-gradient-to-r from-[#09090B] to-[#1a1a19] rounded-2xl border border-white/10 p-8 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Game Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    Level
                  </p>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {gameInfo.level}
                </p>
              </div>

              {/* Room ID */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 text-blue-400 font-mono">#</div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    Room ID
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-400 font-mono">
                  {gameInfo.id}
                </p>
              </div>

              {/* Language */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-green-400/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    Language
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {gameInfo.language}
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="md:ml-6">
              <button
                onClick={handleStart}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg rounded-xl uppercase tracking-widest shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300"
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-yellow-400" />
            <h2 className="text-3xl font-bold">Players</h2>
            <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
              {players.length}
            </span>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#09090B] to-[#1a1a19] rounded-2xl border border-white/10 p-6 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-full h-full rounded-full bg-[#262624] object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#09090B] rounded-full"></div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                    <p className="text-sm text-gray-400">Ready to code</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiting Message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <p className="text-gray-400">
              Waiting for host to start the game...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
