import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "api/axios";
import { EnumEmployeeRole } from "schema/enums";
import { TSearchEmployee } from "schema/person";
import { useEmployeeStore } from "hooks/store/useEmployeeStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import EmployeeTable from "./components/EmployeeTable";

export default function SearchEmployee() {
  const [message, setMessage] = useState<string>("");
  const [searachValues, setSearachValues] = useState<TSearchEmployee>();
  const { employeeList, setEmployeeList } = useEmployeeStore();
  const { register, handleSubmit } = useForm<TSearchEmployee>({});

  const onSubmit: SubmitHandler<TSearchEmployee> = (req) => {
    setSearachValues(req);
  };

  const {
    data: employeeData,
    isPending,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["searchStaff", searachValues],
    queryFn: () => {
      return axios.get("/Employee/Search", { params: searachValues });
    },
    enabled: Boolean(searachValues),
  });

  useEffect(() => {
    if (message !== "") setMessage("");
    setEmployeeList(employeeData?.data);
    // eslint-disable-next-line
  }, [employeeData]);

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending && isFetching) return <Loading />;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group p-2 text-start">
          <h5 className="w-100 mb-2 fw-bold">Staff</h5>
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
                <label htmlFor="role" className="control-label">
                  Role
                </label>
                <select
                  className="form-select form-control"
                  id="role"
                  {...register("role")}
                >
                  <option value=""> </option>
                  {Object.keys(EnumEmployeeRole).map((key) => (
                    <option key={key} value={(EnumEmployeeRole as any)[key]}>
                      {key}
                    </option>
                  ))}
                </select>
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
                <button type="submit" className="btn btn-primary mt-4 mb-2">
                  Search
                </button>
              </div>
              {/* <div className="col-md-auto">
                <button
                  type="button"
                  className="btn btn-outline-primary mt-4"
                  onClick={handleClose}
                >
                  Reset
                </button>
              </div> */}
            </div>
            <hr />
          </div>
        </div>
      </form>
      <div
        style={{
          height: "51vh",
        }}
      >
        {employeeList?.length > 0 && <EmployeeTable />}
      </div>
    </div>
  );
}
