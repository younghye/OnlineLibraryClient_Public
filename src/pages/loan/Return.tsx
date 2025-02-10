import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "api/axios";
import { getErrorData } from "components/error/getErrorData";
import { useLoanStore } from "hooks/store/useLoanStore";
import { EnumItemStatus } from "schema/enums";
import Loading from "../common/Loading";
import LoanTable from "./components/LoanTable";
import MessageModal from "../common/modal/MessageModal";
import { ModalInfo } from "../common/modal/MessageModal";

type FormInputs = {
  barcode: number;
};

export default function Return() {
  const [message, setMessage] = useState<string>("");
  const [modalInfo, setModalInfo] = useState<ModalInfo>();
  const [barcode, setBarcode] = useState<number>();
  const { register, reset, handleSubmit } = useForm<FormInputs>({});
  const { loanDetailList, setLoanDetailList, resetLoanStore } = useLoanStore();

  const handleClose = () => {
    setModalInfo(undefined);
    resetLoanStore();
    reset();
    if (message !== "") setMessage("");
  };

  const onSubmit = (data: FormInputs) => {
    setBarcode(data.barcode);
  };

  useEffect(() => {
    resetLoanStore();
    // eslint-disable-next-line
  }, []);

  const {
    data: checkedOutItem,
    isPending: qIsPending,
    error: qError,
    isFetching: qIsFetching,
  } = useQuery({
    queryKey: ["searchItemCheckout", barcode],
    queryFn: () => {
      return axios.get("/Loan/SearchItemCheckout/", {
        params: {
          barcode: barcode,
        },
      });
    },
    enabled: Boolean(barcode),
  });

  const {
    mutate,
    isPending: mIsPending,
    error: mError,
  } = useMutation({
    mutationKey: ["updateLoan"],
    mutationFn: async () => {
      return await axios.put("/Loan/UpdateLoan", loanDetailList);
    },
    onSuccess: (res) => {
      setModalInfo({
        title: "Info",
        body: "Process is successfully completed.",
      });
    },
  });

  useEffect(() => {
    if (message !== "") setMessage("");
    if (checkedOutItem?.data) {
      let data = {
        ...checkedOutItem?.data,
        returnDate: new Date(),
        itemCopy: {
          ...checkedOutItem?.data.itemCopy,
          status: EnumItemStatus.AVAILABLE,
        },
      };
      setLoanDetailList([...loanDetailList, data]);
      setBarcode(undefined);
    }
    // eslint-disable-next-line
  }, [checkedOutItem?.data]);

  useEffect(() => {
    if (qError) setMessage(getErrorData(qError).message);
    if (mError) setMessage(getErrorData(mError).message);
  }, [qError, mError]);

  if ((qIsPending && qIsFetching) || mIsPending) return <Loading />;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group p-2 text-start">
          <h5 className="w-100 mb-2 fw-bold">Return</h5>
          <div className="container">
            <div className="row justify-content-md-center">
              {message && (
                <p
                  className={
                    (qError || mError ? "text-danger" : "text-info") +
                    " mt-2 mb-0"
                  }
                >
                  <strong>{message}</strong>
                </p>
              )}
              <div className="row mb-3">
                <div>
                  <label htmlFor="barcode" className="control-label">
                    Barcode
                  </label>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6 col-6">
                  <input
                    type="number"
                    id="barcode"
                    className="form-control"
                    {...register("barcode")}
                  />
                </div>
                <div className="col-6">
                  <button type="submit" className="btn btn-primary">
                    Add To List
                  </button>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
        <div
          style={{
            minHeight: "52vh",
          }}
        >
          {loanDetailList?.length > 0 && (
            <>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-danger mb-2 me-4"
                  style={{ width: "180px" }}
                  onClick={() => mutate()}
                >
                  Return
                </button>
              </div>
              <LoanTable hiddenColumns={["returnDate"]} />
            </>
          )}
        </div>
        {modalInfo && <MessageModal onClose={handleClose} info={modalInfo} />}
      </form>
    </div>
  );
}
