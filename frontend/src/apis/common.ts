import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_ADDR,
});
