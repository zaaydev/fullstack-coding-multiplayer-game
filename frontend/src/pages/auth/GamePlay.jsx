import { useState } from "react";
import CodeEditor from "../../components/editor/code-editor";
import OutputScreen from "../../components/editor/output-screen";
import { useGameStore } from "../../store/game-store";
import { socket } from "../../lib/socket-io";
import { usePlayerStore } from "../../store/player-auth-store";
import { useNavigate, useParams } from "react-router-dom";
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
    setCode("/  / Done Reset! Write your code here");
    setRunKey((prev) => prev + 1);
  }

  async function handleSubmit() {
    if (!code) return alert("write something");

    socket.emit("submit-code", {
      frontend_user_id: playerAuth._id,
      room_id: room.room_id,
      the_code: code,
      time: timeLeft,
    });
  }

  useEffect(() => {
    if (!socket) return;

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

    socket.on("show-typing", handleShowTyping);
    socket.on("hide-typing", handleHideTyping);

    return () => {
      socket.off("show-typing", handleShowTyping);
      socket.off("hide-typing", handleHideTyping);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // ⬇ Convert seconds → MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    console.log("ROOM:", room);
  }, [room]);

  return (
    <main className="h-screen w-full bg-zinc-900 text-white flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <div className="h-[15%] min-h-[80px] w-full border-b border-zinc-700 flex items-center px-6 shrink-0">
        {/* Question area (takes remaining width) */}
        <div className="flex-1 flex flex-col justify-center pr-6 overflow-hidden">
          <h2 className="text-base font-semibold text-zinc-200 mb-1">
            Question
          </h2>
          <div className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
            {aiQuestion && (
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">
                  {aiQuestion.title}
                </h2>

                <p className="text-sm text-zinc-400">{aiQuestion.problem}</p>

                <div className="text-xs text-zinc-500">
                  <p>
                    <strong>Input:</strong> {aiQuestion.input_format}
                  </p>
                  <p>
                    <strong>Output:</strong> {aiQuestion.output_format}
                  </p>
                  <p>
                    <strong>Example:</strong> {aiQuestion.example.input} →{" "}
                    {aiQuestion.example.output}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timer (fixed width) */}
        <div className="w-[140px] border-l border-zinc-700 flex items-center justify-center shrink-0">
          <div className="bg-zinc-800 px-5 py-2 rounded-lg text-xl font-bold tabular-nums">
            {formattedTime}
          </div>
        </div>
      </div>

      {/* BOTTOM AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[200px] border-r border-zinc-700 p-4 shrink-0 flex flex-col gap-3 overflow-y-auto">
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">Players</h3>

          <div className="flex flex-col gap-3 text-sm">
            {room?.players?.map((player) => (
              <div
                key={player.socket_id}
                className="flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="text-zinc-300">{player.user_id}</span>

                  <span
                    className={`text-xs ${
                      player.ready ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {player.ready ? "online" : "Coding"}
                  </span>
                  <span
                    className={`text-xs ${
                      player.submitted ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {player.submitted ? "Submitted ✅" : "Not Submitted"}
                  </span>
                  <span
                    className={`text-xs ${
                      typingUsers.includes(player.user_id)
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {typingUsers.includes(player.user_id)
                      ? "Coding"
                      : "No Coding"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content: editor centered + output panel on the right */}
        <section className="flex-1 flex items-stretch p-6 overflow-hidden">
          <div className="mx-auto w-full max-w-[1200px] flex gap-6 items-start">
            {/* Editor: flexible and centered */}
            <div className="flex-1 flex justify-center items-start min-w-0">
              {/* min-w-0 prevents overflow when inside flex */}
              <div className="w-full max-w-[820px]">
                <CodeEditor code={code} handleChange={handleChange} />
              </div>
            </div>

            {/* Output + Buttons: small fixed column */}
            <div className="w-[320px] flex-shrink-0 flex flex-col items-center gap-4">
              <OutputScreen key={runKey} code={runCode} />

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleRun}
                  className="w-full bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Run
                </button>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Done
                </button>

                <button
                  onClick={handleReset}
                  className="w-full bg-red-700 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
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
