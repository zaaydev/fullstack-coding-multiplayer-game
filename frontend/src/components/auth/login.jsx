import React, { useMemo, useState } from "react";
import { usePlayerStore } from "../../store/player-auth-store";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLoginRequest, isLoggingIn } = usePlayerStore();

  // ✅ UX validation only
  const isFormValid = useMemo(() => {
    return email.trim() && password.trim();
  }, [email, password]);

  const handleLogin = async () => {
    if (!isFormValid || isLoggingIn) return;
    await handleLoginRequest({ email, password });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="min-h-screen bg-gradient-to-br from-[#262624] to-[#1a1a19] flex items-center justify-center relative overflow-hidden px-4"
    >
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
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-linear-to-r from-[#F9D72F] via-yellow-400 to-amber-300 bg-clip-text text-transparent tracking-tight">
            CodeBattle
          </h1>
          <p className="text-lg md:text-xl text-gray-400 tracking-widest uppercase">
            Welcome Back
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border-2 border-white/10 p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Login
          </h2>

          <div className="space-y-5">
            {/* Email input */}
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#F9D72F] focus:shadow-lg focus:shadow-[#F9D72F]/20 transition-all duration-300"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#F9D72F] focus:shadow-lg focus:shadow-[#F9D72F]/20 transition-all duration-300"
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-[#F9D72F] transition-colors duration-200"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login button */}
            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid || isLoggingIn}
              className={`w-full px-8 py-4 text-lg font-bold rounded-xl uppercase tracking-widest transition-all duration-300 mt-2
          ${
            !isFormValid || isLoggingIn
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:-translate-y-1"
          }`}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Signup link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#F9D72F] hover:text-yellow-300 font-semibold transition-colors duration-200"
            >
              Sign Up
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

export default LoginPage;
