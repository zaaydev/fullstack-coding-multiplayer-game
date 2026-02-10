import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export const BackendApi = axios.create({
  baseURL: URL,
  withCredentials: true,
});
