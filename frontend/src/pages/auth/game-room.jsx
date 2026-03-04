import { useEffect } from "react";
import { socket } from "../../lib/socket-io";
import { usePlayerStore } from "../../store/player-auth-store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/game-store";
import { BackendApi } from "../../../api/backend";

// ── Reusable Modal primitives ──────────────────────────────────────────────────

const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-sm mx-4 rounded-2xl border border-zinc-800/80 p-6"
      style={{
        background: "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const ModalTitle = ({ color = "emerald", children }) => {
  const dotColors = {
    emerald: { bg: "#10b981", glow: "#10b981" },
    red:     { bg: "#ef4444", glow: "#ef4444" },
    amber:   { bg: "#f59e0b", glow: "#f59e0b" },
    indigo:  { bg: "#6366f1", glow: "#6366f1" },
  };
  const c = dotColors[color] || dotColors.emerald;
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: c.bg, boxShadow: `0 0 8px ${c.glow}` }}
      />
      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
        {children}
      </h3>
    </div>
  );
};

const ModalInput = ({ value, onChange, placeholder, type = "text", onKeyDown }) => (
  <input
    autoFocus
    type={type}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 placeholder-zinc-700 outline-none font-mono tracking-wider transition-all duration-200 focus:border-emerald-500/40"
    style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
  />
);

const ModalBtn = ({ onClick, color = "emerald", children, disabled }) => {
  const styles = {
    emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40",
    red:     "border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40",
    zinc:    "border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-600",
    amber:   "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40",
    indigo:  "border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/40",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-200 active:scale-95 ${styles[color] || styles.emerald} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
};

// ── Specific modals ────────────────────────────────────────────────────────────

const JoinRoomModal = ({ onConfirm, onClose }) => {
  const [value, setValue] = useState("");
  return (
    <Modal onClose={onClose}>
      <ModalTitle color="emerald">Join Room</ModalTitle>
      <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
        Enter the room ID shared by the host.
      </p>
      <ModalInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Room ID..."
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onConfirm(value.trim())}
      />
      <div className="flex gap-2 mt-4">
        <ModalBtn color="zinc" onClick={onClose}>Cancel</ModalBtn>
        <ModalBtn color="emerald" onClick={() => value.trim() && onConfirm(value.trim())} disabled={!value.trim()}>
          Join
        </ModalBtn>
      </div>
    </Modal>
  );
};

const ApiKeyModal = ({ onConfirm, onClose }) => {
  const [value, setValue] = useState("");
  return (
    <Modal onClose={onClose}>
      <ModalTitle color="amber">Add API Key</ModalTitle>
      <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
        Paste your API key below. Required to create rooms.
      </p>
      <ModalInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk-..."
        type="password"
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onConfirm(value.trim())}
      />
      <div className="flex gap-2 mt-4">
        <ModalBtn color="zinc" onClick={onClose}>Cancel</ModalBtn>
        <ModalBtn color="amber" onClick={() => value.trim() && onConfirm(value.trim())} disabled={!value.trim()}>
          Save Key
        </ModalBtn>
      </div>
    </Modal>
  );
};

const ConfirmModal = ({ title, message, confirmLabel = "Confirm", confirmColor = "red", onConfirm, onClose }) => (
  <Modal onClose={onClose}>
    <ModalTitle color={confirmColor}>{title}</ModalTitle>
    <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{message}</p>
    <div className="flex gap-2">
      <ModalBtn color="zinc" onClick={onClose}>Cancel</ModalBtn>
      <ModalBtn color={confirmColor} onClick={onConfirm}>{confirmLabel}</ModalBtn>
    </div>
  </Modal>
);

const AlertModal = ({ message, color = "emerald", onClose }) => (
  <Modal onClose={onClose}>
    <ModalTitle color={color}>Notice</ModalTitle>
    <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{message}</p>
    <div className="flex justify-end">
      <ModalBtn color={color} onClick={onClose}>OK</ModalBtn>
    </div>
  </Modal>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

const RoomPage = () => {
  // 🧠 Getting logged-in player info from Zustand store
  const { playerAuth } = usePlayerStore();
  const navigate = useNavigate();

  // 🏠 Holds current room data (null if not in room)
  const { room, setRoom, setAiQuestion } = useGameStore();

  // ❌ (Currently unused) — probably for future join logic
  const [joinRoom, setJoinRoom] = useState(null);

  // ── Modal state ──
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  useEffect(() => {
    const handleConnect = () => {
      console.log("socket connected");
    };

    const handleRoomCreated = (payload) => {
      console.log("Room received:", payload.data);
      setRoom(payload.data);
    };

    const handleRoomUpdated = (payload) => {
      console.log("Room Updated:", payload.data);
      setRoom(payload.data);
    };

    function handleGameStarted({ room_id, newRoomData, generatedQuestion }) {
      setAiQuestion(generatedQuestion);
      setRoom(newRoomData);
      navigate(`/gameplay/${room_id}`);
    }

    const handleHostClosed = () => {
      setRoom(null);
      navigate("/room");
      setModal({ type: "alert", message: "Host closed the room.", color: "red" });
    };

    socket.on("host-left-room", handleHostClosed);
    socket.on("connect", handleConnect);
    socket.on("room-created", handleRoomCreated);
    socket.on("room-updated", handleRoomUpdated);
    socket.on("game-started", handleGameStarted);

    return () => {
      socket.off("host-left-room", handleHostClosed);
      socket.off("connect", handleConnect);
      socket.off("room-created", handleRoomCreated);
      socket.off("room-updated", handleRoomUpdated);
      socket.off("game-started", handleGameStarted);
    };
  }, []);

  // 🏗️ Create Room Handler
  async function handle_create_room() {
    socket.emit("create-room", {
      frontend_user_id: playerAuth._id,
      frontend_user_name: playerAuth.playerName,
    });
  }

  // 🚪 Join Room Handler — opens modal instead of prompt()
  function handle_join_room() {
    setModal({ type: "join" });
  }

  function confirmJoinRoom(roomId) {
    closeModal();
    socket.emit("join-room", {
      room_id: roomId,
      frontend_user_id: playerAuth._id,
      frontend_user_name: playerAuth.playerName,
    });
  }

  // 🎮 Player Ready Toggle
  function handle_ready() {
    console.log("object");
    socket.emit("player-ready", {
      frontend_user_id: playerAuth._id,
      room_id: room.room_id,
    });
  }

  function start_game() {
    socket.emit("start-game", {
      frontend_user_id: playerAuth._id,
      room_id: room.room_id,
    });
  }

  // API Key — opens modal instead of prompt()
  async function handleAddOrEditApiKey() {
    setModal({ type: "apikey" });
  }

  async function confirmAddApiKey(key) {
    closeModal();
    try {
      const res = await BackendApi.post("/api/user/apikey/add", { apiKey: key });
      usePlayerStore.getState().setPlayerAuth(res.data);
      setModal({ type: "alert", message: "API Key saved successfully!", color: "emerald" });
    } catch (error) {
      console.log(error);
      setModal({ type: "alert", message: "Failed to save API key. Please try again.", color: "red" });
    }
  }

  // Remove API Key — opens confirm modal instead of confirm()
  async function handleRemoveApiKey() {
    setModal({ type: "confirm-remove-key" });
  }

  async function confirmRemoveApiKey() {
    closeModal();
    try {
      const res = await BackendApi.delete("/api/user/apikey/remove");
      usePlayerStore.getState().setPlayerAuth(res.data);
      setModal({ type: "alert", message: "API Key removed.", color: "amber" });
    } catch (error) {
      console.log(error);
      setModal({ type: "alert", message: "Failed to remove API key.", color: "red" });
    }
  }

  function maskApiKey(key) {
    if (!key) return null;
    return key.slice(0, 2) + "**********" + key.slice(-2);
  }

  // 🧠 Check if all players are ready
  const everyone_ready = room?.players.every((p) => p.ready === true);

  return (
    <main
      className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden"
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
            "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 65%)",
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

      {/* ── MODALS ── */}
      {modal?.type === "join" && (
        <JoinRoomModal onConfirm={confirmJoinRoom} onClose={closeModal} />
      )}
      {modal?.type === "apikey" && (
        <ApiKeyModal onConfirm={confirmAddApiKey} onClose={closeModal} />
      )}
      {modal?.type === "confirm-remove-key" && (
        <ConfirmModal
          title="Remove API Key"
          message="Are you sure you want to remove your API key? You won't be able to create rooms without one."
          confirmLabel="Remove"
          confirmColor="red"
          onConfirm={confirmRemoveApiKey}
          onClose={closeModal}
        />
      )}
      {modal?.type === "alert" && (
        <AlertModal
          message={modal.message}
          color={modal.color}
          onClose={closeModal}
        />
      )}

      {/* ── API KEY PANEL (top-right) ── */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-zinc-800/80"
        style={{ background: "#0d0d12" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 flex-shrink-0"
          style={{ boxShadow: "0 0 5px #10b981" }}
        />
        {playerAuth.apiKey ? (
          <>
            <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
              {maskApiKey(playerAuth.apiKey)}
            </span>
            <button
              onClick={handleRemoveApiKey}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all duration-200 uppercase tracking-wider font-bold"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={handleAddOrEditApiKey}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all duration-200 uppercase tracking-wider font-bold"
          >
            Add API Key
          </button>
        )}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center gap-4">

        {/* Page label */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
            Game Lobby
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
        </div>

        {/* Action buttons */}
        <div
          className="w-full rounded-2xl border border-zinc-800/80 p-4 flex flex-col gap-2.5"
          style={{ background: "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)" }}
        >
          {/* Create Room */}
          {playerAuth.apiKey && (
            <button
              onClick={handle_create_room}
              disabled={!!room}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 border ${
                room
                  ? "border-zinc-800/60 bg-zinc-800/20 text-zinc-700 cursor-not-allowed"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40"
              }`}
              style={!room ? { boxShadow: "0 0 16px rgba(245,158,11,0.06)" } : {}}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Room
            </button>
          )}

          {/* Join Room */}
          <button
            onClick={handle_join_room}
            disabled={!!room}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 border ${
              room
                ? "border-zinc-800/60 bg-zinc-800/20 text-zinc-700 cursor-not-allowed"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40"
            }`}
            style={!room ? { boxShadow: "0 0 16px rgba(16,185,129,0.06)" } : {}}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Join Room
          </button>
        </div>

        {/* ── ROOM LOBBY ── */}
        {room && (
          <div
            className="w-full rounded-2xl border border-zinc-800/80 p-5 text-white"
            style={{ background: "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)" }}
          >
            {/* Room header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" style={{ boxShadow: "0 0 5px #10b981" }} />
                <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                  Room Lobby
                </h2>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-400 uppercase tracking-widest font-bold">
                {room.room_status}
              </span>
            </div>

            {/* Room ID */}
            <div className="mb-4 p-2.5 rounded-lg border border-zinc-800/60" style={{ background: "#07070b" }}>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Room ID</p>
              <p className="text-xs text-zinc-400 font-mono break-all">{room.room_id}</p>
            </div>

            {/* Players */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Players</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-800/60 bg-zinc-800/40 text-zinc-500 font-mono">
                  {room.players.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {room.players.map((player, index) => {
                  const isCurrentUser = player.user_id === playerAuth._id;

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center px-3 py-2.5 rounded-lg border border-zinc-800/60"
                      style={{ background: "#0f0f14" }}
                    >
                      {/* Player name */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            player.ready ? "bg-emerald-500" : "bg-zinc-600"
                          }`}
                          style={player.ready ? { boxShadow: "0 0 4px #10b981" } : {}}
                        />
                        <span className="text-xs text-zinc-300 truncate font-mono">
                          {player.user_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] text-zinc-600 uppercase tracking-wider flex-shrink-0">
                            you
                          </span>
                        )}
                      </div>

                      {/* Ready button / status */}
                      {isCurrentUser ? (
                        <button
                          onClick={() => handle_ready()}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex-shrink-0 ${
                            player.ready
                              ? "border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                              : "border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                          }`}
                        >
                          {player.ready ? "Unready" : "Ready"}
                        </button>
                      ) : (
                        <span
                          className={`text-[10px] px-2 py-1 rounded-lg border font-bold uppercase tracking-wider flex-shrink-0 ${
                            player.ready
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/20 bg-red-500/10 text-red-500/70"
                          }`}
                        >
                          {player.ready ? "Ready" : "Not Ready"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── START GAME ── */}
        {everyone_ready && room.host_user_id == playerAuth._id && (
          <button
            onClick={start_game}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 active:scale-95 border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 hover:text-emerald-200 hover:border-emerald-500/50"
            style={{ boxShadow: "0 0 24px rgba(16,185,129,0.12)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Game
          </button>
        )}
      </div>
    </main>
  );
};

export default RoomPage;