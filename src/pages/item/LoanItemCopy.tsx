import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { currencyFormat } from "utils/format";
import axios from "api/axios";
import { TLoanDetail } from "schema/loan";
import { useItemStore } from "hooks/store/useItemStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import Table from "../common/Table";
import Tooltip from "../common/Tooltip";

export default function LoanItemCopy() {
  const [message, setMessage] = useState<string>("");
  const [itemCopyLoanList, setItemCopyLoanList] = useState<TLoanDetail[]>([]);
  const { itemCopy, setShowLoan } = useItemStore();

  const columns = useMemo(
    () => [
      {
        Header: "BorrowerCard#",
        accessor: "loan.libraryCardNumber",
        width: 200,
        minWidth: 200,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Checkout Date",
        accessor: "loan.dateOfLoan",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
      },
      {
        Header: "Return Date",
        accessor: "returnDate",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => (
          <Tooltip
            value={props.value ? moment(props.value).format("DD/MM/YYYY") : ""}
          />
        ),
      },
      {
        Header: "Fine",
        accessor: "fine",
        width: 130,
        minWidth: 130,
        Cell: (props: { value: number }) => (
          <Tooltip value={currencyFormat.format(Number(props.value))} />
        ),
      },
      {
        Header: "Note",
        accessor: "note",
        width: 260,
        minWidth: 260,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
    ],
    []
  );

  const handleClose = () => {
    if (message !== "") setMessage("");
    setShowLoan(false);
  };

  const {
    data: itemCopyLoanData,
    isPending,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["searchItemCopyLoans", itemCopy?.barcode],
    queryFn: () => {
      return axios.get("/Loan/SearchItemCopyLoans", {
        params: {
          barcode: itemCopy?.barcode,
        },
      });
    },
  });

  useEffect(() => {
    if (message !== "") setMessage("");
    setItemCopyLoanList(itemCopyLoanData?.data);
    // eslint-disable-next-line
  }, [itemCopyLoanData]);

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending && isFetching) return <Loading />;

  return (
    <Modal size="xl" show={true} s onHide={handleClose} centered>
      <div className="p-3">
        <Modal.Header closeButton>
          <Modal.Title>
            ItemCopy Loans ({itemCopyLoanList ? itemCopyLoanList.length : 0})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="pt-2"
            style={{
              minHeight: "50vh",
            }}
          >
            {itemCopyLoanList?.length > 0 && (
              <Table
                data={itemCopyLoanList}
                columns={columns}
                cssName={"base loan-table"}
                hiddenColumns={[]}
              />
            )}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}
