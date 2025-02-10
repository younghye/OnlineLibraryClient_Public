import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "api/axios";
import { TEmployee, EmployeeSchema } from "schema/person";
import { getErrorData } from "components/error/getErrorData";
import { useAuthStore } from "hooks/store/useAuthStore";
import Loading from "./common/Loading";

export default function Login() {
  const [message, setMessage] = useState<string>("");
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TEmployee>({
    resolver: zodResolver(EmployeeSchema),
  });

  const onSubmit: SubmitHandler<TEmployee> = (data) => {
    mutate(data);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: TEmployee) => {
      return await axios.get("/Employee/Login", {
        params: {
          userName: data.userName,
          password: data.password,
        },
      });
    },
    onSuccess: (res) => {
      setAuth(res.data);
      navigate("/home");
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <div className="background access-background">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row justify-content-center p-5">
          <div
            className="col-md-6 col-lg-4 border rounded filter"
            style={{
              height: "60vh",
            }}
          >
            <h3 className="w-100 mt-5">Login</h3>
            {message && (
              <p
                className={
                  (error ? "text-danger" : "text-info") +
                  " text-start w-100 m-0"
                }
              >
                <strong>{message}</strong>
              </p>
            )}

            <div className="form-group ps-3 pe-3">
              <div className="mb-3">
                <label className="text-start w-100" htmlFor="inputUserName">
                  UserName
                </label>
                <input
                  type="text"
                  id="inputUserName"
                  className="form-control"
                  {...register("userName")}
                />

                {errors.userName && (
                  <p className="text-danger text-start w-100 m-0 text-wrap">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div className="relative mb-4">
                <label className="text-start w-100" htmlFor="inputPass">
                  Password
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  id="inputPass"
                  className="form-control"
                  {...register("password")}
                />
                <i className="eye_icon" onClick={togglePasswordVisiblity}>
                  <VisibilityIcon />
                </i>
                {errors.password && (
                  <p className="text-danger w-100 text-start m-0 text-wrap">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4 mb-4"
                  onClick={() => {
                    if (message !== "") setMessage("");
                  }}
                >
                  Login
                </button>
              </div>

              <p className="mb-4">
                <a className="text-muted" href="/forgotPassword">
                  Forgot password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
