import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "hooks/store/useAuthStore";

export default function AuthRoutes() {
  return useAuthStore.getState().isLogin ? (
    <Outlet />
  ) : (
    <Navigate to="/access" />
  );
}
