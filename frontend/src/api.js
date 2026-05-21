import axios from "axios";

// When deployed, REACT_APP_API_URL is "/api" — nginx proxies to the Node backend.
// In local dev it falls back to http://localhost:3001/api (or whatever you set).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
