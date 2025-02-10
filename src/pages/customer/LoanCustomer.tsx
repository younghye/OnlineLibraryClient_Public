import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Save from "@mui/icons-material/Save";
import { currencyFormat } from "utils/format";
import axios from "api/axios";
import { TLoanDetail } from "schema/loan";
import { EnumReturnItemStatus } from "schema/enums";
import { useCustomerStore } from "hooks/store/useCustomerStore";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";
import { navActiveStyle } from "../../utils/styles";
import Table from "../common/Table";
import Tooltip from "../common/Tooltip";

export default function LoanCustomer() {
  const { customer } = useCustomerStore();
  const { types } = useItemAttributesStore();
  const [message, setMessage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<string>("activeLoans");
  const [updateValue, setUpdateValue] = useState({
    name: "",
    value: "",
    barcode: 0,
  });

  const {
    customerLoanList,
    setCustomerLoanList,
    activeLoans,
    loanHistory,
    editLoans,
    setEditLoans,
    setShowLoan,
    resetCustomerLoans: removeCustomerLoans,
  } = useCustomerStore();
  const columns = useMemo(
    () => [
      {
        Header: "Barcode",
        accessor: "barcode",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: number }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Title",
        accessor: "itemCopy.item.title",
        width: 220,
        minWidth: 220,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Type",
        accessor: "itemCopy.item.typeID",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: number }) => (
          <Tooltip value={types.find((t) => t.typeID === props.value)?.name} />
        ),
      },
      {
        Header: "Checkout Date",
        accessor: "loan.dateOfLoan",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
      },
      {
        Header: "Due Date",
        accessor: "returnDueDate",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
      },
      {
        Header: "Return Date",
        accessor: "returnDate",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: string }) => (
          <Tooltip
            value={props.value ? moment(props.value).format("DD/MM/YYYY") : ""}
          />
        ),
      },
      {
        Header: "Fine",
        accessor: "fineInput",
        width: 85,
        minWidth: 85,
        Cell: (props: any) => (
          <div>
            <input
              type="number"
              className="form-control"
              style={{ height: "30px" }}
              name="fine"
              pattern="([0-9]{1,3}).([0-9]{1,3})"
              min="0.00"
              max="10000.00"
              step={0.01}
              onChange={(e) =>
                setUpdateValue({
                  name: e.target.name,
                  value: e.target.value,
                  barcode: props.row.original.barcode,
                })
              }
            />
          </div>
        ),
      },
      {
        Header: "Fine",
        accessor: "fine",
        width: 120,
        minWidth: 120,
        Cell: (props: { value: number }) => (
          <Tooltip value={currencyFormat.format(Number(props.value))} />
        ),
      },
      {
        Header: "Status",
        accessor: "itemCopy.status",
        width: 150,
        minWidth: 150,
        Cell: (props: any) => (
          <select
            className="form-select form-control pt-0 pb-0"
            style={{ height: "30px" }}
            name="status"
            onChange={(e) =>
              setUpdateValue({
                name: e.target.name,
                value: e.target.value,
                barcode: props.row.original.barcode,
              })
            }
          >
            <option value=""> </option>
            {Object.keys(EnumReturnItemStatus).map((key) => (
              <option key={key} value={(EnumReturnItemStatus as any)[key]}>
                {key}
              </option>
            ))}
          </select>
        ),
      },
      {
        Header: "Note",
        accessor: "noteInput",
        width: 140,
        minWidth: 140,
        Cell: (props: any) => (
          <div>
            <input
              type="text"
              className="form-control"
              style={{ height: "30px" }}
              name="note"
              onChange={(e) =>
                setUpdateValue({
                  name: e.target.name,
                  value: e.target.value,
                  barcode: props.row.original.barcode,
                })
              }
            />
          </div>
        ),
      },
      {
        Header: "Note",
        accessor: "note",
        width: 320,
        minWidth: 320,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },

      {
        Header: "Actions",
        accessor: "actions",
        width: 75,
        minWidth: 75,
        Cell: (props: any) => {
          return (
            <div>
              <a
                href="#/"
                className="save text-centered"
                title="Save"
                onClick={() => {
                  if (!props.row.original.returnDate) {
                    alert("Status is required");
                  } else {
                    mutate(props.row.original);
                  }
                }}
              >
                <Save />
              </a>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line
    []
  );

  const handleClose = () => {
    if (message !== "") setMessage("");
    setShowLoan(false);
    removeCustomerLoans();
  };

  const {
    data: customerLoanData,
    isPending: qIsPending,
    error: qError,
    isFetching: qIsFetching,
  } = useQuery({
    queryKey: ["searchCustomerLoan", customer?.libraryCardNumber],
    queryFn: () => {
      return axios.get("/Loan/SearchCustomerLoans", {
        params: {
          libraryCardNumber: customer?.libraryCardNumber,
        },
      });
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateLoan"],
    mutationFn: async (data: TLoanDetail) => {
      let update: TLoanDetail = editLoans.find(
        (loan) => loan.barcode === data.barcode
      )!;
      return await axios.put("/Loan/UpdateLoan", new Array(update));
    },
    onSuccess: (res, variable: TLoanDetail) => {
      setCustomerLoanList(
        customerLoanList.map((prev: TLoanDetail) =>
          prev.barcode === variable.barcode ? variable : prev
        ),
        activeLink
      );
    },
  });

  useEffect(() => {
    if (updateValue.name === "status") {
      let date: Date | undefined = (
        updateValue.value !== "" ? new Date() : undefined
      )!;
      setEditLoans(
        editLoans.map((loan: TLoanDetail) =>
          loan.barcode === updateValue.barcode && updateValue.name
            ? {
                ...loan,
                returnDate: date,
                itemCopy: { ...loan.itemCopy, status: updateValue.value },
              }
            : loan
        )
      );
    } else {
      setEditLoans(
        editLoans.map((loan: TLoanDetail) =>
          loan.barcode === updateValue.barcode && updateValue.name
            ? { ...loan, [updateValue.name]: updateValue.value }
            : loan
        )
      );
    }
    // eslint-disable-next-line
  }, [updateValue]);

  useEffect(() => {
    if (message !== "") setMessage("");
    setCustomerLoanList(customerLoanData?.data, activeLink);
    // eslint-disable-next-line
  }, [customerLoanData]);

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
    if (qError) setMessage(getErrorData(qError).message);
  }, [error, qError]);

  if (isPending || (qIsPending && qIsFetching)) return <Loading />;

  return (
    <Modal
      dialogClassName="modal-95w"
      show={true}
      onHide={handleClose}
      centered
    >
      <div className="p-3">
        <Modal.Header closeButton>
          <Modal.Title>Customer Loans</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-3">
            <NavLink
              to="#"
              className="me-4"
              style={navActiveStyle(activeLink === "activeLoans")}
              onClick={() => {
                setEditLoans(activeLoans);
                setActiveLink("activeLoans");
              }}
            >
              Active Loans ({activeLoans?.length})
            </NavLink>
            <NavLink
              to="#"
              className="me-4"
              style={navActiveStyle(activeLink === "loanHistory")}
              onClick={() => {
                setEditLoans(loanHistory);
                setActiveLink("loanHistory");
              }}
            >
              Loan History ({loanHistory?.length})
            </NavLink>
          </div>
          <div
            style={{
              minHeight: "50vh",
            }}
          >
            {editLoans?.length > 0 && (
              <Table
                data={editLoans}
                columns={columns}
                cssName={"base loan-table"}
                hiddenColumns={
                  activeLink === "loanHistory"
                    ? ["itemCopy.status", "actions", "fineInput", "noteInput"]
                    : ["note", "fine"]
                }
              />
            )}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}
