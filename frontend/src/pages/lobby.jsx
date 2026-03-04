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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#07070b",
      }}
    >
      {/* Ambient top glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#00ff90 1px,transparent 1px),linear-gradient(90deg,#00ff90 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating code fragments */}
      <div className="absolute top-[10%] left-[8%] text-emerald-500/10 font-mono text-sm animate-pulse select-none">
        {"{"} code {"}"}
      </div>
      <div className="absolute top-[18%] right-[10%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "1s" }}>
        function()
      </div>
      <div className="absolute bottom-[18%] left-[6%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "2s" }}>
        const x =
      </div>
      <div className="absolute bottom-[28%] right-[8%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "1.5s" }}>
        {"</>"}
      </div>
      <div className="absolute top-[45%] left-[4%] text-emerald-500/8 font-mono text-xs animate-pulse select-none" style={{ animationDelay: "0.5s" }}>
        while(true)
      </div>
      <div className="absolute top-[60%] right-[5%] text-emerald-500/8 font-mono text-xs animate-pulse select-none" style={{ animationDelay: "2.5s" }}>
        return 0;
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-md w-full flex flex-col items-center">

        {/* Top label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" style={{ boxShadow: "0 0 6px #10b981" }} />
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
            multiplayer arena
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" style={{ boxShadow: "0 0 6px #10b981" }} />
        </div>

        {/* Logo */}
        <h1
          className="text-6xl font-black mb-2 tracking-tight"
          style={{
            background: "linear-gradient(135deg, #f9d72f 0%, #fbbf24 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 24px rgba(249,215,47,0.25))",
          }}
        >
          CodeBattle
        </h1>

        {/* Tagline */}
        <p className="text-[11px] text-zinc-600 mb-12 tracking-[0.3em] uppercase">
          Compete · Code · Conquer
        </p>

        {/* Card container */}
        <div
          className="w-full rounded-2xl border border-zinc-800/80 p-6 flex flex-col gap-3"
          style={{ background: "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)" }}
        >
          {/* Play button */}
          <button
            onClick={() => navigate("/room")}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40"
            style={{ boxShadow: "0 0 20px rgba(16,185,129,0.06)", }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Play
          </button>

          {/* Create button */}
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/40"
            style={{ boxShadow: "0 0 20px rgba(99,102,241,0.06)" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Room
          </button>
        </div>

        {/* Bottom dots */}
        <div className="mt-8 flex justify-center gap-1.5">
          <div className="w-1 h-1 bg-emerald-500/50 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-emerald-500/50 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1 h-1 bg-emerald-500/50 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;