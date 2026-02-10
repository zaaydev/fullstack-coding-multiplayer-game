import React, { useRef, useState } from "react";
import { Trophy, Clock, Target } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { usePlayerStore } from "../../store/player-auth-store";

export default function GamePlay() {
  const { playerAuth } = usePlayerStore();
  const [gameInfo] = useState({
    points: 0,
    round: "1",
    question: "Write a program to reverse this array",
  });

  const [code, setCode] = useState("");
  const iframeRef = useRef(null);

  const runCode = () => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframe.srcdoc = `
  <html>
    <body style="background:#000;color:#fff;padding:10px">
      <pre id="output"></pre>
      <script>
        const output = document.getElementById("output");

        console.log = (...args) => {
          output.innerHTML += args.join(" ") + "\\n";
        };

        try {
          ${code}
        } catch (e) {
          output.innerHTML += "Error: " + e.message;
        }
      </script>
    </body>
  </html>
`;

    iframeDoc.close();
  };

  if (!playerAuth) return <div>login first</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#262624] via-[#1a1a19] to-[#09090B] text-white">
      {/* Header with Game Stats */}
      <header className="bg-[#09090B]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CodeBattle
            </h1>

            {/* Stats Bar */}
            <div className="flex items-center gap-6">
              {/* Points */}
              <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Points
                  </p>
                  <p className="text-xl font-bold text-yellow-400">
                    {gameInfo.points}
                  </p>
                </div>
              </div>

              {/* Round */}
              <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                <Target className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Round
                  </p>
                  <p className="text-xl font-bold text-blue-400">
                    {gameInfo.round}
                  </p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Time
                  </p>
                  <p className="text-xl font-bold text-green-400">5:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Question Card */}
        <div className="bg-gradient-to-br from-[#09090B] to-[#1a1a19] rounded-2xl border border-white/10 p-8 shadow-2xl mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/20">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Challenge
                </h2>
                <span className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                  Round {gameInfo.round}
                </span>
              </div>
              <p className="text-3xl font-bold leading-relaxed">
                {gameInfo.question}
              </p>
            </div>
          </div>

          {/* Additional Info Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live Challenge</span>
              </div>
              <div className="text-sm text-gray-400">
                Difficulty:{" "}
                <span className="text-yellow-400 font-semibold">Medium</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Current Points:{" "}
              <span className="text-yellow-400 font-bold text-lg">
                {gameInfo.points}
              </span>
            </div>
          </div>
        </div>

        {/* Code Editor Placeholder */}
        <div className="bg-gradient-to-br from-[#09090B] to-[#1a1a19] rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Your Solution</h3>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition-all duration-300">
                Reset
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-green-900/50 transition-all duration-300"
                onClick={runCode}
              >
                Run Code
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/30 transition-all duration-300">
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-6 min-h-[450px]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-gray-500 text-xs">solution.js</span>
            </div>

            {/* Editor container MUST have height */}
            <div className="h-[360px]">
              <Editor
                height="100%"
                language="javacsript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="mt-6 bg-[#0a0a0a] rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-400">
                Output Console
              </span>
            </div>

            {/* Output must have height */}
            <div className="h-48 rounded-lg overflow-hidden border border-white/10">
              <iframe
                ref={iframeRef}
                title="output"
                className="w-full h-full bg-black text-white"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
