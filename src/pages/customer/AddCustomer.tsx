import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-bootstrap/Modal";
import axios from "api/axios";
import { TCustomer, CustomerSchema } from "schema/person";
import { useCustomerStore } from "hooks/store/useCustomerStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import InputGroup from "./components/CustomerInputForm";

export default function AddCustomer() {
  const [message, setMessage] = useState<string>("");
  const { setCustomerList, setShowAdd } = useCustomerStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCustomer>({
    resolver: zodResolver(CustomerSchema),
  });

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
    setShowAdd(false);
  };

  const onSubmit: SubmitHandler<TCustomer> = (value) => {
    mutate(value);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["addCustomer"],
    mutationFn: async (data: TCustomer) => {
      return await axios.post("/Customer/Add", data);
    },
    onSuccess: (res, variable: TCustomer) => {
      variable.libraryCardNumber = res.data.libraryCardNumber;
      variable.customerID = res.data.customerID;
      setCustomerList(new Array(variable));
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
            <Modal.Title>Add Customer</Modal.Title>
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
            <InputGroup errors={errors} register={register} />
            <Modal.Footer className="border-0">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "80px" }}
                onClick={() => {
                  if (message !== "") setMessage("");
                }}
              >
                Add
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
