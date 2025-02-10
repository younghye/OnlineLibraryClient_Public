import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "api/axios";
import { TEmployee, EmployeeSchema } from "schema/person";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import MessageModal from "../common/modal/MessageModal";
import { ModalInfo } from "../common/modal/MessageModal";
import EmployeeInputForm from "./components/EmployeeInputForm";

export default function SignUp() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [modalInfo, setModalInfo] = useState<ModalInfo>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TEmployee>({
    resolver: zodResolver(EmployeeSchema),
  });

  const handleClose = () => {
    setModalInfo(undefined);
    navigate("/home");
  };

  const onSubmit: SubmitHandler<TEmployee> = (data) => {
    mutate(data);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (data: TEmployee) => {
      return await axios.post("/Employee/Add", data);
    },
    onSuccess: (res) => {
      setModalInfo({
        title: "Info",
        body: "Your submission has been sent!",
      });
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <div className="background access-background">
      <div className="row justify-content-center p-3 align-items-center h-100">
        <div
          className="col-xl-5 col-lg-8 col-sm-11 rounded filter"
          style={{
            height: "69vh",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="w-100 mt-4">Sign-up</h3>
            {message && (
              <p
                className={
                  (error ? "text-danger" : "text-success") +
                  " text-start w-100 m-0"
                }
              >
                <strong>{message}</strong>
              </p>
            )}
            <EmployeeInputForm errors={errors} register={register} />

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary w-100 mt-4 mb-4"
                onClick={() => {
                  if (message !== "") setMessage("");
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {modalInfo && <MessageModal onClose={handleClose} info={modalInfo} />}
    </div>
  );
}
