import { useState } from "react";
import { useAuthStore } from "hooks/store/useAuthStore";
import { useNavigate, NavLink } from "react-router-dom";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import log from "../../assets/images/logo.jpg";
import { navActiveStyle } from "../../utils/styles";

export default function Header() {
  const navigate = useNavigate();
  const { removeAuth } = useAuthStore();
  const { removeItemAttributes } = useItemAttributesStore();
  const isLogin = useAuthStore.getState().isLogin;
  const [activeMenu, setActiveMenu] = useState<string>("");

  const logout = () => {
    removeAuth();
    removeItemAttributes();
    navigate("/access");
    setActiveMenu("");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light mt-3 mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href={isLogin ? "/home" : "/access"}>
            <img src={log} width="50" height="40" alt="logo" />
            <span
              className="fs-5 fw-bold text-muted"
              style={{ fontFamily: "Serif" }}
            >
              Library Management System
            </span>
          </a>
          {isLogin && (
            <ul className="nav justify-content-center">
              <li className="nav-item p-2 p-sm-3">
                <NavLink
                  to="/home"
                  style={navActiveStyle(activeMenu === "home")}
                  onClick={() => setActiveMenu("home")}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item p-2 p-sm-3">
                <NavLink
                  to="/searchItem"
                  style={navActiveStyle(activeMenu === "item")}
                  onClick={() => setActiveMenu("item")}
                >
                  Item
                </NavLink>
              </li>
              <li className="nav-item dropdown p-2 p-sm-3">
                <NavLink
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  to="#"
                  style={navActiveStyle(activeMenu === "loan")}
                >
                  Loan
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/checkout"
                      onClick={() => setActiveMenu("loan")}
                    >
                      CheckOut
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/return"
                      onClick={() => setActiveMenu("loan")}
                    >
                      Return
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item p-2 p-sm-3">
                <NavLink
                  to="/searchCustomer"
                  style={navActiveStyle(activeMenu === "customer")}
                  onClick={() => setActiveMenu("customer")}
                >
                  Customer
                </NavLink>
              </li>
              <li className="nav-item p-2 p-sm-3">
                <NavLink
                  to="/searchEmployee"
                  style={navActiveStyle(activeMenu === "staff")}
                  onClick={() => setActiveMenu("staff")}
                >
                  Staff
                </NavLink>
              </li>
            </ul>
          )}

          {isLogin ? (
            <div className="text-end">
              <button
                type="button"
                className="btn btn-success"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-end">
              <button
                type="button"
                className="btn btn-outline-success me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate("/signUp")}
              >
                Sign-up
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
