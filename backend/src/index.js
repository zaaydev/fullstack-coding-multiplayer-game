// lib imports
import express from "express";
import cors from "cors";
import cookie_parser from "cookie-parser";
import dotenv from "dotenv";

// local imports
import aiRoutes from "../routes/ai.route.js";

import Auth_router from "../routes/auth.routes.js";
import db from "../utils/mongodb.connect.js";

// allow env variables usecase
dotenv.config();
const express_server = express();

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

// middlewares
express_server.use("/api/ai", aiRoutes);
express_server.use("/api/user", Auth_router);

express_server.get("/", (req, res) => {
  res.send("Hi Server!");
});

express_server.listen(process.env.PORT, () => {
  console.log(`🚀 SERVER STARTED ${process.env.PORT}`);
});
