import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "api/axios";
import { TCustomer, CustomerSchema } from "schema/person";
import { useCustomerStore } from "hooks/store/useCustomerStore";
import { getErrorData } from "components/error/getErrorData";
import CustomerInputForm from "./components/CustomerInputForm";
import Loading from "../common/Loading";

export default function UpdateCustomer() {
  const [message, setMessage] = useState<string>("");
  const { customerList, customer, setCustomerList, setShowUpdate } =
    useCustomerStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCustomer>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      ...customer,
      dateOfBirth: moment(customer?.dateOfBirth).format("YYYY-MM-DD"),
    },
  });

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
    setShowUpdate(false);
  };

  const onSubmit: SubmitHandler<TCustomer> = (value) => {
    mutate(value);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateCustomer"],
    mutationFn: async (data: TCustomer) => {
      return await axios.put("/Customer/Update", data);
    },
    onSuccess: (res, variable: TCustomer) => {
      setCustomerList(
        customerList.map((prev: TCustomer) =>
          prev.customerID === variable.customerID ? variable : prev
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
            <Modal.Title>Edit Customer</Modal.Title>
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
            <CustomerInputForm errors={errors} register={register} />
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
