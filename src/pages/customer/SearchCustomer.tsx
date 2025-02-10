import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import axios from "api/axios";
import { getErrorData } from "components/error/getErrorData";
import { useCustomerStore } from "hooks/store/useCustomerStore";
import { TSearchCustomer } from "schema/person";
import Loading from "../common/Loading";
import CustomerTable from "./components/CustomerTable";
import AddCustomer from "./AddCustomer";

export default function SearchCustomer() {
  const [message, setMessage] = useState<string>("");
  const [searachValues, setSearachValues] = useState<TSearchCustomer>();
  const { register, handleSubmit, reset } = useForm<TSearchCustomer>({});
  const { customerList, showAdd, setCustomerList, setShowAdd } =
    useCustomerStore();

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
  };

  const onSubmit: SubmitHandler<TSearchCustomer> = (req) => {
    setSearachValues(req);
  };

  const {
    data: customerData,
    isPending,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["searchCustomer", searachValues],
    queryFn: () => {
      return axios.get("/Customer/Search", { params: searachValues });
    },
    enabled: Boolean(searachValues),
  });

  useEffect(() => {
    if (message !== "") setMessage("");
    setCustomerList(customerData?.data);
    // eslint-disable-next-line
  }, [customerData]);

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  //   If the query does not have cached data
  // The query will start in the status === 'loading' and fetchStatus === 'idle'
  if (isPending && isFetching) return <Loading />;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group p-2 text-start">
          <h5 className="w-100 mb-2 fw-bold">Customer</h5>
          <div className="container">
            <div className="row justify-content-md-center">
              {message && (
                <p
                  className={
                    (error ? "text-danger" : "text-info") + " text-center mb-2"
                  }
                >
                  <strong>{message}</strong>
                </p>
              )}
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="cardNumber" className="control-label">
                  Card Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cardNumber"
                  {...register("libraryCardNumber")}
                />
              </div>

              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="phoneNumber" className="control-label">
                  Phone No.
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="firstName" className="control-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  {...register("firstName")}
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="lastName" className="control-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  {...register("lastName")}
                />
              </div>

              <div className="col-md-auto">
                <button
                  type="submit"
                  className="btn btn-primary mt-4 mb-4 me-3"
                >
                  Search
                </button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  color="primary"
                  size="medium"
                  style={{ textTransform: "none" }}
                  className="mt-4 mb-4"
                  onClick={() => {
                    handleClose();
                    setShowAdd(true);
                    setSearachValues(undefined);
                  }}
                >
                  Add New
                </Button>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </form>
      <div
        style={{
          height: "51vh",
        }}
      >
        {customerList?.length > 0 && <CustomerTable />}
        {showAdd && <AddCustomer />}
      </div>
    </div>
  );
}
