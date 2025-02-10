import { create } from "zustand";
import { TLoanCart, TLoanDetail } from "schema/loan";

interface ILoanStore {
  checkoutList: TLoanCart[] | [];
  loanDetailList: TLoanDetail[] | [];
}

interface ILoanStoreActions {
  setCheckoutList: (data: TLoanCart[]) => void;
  setLoanDetailList: (data: TLoanDetail[]) => void;
  resetLoanStore: () => void;
}
const initialLoanStore: ILoanStore = {
  checkoutList: [],
  loanDetailList: [],
};

export const useLoanStore = create<ILoanStore & ILoanStoreActions>((set) => ({
  ...initialLoanStore,
  setCheckoutList: (data) =>
    set({
      checkoutList: data,
    }),
  setLoanDetailList: (data) =>
    set({
      loanDetailList: data,
    }),
  resetLoanStore: () => {
    set(initialLoanStore);
  },
}));
