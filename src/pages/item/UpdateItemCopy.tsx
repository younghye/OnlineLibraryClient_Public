import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-bootstrap/Modal";
import axios from "api/axios";
import { TItemCopy, ItemCopySchema } from "schema/item";
import { EnumItemStatus } from "schema/enums";
import { useItemStore } from "hooks/store/useItemStore";
import { getErrorData } from "components/error/getErrorData";
import Loading from "../common/Loading";

export default function UpdateItemCopy() {
  const [message, setMessage] = useState<string>("");
  const { item, itemCopy, setItem, setShowItemCopyUpdate, updateItemList } =
    useItemStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TItemCopy>({
    resolver: zodResolver(ItemCopySchema),
    defaultValues: { ...itemCopy },
  });

  const handleClose = () => {
    if (message !== "") setMessage("");
    reset();
    setShowItemCopyUpdate(false);
  };

  const onSubmit: SubmitHandler<TItemCopy> = (value) => {
    mutate(value);
  };

  const { mutate, isPending, error, isError } = useMutation({
    mutationKey: ["updateItemCopy"],
    mutationFn: async (data: TItemCopy) => {
      return await axios.put("/Item/UpdateItemCopy", data);
    },
    onSuccess: (res, variable: TItemCopy) => {
      if (item) {
        let newCopies = item?.itemCopies?.map((prev: TItemCopy) =>
          prev.barcode === variable.barcode ? variable : prev
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

  if (isPending) return <Loading />;

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-3">
          <Modal.Header className="border-0" closeButton>
            <Modal.Title>Edit ItemCopy</Modal.Title>
          </Modal.Header>
          {message && (
            <p
              className={
                (isError ? "text-danger" : "text-info") +
                " text-start w-100 m-0"
              }
            >
              <strong>{message}</strong>
            </p>
          )}
          <Modal.Body>
            <div className="form-group text-start">
              <div className="row mb-2">
                <div className="col-lg-10 col-md-12 col-sm-12">
                  <label htmlFor="barcode" className="control-label required">
                    Barcode
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    id="barcode"
                    {...register("barcode")}
                  />
                  {errors.barcode && (
                    <p className="text-danger text-start w-100 m-0 text-wrap">
                      {errors.barcode.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-lg-5 col-md-7 col-sm-9">
                  <label htmlFor="price" className="control-label required">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    pattern="([0-9]{1,3}).([0-9]{1,3})"
                    min="0.00"
                    max="10000.00"
                    step={0.01}
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-danger text-start w-100 m-0 text-wrap">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="col-lg-5 col-md-7 col-sm-9">
                  <label htmlFor="status" className="control-label required">
                    Status
                  </label>
                  <select
                    className="form-select form-control"
                    id="status"
                    {...register("status")}
                  >
                    {Object.keys(EnumItemStatus).map((key) => (
                      <option
                        key={key}
                        value={(EnumItemStatus as any)[key]}
                        disabled={key === EnumItemStatus.CHECK_OUT}
                      >
                        {key}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-danger text-start w-100 m-0 text-wrap">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer className="border-0 justify-content-start p-0 mt-4">
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
