import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "hooks/store/useAuthStore";

export default function NotAuthRoutes() {
  return useAuthStore.getState().isLogin ? <Navigate to="/home" /> : <Outlet />;
}
