import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "api/axios";
import { TItem, ItemSchema } from "schema/item";
import { useItemStore } from "hooks/store/useItemStore";
import { getErrorData } from "components/error/getErrorData";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import ItemInputForm from "./components/ItemInputForm";
import Loading from "../common/Loading";

export default function UpdateItem() {
  const [message, setMessage] = useState<string>("");
  const { types, categories, genres } = useItemAttributesStore();
  const { item, setItem, setShowUpdate, updateItemList } = useItemStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TItem>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      ...item,
      dateOfPublication: moment(item?.dateOfPublication).format("YYYY-MM-DD"),
    },
  });

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
    setShowUpdate(false);
  };

  const onSubmit: SubmitHandler<TItem> = (value) => {
    value.type = types.find((t) => t.typeID === value.typeID);
    value.category = categories.find((c) => c.categoryID === value.categoryID);
    value.genre = genres.find((g) => g.genreID === value.genreID);
    mutate(value);
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (data: TItem) => {
      return await axios.put("/Item/UpdateItem", data);
    },
    onSuccess: (res, variable: TItem) => {
      setItem(variable);
      updateItemList(variable);
      handleClose();
    },
  });

  useEffect(() => {
    if (error) {
      setMessage(getErrorData(error).message);
    }
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <Modal size="lg" show={true} onHide={handleClose} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-3">
          <Modal.Header className="border-0" closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          {message && (
            <p
              className={
                (error ? "text-danger" : "text-info") + " text-start w-100 m-0"
              }
            >
              <strong>{message}</strong>
            </p>
          )}
          <Modal.Body>
            <ItemInputForm errors={errors} register={register} />
            <Modal.Footer className="border-0">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "80px" }}
                onClick={() => {
                  if (message !== "") setMessage("");
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ width: "80px" }}
                onClick={handleClose}
              >
                Cancel
              </button>
            </Modal.Footer>
          </Modal.Body>
        </div>
      </form>
    </Modal>
  );
}
