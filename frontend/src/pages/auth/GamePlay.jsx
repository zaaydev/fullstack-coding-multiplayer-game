import { useState } from "react";
import CodeEditor from "../../components/editor/code-editor";
import OutputScreen from "../../components/editor/output-screen";
import { useGameStore } from "../../store/game-store";
import { socket } from "../../lib/socket-io";
import { usePlayerStore } from "../../store/player-auth-store";
import { data, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const GameplayPage = () => {
  const [runCode, setRunCode] = useState("");
  const [runKey, setRunKey] = useState(0);
  const { room, setRoom, setScores, aiQuestion, code, setCode } =
    useGameStore();
  const { playerAuth } = usePlayerStore();
  const { roomid } = useParams();
  const navigate = useNavigate();
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  function handleRun() {
    setRunCode(code);
    setRunKey((prev) => prev + 1);
  }

  function handleReset() {
    setCode("// Done Reset! Write your code here");
    setRunKey((prev) => prev + 1);
  }

  async function handleSubmit() {
    socket.emit("submit-code", {
      frontend_user_id: playerAuth._id,
      frontend_user_name: playerAuth.playerName,
      room_id: room.room_id,
      the_code: code || "",
    });
  }

  useEffect(() => {
    if (!socket) return;

    console.log(room);
    socket.on("all-player-submitted", (payload) => {
      setScores(payload.data);
      navigate(`/scores/${payload.room_id}`);
    });

    socket.on("current-player-submitted", ({ user_id }) => {
      setRoom({
        ...room,
        players: room.players.map((player) =>
          player.user_id === user_id ? { ...player, submitted: true } : player,
        ),
      });
    });

    // 🔄 When any room update happens (player joins, ready toggles, etc.)
    const handleRoomUpdated = (payload) => {
      console.log("Room Updated:", payload.data);

      // 🧾 Sync frontend state with latest backend room state
      setRoom(payload.data);
    };

    socket.on("room-updated", handleRoomUpdated);

    return () => {
      socket.off("all-player-submitted");
      socket.off("current-player-submitted");
      socket.off("room-updated");
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    console.log("object");

    socket.emit("player-typing", {
      roomId: room.room_id,
      userId: playerAuth._id,
    });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit("player-stop-typing", {
        roomId: room.room_id,
        userId: playerAuth._id,
      });
    }, 2000); // 1 second idle

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    const handleShowTyping = ({ userId }) => {
      console.log(userId);
      setTypingUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId],
      );
    };

    const handleHideTyping = ({ userId }) => {
      console.log(userId);
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    const handleHostClosed = () => {
      alert("Host closed the room");

      setRoom(null);

      navigate("/room");
    };

    socket.on("host-left-room", handleHostClosed);

    socket.on("show-typing", handleShowTyping);
    socket.on("hide-typing", handleHideTyping);

    return () => {
      socket.off("host-left-room", handleHostClosed);
      socket.off("show-typing", handleShowTyping);
      socket.off("hide-typing", handleHideTyping);
    };
  }, []);

  useEffect(() => {
    // user wont be redirected until theres something in room so room is always available

    const time_interval = setInterval(() => {
      const right_now = Date.now();
      const time_passed = Math.floor((right_now - room.start_time) / 1000);
      const remaining_time = room.total_time - time_passed;

      if (remaining_time <= 0) {
        clearInterval(time_interval);
        handleSubmit();
      }

      setTimeLeft(remaining_time);
    }, 1000);

    return () => clearInterval(time_interval);
  }, []);

  // ⬇ Convert seconds → MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    if (!room) navigate("/");
  }, [room]);

  // Timer color based on urgency
  const timerColor =
    timeLeft <= 30
      ? "text-red-400"
      : timeLeft <= 60
      ? "text-amber-400"
      : "text-emerald-400";

  const timerGlow =
    timeLeft <= 30
      ? "rgba(239,68,68,0.15)"
      : timeLeft <= 60
      ? "rgba(245,158,11,0.12)"
      : "rgba(16,185,129,0.1)";

  return (
    <main
      className="h-screen w-full text-white flex flex-col overflow-hidden"
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

      {/* ── TOP BAR ── */}
      <div
        className="relative z-10 h-[15%] min-h-[80px] w-full border-b border-zinc-800/80 flex items-center px-6 shrink-0"
        style={{ background: "linear-gradient(180deg, #0d0d12 0%, #07070b 100%)" }}
      >
        {/* Question area */}
        <div className="flex-1 flex flex-col justify-center pr-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
              Challenge
            </span>
          </div>

          {aiQuestion && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-white truncate">
                {aiQuestion.title}
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-1 mt-0.5">
                {aiQuestion.problem}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[11px] text-zinc-700">
                  <span className="text-zinc-600">in:</span>{" "}
                  {aiQuestion.input_format}
                </span>
                <span className="text-zinc-800">·</span>
                <span className="text-[11px] text-zinc-700">
                  <span className="text-zinc-600">out:</span>{" "}
                  {aiQuestion.output_format}
                </span>
                <span className="text-zinc-800">·</span>
                <span className="text-[11px] text-zinc-700 font-mono">
                  {aiQuestion.example.input} → {aiQuestion.example.output}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="w-[140px] border-l border-zinc-800/80 flex items-center justify-center shrink-0">
          <div
            className="px-5 py-2.5 rounded-xl border border-zinc-800/80 flex flex-col items-center gap-0.5"
            style={{
              background: `radial-gradient(ellipse at center, ${timerGlow} 0%, transparent 70%)`,
            }}
          >
            <span className={`text-2xl font-black tabular-nums tracking-tight ${timerColor}`}>
              {formattedTime}
            </span>
            <span className="text-[9px] text-zinc-700 uppercase tracking-widest">
              remaining
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM AREA ── */}
      <div className="relative z-10 flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside
          className="w-[200px] border-r border-zinc-800/80 p-4 shrink-0 flex flex-col gap-2 overflow-y-auto"
          style={{ background: "linear-gradient(180deg, #0d0d12 0%, #07070b 100%)" }}
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              Players
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {room?.players?.map((player) => {
              const isTyping = typingUsers.includes(player.user_id);
              return (
                <div
                  key={player.socket_id}
                  className="rounded-lg border border-zinc-800/60 p-2.5"
                  style={{ background: "#0f0f14" }}
                >
                  {/* Name */}
                  <p className="text-xs font-semibold text-zinc-300 truncate mb-1.5">
                    {player.user_name}
                  </p>

                  {/* Status pills */}
                  <div className="flex flex-col gap-1">
                    {/* Online/Coding */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] ${
                        player.ready ? "text-emerald-500" : "text-amber-400"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          player.ready ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                      />
                      {player.ready ? "online" : "Coding"}
                    </span>

                    {/* Submitted */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] ${
                        player.submitted ? "text-emerald-400" : "text-zinc-600"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          player.submitted ? "bg-emerald-400" : "bg-zinc-700"
                        }`}
                      />
                      {player.submitted ? "Submitted ✅" : "Not Submitted"}
                    </span>

                    {/* Typing indicator */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] transition-colors ${
                        isTyping ? "text-indigo-400" : "text-zinc-700"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full transition-colors ${
                          isTyping ? "bg-indigo-400" : "bg-zinc-800"
                        }`}
                      />
                      {typingUsers.includes(player.user_id)
                        ? "Coding"
                        : "No Coding"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <section className="flex-1 flex items-stretch p-5 overflow-hidden">
          <div className="mx-auto w-full max-w-[1200px] flex gap-5 items-start h-full">

            {/* Editor */}
            <div className="flex-1 flex justify-center items-start min-w-0 h-full">
              <div className="w-full max-w-[820px] h-full flex flex-col">

                {/* Editor toolbar */}
                <div
                  className="flex items-center justify-between px-4 py-2 rounded-t-xl border border-b-0 border-zinc-800/70"
                  style={{ background: "#0d0d12" }}
                >
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  {/* Filename */}
                  <span className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    solution.js
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    JavaScript
                  </span>
                </div>

                {/* Editor body */}
                <div className="flex-1 rounded-b-xl border border-zinc-800/70 overflow-hidden">
                  <CodeEditor code={code} handleChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Right column: output + buttons */}
            <div className="w-[300px] flex-shrink-0 flex flex-col gap-3 h-full">

              {/* Output panel */}
              <div
                className="flex-1 rounded-xl border border-zinc-800/70 overflow-hidden flex flex-col"
                style={{ background: "#07070b" }}
              >
                {/* Output header */}
                <div
                  className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/70 flex-shrink-0"
                  style={{ background: "#0d0d12" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      style={{ boxShadow: "0 0 5px #10b981" }}
                    />
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                      Output
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-700 font-mono">
                    stdout
                  </span>
                </div>
                {/* Output content */}
                <div className="flex-1 overflow-hidden">
                  <OutputScreen key={runKey} code={runCode} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {/* Run */}
                <button
                  onClick={handleRun}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/35 shadow-[0_0_16px_rgba(16,185,129,0.06)] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run
                </button>

                {/* Submit / Done */}
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.06)] hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Done
                </button>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 border border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-600"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default GameplayPage;