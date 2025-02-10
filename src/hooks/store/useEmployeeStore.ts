import { create } from "zustand";
import { TEmployee } from "schema/person";

interface IEmployeeStore {
  employeeList: TEmployee[] | [];
  employee: TEmployee | null;
  showUpdate: boolean;
  showDelete: boolean;
}

interface IEmployeeStoreActions {
  setEmployeeList: (data: TEmployee[]) => void;
  setEmployee: (data: TEmployee | null) => void;
  setShowUpdate: (flag: boolean) => void;
  setShowDelete: (flag: boolean) => void;
}
const initialEmployeeStore: IEmployeeStore = {
  employeeList: [],
  employee: null,
  showUpdate: false,
  showDelete: false,
};

export const useEmployeeStore = create<IEmployeeStore & IEmployeeStoreActions>(
  (set) => ({
    ...initialEmployeeStore,
    setEmployeeList: (data) =>
      set({
        employeeList: data,
      }),
    setEmployee: (data) =>
      set({
        employee: data,
      }),
    setShowUpdate: (flag) =>
      set({
        showUpdate: flag,
      }),
    setShowDelete: (flag) =>
      set({
        showDelete: flag,
      }),
  })
);
