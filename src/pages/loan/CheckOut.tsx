import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import moment from "moment";
import axios from "api/axios";
import { getErrorData } from "components/error/getErrorData";
import { useLoanStore } from "hooks/store/useLoanStore";
import { TLoanCart } from "schema/loan";
import { EnumItemStatus, EnumLoanPeriodDays } from "schema/enums";
import { currencyFormat } from "utils/format";
import { addDays } from "utils/date";
import Loading from "../common/Loading";
import ItemDetail from "../item/components/ItemDetail";
import LoanTable from "./components/CheckoutTable";

type FormInputs = {
  libraryCardNumber: number;
  barcode: number;
};

export default function CheckOut() {
  const [message, setMessage] = useState<string>("");
  const [libraryCardNumber, setLibraryCardNumber] = useState<number>();
  const [barcode, setBarcode] = useState<number>();
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const { register, reset, handleSubmit } = useForm<FormInputs>({});
  const { checkoutList, setCheckoutList, resetLoanStore } = useLoanStore();

  const handleReset = () => {
    reset();
    setLibraryCardNumber(undefined);
    setBarcode(undefined);
  };

  const onSubmit = (data: FormInputs) => {
    setLibraryCardNumber(data.libraryCardNumber);
    setBarcode(data.barcode);
  };

  const [customerQuery, itemQuery] = useQueries({
    queries: [
      {
        queryKey: ["searchLibraryCardNumber", libraryCardNumber],
        queryFn: () => {
          return axios.get("/Customer/SearchByLibraryCardNumber/", {
            params: {
              libraryCardNumber: libraryCardNumber,
            },
          });
        },
        enabled: Boolean(libraryCardNumber),
      },

      {
        queryKey: ["searchItemCopy", barcode],
        queryFn: () => {
          return axios.get("/Item/SearchItemCopy/", {
            params: {
              barcode: barcode,
            },
          });
        },
        enabled: Boolean(barcode),
      },
    ],
  });

  useEffect(() => {
    resetLoanStore();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if ((!customerQuery.isError || !itemQuery.isError) && message !== "")
      setMessage("");
    if (itemQuery.data?.data.status === EnumItemStatus.AVAILABLE) {
      setShowAddButton(true);
    } else {
      setShowAddButton(false);
    }
    // eslint-disable-next-line
  }, [itemQuery.data, customerQuery.data]);

  useEffect(() => {
    if (customerQuery.error)
      setMessage(getErrorData(customerQuery.error).message);
    if (itemQuery.error) setMessage(getErrorData(itemQuery.error).message);
  }, [customerQuery.error, itemQuery.error]);

  if (
    (customerQuery.isPending && customerQuery.isFetching) ||
    (itemQuery.isPending && itemQuery.isFetching)
  )
    return <Loading />;

  const addCheckout = () => {
    let addData = checkoutList.find(
      (c) => c.barcode === itemQuery.data?.data.barcode
    );
    if (!addData) {
      let loanPeriod = (EnumLoanPeriodDays as any)[
        itemQuery.data?.data.item.type.name
      ];
      const checkoutCartData: TLoanCart = {
        barcode: itemQuery.data?.data.barcode,
        title: itemQuery.data?.data.item.title,
        type: itemQuery.data?.data.item.type.name,
        price: itemQuery.data?.data.price,
        loanPeriod: loanPeriod,
        returnDueDate: addDays(new Date(), loanPeriod),
      };
      setCheckoutList([...checkoutList, checkoutCartData]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group p-2 text-start">
          <h5 className="w-100 mb-3 fw-bold">CheckOut</h5>
          <div
            className="container-fluid text-start"
            style={{
              minHeight: "35vh",
            }}
          >
            {message && (
              <p
                className={
                  (customerQuery.isError || itemQuery.isError
                    ? "text-danger"
                    : "text-info") + " text-center mb-1"
                }
              >
                <strong>{message}</strong>
              </p>
            )}
            <div className="row mt-2" style={{ overflowWrap: "break-word" }}>
              <div className="col-lg-6 col-md-12 col-sm-12 ps-3">
                <div className="row mb-3">
                  <div>
                    <label htmlFor="cardNumber" className="control-label">
                      Card Number
                    </label>
                  </div>
                  <div className="col-lg-4 col-md-5 col-sm-7 col-8">
                    <input
                      type="number"
                      id="cardNumber"
                      className="form-control"
                      {...register("libraryCardNumber")}
                    />
                  </div>
                  <div className="col-2 text-center">
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </div>
                {customerQuery?.data && (
                  <>
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        First Name
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {customerQuery.data.data.person.firstName}
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Last Name
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {customerQuery.data.data.person.lastName}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Phone No.
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {customerQuery.data.data.person.phoneNumber}
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Email
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {customerQuery.data.data.person.email}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Address
                      </div>
                      <div className="col-lg-10 col-md-10 col-sm-9 col-8">
                        {customerQuery.data.data.person.address}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        DateOfBirth
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {moment(customerQuery.data.data.dateOfBirth).format(
                          "DD/MM/YYYY"
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <hr className="d-lg-none" />
              <div
                className="col-lg-6 col-md-9 col-sm-12 m-0 ps-3 checkout-border"
                style={{ minHeight: "35vh" }}
              >
                <div className="row mb-3">
                  <div>
                    <label htmlFor="barcode" className="control-label w-100">
                      Barcode
                    </label>
                  </div>
                  <div className="col-lg-4 col-md-5 col-sm-7 col-8">
                    <input
                      type="number"
                      id="barcode"
                      className="form-control"
                      {...register("barcode")}
                    />
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-2 col-3 text-center">
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                  {showAddButton && (
                    <div className="col-lg-4 col-md-4 col-sm-5 col-6 pt-2 pt-md-0">
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                        startIcon={<AddIcon />}
                        color="primary"
                        size="medium"
                        onClick={() => addCheckout()}
                      >
                        Add To List
                      </Button>
                    </div>
                  )}
                </div>
                {itemQuery?.data && (
                  <>
                    <ItemDetail
                      item={itemQuery.data.data.item}
                      page={"checkout"}
                    />
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Status
                      </div>
                      <div
                        className={`col-lg-4 col-md-4 col-sm-9 col-8 ${
                          itemQuery.data?.data.status === "CHECK_OUT"
                            ? "text-danger"
                            : "text-info"
                        }`}
                      >
                        {itemQuery.data?.data.status}
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
                        Price
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-9 col-8">
                        {currencyFormat.format(itemQuery.data?.data.price)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="container-fluid text-start p-0 mt-2"
            style={{
              height: "29vh",
            }}
          >
            {checkoutList?.length > 0 && (
              <div
                className="row m-0 p-0"
                style={{ overflowWrap: "break-word" }}
              >
                <LoanTable
                  libraryCardNumber={customerQuery.data?.data.libraryCardNumber}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
