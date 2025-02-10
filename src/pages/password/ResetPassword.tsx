import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import * as jose from "jose";
import { secretKey } from "components/jwt";
import { TEmployee, EmployeeSchema } from "schema/person";
import axios from "api/axios";
import { useThrowAsyncError } from "../../hooks/useThrowAsyncError";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ResetPassword() {
  const throwAsyncError = useThrowAsyncError();
  const { token } = useParams();
  const [message, setMessage] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    const tokenSt = token as string;
    (async () => {
      try {
        const { payload } = await jose.jwtVerify(tokenSt, secretKey, {
          issuer: process.env.REACT_APP_BASE_URL as string,
          algorithms: ["HS256"],
        });
        setEmployeeID(payload.employeeID as string);
      } catch (error) {
        throwAsyncError(error);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEmployee>({
    resolver: zodResolver(EmployeeSchema),
  });

  const onSubmit: SubmitHandler<TEmployee> = (data) => {
    mutate(data);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (data: TEmployee) => {
      return await axios.put("/Employee/UpdatePassword", null, {
        params: {
          id: employeeID,
          password: data.password,
        },
      });
    },
    onSuccess: (res) => {
      setMessage("Your password has been changed successfully!");
      reset();
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <div className="background BK-image">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row justify-content-center p-5">
          <div
            className="col-md-6 col-lg-4 border rounded"
            style={{
              backdropFilter: "blur(8px)",
              height: "61vh",
              overflow: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <h3 className="w-100 mt-5">Reset Password</h3>
            {message && (
              <p
                className={
                  (error ? "text-danger" : "text-info") + " text-start w-100 "
                }
              >
                <strong>{message}</strong>
              </p>
            )}

            <div className="form-group">
              <div className="mb-3">
                <label className="text-start w-100" htmlFor="password">
                  New Password
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  id="password"
                  className="form-control"
                  {...register("password")}
                />
                <i className="eye_icon" onClick={togglePasswordVisiblity}>
                  <VisibilityIcon />
                </i>

                {errors.password && (
                  <p className="text-danger text-start w-100 m-0 text-wrap">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-start w-100" htmlFor="confirmPassword">
                  ConfirmPassword
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  {...register("confirmPassword")}
                />

                {errors.confirmPassword && (
                  <p className="text-danger w-100 text-start m-0 text-wrap">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-5 mb-4"
                  onClick={() => {
                    if (message !== "") setMessage("");
                  }}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
