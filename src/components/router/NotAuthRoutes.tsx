import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "hooks/store/useAuthStore";

export default function NotAuthRoutes() {
  if (useAuthStore.getState().isLogin) {
    alert(
      "Already logged in! Continue to the website or Click logout to access to no Auth page."
    );
    return <Navigate to="/home" />;
  }
  return <Outlet />;
}
