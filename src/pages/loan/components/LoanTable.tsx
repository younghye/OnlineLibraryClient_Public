import { useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLoanStore } from "hooks/store/useLoanStore";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import { TLoanDetail } from "schema/loan";
import moment from "moment";
import Table from "../../common/Table";
import Tooltip from "../../common/Tooltip";
import ConfirmModal from "../../common/modal/ConfirmModal";

interface Props {
  hiddenColumns: string[];
}
export default function LoanTable({ hiddenColumns }: Props) {
  const { types } = useItemAttributesStore();
  const [message, setMessage] = useState<string>("");
  const [deleteID, setDeleteID] = useState<number>();
  const { loanDetailList, setLoanDetailList } = useLoanStore();

  const columns = useMemo(
    () => [
      {
        Header: "Barcode",
        accessor: "barcode",
        width: 200,
        minWidth: 200,
        Cell: (props: { value: number }) => <Tooltip value={props.value} />,
      },
      {
        Header: "BorrowerCard#",
        accessor: "loan.libraryCardNumber",
        width: 200,
        minWidth: 200,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Title",
        accessor: "itemCopy.item.title",
        width: 430,
        minWidth: 430,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Type",
        accessor: "itemCopy.item.typeID",
        width: 175,
        minWidth: 175,
        Cell: (props: { value: number }) => (
          <Tooltip value={types.find((t) => t.typeID === props.value)?.name} />
        ),
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
        Header: "Due Date",
        accessor: "returnDueDate",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
      },
      {
        Header: "Return Date",
        accessor: "returnDate",
        width: 190,
        minWidth: 190,
        Cell: (props: { value: string }) => (
          <Tooltip
            value={props.value ? moment(props.value).format("DD/MM/YYYY") : ""}
          />
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 110,
        minWidth: 110,
        Cell: (props: any) => {
          return (
            <div>
              <a
                href="#/"
                className="delete text-centered"
                title="Delete"
                onClick={() => setDeleteID(props.row.original.barcode)}
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
    setDeleteID(undefined);
    if (message !== "") setMessage("");
  };

  const deleteItem = () => {
    setLoanDetailList(
      loanDetailList.filter((prev: TLoanDetail) => prev.barcode !== deleteID)
    );
    handleClose();
  };

  return (
    <div>
      {loanDetailList?.length > 0 && (
        <Table
          data={loanDetailList}
          columns={columns}
          cssName={"base loan-table"}
          hiddenColumns={hiddenColumns}
        />
      )}

      {deleteID && (
        <ConfirmModal
          toggleModal={deleteItem}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
    </div>
  );
}
