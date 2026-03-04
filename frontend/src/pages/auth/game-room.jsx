import { useEffect } from "react";
import { socket } from "../../lib/socket-io";
import { usePlayerStore } from "../../store/player-auth-store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/game-store";
import { BackendApi } from "../../../api/backend";

const RoomPage = () => {
  // 🧠 Getting logged-in player info from Zustand store
  const { playerAuth } = usePlayerStore();
  const navigate = useNavigate();

  // 🏠 Holds current room data (null if not in room)
  const { room, setRoom, setAiQuestion } = useGameStore();

  // ❌ (Currently unused) — probably for future join logic
  const [joinRoom, setJoinRoom] = useState(null);

  useEffect(() => {
    // 🔌 Runs once when component mounts
    // We attach socket listeners here

    // ✅ When socket successfully connects to backend
    const handleConnect = () => {
      console.log("socket connected");
    };

    // 🏠 When backend creates a new room and sends it back
    const handleRoomCreated = (payload) => {
      console.log("Room received:", payload.data);

      // 🧾 Update local room state with server room data
      setRoom(payload.data);
    };

    // 🔄 When any room update happens (player joins, ready toggles, etc.)
    const handleRoomUpdated = (payload) => {
      console.log("Room Updated:", payload.data);

      // 🧾 Sync frontend state with latest backend room state
      setRoom(payload.data);
    };

    function handleGameStarted({ room_id, newRoomData, generatedQuestion }) {
      setAiQuestion(generatedQuestion);
      setRoom(newRoomData);
      navigate(`/gameplay/${room_id}`);
    }

    const handleHostClosed = () => {
      alert("Host closed the room");
      setRoom(null);
      navigate("/room");
    };

    socket.on("host-left-room", handleHostClosed);

    // 👂 Listening to socket events from server
    socket.on("connect", handleConnect); // 🔌 connection event
    socket.on("room-created", handleRoomCreated); // 🏠 room created event
    socket.on("room-updated", handleRoomUpdated); // 🔄 room updated event
    socket.on("game-started", handleGameStarted);

    // 🧹 Cleanup when component unmounts
    // Very important to avoid duplicate listeners (memory leak nightmare 😵)
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
    // 📤 Emit event to backend to create a room
    // We send current user's ID so backend knows who is host

    socket.emit("create-room", {
      frontend_user_id: playerAuth._id,
      frontend_user_name: playerAuth.playerName
    });
  }

  // 🚪 Join Room Handler
  function handle_join_room() {
    // 📝 Ask user for room ID
    const user_input = prompt("enter room id");

    // 📤 Emit join-room event to backend
    // Send room_id + user ID
    socket.emit("join-room", {
      room_id: user_input, // 🔢 convert to number
      frontend_user_id: playerAuth._id,
      frontend_user_name: playerAuth.playerName
    });
  }

  // 🎮 Player Ready Toggle
  function handle_ready() {
    // 📤 Tell backend that this player toggled ready state
    // Backend will update room and emit "room-updated"
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

  async function handleAddOrEditApiKey() {
    const key = prompt("Enter your API Key");

    if (!key) return;

    try {
      const res = await BackendApi.post("/api/user/apikey/add", {
        apiKey: key,
      });

      usePlayerStore.getState().setPlayerAuth(res.data);

      alert("API Key saved!");
    } catch (error) {
      console.log(error);
      alert("Failed to save API key");
    }
  }

  async function handleRemoveApiKey() {
    const confirmDelete = confirm(
      "Are you sure you want to remove your API key?",
    );

    if (!confirmDelete) return;

    try {
      const res = await BackendApi.delete("/api/user/apikey/remove");

      usePlayerStore.getState().setPlayerAuth(res.data);

      alert("API Key removed");
    } catch (error) {
      console.log(error);
      alert("Failed to remove API key");
    }
  }

  function maskApiKey(key) {
    if (!key) return null;

    return key.slice(0, 2) + "**********" + key.slice(-2);
  }

  // 🧠 Check if all players are ready
  // If every player.ready === true → Start Game button appears
  const everyone_ready = room?.players.every((p) => p.ready === true);

  return (
    <main className="bg-zinc-900 h-screen w-full flex flex-col justify-center items-center">
      {/* API KEY PANEL */}
      <div className="absolute top-5 right-5 bg-zinc-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
        {playerAuth.apiKey ? (
          <>
            <span className="text-xs text-zinc-400">
              {maskApiKey(playerAuth.apiKey)}
            </span>

            <button
              onClick={handleRemoveApiKey}
              className="text-xs bg-red-500 px-2 py-1 rounded"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={handleAddOrEditApiKey}
            className="text-xs bg-green-500 px-3 py-1 rounded"
          >
            Add API Key
          </button>
        )}
      </div>

      {/* 🏗️ CREATE ROOM BUTTON */}
      {playerAuth.apiKey && (
        <button
          onClick={handle_create_room}
          disabled={room} // ❌ disable if already inside a room
          className={`px-4 py-2 rounded-2xl active:scale-90 mb-2 ${
            room ? "bg-zinc-600 cursor-not-allowed" : "bg-yellow-500"
          }`}
        >
          Create Room
        </button>
      )}

      {/* 🚪 JOIN ROOM BUTTON */}
      <button
        onClick={handle_join_room}
        disabled={room} // ❌ disable if already inside a room
        className={`px-4 py-2 rounded-2xl active:scale-90 ${
          room ? "bg-zinc-600 cursor-not-allowed" : "bg-green-500"
        }`}
      >
        Join Room
      </button>

      {/* 🏠 ROOM LOBBY UI */}
      {room && (
        <div className="bg-zinc-800 w-80 rounded-2xl shadow-xl p-6 mt-6 text-white">
          {/* 🏷️ Room Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Room Lobby</h2>

            {/* 📌 Room status badge (waiting / started etc.) */}
            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
              {room.room_status}
            </span>
          </div>

          {/* 🆔 Room ID */}
          <div className="mb-4">
            <p className="text-sm text-zinc-400">Room ID</p>
            <p className="text-sm break-all">{room.room_id}</p>
          </div>

          {/* 👥 Players Section */}
          <div>
            <p className="text-sm text-zinc-400 mb-2">
              Players ({room.players.length})
            </p>

            <div className="space-y-2">
              {room.players.map((player, index) => {
                // 🧠 Check if this player row is current user
                const isCurrentUser = player.user_id === playerAuth._id;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-zinc-700 px-3 py-2 rounded-lg"
                  >
                    {/* 👤 Player ID */}
                    <span className="text-xs break-all">{player.user_name}</span>

                    {/* 🎮 If it's YOU → show Ready button */}
                    {isCurrentUser ? (
                      <button
                        onClick={() => handle_ready()}
                        className="text-xs bg-blue-500 px-2 py-1 rounded"
                      >
                        {/* 🔄 Toggle button label based on ready state */}
                        {player.ready ? "Unready" : "Ready"}
                      </button>
                    ) : (
                      // 👀 Other players just show status badge
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          player.ready
                            ? "bg-green-500 text-black" // ✅ Ready
                            : "bg-red-500 text-black" // ❌ Not Ready
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

      {/* 🚀 Start Game Button (Only when everyone ready) */}
      {everyone_ready && room.host_user_id == playerAuth._id && (
        <button
          onClick={start_game}
          className="bg-red-400 text-2xl px-4 py-2 rounded-2xl active:scale-90"
        >
          Start Game
        </button>
      )}
    </main>
  );
};

export default RoomPage;
