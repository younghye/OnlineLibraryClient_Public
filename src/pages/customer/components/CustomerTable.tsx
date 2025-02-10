import { useMemo, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { getErrorData } from "components/error/getErrorData";
import { TCustomer } from "schema/person";
import { useCustomerStore } from "hooks/store/useCustomerStore";
import axios from "api/axios";
import Table from "../../common/Table";
import Tooltip from "../../common/Tooltip";
import Loading from "../../common/Loading";
import ConfirmModal from "../../common/modal/ConfirmModal";
import UpdateCustomer from "../UpdateCustomer";
import LoanCustomer from "../LoanCustomer";

export default function CustomerTable() {
  const [message, setMessage] = useState<string>("");
  const {
    customerList,
    customer,
    showDelete,
    showUpdate,
    showLoan,
    setCustomerList,
    setCustomer,
    setShowDelete,
    setShowUpdate,
    setShowLoan,
  } = useCustomerStore();

  const columns = useMemo(
    () => [
      {
        Header: "CardNumber",
        accessor: "libraryCardNumber",
        width: 150,
        minWidth: 150,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "FirstName",
        accessor: "person.firstName",
        width: 150,
        minWidth: 150,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "LastName",
        accessor: "person.lastName",
        width: 150,
        minWidth: 150,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Email",
        accessor: "person.email",
        width: 225,
        minWidth: 225,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "PhoneNumber",
        accessor: "person.phoneNumber",
        width: 150,
        minWidth: 150,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Address",
        accessor: "person.address",
        width: 350,
        minWidth: 350,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "DateOfBirth",
        accessor: "dateOfBirth",
        width: 145,
        minWidth: 145,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 135,
        minWidth: 135,
        Cell: (props: any) => {
          return (
            <div>
              <a
                href="#/"
                className="info"
                style={{ paddingRight: "10px" }}
                title="ShowLoan"
                data-toggle="tooltip"
                onClick={() => {
                  setCustomer(props.row.original);
                  setShowLoan(true);
                }}
              >
                <VisibilityIcon />
              </a>
              <a
                href="#/"
                className="edit"
                style={{ paddingRight: "10px" }}
                title="Edit"
                data-toggle="tooltip"
                onClick={() => {
                  setCustomer(props.row.original);
                  setShowUpdate(true);
                }}
              >
                <EditIcon />
              </a>
              <a
                href="#/"
                className="delete"
                title="Delete"
                data-toggle="tooltip"
                onClick={() => {
                  setCustomer(props.row.original);
                  setShowDelete(true);
                }}
              >
                <DeleteIcon />
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
    if (showDelete) setShowDelete(false);
    if (showUpdate) setShowUpdate(false);
    if (showLoan) setShowLoan(false);
  };

  const {
    mutate: deleteCustomer,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: async () => {
      return await axios.put("/Customer/Delete", null, {
        params: {
          id: customer?.customerID,
        },
      });
    },
    onSuccess: (res) => {
      setCustomerList(
        customerList.filter(
          (prev: TCustomer) => prev.customerID !== customer?.customerID
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
    <div>
      {customerList?.length > 0 && (
        <Table
          data={customerList}
          columns={columns}
          cssName={"base person-table"}
          hiddenColumns={[]}
        />
      )}
      {showDelete && (
        <ConfirmModal
          toggleModal={deleteCustomer}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
      {showUpdate && <UpdateCustomer />}
      {showLoan && <LoanCustomer />}
    </div>
  );
}
