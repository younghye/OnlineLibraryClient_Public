import { useMemo, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "api/axios";
import { getErrorData } from "components/error/getErrorData";
import { TEmployee } from "schema/person";
import { useEmployeeStore } from "hooks/store/useEmployeeStore";
import Loading from "../../common/Loading";
import Table from "../../common/Table";
import Tooltip from "../../common/Tooltip";
import ConfirmModal from "../../common/modal/ConfirmModal";
import UpdateEmployee from "../UpdateEmployee";

export default function EmployeeTable() {
  const [message, setMessage] = useState<string>("");
  const {
    employeeList,
    employee,
    showDelete,
    showUpdate,
    setEmployeeList,
    setEmployee,
    setShowDelete,
    setShowUpdate,
  } = useEmployeeStore();

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "employeeID",
        width: 85,
        minWidth: 85,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "FirstName",
        accessor: "person.firstName",
        width: 155,
        minWidth: 155,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "LastName",
        accessor: "person.lastName",
        width: 155,
        minWidth: 155,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Email",
        accessor: "person.email",
        width: 255,
        minWidth: 255,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "PhoneNumber",
        accessor: "person.phoneNumber",
        width: 165,
        minWidth: 165,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Address",
        accessor: "person.address",
        width: 365,
        minWidth: 365,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Role",
        accessor: "role",
        width: 150,
        minWidth: 150,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 125,
        minWidth: 125,
        Cell: (props: any) => {
          return (
            <div>
              <a
                href="#/"
                className="edit"
                style={{ paddingRight: "10px" }}
                title="Edit"
                data-toggle="tooltip"
                onClick={() => {
                  setEmployee(props.row.original);
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
                  setEmployee(props.row.original);
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
  };

  const {
    mutate: deleteEmployee,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["deleteEmployee"],
    mutationFn: async () => {
      return await axios.delete("/Employee/Delete", {
        params: {
          id: employee?.employeeID,
        },
      });
    },
    onSuccess: (res) => {
      setEmployeeList(
        employeeList.filter(
          (prev: TEmployee) => prev.employeeID !== employee?.employeeID
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
      {employeeList?.length > 0 && (
        <Table
          data={employeeList}
          columns={columns}
          cssName={"base person-table"}
          hiddenColumns={[]}
        />
      )}
      {showDelete && (
        <ConfirmModal
          toggleModal={deleteEmployee}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
      {showUpdate && <UpdateEmployee />}
    </div>
  );
}
