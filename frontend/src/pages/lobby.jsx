import React, { useEffect, useState } from "react";
import { usePlayerStore } from "../store/player-auth-store";
import { useNavigate } from "react-router-dom";

const LobbyPage = () => {
  const [roomCode, setRoomCode] = useState("");
  const { playerAuth, checkAuthOnRefresh } = usePlayerStore();
  const navigate = useNavigate();

  const handlePlay = () => {
    console.log("Play clicked");
  };

  const handleCreate = () => {
    console.log("Create room clicked");
  };

  const handleJoin = () => {
    console.log("Join room:", roomCode);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#262624] to-[#1a1a19] flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 3px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating code elements */}
      <div className="absolute top-[10%] left-[10%] text-white/10 font-mono text-xl animate-pulse">
        {"{"} code {"}"}
      </div>
      <div className="absolute top-[20%] right-[15%] text-white/10 font-mono text-xl animate-pulse delay-1000">
        function()
      </div>
      <div className="absolute bottom-[15%] left-[8%] text-white/10 font-mono text-xl animate-pulse delay-2000">
        const x =
      </div>
      <div className="absolute bottom-[25%] right-[12%] text-white/10 font-mono text-xl animate-pulse delay-3000">
        {"</>"}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-2xl w-full">
        {/* Logo */}
        <h1 className="text-7xl font-black mb-3 bg-gradient-to-r from-[#F9D72F] via-yellow-400 to-amber-300 bg-clip-text text-transparent tracking-tight">
          CodeBattle
        </h1>

        {/* Tagline */}
        <p className="text-xl text-gray-400 mb-16 tracking-widest uppercase">
          Compete. Code. Conquer.
        </p>

        {/* Buttons container */}
        <div className="flex flex-col items-center gap-5">
          {/* Play button */}
          <button
            onClick={() => navigate("/room")}
            className="w-72 px-10 py-5 text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10">Play</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          {/* Create button */}
          <button
            onClick={handleCreate}
            className="w-72 px-10 py-5 text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Create</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          {/* Join room container */}
          <div className="w-72 flex gap-2 p-2 bg-white/5 backdrop-blur-md rounded-xl border-2 border-white/10 focus-within:border-[#F9D72F] focus-within:shadow-lg focus-within:shadow-[#F9D72F]/30 transition-all duration-300">
            <input
              type="text"
              placeholder="Join Room"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleJoin()}
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-base"
            />
            <button
              onClick={handleJoin}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg uppercase tracking-wider hover:from-purple-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 text-sm"
            >
              Join
            </button>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
