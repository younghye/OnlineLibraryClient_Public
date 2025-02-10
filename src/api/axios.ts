import axios from "axios";
import { useAuthStore } from "hooks/store/useAuthStore";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(function (config) {
  const token = useAuthStore.getState().accessToken;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default instance;
