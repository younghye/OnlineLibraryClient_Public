import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IItemAttributesStore {
  types: { typeID: number; name: string }[] | [];
  categories: { categoryID: number; name: string }[] | [];
  genres: { genreID: number; name: string }[] | [];
}

interface IItemAttributesStoreActions {
  setTypes: (data: any) => void;
  setCategories: (data: any) => void;
  setGenres: (data: any) => void;
  removeItemAttributes: () => void;
}
const initialItemAttributesStore: IItemAttributesStore = {
  types: [],
  categories: [],
  genres: [],
};

export const useItemAttributesStore = create(
  persist<IItemAttributesStore & IItemAttributesStoreActions>(
    (set) => ({
      ...initialItemAttributesStore,
      setTypes: (data) =>
        set({
          types: data,
        }),
      setCategories: (data) =>
        set({
          categories: data,
        }),
      setGenres: (data) =>
        set({
          genres: data,
        }),
      removeItemAttributes: () => set(initialItemAttributesStore),
    }),
    {
      name: "itemAttributesStore",
    }
  )
);
