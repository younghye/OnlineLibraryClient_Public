import { useMemo, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import { getErrorData } from "components/error/getErrorData";
import { useLoanStore } from "hooks/store/useLoanStore";
import { currencyFormat } from "utils/format";
import { TLoan, TLoanCart } from "schema/loan";
import { EnumItemStatus } from "schema/enums";
import axios from "api/axios";
import moment from "moment";
import MessageModal from "../../common/modal/MessageModal";
import { ModalInfo } from "../../common/modal/MessageModal";
import Table from "../../common/Table";
import Loading from "../../common/Loading";
import Tooltip from "../../common/Tooltip";
import ConfirmModal from "../../common/modal/ConfirmModal";

interface Props {
  libraryCardNumber: number;
  onReset: () => void;
}

export default function LoanTable({ libraryCardNumber, onReset }: Props) {
  const [message, setMessage] = useState<string>("");
  const [deleteID, setDeleteID] = useState<number>();
  const [modalInfo, setModalInfo] = useState<ModalInfo>();
  const { checkoutList, setCheckoutList, resetLoanStore } = useLoanStore();

  const columns = useMemo(
    () => [
      {
        Header: "Barcode",
        accessor: "barcode",
        width: 220,
        minWidth: 220,
        Cell: (props: { value: number }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Title",
        accessor: "title",
        width: 490,
        minWidth: 490,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Type",
        accessor: "type",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => <Tooltip value={props.value} />,
      },
      {
        Header: "Price",
        accessor: "price",
        width: 125,
        minWidth: 125,
        Cell: (props: { value: number }) => (
          <Tooltip value={currencyFormat.format(props.value)} />
        ),
      },
      {
        Header: "Loan Period",
        accessor: "loanPeriod",
        width: 140,
        minWidth: 140,
        Cell: (props: { value: string }) => (
          <Tooltip value={props.value + "days"} />
        ),
        Footer: (props: any) => {
          return <>Total ({props.rows.length} items)</>;
        },
      },
      {
        Header: "Return DueDate",
        accessor: "returnDueDate",
        width: 170,
        minWidth: 170,
        Cell: (props: { value: string }) => (
          <Tooltip value={moment(props.value).format("DD/MM/YYYY")} />
        ),
        Footer: (props: any) => {
          const total = useMemo(
            () =>
              props.rows.reduce(
                (sum: number, row: { values: { price: number } }) =>
                  row.values.price + sum,
                0
              ),
            [props.rows]
          );
          let totalFormat = currencyFormat.format(total);

          return <>{totalFormat}</>;
        },
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
        Footer: (props: any) => (
          <button className="btn btn-danger" onClick={() => mutate()}>
            Check Out
          </button>
        ),
      },
    ],
    // eslint-disable-next-line
    []
  );

  const handleClose = () => {
    setDeleteID(undefined);
    setModalInfo(undefined);
    if (message !== "") setMessage("");
    // if (isSuccess) window.location.reload();
    if (isSuccess) {
      resetLoanStore();
      onReset();
    }
  };

  const deleteItem = () => {
    setCheckoutList(
      checkoutList.filter((prev: TLoanCart) => prev.barcode !== deleteID)
    );
    handleClose();
  };

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationKey: ["addLoan"],
    mutationFn: async () => {
      return await axios.post("/Loan/AddLoan", checkout());
    },
    onSuccess: (res) => {
      setModalInfo({
        title: "Info",
        body: "Your checkout was completed successfuly.",
      });
    },
  });

  const checkout = () => {
    if (!libraryCardNumber) {
      setModalInfo({
        title: "Info",
        body: "Enter Customer ID.",
      });
    } else {
      const checkoutData: TLoan = {
        libraryCardNumber: libraryCardNumber,
        dateOfLoan: new Date(),
        TotalAmount: (checkoutList as TLoanCart[]).reduce(
          (sum: number, c: TLoanCart) => c.price + sum,
          0
        ),
        quantities: checkoutList.length,
        loanDetails: checkoutList.map((c) => {
          return {
            barcode: c.barcode,
            returnDueDate: c.returnDueDate,
            itemCopy: { status: EnumItemStatus.CHECK_OUT },
          };
        }),
      };
      return checkoutData;
    }
  };

  useEffect(() => {
    if (error) {
      setMessage(getErrorData(error).message);
    }
  }, [error]);

  if (isPending) return <Loading />;

  return (
    <div>
      {checkoutList?.length > 0 && (
        <Table
          data={checkoutList}
          columns={columns}
          cssName={"base checkout-table"}
          hiddenColumns={[]}
          isFooter={true}
        />
      )}

      {deleteID && (
        <ConfirmModal
          toggleModal={deleteItem}
          onClose={handleClose}
          errorMsg={message}
        />
      )}
      {modalInfo && <MessageModal onClose={handleClose} info={modalInfo} />}
    </div>
  );
}
