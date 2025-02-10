import { Routes as Switch, Route } from "react-router-dom";
import { Suspense } from "react";
import AuthRoutes from "./AuthRoutes";
import NotAuthRoutes from "./NotAuthRoutes";
import Login from "../../pages/Login";
import Access from "../../pages/Access";
import Home from "../../pages/Home";
import SignUp from "../../pages/employee/SignUp";
import SearchEmployee from "../../pages/employee/SearchEmployee";
import SearchCustomer from "../../pages/customer/SearchCustomer";
import SearchItem from "../../pages/item/SearchItem";
import CheckOut from "../../pages/loan/CheckOut";
import Return from "../../pages/loan/Return";
import ForgotPassword from "../../pages/password/ForgotPassword";
import Loading from "../../pages/common/Loading";
import ResetPassword from "../../pages/password/ResetPassword";

export default function Routes() {
  function NotFound() {
    throw new Response("", { status: 404 });
    // eslint-disable-next-line
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route>
            <Route element={<AuthRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/searchEmployee" element={<SearchEmployee />} />
              <Route path="/searchCustomer" element={<SearchCustomer />} />
              <Route path="/searchItem" element={<SearchItem />} />
              <Route path="/checkOut" element={<CheckOut />} />
              <Route path="/return" element={<Return />} />
            </Route>
            <Route element={<NotAuthRoutes />}>
              <Route path="/access" element={<Access />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword/:token" element={<ResetPassword />} />
              <Route path="/" element={<Access />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}
