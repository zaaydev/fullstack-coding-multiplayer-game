import express from "express";
import {
  handleCheckAuth,
  handleLogIn,
  handleLogOut,
  handleSignUp,
} from "../controllers/Auth.controller.js";
import {
  protectRoute,
  protectRouteForCookie,
} from "../middlewares/auth.middleware.js";
const Auth_router = express.Router();

/* =====================================================
   ✍️ AUTH ROUTES (PUBLIC)
===================================================== */

// 🆕 User signup (no auth required)
Auth_router.post("/signup", handleSignUp);

// 🔑 User login (no auth required)
Auth_router.post("/login", handleLogIn);

// 🚪 User logout (clears auth cookie)
Auth_router.get("/logout", handleLogOut);

/* =====================================================
   🔍 AUTH CHECK (COOKIE-BASED)
===================================================== */

// Check if user is authenticated via cookie
// Used on frontend refresh to restore session
Auth_router.get("/check", protectRouteForCookie, handleCheckAuth);

export default Auth_router;
