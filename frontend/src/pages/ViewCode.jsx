import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import OutputScreen from "../components/ViewCode/Output";
import { socket } from "../lib/socket-io";

// --- Main Page ---
// Can be used as a standalone page (pass userId+roomId as props)
// OR as a route page (pass nothing, reads from useParams)
export default function ViewCodePage({ userId, roomId, onClose }) {

  const [userScore, setUserScore]     = useState(null);
  const [language, setLanguage]       = useState("javascript");
  const [theme, setTheme]             = useState("vs-dark");
  const [copied, setCopied]           = useState(false);
  const [runCode, setRunCode]         = useState(null);
  const [running, setRunning]         = useState(false);
  const [outputOpen, setOutputOpen]   = useState(false);

  const editorRef = useRef(null);

  // Reset state when switching users
  useEffect(() => {
    setUserScore(null);
    setRunCode(null);
    setOutputOpen(false);
    setCopied(false);
  }, [userId, roomId]);

  // --- Socket ---
  useEffect(() => {
    if (!userId || !roomId) return;

    socket.emit("view-code", { roomId, userId });

    const handleViewCodeData = (data) => {
      console.log("Received:", data.userScore);
      setUserScore(data.userScore);
    };

    socket.on("view-code-data", handleViewCodeData);
    return () => socket.off("view-code-data", handleViewCodeData);
  }, [userId, roomId]);

  // --- Map API fields ---
  // { user_id, user_name, code_for_review, time_left,
  //   score, time_taken, completed_in, roast, feedback }
  const score       = userScore?.score           ?? 0;
  const pct         = (score / 10) * 100;
  const playerName  = userScore?.user_name       ?? "—";
  const uid         = userScore?.user_id         ?? "";
  const code        = userScore?.code_for_review ?? "// No code submitted";
  const completedIn = userScore?.completed_in    ?? null;
  const timeLeft    = userScore?.time_left       ?? null;
  const timeTaken   = userScore?.time_taken      ?? null;
  const feedback    = userScore?.feedback        ?? null;
  const roast       = userScore?.roast           ?? null;

  // --- Helpers ---
  function getScoreColor(s) {
    if (s >= 8) return "text-emerald-400";
    if (s >= 5) return "text-amber-400";
    return "text-red-400";
  }
  function getScoreBarColor(s) {
    if (s >= 8) return "#10b981";
    if (s >= 5) return "#f59e0b";
    return "#ef4444";
  }
  function getRankEmoji(s) {
    if (s >= 9) return "🥇";
    if (s >= 7) return "🥈";
    if (s >= 5) return "🥉";
    return "💀";
  }

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }
  function handleCopy() {
    const val = editorRef.current?.getValue() ?? code;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  function handleRun() {
    const val = editorRef.current?.getValue() ?? code;
    setRunning(true);
    setOutputOpen(true);
    setRunCode(null);
    setTimeout(() => { setRunCode(val); setRunning(false); }, 300);
  }
  function handleRerun() {
    const val = editorRef.current?.getValue() ?? code;
    setRunCode(null);
    setTimeout(() => setRunCode(val), 50);
  }

  // --- Loading ---
  if (!userScore) {
    return (
      <div
        className="h-full min-h-screen bg-[#07070b] flex flex-col items-center justify-center gap-3"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
      >
        <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 25% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 65%)" }} />
        <svg className="w-6 h-6 text-emerald-500/40 animate-spin relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-xs text-zinc-600 relative z-10">Fetching player data…</p>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      className="min-h-screen bg-[#07070b] text-white"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 25% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 65%)" }} />
      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#00ff90 1px,transparent 1px),linear-gradient(90deg,#00ff90 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-7 flex flex-col gap-5">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between">

          {/* Left: close button + player badge */}
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-200 text-xs transition-colors group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Close
              </button>
            )}
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base">{getRankEmoji(score)}</span>
              <span className="text-zinc-300 font-medium">{playerName}</span>
              <span className="text-zinc-700">·</span>
              <span className="font-mono text-zinc-700 text-[11px]">{uid}</span>
            </div>
          </div>

          {/* Right: theme + copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(t => t === "vs-dark" ? "light" : "vs-dark")}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-500 border border-zinc-800/80 hover:border-zinc-700 transition-all"
            >
              {theme === "vs-dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                copied
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800/80 text-zinc-500 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
              }`}
            >
              {copied ? (
                <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
              ) : (
                <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>Copy</>
              )}
            </button>
          </div>
        </div>

        {/* ── Player Card ── */}
        <div className="rounded-2xl border border-zinc-800/70 p-5" style={{ background: "linear-gradient(135deg,#0f0f14 0%,#0a0a0f 100%)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-xl flex-shrink-0">
                {getRankEmoji(score)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">{playerName}</h1>
                <p className="text-[11px] text-zinc-700 mt-0.5 font-mono">{uid}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {completedIn && (
                    <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {completedIn}
                    </span>
                  )}
                  {typeof timeLeft === "number" && (
                    <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      {timeLeft}s left
                    </span>
                  )}
                  {timeTaken && (
                    <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                      {timeTaken}s taken
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-4xl font-black tabular-nums ${getScoreColor(score)}`}>{score}</span>
                <span className="text-zinc-700 text-base ml-1">/10</span>
              </div>
              <div className="w-28 h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: getScoreBarColor(score) }} />
              </div>
            </div>
          </div>

          {/* Feedback + Roast */}
          {(feedback || roast) && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedback && (
                <div className="flex gap-2.5">
                  <div className="w-0.5 rounded-full bg-emerald-500/25 flex-shrink-0" />
                  <p className="text-[12px] text-zinc-500 leading-relaxed">{feedback}</p>
                </div>
              )}
              {roast && (
                <div className="flex gap-2.5">
                  <div className="w-0.5 rounded-full bg-rose-500/25 flex-shrink-0" />
                  <p className="text-[12px] text-rose-500/55 italic leading-relaxed">"{roast}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Editor + Output ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: outputOpen ? "1fr 360px" : "1fr", alignItems: "start" }}>

          {/* Editor Panel */}
          <div className="rounded-2xl border border-zinc-800/70 overflow-hidden flex flex-col" style={{ background: "#0a0a0f" }}>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/70 bg-zinc-900/40">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                solution.js
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                JavaScript
              </span>
            </div>

            {/* Monaco */}
            <div style={{ height: "440px" }}>
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                  readOnly: false,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  renderLineHighlight: "gutter",
                  tabSize: 2,
                  wordWrap: "on",
                  padding: { top: 14, bottom: 14 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  bracketPairColorization: { enabled: true },
                  overviewRulerBorder: false,
                  scrollbar: { verticalScrollbarSize: 3, horizontalScrollbarSize: 3 },
                }}
              />
            </div>

            {/* Run bar */}
            <div className="px-4 py-3 border-t border-zinc-800/70 bg-zinc-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  JavaScript
                </span>
                <span>UTF-8</span>
                <span>Spaces: 2</span>
              </div>
              <button
                onClick={handleRun}
                disabled={running}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  running
                    ? "bg-emerald-500/8 text-emerald-600 border border-emerald-500/15 cursor-not-allowed"
                    : "bg-emerald-500/12 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/35 active:scale-95 shadow-[0_0_18px_rgba(16,185,129,0.06)] hover:shadow-[0_0_22px_rgba(16,185,129,0.12)]"
                }`}
              >
                {running ? (
                  <><svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Running...</>
                ) : (
                  <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>Run Code</>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          {outputOpen && (
            <div className="rounded-2xl border border-zinc-800/70 overflow-hidden flex flex-col" style={{ background: "#07070b", height: "530px" }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/70 bg-zinc-900/40 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 6px #10b981" }} />
                  <span className="text-xs text-zinc-400 font-medium tracking-wide">OUTPUT</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleRerun} className="text-[11px] text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.49-4.8" /></svg>
                    Re-run
                  </button>
                  <button onClick={() => { setOutputOpen(false); setRunCode(null); }} className="text-zinc-700 hover:text-zinc-400 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {runCode !== null ? (
                  <OutputScreen code={runCode} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-zinc-800 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p className="text-[11px] text-zinc-700">Preparing runtime…</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}