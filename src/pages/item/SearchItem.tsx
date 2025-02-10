import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { EnumItemStatus, EnumLoanFees } from "schema/enums";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import { useItemStore } from "hooks/store/useItemStore";
import axios from "api/axios";
import { getErrorData } from "components/error/getErrorData";
import { TItemCopy, TSearchItem } from "schema/item";
import Loading from "../common/Loading";
import ItemTable from "./components/ItemTable";
import ItemCopyTable from "./components/ItemCopyTable";
import ItemDetail from "../item/components/ItemDetail";
import AddItem from "./AddItem";

export default function SearchItem() {
  const { types } = useItemAttributesStore();
  const [availableItemCopies, setAvailableItemCopies] = useState<TItemCopy[]>(
    []
  );
  const [message, setMessage] = useState<string>("");
  const [searachValues, setSearachValues] = useState<TSearchItem>();
  const { register, handleSubmit, reset } = useForm<TSearchItem>({});
  const {
    itemList,
    item,
    isSearchItemCopy,
    showAdd,
    setItemList,
    setItem,
    setIsSearchItemCopy,
    setShowAdd,
    updateItemList,
    resetItemStore,
  } = useItemStore();

  useEffect(() => {
    resetItemStore();
    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
  };

  const onSubmit: SubmitHandler<TSearchItem> = (req) => {
    setSearachValues(req);
  };

  const {
    data: itemsData,
    isPending: isPending_search,
    error: error_search,
    isError: isError_search,
    isFetching,
  } = useQuery({
    queryKey: ["selectItem", searachValues],
    queryFn: () => {
      return axios.get("/Item/SelectItem", { params: searachValues });
    },
    enabled: Boolean(searachValues),
  });

  const {
    mutate,
    isPending: isPending_add,
    error: error_add,
    isError: isError_add,
  } = useMutation({
    mutationKey: ["addItemCopy"],
    mutationFn: async () => {
      return await axios.post("/Item/AddItemCopy", {
        itemID: item?.itemID,
        price: item?.type?.name ? getItemFee(item?.type?.name) : 0.0,
        status: EnumItemStatus.AVAILABLE,
      });
    },
    onSuccess: (res) => {
      if (item) {
        let newCopies = item?.itemCopies
          ? [...item.itemCopies, res.data]
          : new Array(res.data);
        let newItem = { ...item, itemCopies: newCopies };
        setItem(newItem);
        updateItemList(newItem);
      }
    },
  });

  const getItemFee = (type: string) => {
    switch (type) {
      case "BOOK":
        return EnumLoanFees.BOOK;
      case "DVD":
        return EnumLoanFees.DVD;
      case "SOFTWARE":
        return EnumLoanFees.SOFTWARE;
      default:
        return 0.0;
    }
  };
  useEffect(() => {
    if (message !== "") setMessage("");
    if (searachValues?.barcode) setIsSearchItemCopy(true);
    if (itemsData?.data.length === 1) {
      setItem(itemsData?.data[0]);
    } else {
      setItem(null);
    }
    setItemList(itemsData?.data);
    // eslint-disable-next-line
  }, [itemsData]);

  useEffect(() => {
    if (item?.itemCopies && item?.itemCopies.length > 0) {
      setAvailableItemCopies(
        item.itemCopies.filter(
          (copy: TItemCopy) => copy.status === EnumItemStatus.AVAILABLE
        )
      );
    } else {
      setAvailableItemCopies([]);
    }
  }, [item]);

  useEffect(() => {
    if (isError_search) setMessage(getErrorData(error_search).message);
    if (isError_add) setMessage(getErrorData(error_add).message);
  }, [isError_search, isError_add, error_search, error_add]);

  if ((isPending_search && isFetching) || isPending_add) return <Loading />;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group p-2 text-start">
          <h5 className="w-100 mb-2 fw-bold">Item</h5>
          <div className="container">
            <div className="row justify-content-md-center">
              {message && (
                <p
                  className={
                    (isError_search || isError_add
                      ? "text-danger"
                      : "text-info") + " text-center mb-2"
                  }
                >
                  <strong>{message}</strong>
                </p>
              )}
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="barcode" className="control-label">
                  Barcode
                </label>
                <input
                  type="number"
                  id="barcode"
                  className="form-control"
                  {...register("barcode")}
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="title" className="control-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  {...register("title")}
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="type" className="control-label">
                  Type
                </label>
                <select
                  className="form-select form-control"
                  id="type"
                  {...register("typeID")}
                >
                  <option value=""> </option>
                  {types.map((t) => (
                    <option key={t.typeID} value={t.typeID}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-10">
                <label htmlFor="producer" className="control-label">
                  Author/Producer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="producer"
                  {...register("producer")}
                />
              </div>

              <div className="col-md-auto">
                <button type="submit" className="btn btn-primary mt-3 me-3">
                  Search
                </button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  color="primary"
                  size="medium"
                  style={{ textTransform: "none" }}
                  className="mt-4 mb-2"
                  onClick={() => {
                    handleClose();
                    setShowAdd(true);
                    setSearachValues(undefined);
                  }}
                >
                  Add New
                </Button>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </form>

      <div
        className="container-fluid text-start p-0"
        style={{
          minHeight: "51vh",
        }}
      >
        <div className="row" style={{ overflowWrap: "break-word" }}>
          <div className="col-lg-6 col-md-12 col-sm-12">
            {itemList?.length > 0 && <ItemTable />}
          </div>

          {item && (
            <div className="col-lg-6 col-md-12 col-sm-12">
              <ItemDetail item={item} page={"item"} />
              <hr className="mt-0" />
              {!isSearchItemCopy && (
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => mutate()}
                  >
                    Add Copy
                  </button>
                  <label className="ms-2">
                    <strong>{availableItemCopies.length}</strong> available |{" "}
                    <strong>
                      {item?.itemCopies ? item.itemCopies.length : 0}
                    </strong>{" "}
                    copies
                  </label>
                </div>
              )}

              <div className="row mb-0 mt-2">
                {item?.itemCopies && item.itemCopies.length > 0 && (
                  <ItemCopyTable />
                )}
              </div>
            </div>
          )}

          {showAdd && <AddItem />}
        </div>
      </div>
    </div>
  );
}
