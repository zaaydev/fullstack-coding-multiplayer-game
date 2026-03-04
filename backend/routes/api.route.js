import express from "express";
import { handle_add_apikey, handle_remove_apikey } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const api_router = express.Router();

api_router.post("/add", protectRoute, handle_add_apikey);

api_router.delete("/remove", protectRoute, handle_remove_apikey)

export default api_router;
