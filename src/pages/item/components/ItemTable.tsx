import { useMemo, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getErrorData } from "components/error/getErrorData";
import { useItemStore } from "hooks/store/useItemStore";
import { TItem } from "schema/item";
import axios from "api/axios";
import Table from "../../common/Table";
import Loading from "../../common/Loading";
import Tooltip from "../../common/Tooltip";
import ConfirmModal from "../../common/modal/ConfirmModal";
import UpdateItem from "../UpdateItem";

export default function ItemTable() {
  const [message, setMessage] = useState<string>("");
  const {
    itemList,
    item,
    isSearchItemCopy,
    showDelete,
    showUpdate,
    setItemList,
    setItem,
    setIsSearchItemCopy,
    setShowDelete,
    setShowUpdate,
    updateItemList,
  } = useItemStore();

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "itemID",
        width: 70,
        minWidth: 70,
        Cell: (props: { value: number }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Title",
        accessor: "title",
        width: 240,
        minWidth: 240,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Type",
        accessor: "type.name",
        width: 123,
        minWidth: 123,
        Cell: (props: { value: number }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Producer",
        accessor: "producer",
        width: 175,
        minWidth: 175,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 95,
        minWidth: 95,
        Cell: (props: any) => {
          return (
            <div>
              <a
                href="#/"
                className="edit"
                style={{ paddingRight: "10px" }}
                title="Edit"
                onClick={() => {
                  setShowUpdate(true);
                }}
              >
                <EditIcon />
              </a>
              <a
                href="#/"
                className="delete"
                title="Delete"
                onClick={() => {
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

  const onRowClicked = (row: TItem) => {
    if (isSearchItemCopy) {
      setItem(itemData?.data);
      updateItemList(itemData?.data);
      setIsSearchItemCopy(false);
    } else {
      setItem(row);
    }
  };

  const {
    data: itemData,
    isPending: qIsPending,
    error: qError,
    isFetching: qIsFetching,
  } = useQuery({
    queryKey: ["searchItem", item?.itemID],
    queryFn: () => {
      return axios.get("/Item/SearchItem", {
        params: {
          id: item?.itemID,
        },
      });
    },
    enabled: Boolean(isSearchItemCopy),
  });

  const {
    mutate: deleteItem,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async () => {
      return await axios.put("/Item/DeleteItem", null, {
        params: {
          id: item?.itemID,
        },
      });
    },
    onSuccess: (res) => {
      setItemList(
        itemList.filter((prev: TItem) => prev.itemID !== item?.itemID)
      );
      setItem(null);
      handleClose();
    },
  });

  useEffect(() => {
    if (error) setMessage(getErrorData(error).message);
    if (qError) setMessage(getErrorData(qError).message);
  }, [error, qError]);

  if ((qIsPending && qIsFetching) || isPending) <Loading />;

  return (
    <div>
      {itemList?.length > 0 && (
        <Table
          data={itemList}
          columns={columns}
          cssName={"base item-table"}
          hiddenColumns={[]}
          onRowClicked={onRowClicked}
        />
      )}

      {showDelete && (
        <ConfirmModal
          toggleModal={deleteItem}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
      {showUpdate && <UpdateItem />}
    </div>
  );
}
