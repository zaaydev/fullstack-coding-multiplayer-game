import React, { useMemo, useState } from "react";
import { usePlayerStore } from "../../store/player-auth-store";

const SignupPage = () => {
  const [playerData, setPlayerData] = useState({
    playerName: "",
    email: "",
    password: "",
  });

  const { handleSignUpRequest, isSigningUp } = usePlayerStore();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ basic frontend validation (UX only)
  const isFormValid = useMemo(() => {
    return (
      playerData.playerName.trim() &&
      playerData.email.trim() &&
      playerData.password.trim()
    );
  }, [playerData]);

  const handleSignup = async () => {
    if (isSigningUp || !isFormValid) return;
    await handleSignUpRequest(playerData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#07070b",
      }}
    >
      {/* Ambient glow */}
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
      <div className="absolute top-[10%] left-[5%] md:left-[10%] text-emerald-500/10 font-mono text-sm animate-pulse select-none">{"{"} code {"}"}</div>
      <div className="absolute top-[20%] right-[5%] md:right-[15%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "1s" }}>function()</div>
      <div className="absolute bottom-[15%] left-[3%] md:left-[8%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "2s" }}>const x =</div>
      <div className="absolute bottom-[25%] right-[5%] md:right-[12%] text-emerald-500/10 font-mono text-sm animate-pulse select-none" style={{ animationDelay: "1.5s" }}>{"</>"}</div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Join the Arena</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          </div>
          <h1
            className="text-5xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #f9d72f 0%, #fbbf24 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 24px rgba(249,215,47,0.25))",
            }}
          >
            CodeBattle
          </h1>
        </div>

        {/* Form card */}
        <div
          className="w-full rounded-2xl border border-zinc-800/80 p-6"
          style={{ background: "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)" }}
        >
          {/* Card title */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/60">
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-500/70"
              style={{ boxShadow: "0 0 5px #f59e0b" }}
            />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Create Account</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={playerData.email}
                onChange={handleOnChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 placeholder-zinc-700 outline-none font-mono tracking-wide transition-all duration-200 focus:border-emerald-500/40"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
              />
            </div>

            {/* Player Name */}
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                Player Name
              </label>
              <input
                required
                name="playerName"
                type="text"
                value={playerData.playerName}
                onChange={handleOnChange}
                placeholder="CodeWarrior123"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 placeholder-zinc-700 outline-none font-mono tracking-wide transition-all duration-200 focus:border-emerald-500/40"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={playerData.password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 placeholder-zinc-700 outline-none font-mono tracking-wide transition-all duration-200 focus:border-emerald-500/40"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
              />
            </div>

            {/* Signup button */}
            <button
              onClick={handleSignup}
              disabled={!isFormValid || isSigningUp}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest border transition-all duration-200 active:scale-95 mt-1 ${
                !isFormValid || isSigningUp
                  ? "border-zinc-800/60 bg-zinc-800/20 text-zinc-700 cursor-not-allowed"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40"
              }`}
              style={isFormValid && !isSigningUp ? { boxShadow: "0 0 20px rgba(245,158,11,0.08)" } : {}}
            >
              {isSigningUp ? (
                <>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-amber-500/60 animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Sign Up
                </>
              )}
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-zinc-700 mt-6 text-[11px]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors duration-200"
            >
              Login
            </a>
          </p>
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

export default SignupPage;