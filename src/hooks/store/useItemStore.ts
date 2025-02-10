import { create } from "zustand";
import { TItem, TItemCopy } from "schema/item";

interface IItemStore {
  itemList: TItem[] | [];
  item: TItem | null;
  itemCopy: TItemCopy | null;
  isSearchItemCopy: boolean;
  showItemCopyDelete: boolean;
  showItemCopyUpdate: boolean;
  showAdd: boolean;
  showUpdate: boolean;
  showDelete: boolean;
  showLoan: boolean;
}

interface IItemStoreActions {
  setItemList: (data: TItem[]) => void;
  updateItemList: (data: TItem) => void;
  setItem: (data: TItem | null) => void;
  setItemCopy: (data: TItemCopy | null) => void;
  setIsSearchItemCopy: (flag: boolean) => void;
  setShowItemCopyDelete: (flag: boolean) => void;
  setShowItemCopyUpdate: (flag: boolean) => void;
  setShowAdd: (flag: boolean) => void;
  setShowUpdate: (flag: boolean) => void;
  setShowDelete: (flag: boolean) => void;
  setShowLoan: (flag: boolean) => void;
  resetItemStore: () => void;
}
const initialItemStore: IItemStore = {
  itemList: [],
  item: null,
  itemCopy: null,
  isSearchItemCopy: false,
  showItemCopyDelete: false,
  showItemCopyUpdate: false,
  showAdd: false,
  showUpdate: false,
  showDelete: false,
  showLoan: false,
};

export const useItemStore = create<IItemStore & IItemStoreActions>(
  (set, get) => ({
    ...initialItemStore,
    setItemList: (data) =>
      set({
        itemList: data,
      }),
    updateItemList: (data) => {
      set({
        itemList: useItemStore
          .getState()
          .itemList.map((prev: TItem) =>
            prev.itemID === data.itemID ? data : prev
          ),
      });
    },
    setItem: (data) =>
      set({
        item: data,
      }),
    setItemCopy: (data) =>
      set({
        itemCopy: data,
      }),
    // setShowAdd: () => set((state) => ({ showAdd: !state.showAdd })),
    setIsSearchItemCopy: (flag) =>
      set({
        isSearchItemCopy: flag,
      }),

    setShowItemCopyDelete: (flag) =>
      set({
        showItemCopyDelete: flag,
      }),
    setShowItemCopyUpdate: (flag) =>
      set({
        showItemCopyUpdate: flag,
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
    resetItemStore: () => set(initialItemStore),
  })
);
