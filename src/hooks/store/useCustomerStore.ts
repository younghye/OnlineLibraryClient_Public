import { create } from "zustand";
import { TCustomer } from "schema/person";
import { TLoanDetail } from "schema/loan";

interface ICustomerStore {
  customerList: TCustomer[] | [];
  customer: TCustomer | null;
  customerLoanList: TLoanDetail[] | [];
  activeLoans: TLoanDetail[] | [];
  loanHistory: TLoanDetail[] | [];
  editLoans: TLoanDetail[] | [];
  showAdd: boolean;
  showUpdate: boolean;
  showDelete: boolean;
  showLoan: boolean;
}

interface ICustomerStoreActions {
  setCustomerList: (data: TCustomer[]) => void;
  setCustomer: (data: TCustomer) => void;
  setCustomerLoanList: (data: TLoanDetail[], activeLink: string) => void;
  setActiveLoans: (data: TLoanDetail[]) => void;
  setLoanHistory: (data: TLoanDetail[]) => void;
  setEditLoans: (data: TLoanDetail[]) => void;
  setShowAdd: (flag: boolean) => void;
  setShowUpdate: (flag: boolean) => void;
  setShowDelete: (flag: boolean) => void;
  setShowLoan: (flag: boolean) => void;
  resetCustomerLoans: () => void;
}
const initialCustomerStore: ICustomerStore = {
  customerList: [],
  customer: null,
  customerLoanList: [],
  activeLoans: [],
  loanHistory: [],
  editLoans: [],
  showAdd: false,
  showUpdate: false,
  showDelete: false,
  showLoan: false,
};

export const useCustomerStore = create<ICustomerStore & ICustomerStoreActions>(
  (set) => ({
    ...initialCustomerStore,
    setCustomerList: (data) =>
      set({
        customerList: data,
      }),
    setCustomer: (data) =>
      set({
        customer: data,
      }),
    setCustomerLoanList: (data, activeLink) => {
      let active = data?.filter(
        (prev: TLoanDetail) => prev.returnDate === null
      );
      let history = data?.filter(
        (prev: TLoanDetail) => prev.returnDate !== null
      );
      set((state) => ({
        activeLoans: active ? active : [],
        loanHistory: history ? history : [],
        customerLoanList: data ? data : [],
        editLoans: activeLink === "activeLoans" ? active : history,
      }));
    },

    setActiveLoans: (data) =>
      set({
        activeLoans: data,
      }),
    setLoanHistory: (data) =>
      set({
        loanHistory: data,
      }),
    setEditLoans: (data) =>
      set({
        editLoans: data,
      }),

    setShowAdd: (flag) =>
      set({
        showAdd: flag,
      }),
    setShowUpdate: (flag) =>
      set({
        showUpdate: flag,
      }),
    setShowDelete: (flag) =>
      set({
        showDelete: flag,
      }),
    setShowLoan: (flag) =>
      set({
        showLoan: flag,
      }),
    resetCustomerLoans: () =>
      set({
        customerLoanList: [],
        activeLoans: [],
        loanHistory: [],
        editLoans: [],
      }),
  })
);
