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
   🖼️ PROFILE UPDATE (PROTECTED)
===================================================== */

// Update profile picture
// 1️⃣ protectRoute → verifies JWT & attaches req.user
// 2️⃣ multerGrabber → extracts uploaded image (profilePic)
// 3️⃣ handleProfileUpdate → uploads image + updates DB
// router.put(
//     "/update-profile",
//     protectRoute,
//     multerGrabber.single("profilePic"),
//     handleProfileUpdate
// );


/* =====================================================
   🔍 AUTH CHECK (COOKIE-BASED)
===================================================== */

// Check if user is authenticated via cookie
// Used on frontend refresh to restore session
Auth_router.get(
    "/check",
    protectRouteForCookie,
    handleCheckAuth
);

export default Auth_router;