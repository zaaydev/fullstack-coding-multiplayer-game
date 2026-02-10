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
    <div className="min-h-screen bg-gradient-to-br from-[#262624] to-[#1a1a19] flex items-center justify-center relative overflow-hidden px-4">
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
      <div className="absolute top-[10%] left-[5%] md:left-[10%] text-white/10 font-mono text-lg md:text-xl animate-pulse">
        {"{"} code {"}"}
      </div>
      <div className="absolute top-[20%] right-[5%] md:right-[15%] text-white/10 font-mono text-lg md:text-xl animate-pulse delay-1000">
        function()
      </div>
      <div className="absolute bottom-[15%] left-[3%] md:left-[8%] text-white/10 font-mono text-lg md:text-xl animate-pulse delay-2000">
        const x =
      </div>
      <div className="absolute bottom-[25%] right-[5%] md:right-[12%] text-white/10 font-mono text-lg md:text-xl animate-pulse delay-3000">
        {"</>"}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-[#F9D72F] via-yellow-400 to-amber-300 bg-clip-text text-transparent tracking-tight">
            CodeBattle
          </h1>
          <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase">
            Join the Arena
          </p>
        </div>

        {/* Signup form */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border-2 border-white/10 p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>

          <div className="space-y-5">
            {/* Email input */}
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={playerData.email}
                onChange={handleOnChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#F9D72F] focus:shadow-lg focus:shadow-[#F9D72F]/20 transition-all duration-300"
              />
            </div>
            {/* Player Name input */}
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                Player Name
              </label>
              <input
                required
                name="playerName"
                type="text"
                value={playerData.playerName}
                onChange={handleOnChange}
                placeholder="CodeWarrior123"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#F9D72F] focus:shadow-lg focus:shadow-[#F9D72F]/20 transition-all duration-300"
              />
            </div>
            {/* Password input */}
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={playerData.password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#F9D72F] focus:shadow-lg focus:shadow-[#F9D72F]/20 transition-all duration-300"
              />
            </div>
            {/* Signup button */}

            <button
              onClick={handleSignup}
              disabled={!isFormValid || isSigningUp}
              className={`w-full px-8 py-4 text-lg font-bold rounded-xl uppercase tracking-widest transition-all duration-300 mt-2
        ${
          !isFormValid || isSigningUp
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#F9D72F] to-amber-400 text-[#262624] hover:-translate-y-1"
        }`}
            >
              {isSigningUp ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#F9D72F] hover:text-yellow-300
              font-semibold transition-colors duration-200"
            >
              Login
            </a>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-[#F9D72F] rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
