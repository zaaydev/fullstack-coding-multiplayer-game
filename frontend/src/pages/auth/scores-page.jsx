import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { socket } from "../../lib/socket-io";
import { useGameStore } from "../../store/game-store";
import ViewCodePage from "../ViewCode";

export default function ScorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomid } = useParams();

  const initialScores = location.state?.scores ?? null;
  const { scores, setScores } = useGameStore();
  const [loading, setLoading] = useState(!initialScores);

  // ── Slide-in panel state ──
  const [selectedUser, setSelectedUser] = useState(null); // { user_id, roomid }

  useEffect(() => {
    if (scores && scores.length > 0) {
      setLoading(false);
    }
  }, [scores]);

  // Close panel on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const maxScore =
    scores && scores.length
      ? Math.max(...scores.map((s) => s.score || 0))
      : null;

  const sortedScores = scores
    ? [...scores].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : [];

  const getRankLabel = (idx) => {
    if (idx === 0) return { emoji: "🥇", color: "text-yellow-400" };
    if (idx === 1) return { emoji: "🥈", color: "text-zinc-400" };
    if (idx === 2) return { emoji: "🥉", color: "text-amber-600" };
    return { emoji: `#${idx + 1}`, color: "text-zinc-500" };
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-amber-400";
    return "text-red-400";
  };

  const getBarColor = (score) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 5) return "bg-amber-500";
    return "bg-red-500";
  };

  const getBarGlow = (score) => {
    if (score >= 8) return "rgba(16,185,129,0.5)";
    if (score >= 5) return "rgba(245,158,11,0.5)";
    return "rgba(239,68,68,0.5)";
  };

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-hidden"
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
            "radial-gradient(ellipse 70% 25% at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 65%)",
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

      {/* ── Backdrop ── */}
      <div
        onClick={() => setSelectedUser(null)}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          selectedUser
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      />

      {/* ── Slide-in Panel ── */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out overflow-x-hidden ${
          selectedUser ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#07070b" }}
      >
        {selectedUser && (
          <ViewCodePage
            userId={selectedUser.user_id}
            roomId={selectedUser.roomid}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>

      {/* ── Header ── */}
      <div
        className="relative z-10 w-full border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, #0d0d12 0%, #07070b 100%)" }}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <h1
            className="text-base font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #f9d72f 0%, #fbbf24 60%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 10px rgba(249,215,47,0.2))",
            }}
          >
            CodeBattle
          </h1>
          <span className="text-zinc-800">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
            <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
              room/{roomid ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/app/game")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-800/80 bg-zinc-800/40 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-600 transition-all duration-200 active:scale-95"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Lobby
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 transition-all duration-200 active:scale-95"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"
              style={{ boxShadow: "0 0 6px #10b981" }}
            />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Game Over
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Results</h1>
          <p className="text-zinc-600 text-xs mt-1 font-mono">
            {sortedScores.length} player{sortedScores.length !== 1 ? "s" : ""} · sorted by score
          </p>
        </div>

        {/* ── States ── */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl border border-zinc-800/60"
            style={{ background: "#0d0d12" }}
          >
            <div className="flex gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Waiting for scores...</p>
          </div>
        ) : !sortedScores || sortedScores.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl border border-zinc-800/60"
            style={{ background: "#0d0d12" }}
          >
            <p className="text-xs text-zinc-600 uppercase tracking-widest">No scores available.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedScores.map((s, idx) => {
              const isWinner = maxScore !== null && (s.score ?? 0) === maxScore;
              const isSelected = selectedUser?.user_id === s.user_id;
              const rank = getRankLabel(idx);
              const score = s.score ?? 0;
              const pct = (score / 10) * 100;

              return (
                <div
                  key={s.user_id + idx}
                  className="rounded-2xl border transition-all duration-200"
                  style={{
                    background: isSelected
                      ? "rgba(99,102,241,0.05)"
                      : isWinner
                      ? "rgba(249,215,47,0.03)"
                      : "#0d0d12",
                    borderColor: isSelected
                      ? "rgba(99,102,241,0.3)"
                      : isWinner
                      ? "rgba(249,215,47,0.2)"
                      : "rgba(39,39,42,0.8)",
                  }}
                >
                  {/* Top row: rank + name + score */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xl font-bold flex-shrink-0 ${rank.color}`}>
                      <span
                        className={`text-xl font-bold shrink-0 ${rank.color}`}
                      >
                        {rank.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">
                          {s.user_name ?? s.user_id}
                        </p>
                        {s.user_name && (
                          <p className="text-xs text-zinc-600 font-mono truncate">
                            {s.user_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-3xl font-extrabold font-mono ${getScoreColor(score)}`}>
                        {score}
                      </span>
                      <span className="text-zinc-600 text-sm">/10</span>
                    </div>

                    {/* Time Info */}
                    <div className="mt-2 text-xs text-zinc-500 font-mono">
                      {s.completed_in && (
                        <p>
                          Completed in:{" "}
                          <span className="text-zinc-300">{s.completed_in}</span>
                        </p>
                      )}
                      {typeof s.time_left === "number" && (
                        <p>
                          Time left:{" "}
                          <span className="text-zinc-400">{s.time_left}s</span>
                        </p>
                      )}
                    </div>
                  </div>

                    {/* Score bar */}
                    <div className="mt-4 w-full h-1 bg-zinc-800/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
                        style={{
                          width: `${pct}%`,
                          boxShadow: `0 0 8px ${getBarGlow(score)}`,
                        }}
                      />
                    </div>

                    {/* Feedback */}
                    {s.feedback && (
                      <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
                        {s.feedback}
                      </p>
                    )}

                    {/* Roast */}
                    {s.roast && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/60">
                        <p className="text-[11px] text-rose-400/70 italic leading-relaxed">
                          "{s.roast}"
                        </p>
                      </div>
                    )}

                    {/* View Code button */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/50">
                      <button
                        onClick={() =>
                          setSelectedUser(
                            isSelected ? null : { user_id: s.user_id, roomid },
                          )
                        }
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                            : "border-zinc-800/80 bg-zinc-800/30 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Viewing
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View Code
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-[10px] text-zinc-800 uppercase tracking-widest">
          Scores arrive via socket · ESC or backdrop to close panel
        </p>
      </div>
    </div>
  );
}