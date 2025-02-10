import { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import axios from "api/axios";
import { currencyFormat } from "utils/format";
import { TItemCopy } from "schema/item";
import { useItemStore } from "hooks/store/useItemStore";
import { getErrorData } from "components/error/getErrorData";
import Table from "../../common/Table";
import Tooltip from "../../common/Tooltip";
import ConfirmModal from "../../common/modal/ConfirmModal";
import Loading from "../../common/Loading";
import UpdateItemCopy from "../UpdateItemCopy";
import LoanItemCopy from "../LoanItemCopy";

export default function ItemCopyTable() {
  const [message, setMessage] = useState<string>("");
  const {
    item,
    itemCopy,
    showItemCopyDelete,
    showItemCopyUpdate,
    showLoan,
    setItem,
    setItemCopy,
    setShowItemCopyDelete,
    setShowItemCopyUpdate,
    setShowLoan,
    updateItemList,
  } = useItemStore();

  const columns = useMemo(
    () => [
      {
        Header: "Barcode",
        accessor: "barcode",
        width: 260,
        minWidth: 260,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Price",
        accessor: "price",
        width: 130,
        minWidth: 130,
        Cell: (props: { value: string }) => (
          <Tooltip value={currencyFormat.format(Number(props.value))} />
        ),
      },

      {
        Header: "Status",
        accessor: "status",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 143,
        minWidth: 144,
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
                onClick={() => {
                  setShowItemCopyUpdate(true);
                }}
              >
                <EditIcon />
              </a>
              <a
                href="#/"
                className="delete"
                title="Delete"
                onClick={() => {
                  setShowItemCopyDelete(true);
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
    if (showItemCopyDelete) setShowItemCopyDelete(false);
  };

  const onRowClicked = (row: TItemCopy) => {
    setItemCopy(row);
  };

  const {
    mutate: deleteItemCopy,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["deleteItemCopy"],
    mutationFn: async () => {
      return await axios.put("/Item/DeleteItemCopy", null, {
        params: {
          barcode: itemCopy?.barcode,
        },
      });
    },
    onSuccess: (res) => {
      if (item) {
        let newCopies = item.itemCopies?.filter(
          (prev: TItemCopy) => prev.barcode !== itemCopy?.barcode
        );
        let newItem = { ...item, itemCopies: newCopies };
        setItem(newItem);
        updateItemList(newItem);
      }
      handleClose();
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
  }, [error]);

  if (isPending) <Loading />;

  return (
    <div>
      {item?.itemCopies && item.itemCopies.length > 0 && (
        <Table
          data={item.itemCopies}
          columns={columns}
          cssName={"base itemCopy-table"}
          hiddenColumns={[]}
          onRowClicked={onRowClicked}
        />
      )}
      {showItemCopyDelete && (
        <ConfirmModal
          toggleModal={deleteItemCopy}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
      {showItemCopyUpdate && <UpdateItemCopy />}
      {showLoan && <LoanItemCopy />}
    </div>
  );
}
