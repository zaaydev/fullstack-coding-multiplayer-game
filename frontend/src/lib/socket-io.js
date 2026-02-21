import { io } from "socket.io-client";

// give server url so socket knows who to connect with
const URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL);
