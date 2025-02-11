import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import axios from "api/axios";
import { signJwt } from "components/jwt";
import { getErrorData } from "components/error/getErrorData";
import { useThrowAsyncError } from "../../hooks/useThrowAsyncError";
import { EmployeeSchema, TEmployee } from "schema/person";
import Loading from "../common/Loading";

export default function FogotPassword() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const throwAsyncError = useThrowAsyncError();
  const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID as string;
  const templateID = process.env
    .REACT_APP_EMAILJS_RESETPASS_TEMPLATE_ID as string;

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
    mutationKey: ["forgotPassword"],
    mutationFn: async (data: TEmployee) => {
      return await axios.get("/Employee/ForgotPassword", {
        params: {
          email: data.person?.email,
        },
      });
    },
    onSuccess: async (res) => {
      const token = await signJwt(res.data.person.email, {
        employeeID: res.data.employeeID,
      });

      emailjs.init({ publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY });
      setLoading(true);

      emailjs
        .send(serviceID, templateID, {
          to: res.data.person.email,
          from: process.env.REACT_APP_EMAIL_SENDER,
          subject: "Rest Password",
          html: `<p> Hi, ${res.data.person.firstName}</p>
                <p>We've received a request to reset your password. <br> Click on the following link to reset your password:</p>
                <p><span style="font-size: 14pt;"><strong><a href="${process.env.REACT_APP_URL}resetPassword/${token}">Reset Password</a></strong></span></p>
                <p>The link will expire in 10 minutes.<br> If you didn't request a password reset, please ignore this email.</p>
                <p>Thanks,<br>The Library Management System</p>`,
        })
        .then(
          (res) => {
            setMessage("email successfully sent check inbox");
          },
          (error) => {
            throwAsyncError(error);
          }
        )
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending || loading) return <Loading />;

  return (
    <div className="background access-background">
      <div className="row justify-content-center p-5">
        <div
          className="col-md-6 col-lg-4 border rounded"
          style={{
            backdropFilter: "blur(8px)",
            height: "45vh",
            overflow: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="w-100 mt-5 mb-3">Forgot Password</h3>
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
                <label className="text-start w-100" htmlFor="inputEmail">
                  Email
                </label>
                <input
                  type="text"
                  id="inputEmail"
                  className="form-control"
                  {...register("person.email")}
                />

                {errors.person?.email && (
                  <p className="text-danger text-start w-100 m-0 text-wrap">
                    {errors.person.email.message}
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
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
