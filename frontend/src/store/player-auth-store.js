import axios from "axios"; // 📦 HTTP client (not used here directly)
import { create } from "zustand"; // 🧠 Zustand store creator
import { toast } from "react-toastify"; // 🔔 Toast notifications
import { BackendApi } from "../../api/backend"; // 🌐 Pre-configured backend API instance

export const usePlayerStore = create((set, get) => ({
  // ======================
  // 📦 GLOBAL STATES
  // ======================
  playerAuth: null, // 👤 Logged-in player data
  isSigningUp: false, // 📝 Signup request loading flag
  isLoggingIn: false, // 🔐 Login request loading flag
  isCheckingAuth: false, // 🔄 Auth refresh check flag

  // 🧩 Manually set player auth data
  setPlayerAuth: (val) => set({ playerAuth: val }),

  /* =======================
     🔄 AUTH CHECK (ON REFRESH)
     ======================= */

  checkAuthOnRefresh: async () => {
    // 🚦 Lock UI while verifying session
    set({ isCheckingAuth: true });

    try {
      // 🔍 Ask backend if cookie/session is still valid
      const res = await BackendApi.get("/api/user/check");

      // ✅ User is authenticated → store user in state
      set({ playerAuth: res.data.user });
    } catch (error) {
      // ❌ Session expired or invalid
      console.log("Error Checking Refresh", error);

      // 🧹 Clear auth state
      set({ playerAuth: null });
    } finally {
      // 🔓 Unlock UI rendering
      set({ isCheckingAuth: false });
    }
  },

  // ======================
  // 📝 SIGNUP HANDLER
  // ======================
  handleSignUpRequest: async ({ playerName, email, password }) => {
    // 🛑 Prevent multiple signup requests
    if (get().isSigningUp) return null;

    // ✂️ Clean user input
    const name = playerName?.trim();
    const mail = email?.trim();
    const pass = password?.trim();

    // 🚨 Basic validations
    if (!name || !mail || !pass) {
      toast.error("All fields are required");
      return null;
    }

    // 📧 Email format validation
    if (!/\S+@\S+\.\S+/.test(mail)) {
      toast.error("Invalid email address");
      return null;
    }

    // 🔐 Password length check
    if (pass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return null;
    }

    try {
      // 🚦 Lock signup button
      set({ isSigningUp: true });

      // 📤 Send signup data to backend
      const res = await BackendApi.post(`/api/user/signup`, {
        playerName: name,
        email: mail,
        password: pass,
      });

      // ✅ Save logged-in user data
      set({ playerAuth: res.data });

      // 🎉 Success feedback
      toast.success("Signup successful 🎉");

      return res.data;
    } catch (error) {
      // ❌ Show backend error or fallback message
      toast.error(error?.response?.data?.message || "Signup failed");
      return null;
    } finally {
      // 🔓 Unlock signup button
      set({ isSigningUp: false });
    }
  },

  // ======================
  // 🔐 LOGIN HANDLER
  // ======================
  handleLoginRequest: async ({ email, password }) => {
    // 🛑 Prevent double login clicks
    if (get().isLoggingIn) return null;

    // ✂️ Clean inputs
    const mail = email?.trim();
    const pass = password?.trim();

    // 🚨 Required fields check
    if (!mail || !pass) {
      toast.error("Email and password are required");
      return null;
    }

    try {
      // 🚦 Lock login button
      set({ isLoggingIn: true });

      // 📤 Send login request to backend
      const res = await BackendApi.post(`/api/user/login`, {
        email: mail,
        password: pass,
      });

      // ✅ Save authenticated user
      set({ playerAuth: res.data });

      // 🚀 Success feedback
      toast.success("Login successful 🚀");

      return res.data;
    } catch (error) {
      // ❌ Show backend or generic error
      toast.error(error?.response?.data?.message || "Login failed");
      return null;
    } finally {
      // 🔓 Unlock login button
      set({ isLoggingIn: false });
    }
  },
}));
