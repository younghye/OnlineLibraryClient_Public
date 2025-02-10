import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-bootstrap/Modal";
import axios from "api/axios";
import { TEmployee, EmployeeSchema } from "schema/person";
import { useEmployeeStore } from "hooks/store/useEmployeeStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import EmployeeInputForm from "./components/EmployeeInputForm";

export default function UpdateEmployee() {
  const [message, setMessage] = useState<string>("");
  const { employeeList, employee, setEmployeeList, setShowUpdate } =
    useEmployeeStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEmployee>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: { ...employee },
  });

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
    setShowUpdate(false);
  };

  const onSubmit: SubmitHandler<TEmployee> = (value) => {
    mutate(value);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateEmployee"],
    mutationFn: async (data: TEmployee) => {
      return await axios.put("/Employee/Update", data);
    },
    onSuccess: (res, variable: TEmployee) => {
      setEmployeeList(
        employeeList.map((prev: TEmployee) =>
          prev.employeeID === variable.employeeID ? variable : prev
        )
      );
      handleClose();
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-3">
          <Modal.Header className="border-0" closeButton>
            <Modal.Title>Edit Staff</Modal.Title>
          </Modal.Header>
          {message && (
            <p
              className={
                (error ? "text-danger" : "text-info") + " text-start w-100 m-0"
              }
            >
              <strong>{message}</strong>
            </p>
          )}
          <Modal.Body>
            <EmployeeInputForm errors={errors} register={register} />
            <Modal.Footer className="border-0">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "80px" }}
                onClick={() => {
                  if (message !== "") setMessage("");
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ width: "80px" }}
                onClick={handleClose}
              >
                Cancel
              </button>
            </Modal.Footer>
          </Modal.Body>
        </div>
      </form>
    </Modal>
  );
}
