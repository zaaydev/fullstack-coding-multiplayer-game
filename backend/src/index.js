// lib imports
import express from "express";
import cors from "cors";
import cookie_parser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "../utils/mongodb.connect.js";

// local imports
import aiRoutes from "../routes/ai.route.js";
import { score_prompt } from "../lib/prompts/score-prompt.js";
import { question_prompt } from "../lib/prompts/question-prompt.js";
import Auth_router from "../routes/auth.routes.js";
import api_router from "../routes/api.route.js";
import { UserModel } from "../models/user.model.js";
import generateAiResponse from "../lib/ai.js";

// allow env variables usecase
dotenv.config();

// servers
// 🧱 Express app handles normal HTTP routes (REST APIs)
const express_server = express();

// 🌐 We manually create an HTTP server from express
// WHY?
// Because Socket.IO needs access to the raw HTTP server.
// It upgrades HTTP connections into WebSocket connections internally.
const http_server = http.createServer(express_server);

// ⚡ Attach Socket.IO to the HTTP server
// WHY?
// Socket.IO sits on top of HTTP and handles real-time communication.
const socket_server = new Server(http_server, {
  cors: {
    origin: "*", // allow connections from anywhere (dev mode)
  },
});

// request middlewares
express_server.use(express.json());
express_server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
// 🍪 Parse cookies from requests
express_server.use(cookie_parser());

// routes middlewares
express_server.use("/api/ai", aiRoutes);
express_server.use("/api/user", Auth_router);
express_server.use("/api/user/apikey", api_router);

express_server.get("/", (req, res) => {
  res.send("Hi Server!");
});

// ==============================
// ⚡ SOCKET.IO SECTION
// ==============================

// 🧠 In-memory object to store all game rooms
// WHY?
// This acts like a temporary database.
// It lives in RAM.
// If server restarts → everything resets.
const rooms = {};

// 🔌 When a new client connects to socket server
// This runs EVERY time a user opens your site.
socket_server.on("connection", (socket) => {
  console.log("socket connected");

  // Each user gets a unique socket.id automatically.
  // This ID represents their lisve connection session.

  // ==========================
  // 🏗 CREATE ROOM
  // ==========================

  // This runs when frontend emits "create-room"
  socket.on("create-room", ({ frontend_user_id, frontend_user_name }) => {
    // 🎲 Generate simple random room ID
    // WHY?
    // So players can share this ID and join same room.
    const randomId = Math.floor(Math.random() * 100).toString();

    // 🚪 Join a Socket.IO internal room
    // IMPORTANT:
    // This is NOT your JS room object.
    // This is a communication channel managed by Socket.IO.
    // It groups sockets so we can broadcast to specific players.
    socket.join(randomId);

    // 🧱 Create room structure in server memory
    // WHY?
    // We need to track players, host, ready states, etc.
    rooms[randomId] = {
      room_id: randomId,

      // 👑 Host info
      // WHY store socket_id?
      // So later we can identify or disconnect host if needed.
      host_socket_id: socket.id,
      host_user_id: frontend_user_id,

      // 👥 Players array
      players: [
        {
          user_id: frontend_user_id,
          user_name: frontend_user_name,
          socket_id: socket.id,
          ready: false, // initially not ready,
          submitted: false,
        },
      ],

      submissions: [],
      room_status: "waiting", // game not started yet
      scores: [],
    };

    // 📤 Send created room ONLY to creator
    // WHY socket.emit?
    // Because only the creator needs initial room confirmation.
    socket.emit("room-created", { data: rooms[randomId] });
  });

  // ==========================
  // 🚪 JOIN ROOM
  // ==========================

  socket.on("join-room", ({ frontend_user_id, frontend_user_name, room_id }) => {
    // 🚪 Join the internal Socket.IO communication room
    // WHY?
    // So this socket can receive broadcasts for this room.
    socket.join(room_id);

    // ➕ Add player into server memory room object
    // WHY?
    // We must track who is inside, their socket id and ready state.
    rooms[room_id].players.push({
      user_id: frontend_user_id,
      user_name: frontend_user_name,
      socket_id: socket.id,
      ready: false,
      submitted: false,
    });

    // 📡 Broadcast updated room to EVERYONE inside this room
    // socket_server.to(room_id)
    // means:
    // "Send event only to sockets inside this specific room"
    socket_server.to(room_id).emit("room-updated", {
      data: rooms[room_id],
    });
  });

  // ==========================
  // 🎮 PLAYER READY TOGGLE
  // ==========================

  socket.on("player-ready", ({ frontend_user_id, room_id }) => {
    // 📦 Get room from memory
    const room = rooms[room_id];


    // 🔍
    //  the correct player object
    // WHY?
    // Because we need to update only this player's ready state.
    const player = room.players.find(
      (player) => player.user_id == frontend_user_id,
    );

    // 🔄 Toggle ready state (true → false or false → true)
    // WHY toggle?
    // So one button can act as Ready / Unready.
    player.ready = !player.ready;

    // 📡 Broadcast updated room state to everyone
    // WHY broadcast?
    // So all clients stay synchronized in real-time.
    socket_server.to(room_id).emit("room-updated", {
      data: room,
    });
  });

  socket.on("player-typing", ({ roomId, userId }) => {
    socket_server.to(roomId).emit("show-typing", {
      userId,
    });
  });

  socket.on("player-stop-typing", ({ roomId, userId }) => {
    socket_server.to(roomId).emit("hide-typing", {
      userId,
    });
  });

  // start game
  socket.on("start-game", async ({ frontend_user_id, room_id }) => {
    if (frontend_user_id !== rooms[room_id].host_user_id) return;


    let generatedQuestion;

    const hostUser = await UserModel.findById(frontend_user_id);

    if (!hostUser || !hostUser.apiKey) {
      return socket.emit("error", {
        message: "Host API key missing",
      });
    }

    const apiKey = hostUser.apiKey;

    try {
      const aiRaw = await generateAiResponse(apiKey, question_prompt);
      generatedQuestion = JSON.parse(aiRaw);

      // dummy data
      // generatedQuestion = "Given two numbers, calculate their sum.";
    } catch (error) {
      console.log("QUESTION AI ERROR:", error);

      generatedQuestion = {
        title: "Fallback Question",
        difficulty: "easy",
        problem: "Given two numbers, calculate their sum.",
        input_format: "Two integers separated by space.",
        output_format: "Single integer representing the sum.",
        example: {
          input: "2 3",
          output: "5",
        },
      };
    }

    // Store inside room
    rooms[room_id].generatedQuestion = generatedQuestion;
    rooms[room_id].room_status = "playing";

    // send time
    rooms[room_id].start_time = Date.now();
    rooms[room_id].total_time = 300; // 5 minute

    socket_server.to(room_id).emit("game-started", {
      room_id,
      newRoomData: rooms[room_id],
      generatedQuestion,
    });
  });

  // listen for submits
  socket.on("submit-code", async ({ frontend_user_id, frontend_user_name, room_id, the_code }) => {
    if (!the_code) return;
    const room = rooms[room_id];
    if (!room) return console.log("didnt found room");

    const player = room.players.find((p) => p.user_id == frontend_user_id);
    if (player.submitted) return console.log("player already submitted");

    player.submitted = true;

    const now = Date.now();
    const timePassed = Math.floor((now - room.start_time) / 1000);
    const remainingTime = room.total_time - timePassed;

    const safeRemainingTime = remainingTime > 0 ? remainingTime : 0;

    room.submissions.push({
      user_id: frontend_user_id,
      user_name: frontend_user_name,
      code_for_review: the_code,
      time_left: safeRemainingTime,
    });

    // check if all players submitted
    const all_submitted = room.players.every((p) => p.submitted == true);


    socket_server.to(room_id).emit("room-updated", {
      data: room,
    });

    // send request to gemini
    if (all_submitted) {
      const finalPrompt = `
        ${score_prompt}
        
Coding Question:
${JSON.stringify(room.generatedQuestion, null, 2)}

Submissions:
${JSON.stringify(room.submissions)}
`;

      let generated_scores;

      const hostUser = await UserModel.findById(room.host_user_id);

      if (!hostUser || !hostUser.apiKey) {
        return socket.emit("error", {
          message: "Host API key missing",
        });
      }

      const apiKey = hostUser.apiKey;

      try {
        const aiRaw = await generateAiResponse(apiKey, finalPrompt);
        generated_scores = JSON.parse(aiRaw);
      } catch (err) {
        console.log("AI ERROR:", err);

        return {
          user_id: player.user_id,
          user_name: player.user_name,
          code_for_review: player.code_for_review,
          score: 0,
          time_left: player.time_left,
          // time_taken,
          // completed_in:
          //   time_taken < 60
          //     ? `${time_taken}s`
          //     : `${Math.floor(time_taken / 60)}min ${time_taken % 60}s`,
          roast: "AI crashed. Lucky escape.",
          feedback: "System failure during evaluation.",
        };
      }

      room.room_status = "finished";
      // now frontend can redirect to scores page
      socket_server.to(room_id).emit("all-player-submitted", {
        data: generated_scores,
        room_id: room.room_id,
      });

      socket.on("view-code", ({ roomId, userId }) => {

        const room = rooms[roomId]; // assuming rooms object hai

        if (!room) {
          return socket.emit("view-code-data", {
            error: "Room not found"
          });
        }

        const user = room.submissions.find(
          us => us.user_id === userId
        );
        const Score = generated_scores.find(s => s.user_id === userId)
        const userScore = {...user, ...Score}

        if (!user) {
          return socket.emit("view-code-data", {
            error: "User submission not found"
          });
        }

        // Emit ONLY to requester
        socket.emit("view-code-data", {
          userScore
        });
      });


    }
  });

  socket.on("disconnect", () => {
    const player_socket_id = socket.id;

    // loop through all keys in rooms object
    for (const current_room_id in rooms) {
      // current room details
      const curr_room = rooms[current_room_id];

      // remove all players from room if host disconnects
      if (curr_room.host_socket_id == player_socket_id) {
        // notify all players
        socket_server.to(current_room_id).emit("host-left-room");

        // delete room
        delete rooms[current_room_id];
      }
    }
  });
});

// ==============================
// 🚀 START SERVER
// ==============================

// Start listening on given port
// WHY http_server and not express_server?
// Because Socket.IO is attached to http_server.
http_server.listen(process.env.PORT, () => {
  console.log(`🚀 SERVER STARTED ${process.env.PORT}`);
});
