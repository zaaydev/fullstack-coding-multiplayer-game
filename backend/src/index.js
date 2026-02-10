// lib imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// local imports
import aiRoutes from "../routes/ai.route.js";

const express_server = express();
import Auth_router from "../routes/auth.routes.js";
import db from "../utils/mongodb.connect.js"
// allow env variables usecase
dotenv.config();

// middlewares
express_server.use(express.json());
express_server.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// middlewares
express_server.use("/api/ai", aiRoutes);
express_server.use("/user", Auth_router);

express_server.get("/", (req, res) => {
  res.send("Hi Server!");
});

express_server.listen(process.env.PORT, () => {
  console.log(`🚀 SERVER STARTED ${process.env.PORT}`);
});
