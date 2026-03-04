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

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white relative overflow-hidden">

      {/* ── Backdrop ── */}
      <div
        onClick={() => setSelectedUser(null)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${selectedUser ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* ── Slide-in Panel ── */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out overflow-x-hidden ${selectedUser ? "translate-x-0" : "translate-x-full"
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
      <div className="w-full border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg tracking-tight">CodeBattle</span>
          <span className="ml-3 text-xs text-zinc-500 font-mono">
            room/{roomid ?? "—"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/app/game")}
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            ← Lobby
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded-md bg-amber-400 text-sm font-medium text-black hover:bg-amber-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {sortedScores.length} player{sortedScores.length !== 1 ? "s" : ""} ·
            sorted by score
          </p>
        </div>

        {loading ? (
          <div className="text-zinc-500 py-20 text-center text-sm">
            Waiting for scores...
          </div>
        ) : !sortedScores || sortedScores.length === 0 ? (
          <div className="text-zinc-500 py-20 text-center text-sm">
            No scores available.
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
                  className={`rounded-xl border p-5 transition-all duration-200 ${isSelected
                      ? "border-indigo-500/40 bg-indigo-500/5"
                      : isWinner
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-zinc-800 bg-zinc-900/60"
                    }`}
                >
                  {/* Top row: rank + name + score */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xl font-bold flex-shrink-0 ${rank.color}`}>
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
                  <div className="mt-3 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${score >= 8
                          ? "bg-emerald-500"
                          : score >= 5
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Feedback */}
                  {s.feedback && (
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                      {s.feedback}
                    </p>
                  )}

                  {/* Roast */}
                  {s.roast && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <p className="text-xs text-rose-400/80 italic">"{s.roast}"</p>
                    </div>
                  )}

                  {/* View Code button */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60">
                    <button
                      onClick={() =>
                        setSelectedUser(
                          isSelected ? null : { user_id: s.user_id, roomid }
                        )
                      }
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${isSelected
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        }`}
                    >
                      {isSelected ? (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Viewing
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-700">
          Scores arrive via socket · press ESC or click backdrop to close panel
        </p>
      </div>
    </div>
  );
}